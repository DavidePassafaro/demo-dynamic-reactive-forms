import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface RadioListOption {
  id: string;
  value: string;
  description: string;
}

@Component({
  selector: 'drf-radio-list',
  templateUrl: './radio-list.component.html',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioListComponent),
      multi: true,
    },
  ],
})
export class RadioListComponent implements ControlValueAccessor {
  @Input() public description: string;
  @Input() public options: RadioListOption[] = [];

  public value: string;
  // public disabledStatus: boolean;

  private onChange: any = () => {};
  private onTouch: any = () => {};

  constructor() {}

  public inputEventHandler(event: Event): void {
    const selectedInput: HTMLInputElement = event.target as HTMLInputElement;
    this.value = selectedInput.value;

    this.onChange(this.value);
  }

  public blurEventHandler(): void {
    this.onTouch();
  }

  /* ControlValueAccessor methods */

  public writeValue(value: string): void {
    this.value = value;
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  // public setDisabledState(disabled: boolean): void {
  //   this.disabledStatus = disabled;
  // }
}
