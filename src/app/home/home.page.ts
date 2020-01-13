import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';
import { EMPTY } from 'rxjs';
import { tap, switchMap, catchError, take } from 'rxjs/operators';
import { Token, Authorization } from './../../models/home/home';
import { ApiHomeService } from '../services/home/api-home.service';
import { HomeService } from '../services/home/home.service';
import { LoadingControllerService, ToastControllerService } from '../core/services';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  mana: Array<number> = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  constructor(
    private activatedRoute: ActivatedRoute,
    private loadingControllerService: LoadingControllerService,
    private toastControllerService: ToastControllerService,
    private apiService: ApiHomeService,
    public service: HomeService
  ) {

    window.addEventListener('orientationchange', () => {
      console.log(screen.orientation.type); // e.g. portrait
    });

  }

  ionViewDidEnter(): void {

    this.loadingControllerService.createLoading('Accesso in corso');

    this.activatedRoute.queryParams.pipe(
      take(1),
      tap(async () => {
        this.loadingControllerService.presentLoading();
      }),
      switchMap((parameters: Authorization) => this.apiService.authorization(parameters).pipe(
        catchError(async error => {
          this.loadingControllerService.dismissLoading();
          this.toastControllerService.createToast(error);
          this.toastControllerService.presentToast();
          console.dir(error);
          return null;
        }),
      )),
      tap((data: Token) => {
        // this.service.emitToken(data);
        this.service.setStorageToken(data);
      }),
      tap(async () => {
        this.loadingControllerService.dismissLoading();
      }),
      catchError(async error => {
        this.loadingControllerService.dismissLoading();
        this.toastControllerService.createToast(error);
        this.toastControllerService.presentToast();
        console.dir(error);
        return EMPTY;
      }),
    ).subscribe();

  }

}
