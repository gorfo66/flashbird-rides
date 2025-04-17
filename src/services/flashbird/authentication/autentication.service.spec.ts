import { TestBed } from '@angular/core/testing';

import { AuthenticationService } from './authentication.service';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { flashbirdUrl } from '../constants';
import { AuthenticationReply } from '../flashbird-api-reply.model';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    
    service = TestBed.inject(AuthenticationService);
    httpTesting = TestBed.inject(HttpTestingController);

  });

  afterEach(() => {
    // Verify that none of the tests make any extra HTTP requests.
    TestBed.inject(HttpTestingController).verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  describe('getToken method', () => {
    it('should return token if the response contains the token', async () => {
      const token = 'abcd';
      const login = 'fakeLogin';
      const password = 'fakePassword;'
      const responseContent: AuthenticationReply = {
        data: {
          signInWithEmailAndPassword: {
            token: token
          }
        }
      }
      const token$ = firstValueFrom(service.getToken(login, password));
      const req = httpTesting.expectOne(flashbirdUrl, 'Request to get token');
      const body = JSON.parse(req.request.body);
      expect(req.request.method).toBe('POST');
      expect(body.variables.email).toEqual(login);
      expect(body.variables.password).toEqual(password);
      expect(body.operationName).toEqual('SignInWithEmailAndPassword');
      req.flush(responseContent);

      expect(await token$).toEqual({
        token: token
      })
    });
  
    it('should return an error if the response does not contain any token', async () => {
      const responseContent: AuthenticationReply = {}
      const token$ = firstValueFrom(service.getToken('login', 'password'));
      const req = httpTesting.expectOne(flashbirdUrl, 'Request to get token');
      req.flush(responseContent);

      expect(await token$).toEqual({
        token: undefined,
        error: jasmine.notEmpty()
      })
    });
  })


  describe('checkValidity method', () => {
    const validToken = [
      btoa('header'),
      btoa(JSON.stringify({ exp: new Date().getTime() / 1000 + 500})),
      btoa('validator')
    ].join('.');

    const expiredToken = [
      btoa('header'),
      btoa(JSON.stringify({ exp: new Date().getTime() / 1000 - 500})),
      btoa('validator')
    ].join('.');

    it('should return true if token is correctly formatted and not expired', () => {
      expect(service.checkValidity(validToken)).toBeTrue();
    });
  
    it('should return false if token is correctly formatted and expired', () => {
      expect(service.checkValidity(expiredToken)).toBeFalse();
    });
  
    it('should return false if token is wrongly formated', () => {
      expect(service.checkValidity('1212211221')).toBeFalse();
    });
  })
  
});
