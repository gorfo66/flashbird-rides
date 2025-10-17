import {
  HttpClient
} from '@angular/common/http'
import {
  Injectable,
  inject
} from '@angular/core'
import {
  Observable,
  map
} from 'rxjs'
import {
  flashbirdUrl
} from '../constants'
import {
  AuthenticationReply,
  AuthenticationResult
} from '../../../models'

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private httpClient = inject(HttpClient);

  public getToken(login: string, password: string): Observable<AuthenticationResult> {
    return this.httpClient.post<AuthenticationReply>(
      flashbirdUrl, 
      JSON.stringify({
        "query":"mutation SignInWithEmailAndPassword($email: String!, $password: String!) { signInWithEmailAndPassword(email: $email, password: $password) { token }}",
        "variables":{
          "email":login,
          "password":password
        },
        "operationName":"SignInWithEmailAndPassword"
      })
    ).pipe(
      map((response) => {
        const token = response.data?.signInWithEmailAndPassword?.token as string;
        return {
          token,
          ... (!token) ? { error: 'Invalid credentials'} : {}
        }
      })
    )
  }


  public checkValidity(token: string): boolean {
    try {
      const ckunk = token.split('.');
      const value = JSON.parse(atob(ckunk[1]));
      return new Date().getTime() < (value.exp * 1000)
    }
    catch {
      return false;
    }
  }

}
