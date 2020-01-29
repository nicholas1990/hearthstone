import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable , Subject, BehaviorSubject } from 'rxjs';
import { Token } from 'src/models/home/home';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationStoreService {



  private _token$: BehaviorSubject<Token> = new BehaviorSubject(null);
  token$: Observable<Token> = this._token$.asObservable();

  private _loggedUser$: Subject<number> = new Subject<number>();
  loggedUser$: Observable<number> = this._loggedUser$.asObservable();

  constructor(private storage: Storage) { }


  async getStorageToken(): Promise<Token> {
    const token = await this.storage.get('token');
    return token;
  }

  async setStorageToken(token?: Token): Promise<void> {
    await this.storage.set('token', token);
    this._token$.next(token);
  }
  
  isAuthenticated() {
    return this._token$.value;
  }

  emitLoggedUser(id: number) {
    this._loggedUser$.next(id);
  };

}
