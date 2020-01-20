import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EMPTY } from 'rxjs';
import { tap, switchMap, catchError, take } from 'rxjs/operators';
import { Token, Authorization } from './../../models/home/home';
import { ApiHomeService } from '../services/home/api-home.service';
import { AuthenticationService } from '../services/authentication/authentication.service';
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
    public authService: AuthenticationService
  ) {

    window.addEventListener('orientationchange', () => {
      console.log(screen.orientation.type); // e.g. portrait
    });

  }

  async ionViewDidEnter(): Promise<void> {

    this.loadingControllerService.createLoading('Accesso in corso');

    this.activatedRoute.queryParams.pipe(
      take(1),
      tap(async () => {
        this.loadingControllerService.presentLoading();
      }),
      switchMap((parameters: Authorization) => this.apiService.authorization(parameters).pipe(
        catchError(async (error) => {
          await this.loadingControllerService.dismissLoading();
          this.toastControllerService.createToast(error);
          await this.toastControllerService.presentToast();
          return null;
        }),
      )),
      tap(async (data: Token) => {
        await this.authService.setStorageToken(data);
      }),
      tap(async () => {
        await this.loadingControllerService.dismissLoading();
      }),
      catchError(async (error) => {
        await this.loadingControllerService.dismissLoading();
        this.toastControllerService.createToast(error);
        await this.toastControllerService.presentToast();
        return EMPTY;
      }),
    ).subscribe();

    // const response = this.authService.isAuthenticated();

    const getInfo = async (): Promise<Token> => {
      return await this.authService.getStorageToken();
    };

    const asd = await getInfo();

    console.log('token ', asd.access_token);

  }

  async onClick(): Promise<Token> {
    const control =  this.authService.isAuthenticated();
    // console.log(control);
    const info = await this.authService.getStorageToken();
    return info;

  }

}
