import { Component, OnInit } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { DynamicFormComponent, DynamicFormControl } from '@drf-shared';
import { UntypedFormGroup } from '@angular/forms';
import { SIMPLE_STEP_CONTROL } from './simple-form.model';

@Component({
  selector: 'drf-simple-form-page',
  templateUrl: './simple-form-page.component.html',
  standalone: true,
  imports: [CommonModule, DynamicFormComponent],
})
export class SimpleFormPageComponent implements OnInit {
  public simpleStepControl: DynamicFormControl[] = SIMPLE_STEP_CONTROL;

  public formGroup: UntypedFormGroup;

  public ngOnInit(): void {
    console.log(this.simpleStepControl);
  }

  public formGroupCreatedHandler(formGroup: UntypedFormGroup): void {
    this.formGroup = formGroup;
    console.log(this.formGroup);
  }

  public submitClickHandler(): void {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    const value = this.formGroup.getRawValue();
    console.log(value);
    alert(new JsonPipe().transform(value));
  }
}
