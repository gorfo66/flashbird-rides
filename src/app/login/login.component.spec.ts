import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { AuthenticationService } from '../../services';
import { AuthenticationServiceFixture, MOCK_TOKEN } from '../../services/flashbird/authentication/authentication.fixture';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { selectToken } from '../../store';
import { Router, RouterModule } from '@angular/router';
import { firstValueFrom, of } from 'rxjs';


describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let store: MockStore;
  let router: Router;
  const authenticationService = new AuthenticationServiceFixture();
  let dispatchSpy: jasmine.Spy;
  let routerSpy: jasmine.Spy;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
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
    store = TestBed.inject(MockStore);
    store.overrideSelector(selectToken, MOCK_TOKEN);
    
    router = TestBed.inject(Router);
    dispatchSpy = spyOn(store, 'dispatch').and.callThrough();
    routerSpy = spyOn(router, 'navigate').and.callThrough();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update the store once succesfully submitted', fakeAsync(() => {
    authenticationService.getToken.and.returnValue(of({
      token: MOCK_TOKEN
    }));
    
    const login = 'login@domain.com';
    const password = 'password';
    component.form.controls['login'].setValue(login);
    component.form.controls['password'].setValue(password);
    component.form.markAllAsTouched();
    component.onSubmit();
    
    tick();

    // Call the authentication service
    expect(authenticationService.getToken).toHaveBeenCalledWith(login, password);

    // Dispatch the token to the store
    expect(dispatchSpy).toHaveBeenCalledOnceWith(
      { token: MOCK_TOKEN, type: '[Auth] Upsert token' }
    );

    // Redirect to the rides page
    expect(routerSpy).toHaveBeenCalledOnceWith(['rides']);
  }));

  it('should show an error in case of wrong authentication', fakeAsync(async () => {
    authenticationService.getToken.and.returnValue(of({
      token: undefined,
      error: 'wrong credentials'
    }));

    const login = 'login@domain.com';
    const password = 'password';
    component.form.controls['login'].setValue(login);
    component.form.controls['password'].setValue(password);
    component.form.markAllAsTouched();
    component.onSubmit();

    tick();

    const errorMessage = await firstValueFrom(component.errorMessage$);
    expect(errorMessage).toEqual('wrong credentials');
    expect(dispatchSpy).not.toHaveBeenCalled();
    expect(routerSpy).not.toHaveBeenCalled();
  }))
});
