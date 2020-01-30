
import { NotificationHandlerService } from './../../core/services/notification/notification-handler.service';
import { LoadingHandlerService } from './../../core/services/loading/loading-handler.service';
import { AuthenticationStoreService } from './authentication.store';
import { StorageHandlerService } from './../../core/services/storage/storage-handler.service';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable, BehaviorSubject, forkJoin, EMPTY } from 'rxjs';
import { Token, Authorization, Card, LoggedUser } from 'src/models/home/home';
import { take, switchMap, tap, catchError, map } from 'rxjs/operators';
import { ApiAuthenticationService } from './api-authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private apiService: ApiAuthenticationService,
    // private authenticationStore: AuthenticationStoreService,
    public loadingHandlerService: LoadingHandlerService,
    public notificationHandlerService: NotificationHandlerService,
    private storageHandlerService: StorageHandlerService,
  ) { }

  async getAuthorization(code: string): Promise<any> {

    return this.apiService.authorization({code}).pipe(
      tap(async (data: Token) => {
        console.log('data token: ', data);
        console.log(JSON.stringify(data));
        await this.storageHandlerService.setStorageToken(data);
      }),
      catchError(async (error) => {
        this.notificationHandlerService.showError(error);
        return EMPTY;
      }),
    ).toPromise();

    // return this.activatedRoute.queryParams.pipe(
    //   take(1),
    //   switchMap((parameters: Authorization) => this.apiService.authorization({code: parameters.code}).pipe(
    //     tap(async (data: Token) => {
    //       await this.storageHandlerService.setStorageToken(data);
    //     }),
    //     catchError((error) => {
    //       this.notificationHandlerService.showError(error);
    //       return EMPTY;  // OR of(null)
    //     }),
    //   )),
    //   catchError(async (error) => {
    //     this.notificationHandlerService.showError(error);
    //     return EMPTY;
    //   }),
    // ).toPromise();

  }

}

