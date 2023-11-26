import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicFormComponent } from '@drf-shared';
import { DynamicFormControl } from 'src/app/shared/components/dynamic-form/dynamic-form.interface';
import { UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'drf-multi-step-form-page',
  templateUrl: './multi-step-form-page.component.html',
  standalone: true,
  imports: [CommonModule, DynamicFormComponent],
})
export class MultiStepFormPageComponent {
  public dynamicForm: DynamicFormControl[] = [];

  public formGroup: UntypedFormGroup;

  public formGroupCreatedHandler(formGroup: UntypedFormGroup): void {
    this.formGroup = formGroup;
  }
}
