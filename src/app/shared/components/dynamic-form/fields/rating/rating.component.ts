import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition, faStar } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'drf-rating',
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.scss',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RatingComponent),
      multi: true,
    },
  ],
  imports: [FontAwesomeModule],
})
export class RatingComponent implements ControlValueAccessor {
  @Input() public description: string;
  @Input() public inputId: string;
  @Input() public errorText: string;

  public value: number = 0;
  // public disabledStatus: boolean;

  public readonly starsList: number[] = [5, 4, 3, 2, 1];
  public readonly faStar: IconDefinition = faStar;

  private onChange: any = () => {};
  private onTouch: any = () => {};

  constructor() {}

  public inputEventHandler(event: Event): void {
    this.value = +(event.target as HTMLInputElement).value;
    this.onChange(this.value);
  }

  public blurEventHandler(): void {
    this.onTouch();
  }

  /* ControlValueAccessor methods */

  public writeValue(value: number): void {
    this.value = value || 0;
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
