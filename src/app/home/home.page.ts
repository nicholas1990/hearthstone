import { Token, Authorization } from './../../models/home/home';
import { tap, switchMap, catchError, take } from 'rxjs/operators';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { ApiHomeService } from '../services/home/api-home.service';
import { HomeService } from '../services/home/home.service';
import { Storage } from '@ionic/storage';

import { EMPTY, of } from 'rxjs';
// import { LoadingControllerService } from '../core/services';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(
    private activatedRoute: ActivatedRoute,
    public loadingController: LoadingController,
    private storage: Storage,
    // private loadingControllerService: LoadingControllerService,
    private apiService: ApiHomeService,
    public service: HomeService) {

    window.addEventListener('orientationchange', () => {
      console.log(screen.orientation.type); // e.g. portrait
    });

  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Accesso in corso',
    });
    return await loading.present();
    // const { role, data } = await loading.onDidDismiss();
  }

  ionViewDidEnter(): void {
    const loading = this.loadingController.create({
      message: 'Accesso in corso',
    });

    this.activatedRoute.queryParams.pipe(
      take(1),
      tap(async () => {
        const loader = await loading;
        loader.present();
      }),
      switchMap((parameters: Authorization) => this.apiService.authorization(parameters).pipe(
        catchError(async error => {
          const loader = await loading;
          loader.dismiss();
          console.dir(error);
          return null;
        }),
      )),
      tap((data: Token) => {
        // this.service.emitToken(data);
        this.service.setStorageToken(data);
      }),
      tap(async () => {
        const loader = await loading;
        loader.dismiss();
      }),
      catchError(async error => {
        const loader = await loading;
        loader.dismiss();
        console.dir(error);
        return EMPTY;
      }),
    ).subscribe();

  }

}
