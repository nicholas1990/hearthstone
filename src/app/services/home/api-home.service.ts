import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageHandlerService } from '../../core/services/index';
import { Authorization, Token, Cards } from '../../../models/home/home';
import { environment } from './../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ApiHomeService {

  allCards = `${environment.hearthstone}cards?&pageSize=8`;

  constructor(private http: HttpClient, private storage: StorageHandlerService) { }

  authorization(parameters: Authorization): Observable<Token> {

    const params = new HttpParams()
      .append('code', parameters.code)
      .append('grant_type', 'authorization_code')
      .append('redirect_uri', environment.redirect_uri);

    const authorization = `${environment.client_id}:${environment.secret_id}`;
    const headers = new HttpHeaders()
      .append('Authorization', 'Basic ' + btoa(authorization))
      .append('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post<Token>(environment.token_url, null, {
      params, 
      headers
    });
  }

  /**
   * Ritorna le informazioni riguardanti l'utente loggato.
   */
  getUserInfo(token: Token) {
    
    const userInfo = `https://eu.battle.net/oauth/userinfo`;
    const authorization = `Bearer ${token.access_token}`;

    console.log('authorization ');
    console.log(JSON.stringify(authorization));
    const headers = new HttpHeaders()
      .append('Authorization', authorization)
      .append('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.get<any>(userInfo, {
      headers,
    });

  }

  getCards(token:Token, attribute?: number | string) {

    console.log(typeof attribute);

    const authorization = `Bearer ${token.access_token}`;

    const headers = new HttpHeaders()
      .append('Authorization', authorization)
      .append('Content-Type', 'application/x-www-form-urlencoded');

    const url = `${this.allCards}${attribute}`
    
    return this.http.get<Cards>(url, {
      headers,
    });

  }
}
