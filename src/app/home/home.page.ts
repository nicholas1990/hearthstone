import { SkinFilterComponent } from './../components/skin-filter/skin-filter.component';
import { ManaFilterComponent } from './../components/mana-filter/mana-filter.component';
import { HomeService } from './../services/home/home.service';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { tap, switchMap, catchError, take, map } from 'rxjs/operators';
import { Token, Authorization, Cards, Card, urlAttr} from './../../models/home/home';
import { ApiHomeService } from '../services/home/api-home.service';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { LoadingControllerService, ToastControllerService } from '../core/services';
import { PopoverController, Events } from '@ionic/angular';
import { myEnterAnimation, myLeaveAnimation } from '../core/animation';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  

  cards$:Observable<Cards>;
  cards : Array<Card>;
  paginate: number = 1;
  mana: string = '';
  selectSkin: string = '';
  urlAttribute: string = `&class=druid`;

  validate : urlAttr = {
    class:'druid',
    manaCost: '',
    page: ''
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private loadingControllerService: LoadingControllerService,
    private toastControllerService: ToastControllerService,
    private apiService: ApiHomeService,
    public homeService: HomeService,
    public authService: AuthenticationService,
    public popoverController: PopoverController,
    private events: Events
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

    this.apiService.getCards(this.urlAttribute).pipe(
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
    this.events.subscribe('selectManaEvent', res => {
      this.filterMana(res)
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
    this.events.subscribe('selectSkinEvent', res => {
      this.filterSkin(res)
    });
  
    return await popover.present();
  }
  getCard(card:Card){
    console.log(card)

  }
  backPage(){
    this.paginate--
    const page = `&page=${this.paginate}`
    this.validate.page = page
    this.validateUrl(page)
  }
  nextPage(){
    this.paginate++
    const page = `&page=${this.paginate}`
    this.validate.page = page
    this.validateUrl(page)
  }
  filterSkin(skin?:string){
    this.selectSkin = `&class=${skin}&page=1`;
    this.validate.page = '1';
    this.paginate=1;
    this.validateUrl(this.selectSkin)
  }
  filterMana(mana?:string){
    this.mana = `&manaCost=${mana}&page=1`;
    this.validate.page = '1';
    this.paginate=1;
    this.validateUrl(this.mana)
  }
  validateUrl(attribute:string){
    //prove
    this.urlAttribute = this.urlAttribute+attribute
    let b = this.urlAttribute.split('&')
    b.forEach(element => {
      let x = element.split('=')
      
      if(x.length == 2){
          if(x[0] == 'class'){
            this.validate.class = x[1]
            //this.urlAttribute = this.urlAttribute+'&class='+x[1];
          }else if(x[0] == 'manaCost'){
            this.validate.manaCost = x[1]
            //this.urlAttribute = this.urlAttribute+'&manaCost='+x[1];
          }else if(x[0] == 'page'){
            this.validate.page = x[1]
            //this.urlAttribute = this.urlAttribute+'&page='+x[1];
          }
      }
      }
      );
      //ricostruisco l'url
      if(this.validate.class != '' ){
        this.urlAttribute = `&class=${this.validate.class}`
      }
      if(this.validate.manaCost != ''){
        this.urlAttribute = this.urlAttribute+`&manaCost=${this.validate.manaCost}`
      }
      if(this.validate.page != ''){
        this.urlAttribute = this.urlAttribute+`&page=${this.validate.page}`
      }
      
      console.log('url: '+this.urlAttribute)
      console.log(this.validate)
    
    
    this.apiService.getCards(this.urlAttribute).pipe(
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
