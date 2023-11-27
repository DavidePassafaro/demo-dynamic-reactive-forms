import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'drf-homepage',
  templateUrl: './homepage.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class HomepageComponent {}
