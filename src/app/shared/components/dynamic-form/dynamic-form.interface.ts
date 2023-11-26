import { CheckboxListOption } from './fields/checkbox-list/checkbox-list.component';
import { RadioListOption } from './fields/radio-list/radio-list.component';

export interface BaseControl {
  key: string;
  label: string;
  validators?: {
    name: string;
    params?: any[];
  }[];
}

export interface InputControl extends BaseControl {
  type: 'input';
  defaultValue?: string | number;
}

export interface CheckboxListControl extends BaseControl {
  type: 'checkbox-list';
  options: CheckboxListOption[];
  defaultValue?: string[];
}

export interface RatingControl extends BaseControl {
  type: 'rating';
  defaultValue?: number;
}

export interface RadioListControl extends BaseControl {
  type: 'radio-list';
  options: RadioListOption[];
  defaultValue?: string;
}

export interface TextareaControl extends BaseControl {
  type: 'textarea';
  defaultValue?: string;
}

export type DynamicFormControl =
  | InputControl
  | CheckboxListControl
  | RatingControl
  | RadioListControl
  | TextareaControl;
