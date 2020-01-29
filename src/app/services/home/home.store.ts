import { Injectable } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { Card, Deck } from 'src/models/home/home';

@Injectable({
  providedIn: 'root'
})
export class HomeStoreService {

  

  private _cards$: Subject<Card[]> = new Subject<Card[]>();
  cards$ : Observable<Card[]> = this._cards$.asObservable();

  private _deck$: Subject<Deck> = new Subject<Deck>();
  deck$ : Observable<Deck> = this._deck$.asObservable();

  constructor() { }

  

  emitCards(card: Card[]){
    this._cards$.next(card);
  }

  emitDeck(deck: Deck) {
    this._deck$.next(deck);
  }

}
