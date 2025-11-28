import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick
} from '@angular/core/testing'

import {
  LoginComponent
} from './login.component'
import {
  AuthenticationService
} from '../../services'
import {
  AuthenticationServiceFixture,
  MOCK_TOKEN
} from '../../services/flashbird/authentication/authentication.fixture'
import {
  ReactiveFormsModule
} from '@angular/forms'
import {
  MatButtonModule
} from '@angular/material/button'
import {
  MatCardModule
} from '@angular/material/card'
import {
  MatInputModule
} from '@angular/material/input'
import {
  MockStore,
  provideMockStore
} from '@ngrx/store/testing'
import {
  selectToken
} from '../../store'
import {
  Router,
  RouterModule
} from '@angular/router'
import {
  LoginComponentFixture
} from './login.fixture';
import {
  of
} from 'rxjs';


describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let componentFixture: LoginComponentFixture;
  let store: MockStore;
  let router: Router;
  let authenticationService: AuthenticationServiceFixture;

  beforeEach(async () => {
    authenticationService = new AuthenticationServiceFixture();

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        MatButtonModule,
        MatCardModule,
        MatInputModule,
        ReactiveFormsModule,
        RouterModule.forRoot([{
          path: 'rides',
          redirectTo: '/'
        }])
      ],
      providers: [
        provideMockStore(),
        {
          provide: AuthenticationService,
          useValue: authenticationService
        }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    componentFixture = new LoginComponentFixture(fixture.debugElement);

    store = TestBed.inject(MockStore);
    store.overrideSelector(selectToken, MOCK_TOKEN);
    
    router = TestBed.inject(Router)

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update the store once succesfully submitted', fakeAsync(() => {
    const dispatchSpy = spyOn(store, 'dispatch').and.callThrough();
    const routerSpy = spyOn(router, 'navigate').and.callThrough();
    
    const login = 'login@domain.com';
    const password = 'password';
    component.form.controls['login'].setValue(login);
    component.form.controls['password'].setValue(password);
    component.form.markAllAsTouched();
    component.onSubmit();
    
    tick();
    fixture.detectChanges();
    
    // No error message
    expect(componentFixture.hasServerErrorText()).toBeFalse();

    // Call the authentication service
    expect(authenticationService.getToken).toHaveBeenCalledWith(login, password);

    // Dispatch the token to the store
    expect(dispatchSpy).toHaveBeenCalledOnceWith(
      { token: MOCK_TOKEN,
        type: '[Auth] Upsert token' }
    );

    // Redirect to the rides page
    expect(routerSpy).toHaveBeenCalledOnceWith(['rides']);
  }));

  it('should show error in case of wrong authentication', fakeAsync(() => {

    // Force the error case
    authenticationService.getToken = jasmine.createSpy('getToken').and.returnValue(of({
      error: 'auth error'
    }));

    const dispatchSpy = spyOn(store, 'dispatch').and.callThrough();
    const routerSpy = spyOn(router, 'navigate').and.callThrough();
    
    const login = 'login@domain.com';
    const password = 'password';
    component.form.controls['login'].setValue(login);
    component.form.controls['password'].setValue(password);
    component.form.markAllAsTouched();
    component.onSubmit();
    
    tick();
    fixture.detectChanges();
    
    // Error message displayed
    expect(componentFixture.hasServerErrorText()).toBeTrue();
    expect(componentFixture.getServerErrorText()).toEqual('auth error');

    // We must not dispatch anything to the store
    expect(dispatchSpy).not.toHaveBeenCalled();

    // We must not redirect out of the login page
    expect(routerSpy).not.toHaveBeenCalled();
  }));
});
