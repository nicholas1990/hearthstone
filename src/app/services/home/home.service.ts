import { Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Card } from 'src/models/home/home';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private _cards$: Subject<Card[]> = new Subject<Card[]>()
  cards$ : Observable<Card[]> = this._cards$.asObservable()

  constructor() { }

   emitCards(card: Card[]){
     this._cards$.next(card);
   }

}
