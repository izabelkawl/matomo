import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/form-default/form-default.page').then((m) => m.FormDefaultPageComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
