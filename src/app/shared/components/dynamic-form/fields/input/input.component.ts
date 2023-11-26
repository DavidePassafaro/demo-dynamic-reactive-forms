import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'drf-input',
  templateUrl: './input.component.html',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor {
  @Input() public description: string;
  @Input() public inputId: string;
  @Input() public inputType: string;

  public value: string | number;
  // public disabledStatus: boolean;

  private onChange: any = () => {};
  private onTouch: any = () => {};

  constructor() {}

  public inputEventHandler(event: Event): void {
    this.value = (event.target as HTMLInputElement).value;
    this.onChange(this.value);
  }

  public blurEventHandler(): void {
    this.onTouch();
  }

  /* ControlValueAccessor methods */

  public writeValue(value: string | number): void {
    this.value = value || '';
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
