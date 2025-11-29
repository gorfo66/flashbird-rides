import {
  ChangeDetectionStrategy,
  Component,
  signal,
  inject
} from '@angular/core'
import {
  CommonModule
} from '@angular/common'
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms'
import {
  AuthenticationService
} from '../../services'
import {
  take
} from 'rxjs'
import {
  Store
} from '@ngrx/store'
import {
  upsertAuthToken
} from '../../store'
import {
  Router
} from '@angular/router'
import {
  MatButtonModule
} from "@angular/material/button"
import {
  MatCardModule
} from "@angular/material/card"
import {
  MatInputModule
} from "@angular/material/input"

@Component({
  selector: 'app-login-',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatCardModule, MatInputModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  private authService = inject(AuthenticationService);
  private store = inject(Store);
  private router = inject(Router);

  public errorMessage = signal<string>('');

  public readonly form: FormGroup;

  constructor() {
    this.form = new FormGroup({
      login: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required)
    });
  }

  public onSubmit() {
    if (this.form.valid) {
      const login = this.form.value.login;
      const password = this.form.value.password;
      this.authService.getToken(login, password).pipe(take(1)).subscribe((reply) => {
        if (reply.error) {
          this.errorMessage.set(reply.error);
          return;
        }
        this.store.dispatch(upsertAuthToken({ token: reply.token! }));
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
