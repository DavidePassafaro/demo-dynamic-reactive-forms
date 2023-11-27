import { Component } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { DynamicFormComponent } from '@drf-shared';
import { DynamicFormControl } from 'src/app/shared/components/dynamic-form/dynamic-form.interface';
import { UntypedFormGroup } from '@angular/forms';

interface MultiStepControl {
  stepKey: string;
  stepName: string;
  dynamicFormControl: DynamicFormControl[];
}

@Component({
  selector: 'drf-multi-step-form-page',
  templateUrl: './multi-step-form-page.component.html',
  standalone: true,
  imports: [CommonModule, DynamicFormComponent],
})
export class MultiStepFormPageComponent {
  public multiStepControl: MultiStepControl[] = [
    {
      stepKey: 'personal-info',
      stepName: 'Your info',
      dynamicFormControl: [
        {
          key: 'nameSurname',
          label: 'Your name and surname',
          type: 'input',
          defaultValue: '',
          validators: [
            { name: 'required' },
            { name: 'minLength', params: [3] },
          ],
        },
        {
          key: 'experience',
          label: 'Years of experience',
          type: 'radio-list',
          options: [
            {
              id: 'junior',
              value: 'junior',
              description: 'Junior (-1 years)',
            },
            {
              id: 'middle',
              value: 'middle',
              description: 'Middle (+1 years but -3 years)',
            },
            {
              id: 'senior',
              value: 'senior',
              description: 'Senior (+3 years)',
            },
          ],
          defaultValue: 'middle',
        },
        {
          key: 'skills',
          label: 'Your skills',
          type: 'checkbox-list',
          options: [
            {
              id: 'javascript',
              value: 'javascript',
              description: 'Javascript',
            },
            {
              id: 'typescript',
              value: 'typescript',
              description: 'Typescript',
            },
            {
              id: 'angular',
              value: 'angular',
              description: 'Angular',
            },
            {
              id: 'react',
              value: 'react',
              description: 'React',
            },
            {
              id: 'vue',
              value: 'vue',
              description: 'Vue',
            },
          ],
          defaultValue: ['javascript', 'typescript', 'angular'],
        },
      ],
    },
    {
      stepKey: 'review',
      stepName: 'Your review of the demo',
      dynamicFormControl: [
        {
          key: 'rating',
          label: 'Rate this demo',
          type: 'rating',
          defaultValue: 5,
        },
        {
          key: 'feedback',
          label: 'Other feedbacks',
          type: 'textarea',
          defaultValue: 'This demo is amazing',
        },
      ],
    },
  ];

  public currentStep: number = 0;

  public formGroup: UntypedFormGroup;

  private result = {};

  public formGroupCreatedHandler(formGroup: UntypedFormGroup): void {
    this.formGroup = formGroup;
    console.log(this.formGroup);
  }

  public submitClickHandler(): void {
    this.result[this.multiStepControl[this.currentStep].stepKey] =
      this.formGroup.getRawValue();

    if (this.currentStep < this.multiStepControl.length - 1) this.currentStep++;
    else {
      console.log(this.result);
      alert(new JsonPipe().transform(this.result));
    }
  }
}
