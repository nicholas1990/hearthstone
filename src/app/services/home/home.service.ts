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

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: ApiHomeService,
    private authService: StorageHandlerService,
    private homeStore: HomeStoreService,
    public loadingHandlerService: LoadingHandlerService,
    public notificationHandlerService: NotificationHandlerService,
    private storageHandlerService: StorageHandlerService,
  ) { }

  // async getAuthorization() {

  //   this.activatedRoute.queryParams.pipe(
  //     take(1),
  //     switchMap((parameters: Authorization) => this.apiService.authorization({code: parameters.code}).pipe(
  //       tap(async (data: Token) => {
  //         await this.storageHandlerService.setStorageToken(data);
  //       }),
  //       catchError((error) => {
  //         this.notificationHandlerService.showError(error);
  //         return EMPTY;  // OR of(null)
  //       }),
  //     )),
  //     catchError(async (error) => {
  //       this.notificationHandlerService.showError(error);
  //       return EMPTY;
  //     }),
  //   ).toPromise();

  // }

  // async getDataFromMultipleSource() {

  //   let observable1: Observable<number> = await this.getUserInfo();
  //   let observable2: Observable<Card[]> = this.getCards();

  //   return forkJoin([
  //     observable1, 
  //     observable2,
  //   ]).subscribe((response) => {
  //     this.homeStore.emitLoggedUser(response[0]);
  //     this.homeStore.emitCards(response[1]);
  //   }, (error) => {
  //     this.notificationHandlerService.showError(error);
  //     return EMPTY;
  //   });

  // }

  // async getUserInfo() {

  //   const token = await this.storageHandlerService.getStorageToken();

  //   return this.apiService.getUserInfo(token).pipe(
  //     take(1),
  //     map((loggedUser: LoggedUser): number => {
  //       return loggedUser.id;
  //     })
  //   );

  // }

  getCards(attribute?:string): Observable<Card[]> {
    console.log("getcards")
    if(attribute){
    this.urlAttribute = attribute
    }
    return this.apiService.getCards(this.urlAttribute).pipe(
      take(1),
      map((res: Cards): Card[] => {
        return res.cards;
      }),
    );

  }

  getCardsFiltered(attribute:string): void {

    this.getCards(attribute).subscribe(
      (response) => {
        this.homeStore.emitCards(response);
      }, (error) => {
        this.notificationHandlerService.showError(error);
      }
    );

  }

}
