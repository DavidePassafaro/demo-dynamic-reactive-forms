import { Component, OnInit } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { DynamicFormComponent } from '@drf-shared';
import { UntypedFormGroup } from '@angular/forms';
import { MULTI_STEP_CONTROL, MultiStepControl } from './multi-step-form.model';

@Component({
  selector: 'drf-multi-step-form-page',
  templateUrl: './multi-step-form-page.component.html',
  standalone: true,
  imports: [CommonModule, DynamicFormComponent],
})
export class MultiStepFormPageComponent implements OnInit {
  public multiStepControl: MultiStepControl[] = MULTI_STEP_CONTROL;
  public currentStep: number = 0;

  public formGroup: UntypedFormGroup;
  private result: any = {};

  public ngOnInit(): void {
    console.log(this.multiStepControl);
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

    this.result[this.multiStepControl[this.currentStep].stepKey] =
      this.formGroup.getRawValue();

    if (this.currentStep < this.multiStepControl.length - 1) this.currentStep++;
    else {
      console.log(this.result);
      alert(new JsonPipe().transform(this.result));
    }
  }
}
