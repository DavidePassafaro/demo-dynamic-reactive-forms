import { DynamicFormControl } from '@drf-shared';

export interface MultiStepControl {
  stepKey: string;
  stepName: string;
  dynamicFormControl: DynamicFormControl[];
}

export const MULTI_STEP_CONTROL: MultiStepControl[] = [
  {
    stepKey: 'personal-info',
    stepName: 'Your info',
    dynamicFormControl: [
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
        validators: [{ name: 'required' }],
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
        validators: [{ name: 'required' }],
      },
      {
        key: 'feedback',
        label: 'Other feedbacks',
        type: 'textarea',
        defaultValue: 'This demo is amazing',
        validators: [{ name: 'required' }, { name: 'minLength', params: [25] }],
      },
    ],
  },
];
