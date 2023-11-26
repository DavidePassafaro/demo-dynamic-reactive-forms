import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface CheckboxListOption {
  id: string;
  value: string;
  description: string;
  checked?: boolean;
}

@Component({
  selector: 'drf-checkbox-list',
  templateUrl: './checkbox-list.component.html',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxListComponent),
      multi: true,
    },
  ],
})
export class CheckboxListComponent implements ControlValueAccessor {
  @Input() public inputTitle: string;
  @Input() public options: CheckboxListOption[] = [];

  // public disabledStatus: boolean;

  private onChange: any = () => {};
  private onTouch: any = () => {};

  constructor() {}

  public inputEventHandler(event: Event): void {
    const selectedInput: HTMLInputElement = event.target as HTMLInputElement;
    this.options.find(({ id }) => id === selectedInput.id).checked =
      selectedInput.checked;

    this.onChange(
      this.options.filter(({ checked }) => checked).map(({ value }) => value)
    );
  }

  public blurEventHandler(): void {
    this.onTouch();
  }

  /* ControlValueAccessor methods */

  public writeValue(value: string[]): void {
    this.options.forEach((item) => {
      if (value?.includes(item.value)) item.checked = true;
    });
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
