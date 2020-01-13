import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Authorization, Token } from '../../../models/home/home';
import { environment } from './../../../environments/environment';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiHomeService {

  allCards = `${environment.hearthstone}/cards/`;

  constructor(private http: HttpClient) { }

  authorization(parameters: Authorization): Observable<Token> {

    const params = new HttpParams()
      .append('code', parameters.code)
      .append('grant_type', 'authorization_code')
      .append('redirect_uri', environment.redirect_uri);

    const authorization = `${environment.client_id}:${environment.secret_id}s`;
    const headers = new HttpHeaders()
      .append('Authorization', 'Basic ' + btoa(authorization))
      .append('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post<Token>(environment.token_url, null, {params, headers});
  }

  getCards() {
    //
  }
}
