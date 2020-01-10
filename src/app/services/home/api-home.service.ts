import { tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiHomeService{
   AllCards: string=`${environment.hearthstone}cards/`;

    

  constructor(private http:HttpClient) { }

  getCards(){

    return this.http.get(this.AllCards)
    
  }
}
