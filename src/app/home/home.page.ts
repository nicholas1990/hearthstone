import { Token, Authorization } from './../../models/home/home';
import { tap, switchMap, catchError, take } from 'rxjs/operators';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { ApiHomeService } from '../services/home/api-home.service';
import { LoadingControllerService } from '../core/services';
import { HomeService } from '../services/home/home.service';
import { Storage } from '@ionic/storage';

import { EMPTY, of } from 'rxjs';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  mana: Array<number> = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  constructor(
    private activatedRoute: ActivatedRoute,
    public loadingController: LoadingController,
    private storage: Storage,
    private loadingControllerService: LoadingControllerService,
    private apiService: ApiHomeService,
    public service: HomeService) {

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
        console.dir(error);
        return EMPTY;
      }),
    ).subscribe();

  }

}
