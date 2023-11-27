import {
  Component,
  Input,
  OnInit,
  Output,
  ViewContainerRef,
  EventEmitter,
  OnDestroy,
  ComponentRef,
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
  input: InputComponent,
  'checkbox-list': CheckboxListComponent,
  rating: RatingComponent,
  'radio-list': RadioListComponent,
  textarea: TextareaComponent,
};

const CUSTOM_SYNC_VALIDATORS: { [key: string]: ValidatorFn } = {
  twoWords: (control: UntypedFormControl) => {
    const isValid: boolean = /^(\w.+\s).+$/.test(control.value);
    return isValid ? null : { twoWords: true };
  },
};

const VALIDATORS_ERROR_MESSAGES: { [key: string]: (params: any) => string } = {
  required: () => 'This field is required.',
  minlength: ({ requiredLength: req, actualLength: act }) =>
    `Must be longer than ${req}. Add ${req - act} more.`,
  twoWords: () => 'You need to insert at least two words.',
};

@Component({
  selector: 'drf-dynamic-form',
  template: '',
  standalone: true,
})
export class DynamicFormComponent implements OnInit, OnDestroy {
  private _dynamicForm: DynamicFormControl[];
  @Input() public set dynamicForm(dynamicForm: DynamicFormControl[]) {
    this._dynamicForm = dynamicForm;

    this.vrc.clear();
    const formGroup: UntypedFormGroup = this.createFormClassAndTemplate();
    this.formGroupCreated.emit(formGroup);
  }

  @Output() public formGroupCreated: EventEmitter<UntypedFormGroup> =
    new EventEmitter();

  private onDestroy$: Subject<void> = new Subject<void>();

  constructor(public vrc: ViewContainerRef) {}

  public ngOnInit(): void {}

  public ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  /* Private methods */

  private createFormClassAndTemplate(): UntypedFormGroup {
    const dynamicFormGroup = new UntypedFormGroup({});

    this._dynamicForm.forEach((formField) => {
      if (!COMPONENTS_MAP[formField.type])
        throw new Error(`Field type ${formField.type} not registered!`);

      const syncValidators = this.generateSyncValidatorsList(formField);

      const formControl: UntypedFormControl = new UntypedFormControl(
        formField.defaultValue || null,
        syncValidators
      );

      dynamicFormGroup.addControl(formField.key, formControl);

      this.createFieldTemplate(formField, formControl);
    });

    return dynamicFormGroup;
  }

  private generateSyncValidatorsList(
    formField: DynamicFormControl
  ): ValidatorFn[] {
    const validators = [];

    formField.validators?.forEach(({ name, params }) => {
      const validator = Validators[name] || CUSTOM_SYNC_VALIDATORS[name];
      if (!validator) throw new Error(`Validator ${name} not registered!`);

      if (params) validators.push(validator(...params));
      else validators.push(validator);
    });

    return validators;
  }

  private createFieldTemplate(
    formField: DynamicFormControl,
    formControl: UntypedFormControl
  ): void {
    const componentRef: ComponentRef<unknown> = this.vrc.createComponent(
      COMPONENTS_MAP[formField.type] as any
    );

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

    this.appendFormControlToField(componentRef, formControl);
  }

  private appendFormControlToField(
    componentRef: ComponentRef<unknown>,
    formControl: UntypedFormControl
  ): void {
    const fieldRef = componentRef.instance as ControlValueAccessor;
    const nativeElement = componentRef.location.nativeElement;

    fieldRef.writeValue(formControl.value);
    nativeElement.classList.add('ng-untouched');
    nativeElement.classList.add('ng-pristine');
    nativeElement.classList.add(formControl.valid ? 'ng-valid' : 'ng-invalid');
    if (formControl.invalid)
      fieldRef['errorText'] = this.getErrorMessage(formControl);

    formControl.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((value) => fieldRef.writeValue(value));

    formControl.statusChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((status) => {
        if (status === 'VALID') {
          nativeElement.classList.remove('ng-invalid');
          nativeElement.classList.add('ng-valid');
          fieldRef['errorText'] = '';
        } else {
          nativeElement.classList.remove('ng-valid');
          nativeElement.classList.add('ng-invalid');
          fieldRef['errorText'] = this.getErrorMessage(formControl);
        }
      });

    formControl.markAsTouched = () => {
      nativeElement.classList.remove('ng-untouched');
      nativeElement.classList.add('ng-touched');
    };

    fieldRef.registerOnChange((value) => {
      formControl.setValue(value);
      formControl.updateValueAndValidity();
      nativeElement.classList.remove('ng-pristine');
      nativeElement.classList.add('ng-dirty');
    });

    fieldRef.registerOnTouched(() => {
      formControl.markAsTouched();
      nativeElement.classList.remove('ng-untouched');
      nativeElement.classList.add('ng-touched');
    });
  }

  private getErrorMessage(formControl: UntypedFormControl): string {
    const errorKey: string = Object.keys(formControl.errors)[0];
    const params: any = formControl.errors[errorKey];

    const errorMessage: string = VALIDATORS_ERROR_MESSAGES[errorKey](params);
    return errorMessage || 'There is an error';
  }
}
