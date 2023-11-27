import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'drf-homepage',
  templateUrl: './homepage.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class HomepageComponent {
  public readonly gitHubUrl: string =
    'https://github.com/DavidePassafaro/demo-dynamic-reactive-forms';
}
