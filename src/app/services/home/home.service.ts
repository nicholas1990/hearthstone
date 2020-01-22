import { Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Card } from 'src/models/home/home';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private _cards$: Subject<Card[]> = new Subject<Card[]>()
  cards$ : Observable<Card[]> = this._cards$.asObservable()

  private _deck$: Subject<Card[]> = new Subject<Card[]>()
  deck$ : Observable<Card[]> = this._deck$.asObservable()

  constructor() { }

   emitCards(card: Card[]){
     this._cards$.next(card);
   }

   addDeck(card: Card[]){
     this._deck$.next(card)

   }

}
