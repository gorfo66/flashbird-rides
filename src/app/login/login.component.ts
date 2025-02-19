import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services';
import { BehaviorSubject } from 'rxjs';
import { Store } from '@ngrx/store';
import { upsertAuthToken } from '../../store';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {

  private errorMessageSubject = new BehaviorSubject<string>('');
  public errorMessage$ = this.errorMessageSubject.asObservable();

  public readonly form: FormGroup;

  constructor(private authService: AuthenticationService, private store: Store, private router: Router) {
    this.form = new FormGroup({
      login: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required)
    });
  }

  public onSubmit() {
    if (this.form.valid) {
      const login = this.form.value.login;
      const password = this.form.value.password;
      this.authService.getToken(login, password).subscribe((reply) => {
        if (reply.error) {
          this.errorMessageSubject.next(reply.error);
          return;
        }

        this.store.dispatch(upsertAuthToken({token: reply.token!}));
        this.router.navigate(['rides']);
      })
    }

    

    return false;
  }


  get login() {
    return this.form.controls['login']
  }

  get password() {
    return this.form.controls['password']
  }
}
