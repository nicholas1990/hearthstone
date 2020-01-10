import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Token } from 'src/models/home/home';

import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private _token$: BehaviorSubject<Token> = new BehaviorSubject(null);
  token$: Observable<Token> = this._token$.asObservable();

  emitToken(value: Token): void {
    this._token$.next(value);
  }

}
