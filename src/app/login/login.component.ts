import {
  ChangeDetectionStrategy,
  Component,
  inject,
  effect
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
  filter,
  map,
} from 'rxjs'
import {
  Store
} from '@ngrx/store'
import {
  login,
  selectToken,
  selectUiState,
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
import {
  toSignal
} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatCardModule, MatInputModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  private store = inject(Store);
  private router = inject(Router);

  public errorMessage = toSignal(this.store.select(selectUiState).pipe(map((state) => state?.errorMessage || '')));
  private token = toSignal(this.store.select(selectToken).pipe(filter( (token) => !!token)))

  public readonly form: FormGroup;

  constructor() {
    this.form = new FormGroup({
      login: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required)
    });


    effect(() => {
      if (this.token()) {
        this.router.navigate(['rides']);
      }
    })
  }

  public onSubmit() {
    if (this.form.valid) {
      this.store.dispatch(login({ login: this.form.value.login, password: this.form.value.password}));
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
