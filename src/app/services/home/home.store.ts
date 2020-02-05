import { Skin } from './../../../models/home/home';
import { Injectable } from '@angular/core';
import { Observable, Subject,  } from 'rxjs';
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

  private _mana$: Subject<number | string> = new Subject<number | string>();
  mana$: Observable<number | string> = this._mana$.asObservable();

  private _skin$: Subject<Skin> = new Subject<Skin>();
  skin$: Observable<Skin> = this._skin$.asObservable();

  constructor() { }

  emitLoggedUser(id: number) {
    this._loggedUser$.next(id);
  }

  emitCards(cards: Card[]){
    console.log('CARDS:', cards);
    this._cards$.next(cards);
    // this.cards = [
    //   ...cards
    // ];
  }

  emitDeck(deck: Deck) {
    this._deck$.next(deck);
  }

  emitMana(mana: number | string) {
    this._mana$.next(mana);
  }
  emitSkin(skin :Skin) {
    this._skin$.next(skin);
  }

}
