import { SkinFilterComponent } from './../components/skin-filter/skin-filter.component';
import { ManaFilterComponent } from './../components/mana-filter/mana-filter.component';

import { HomeService } from './../services/home/home.service';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { tap, switchMap, catchError, take, map } from 'rxjs/operators';
import { Token, Authorization, Cards, Card } from './../../models/home/home';
import { ApiHomeService } from '../services/home/api-home.service';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { LoadingControllerService, ToastControllerService } from '../core/services';
import { PopoverController } from '@ionic/angular';
import { myEnterAnimation, myLeaveAnimation } from '../core/animation';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  mana: Array<number> = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  cards$:Observable<Cards>;
  cards : Array<Card>;
  paginate: number = 1

  constructor(
    private activatedRoute: ActivatedRoute,
    private loadingControllerService: LoadingControllerService,
    private toastControllerService: ToastControllerService,
    private apiService: ApiHomeService,
    public homeService: HomeService,
    public authService: AuthenticationService,
    public popoverController: PopoverController,
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

    this.apiService.getCards().pipe(
      map((res: Cards): Card[] => {
        return res.cards;
      }),
      tap((res: Card[]) => {
        console.log(res)
        this.homeService.emitCards(res)
        //this.cards = res.cards
      })        
    ).subscribe();
    
    const getInfo = async (): Promise<Token> => {
      return await this.authService.getStorageToken();
    };
    const asd = await getInfo();
    console.log('token ', asd.access_token);

  }

  async onClick(): Promise<Token> {
    let control =  this.authService.isAuthenticated()
    console.log(control)
    const info = await this.authService.getStorageToken();
    const token = info.access_token;
    return info;
  }
  async presentPopoverMana(ev: any) {
    const popover = await this.popoverController.create({
      component: ManaFilterComponent,
      event: ev,
      cssClass:'mana-popover',
      enterAnimation:myEnterAnimation,
      leaveAnimation:myLeaveAnimation,
      translucent: true
    });
    return await popover.present();
  }
  async presentPopoverSkin(ev: any) {
    const popover = await this.popoverController.create({
      component: SkinFilterComponent,
      event: ev,
      cssClass:'skin-popover',
      enterAnimation:myEnterAnimation,
      leaveAnimation:myLeaveAnimation,
      translucent: true
    });
    return await popover.present();
  }
  getCard(card:Card){
    console.log(card)

  }
  backPage(){
    this.paginate--
    const page = `&page=${this.paginate}`
    this.apiService.getCards(page).pipe(
      map((res: Cards): Card[] => {
        return res.cards;
      }),
      tap((res: Card[]) => {
        console.log(res)
        this.homeService.emitCards(res)
        //this.cards = res.cards
      })        
    ).subscribe();
  }
  nextPage(){
    this.paginate++
    const page = `&page=${this.paginate}`
    this.apiService.getCards(page).pipe(
      map((res: Cards): Card[] => {
        return res.cards;
      }),
      tap((res: Card[]) => {
        console.log(res)
        this.homeService.emitCards(res)
        //this.cards = res.cards
      })        
    ).subscribe();

  }
  

}
