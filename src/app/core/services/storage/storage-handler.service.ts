import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Token } from 'src/models/home/home';

@Injectable({
  providedIn: 'root'
})
export class StorageHandlerService {

  constructor(private storage: Storage) { }

  async setStorageToken(token: Token): Promise<void> {
    await this.storage.set('token', token);
    // this._token$.next(token);
  }

  async getStorageToken(): Promise<Token> {

    const getInfo = async (): Promise<Token> => {
      return await this.storage.get('token');
    };

    return await getInfo();

  }
}
