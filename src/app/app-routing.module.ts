import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {
  canActivate,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
    ...canActivate(() => redirectUnauthorizedTo(['login'])),
  },
  {
    path: 'car-map/:action',
    loadChildren: () =>
      import('./car-map/car-map.module').then((m) => m.CarMapModule),
    ...canActivate(() => redirectUnauthorizedTo(['login'])),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginModule),
    ...canActivate(() => redirectLoggedInTo(['home'])),
  },
  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
