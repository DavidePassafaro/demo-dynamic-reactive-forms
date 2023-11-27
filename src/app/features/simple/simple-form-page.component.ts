import { Component } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { DynamicFormControl } from 'src/app/shared/components/dynamic-form/dynamic-form.interface';
import { DynamicFormComponent } from '@drf-shared';
import { UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'drf-simple-form-page',
  templateUrl: './simple-form-page.component.html',
  standalone: true,
  imports: [CommonModule, DynamicFormComponent],
})
export class SimpleFormPageComponent {
  public dynamicForm: DynamicFormControl[] = [
    {
      key: 'nameSurname',
      label: 'Your name and surname',
      type: 'input',
      defaultValue: '',
      validators: [{ name: 'required' }, { name: 'twoWords' }],
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
      // defaultValue: 'middle',
      validators: [{ name: 'required' }],
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
      validators: [{ name: 'minLength', params: [25] }],
    },
  ];

  public formGroup: UntypedFormGroup;

  public formGroupCreatedHandler(formGroup: UntypedFormGroup): void {
    this.formGroup = formGroup;
    console.log(this.formGroup);
  }

  public submitClickHandler(): void {
    const value = this.formGroup.getRawValue();
    console.log(value);
    alert(new JsonPipe().transform(value));
  }
}
