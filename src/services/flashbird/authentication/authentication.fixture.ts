import { of } from 'rxjs';
import { AuthenticationService } from './authentication.service';


export const MOCK_TOKEN = '123456';

export class AuthenticationServiceFixture implements Readonly<AuthenticationService> {

  public getToken: jasmine.Spy;
  public checkValidity: jasmine.Spy;

  constructor() { 
    this.getToken = jasmine.createSpy('getToken').and.returnValue(of({
      token: MOCK_TOKEN
    }));

    this.checkValidity = jasmine.createSpy('checkValidity').and.returnValue(true);
  }

}
