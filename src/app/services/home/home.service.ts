import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Storage } from '@ionic/storage';
import { Token } from 'src/models/home/home';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private _token$: BehaviorSubject<Token> = new BehaviorSubject(null);
  token$: Observable<Token> = this._token$.asObservable();

  constructor(private storage: Storage) { }

  // emitToken(value: Token): void {
  //   this._token$.next(value);
  // }

  getStorageToken() {
    this.storage.get('token').then((val: Token) => {
        return val;
      }, () => {
        return null;
      }
    );
  }

  setStorageToken(token: Token) {
    this.storage.set('token', token);
  }

}
