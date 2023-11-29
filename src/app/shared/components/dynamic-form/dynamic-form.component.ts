import {
  Component,
  Input,
  Output,
  ViewContainerRef,
  EventEmitter,
  OnDestroy,
  ComponentRef,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { DynamicFormControl } from './dynamic-form.interface';
import {
  ControlValueAccessor,
  UntypedFormControl,
  UntypedFormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  InputComponent,
  CheckboxListComponent,
  RatingComponent,
  RadioListComponent,
} from './fields';
import { Subject, takeUntil } from 'rxjs';
import { TextareaComponent } from './fields/textarea/textarea.component';

const COMPONENTS_MAP = {
  'input': InputComponent,
  'checkbox-list': CheckboxListComponent,
  'rating': RatingComponent,
  'radio-list': RadioListComponent,
  'textarea': TextareaComponent,
};

const CUSTOM_SYNC_VALIDATORS: { [key: string]: ValidatorFn } = {
  twoWords: (control: UntypedFormControl) => {
    const isValid: boolean = /^(\w.+\s).+$/.test(control.value);
    return isValid ? null : { twoWords: true };
  },
};

const VALIDATORS_ERROR_MESSAGES: { [key: string]: (params: any) => string } = {
  required: () => 'This field is required.',
  minlength: ({ requiredLength: req, actualLength: act }) => `Must be longer than ${req}. Add ${req - act} more.`,
  twoWords: () => 'You need to insert at least two words.',
};

@Component({
  selector: 'drf-dynamic-form',
  template: '',
  standalone: true,
})
export class DynamicFormComponent implements OnChanges, OnDestroy {
  @Input() public dynamicForm: DynamicFormControl[];

  @Output() public formGroupCreated: EventEmitter<UntypedFormGroup> = new EventEmitter();

  private onDestroy$: Subject<void> = new Subject<void>();

  constructor(public vrc: ViewContainerRef) {}

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['dynamicForm']) {
      this.vrc.clear();
      const formGroup: UntypedFormGroup = this.createFormClassAndTemplate();
      this.formGroupCreated.emit(formGroup);
    }
  }

  public ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  /* Private methods */

  private createFormClassAndTemplate(): UntypedFormGroup {
    const dynamicFormGroup = new UntypedFormGroup({});

    this.dynamicForm.forEach((formField) => {
      if (!COMPONENTS_MAP[formField.type])
        throw new Error(`Field type ${formField.type} not registered!`);

      const formControl: UntypedFormControl = this.generateFormControl(formField);
      dynamicFormGroup.addControl(formField.key, formControl);

      const componentRef: ComponentRef<unknown> = this.createFieldTemplate(formField);
      this.appendFormControlToField(componentRef, formControl);
    });

    return dynamicFormGroup;
  }

  private generateFormControl(formField: DynamicFormControl): UntypedFormControl {
    const initialValue = formField.defaultValue || null;
    const syncValidators = this.getSyncValidators(formField);
    return new UntypedFormControl(initialValue, syncValidators);
  }

  private createFieldTemplate( formField: DynamicFormControl ): ComponentRef<unknown> {
    const componentRef: ComponentRef<unknown> = 
      this.vrc.createComponent(COMPONENTS_MAP[formField.type] as any);

    componentRef.location.nativeElement.classList.add('mb-3');
    componentRef.location.nativeElement.classList.add('lg:mb-5');

    if (formField.type === 'input') {
      const field: Partial<InputComponent> = componentRef.instance;
      field.description = formField.label;
    } else if (formField.type === 'checkbox-list') {
      const field: Partial<CheckboxListComponent> = componentRef.instance;
      field.description = formField.label;
      field.options = formField.options;
    } else if (formField.type === 'rating') {
      const field: Partial<RatingComponent> = componentRef.instance;
      field.description = formField.label;
    } else if (formField.type === 'radio-list') {
      const field: Partial<RadioListComponent> = componentRef.instance;
      field.description = formField.label;
      field.options = formField.options;
    } else if (formField.type === 'textarea') {
      const field: Partial<TextareaComponent> = componentRef.instance;
      field.description = formField.label;
    }

    return componentRef;
  }

  private appendFormControlToField(componentRef: ComponentRef<unknown>, formControl: UntypedFormControl): void {
    const fieldRef = componentRef.instance as ControlValueAccessor;
    const { classList } = componentRef.location.nativeElement;

    fieldRef.writeValue(formControl.value);
    fieldRef['errorText'] = this.getErrorMessage(formControl);

    const validClass = formControl.valid ? 'ng-valid' : 'ng-invalid';
    classList.add('ng-untouched', 'ng-pristine', validClass);

    formControl.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((value) => fieldRef.writeValue(value));

    formControl.statusChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((status) => {
        if (status === 'VALID') classList.replace('ng-invalid', 'ng-valid');
        else classList.replace('ng-valid', 'ng-invalid');

        fieldRef['errorText'] = this.getErrorMessage(formControl);
      });

    formControl.markAsTouched = () => classList.replace('ng-untouched', 'ng-touched');

    fieldRef.registerOnChange((value) => {
      formControl.setValue(value);
      classList.replace('ng-pristine', 'ng-dirty');
    });

    fieldRef.registerOnTouched(() => formControl.markAsTouched());
  }

  // Utils

  private getSyncValidators(formField: DynamicFormControl): ValidatorFn[] {
    const validators = [];

    formField.validators?.forEach(({ name, params }) => {
      const validator = Validators[name] || CUSTOM_SYNC_VALIDATORS[name];
      if (!validator) throw new Error(`Validator ${name} not registered!`);

      if (params) validators.push(validator(...params));
      else validators.push(validator);
    });

    return validators;
  }

  private getErrorMessage(formControl: UntypedFormControl): string {
    if (formControl.valid) return '';

    const errorKey: string = Object.keys(formControl.errors)[0];
    const params: any = formControl.errors[errorKey];

    const errorMessage: string = VALIDATORS_ERROR_MESSAGES[errorKey](params);
    return errorMessage || 'There is an error';
  }
}
