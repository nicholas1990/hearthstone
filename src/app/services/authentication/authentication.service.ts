import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable, BehaviorSubject } from 'rxjs';
import { Token } from 'src/models/home/home';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private _token$: BehaviorSubject<Token> = new BehaviorSubject(null);
  token$: Observable<Token> = this._token$.asObservable();

  constructor(private storage: Storage) { }

  // emitToken(value: Token): void {
  //   this._token$.next(value);
  // }

  async getStorageToken(): Promise<Token> {
    const token = await this.storage.get('token');
    return token;
    // return this.storage.get('token').then((val: Token) => {
    //     return val.access_token;
    //   }, () => {
    //     return null;
    //   }
    // );
  }

  async setStorageToken(token?: Token): Promise<void> {
    await this.storage.set('token', token);
    this._token$.next(token);
  }
  
  isAuthenticated() {
    return this._token$.value;
  }

}
