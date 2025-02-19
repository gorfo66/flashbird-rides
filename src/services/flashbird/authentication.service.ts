import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { flashbirdUrl } from './constants';
import { AuthenticationReply } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor( private httpClient: HttpClient) { }


  public getToken(login: string, password: string): Observable<AuthenticationReply> {
    return this.httpClient.post(
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
      map((response:any) => {
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
