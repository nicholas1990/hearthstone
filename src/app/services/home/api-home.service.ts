
import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiHomeService{
   AllCards: string=`${environment.hearthstone}/cards/`;

  constructor() { }

  getCards(){
    
  }
}
