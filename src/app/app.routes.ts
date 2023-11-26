import { Routes } from '@angular/router';

export const AppPaths = {
  Homepage: 'home',
  Simple: 'simple-form',
  MultiStep: 'multi-step-form',
  Theatre: 'theatre-form',
};

export const routes: Routes = [
  {
    path: AppPaths.Homepage,
    loadComponent: () =>
      import('./features/homepage/homepage.component').then(
        (m) => m.HomepageComponent
      ),
    title: 'DRF • Select a form',
  },
  {
    path: AppPaths.Simple,
    loadComponent: () =>
      import('./features/simple/simple-form-page.component').then(
        (m) => m.SimpleFormPageComponent
      ),
    title: 'DRF • Simple Form',
  },
  {
    path: AppPaths.MultiStep,
    loadComponent: () =>
      import('./features/multi-step/multi-step-form-page.component').then(
        (m) => m.MultiStepFormPageComponent
      ),
    title: 'DRF • Multi Step Form',
  },
  {
    path: AppPaths.Theatre,
    loadComponent: () =>
      import('./features/theater/theater-form-page.component').then(
        (m) => m.TheaterFormPageComponent
      ),
    title: 'DRF • Theatre Form',
  },
  { path: '', redirectTo: `/${AppPaths.Homepage}`, pathMatch: 'full' },
  { path: '**', redirectTo: `/${AppPaths.Homepage}`, pathMatch: 'full' },
];
