import {
  Component,
  Input,
  OnInit,
  Output,
  ViewContainerRef,
  EventEmitter,
  OnDestroy,
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

@Component({
  selector: 'drf-dynamic-form',
  template: '',
  standalone: true,
})
export class DynamicFormComponent implements OnInit, OnDestroy {
  @Input() public dynamicForm: DynamicFormControl[];
  @Input() public customSyncValidators: ValidatorFn[];

  @Output() public formGroupCreated: EventEmitter<UntypedFormGroup> =
    new EventEmitter();

  private onDestroy$: Subject<void> = new Subject<void>();

  constructor(public vrc: ViewContainerRef) {}

  public ngOnInit(): void {
    const formGroup: UntypedFormGroup = this.createFormClassAndTemplate();
    this.formGroupCreated.emit(formGroup);
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
      const validator = Validators[name] || this.customSyncValidators[name];
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
    const component = this.vrc.createComponent(
      COMPONENTS_MAP[formField.type] as any
    );

    component.location.nativeElement.classList.add('mb-6');

    if (formField.type === 'input') {
      const field: Partial<InputComponent> = component.instance;
      field.description = formField.label;
    } else if (formField.type === 'checkbox-list') {
      const field: Partial<CheckboxListComponent> = component.instance;
      field.description = formField.label;
      field.options = formField.options;
    } else if (formField.type === 'rating') {
      const field: Partial<RatingComponent> = component.instance;
      field.description = formField.label;
    } else if (formField.type === 'radio-list') {
      const field: Partial<RadioListComponent> = component.instance;
      field.description = formField.label;
      field.options = formField.options;
    } else if (formField.type === 'textarea') {
      const field: Partial<TextareaComponent> = component.instance;
      field.description = formField.label;
    }

    this.appendFormControlToField(
      component.instance as ControlValueAccessor,
      formControl
    );
  }

  private appendFormControlToField(
    fieldRef: ControlValueAccessor,
    formControl: UntypedFormControl
  ): void {
    fieldRef.writeValue(formControl.value);

    formControl.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((value) => fieldRef.writeValue(value));

    fieldRef.registerOnChange((value) => {
      formControl.setValue(value);
      formControl.updateValueAndValidity();
    });

    fieldRef.registerOnTouched(() => formControl.markAsTouched());
  }
}
