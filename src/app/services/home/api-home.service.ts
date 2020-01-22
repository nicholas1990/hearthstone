import { Cards } from './../../../models/home/home';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Authorization, Token } from '../../../models/home/home';
import { environment } from './../../../environments/environment';

import { Observable } from 'rxjs';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class ApiHomeService {

  allCards = `${environment.hearthstone}cards?&pageSize=8`;

  constructor(private http: HttpClient) { }

  authorization(parameters: Authorization): Observable<Token> {

    const params = new HttpParams()
      .append('code', parameters.code)
      .append('grant_type', 'authorization_code')
      .append('redirect_uri', environment.redirect_uri);

    const authorization = `${environment.client_id}:${environment.secret_id}`;
    const headers = new HttpHeaders()
      .append('Authorization', 'Basic ' + btoa(authorization))
      .append('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post<Token>(environment.token_url, null, {params, headers});
  }

  getCards(attribute?:any) {
    const value = attribute
    console.log(value)
    const headers = new HttpHeaders()
      .append('Authorization', 'Bearer ' + 'EUeFOmnUcMDcRfetl1RAJliAcw6ACPuro2')
      .append('Content-Type', 'application/x-www-form-urlencoded');
    if(value){
      return this.http.get<Cards>(this.allCards+value, {
        headers:headers,
      });
    }else{
      return this.http.get<Cards>(this.allCards, {
        headers:headers,
      });
    }

  }
}
