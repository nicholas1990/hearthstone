import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, of, Observable, forkJoin } from 'rxjs';
import { tap, switchMap, catchError, take, map, filter, finalize } from 'rxjs/operators';
import { ApiHomeService } from './api-home.service';
import { HomeStoreService } from './home.store';
import { LoadingHandlerService, NotificationHandlerService, StorageHandlerService } from '../../core/services/index';
import { Authorization, Token, Cards, Card, LoggedUser } from '../../../models/home/home';


@Injectable({
  providedIn: 'root'
})
export class HomeService {

  urlAttribute: string = `&class=druid`;
  tokenAccess: Token;

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: ApiHomeService,
    private authService: StorageHandlerService,
    private homeStore: HomeStoreService,
    public loadingHandlerService: LoadingHandlerService,
    public notificationHandlerService: NotificationHandlerService,
    private storageHandlerService: StorageHandlerService,
  ) { }

  async getDataFromMultipleSource() {

    const observable1: Observable<number> = await this.getUserInfo();
    const observable2: Observable<Card[]> = await this.getCards();

    return forkJoin([
      observable1, 
      observable2,
    ]).subscribe((response) => {
      this.homeStore.emitLoggedUser(response[0]);
      this.homeStore.emitCards(response[1]);
    }, (error) => {
      this.notificationHandlerService.showError(error);
      return EMPTY;
    });

  }

  async getUserInfo() {

    this.tokenAccess = await this.storageHandlerService.getStorageToken();
    return this.apiService.getUserInfo(this.tokenAccess).pipe(
      take(1),
      map((loggedUser: LoggedUser): number => {
        return loggedUser.id;
      })
    );

  }

  async getCards(attribute?:string) {
    this.tokenAccess = await this.storageHandlerService.getStorageToken();
    console.log("getcards")
    if(attribute){
    this.urlAttribute = attribute
    }
    return this.apiService.getCards(this.tokenAccess,this.urlAttribute).pipe(
      take(1),
      map((res: Cards): Card[] => {
        return res.cards;
      }),
    );

  }

  async getCardsFiltered(attribute:string) {

    this.tokenAccess = await this.storageHandlerService.getStorageToken();

    if (attribute) {
      this.urlAttribute = attribute;
    }
    return this.apiService.getCards(this.tokenAccess,this.urlAttribute).pipe(
      take(1),
      map((res: Cards): Card[] => {
        return res.cards;
      }),
    );

    // .pipe(
    //   take(1),
    //   finalize(() => console.log('Sequence complete'))
    // ).subscribe(
    //   (response) => {
    //     console.log('response: ', response);
    //     this.homeStore.emitCards(response);
    //   }, (error) => {
    //     this.notificationHandlerService.showError(error);
    //   }
    // );

  }

}
