import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { CoreModule, NavigationPage } from '@drf-core';
import { AppPaths } from './app.routes';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, CoreModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  public pages: NavigationPage[] = [
    { label: 'Simple', link: AppPaths.Simple },
    { label: 'Multi Step', link: AppPaths.MultiStep },
  ];
}
