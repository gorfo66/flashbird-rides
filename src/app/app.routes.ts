import {
  Routes
} from '@angular/router'
import {
  RideComponent,
  RideGuard
} from './ride'
import {
  RidesComponent,
  RidesGuard
} from './rides'
import {
  LoginComponent
} from './login'

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'rides',
    component: RidesComponent,
    canActivate: [RidesGuard]
  },
  {
    path: 'ride/:id',
    component: RideComponent,
    canActivate: [RideGuard]
  },
  { path: '**',
    redirectTo: '/rides',
    pathMatch: 'full' },
];
