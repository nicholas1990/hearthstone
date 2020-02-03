import { Injectable } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { Card, Deck } from 'src/models/home/home';

@Injectable({
  providedIn: 'root'
})
export class HomeStoreService {

  private _loggedUser$: Subject<number> = new Subject<number>();
  loggedUser$: Observable<number> = this._loggedUser$.asObservable();

  private _cards$: Subject<Card[]> = new Subject<Card[]>();
  cards$: Observable<Card[]> = this._cards$.asObservable();

  cards: Card[] = [];

  private _deck$: Subject<Deck> = new Subject<Deck>();
  deck$: Observable<Deck> = this._deck$.asObservable();

  constructor() { }

  emitLoggedUser(id: number) {
    this._loggedUser$.next(id);
  }

  emitCards(cards: Card[]){
    // this._cards$.next(card);
    this.cards = [
      ...cards
    ];
  }

  emitDeck(deck: Deck) {
    this._deck$.next(deck);
  }

}
