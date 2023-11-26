import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckboxListComponent, InputComponent } from '@drf-shared';
import {
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'drf-simple-form-page',
  templateUrl: './simple-form-page.component.html',
  standalone: true,
  imports: [
    CommonModule,
    InputComponent,
    CheckboxListComponent,
    ReactiveFormsModule,
  ],
})
export class SimpleFormPageComponent {
  public name = new UntypedFormControl(null, Validators.required);
  public skills = new UntypedFormControl(['react'], Validators.required);

  public formGroup = new UntypedFormGroup({
    name: this.name,
    skills: this.skills,
  });

  constructor() {
    this.formGroup.controls['name'].valueChanges.subscribe(console.log);
  }
}
