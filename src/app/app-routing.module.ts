import {
  NgModule
} from '@angular/core'
import {
  RouterModule,
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

const routes: Routes = [
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

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
