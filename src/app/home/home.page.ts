import { ModalSkinComponent } from './../components/modal-skin/modal-skin.component';
import { SkinFilterComponent } from './../components/skin-filter/skin-filter.component';
import { ManaFilterComponent } from './../components/mana-filter/mana-filter.component';
import { HomeService } from './../services/home/home.service';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { tap, switchMap, catchError, take, map, filter } from 'rxjs/operators';
import { Token, Authorization, Cards, Card, urlAttr, Deck } from './../../models/home/home';
import { ApiHomeService } from '../services/home/api-home.service';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { LoadingControllerService, ToastControllerService } from '../core/services';
import { PopoverController, Events, ModalController } from '@ionic/angular';
import { myEnterAnimation, myLeaveAnimation } from '../core/animation';
import { element } from 'protractor';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  // cards$: Observable<Cards>;
  cards : Array<Card>;
  paginate: number = 1;
  mana: string = '*';
  maxLength: number = 30;
  selectSkin: string = 'druid';
  urlAttribute: string = `&class=druid`;
  createDeck: boolean = false;

  deck : Deck = {
    id:0,
    cards:[],
    counter:0,
  }

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
    private events: Events,
    public modalController: ModalController
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
        await this.loadingControllerService.presentLoading();
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

    this.getCards();

    const getInfo = async (): Promise<Token> => {
      return await this.authService.getStorageToken();
    };
    const asd = await getInfo();
    console.log('token ', asd.access_token);

  }

  private getCards() {

    this.apiService.getCards(this.urlAttribute).pipe(
      map((res: Cards): Card[] => {
        return res.cards;
      }),
    ).subscribe(
      (res: Card[]) => {
        this.homeService.emitCards(res);
      }
    );

  }

  async onClick(): Promise<Token> {

    let control =  this.authService.isAuthenticated()
    console.log(control)
    const info = await this.authService.getStorageToken();
    return info;

  }
  async presentModalSkin() {
    const modal = await this.modalController.create({
      component: ModalSkinComponent
    });
    this.events.subscribe('selectSkinEvent', res => {
      if(res){
        this.createDeck = true
      }else{
        this.createDeck = false
      }
      this.selectedSkin(res.name)
    });
    return await modal.present();
  }
  async presentPopoverMana(ev: any) {
    const popover = await this.popoverController.create({
      component: ManaFilterComponent,
      event: ev,
      componentProps:{manaSelected:this.mana},
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
      componentProps:{skinSelected:this.selectSkin},
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
  addCard(card:Card){
    if(this.deck.counter < this.maxLength){
      if(this.deck.cards.filter(element => element.id == card.id).length == 0){
        console.log("uguale a 0");
        card.counter = 1
        this.deck.cards.push(card)
        this.deck.counter++
      }else if(this.deck.cards.filter(element => element.id == card.id ).filter(element => element.counter == 1).length == 1 ){
        console.log("uguale a 1");
        card.counter = 2
        this.deck.cards.filter(element => element.id == card.id).length = 2
        this.deck.counter++
      }else{
        console.log("massimo carte")
      }


     console.log(this.deck)

    }
    
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
    this.selectSkin = skin
    const skinValue = `&class=${skin},neutral&page=1`;
    this.validate.page = '1';
    this.paginate=1;
    this.validateUrl(skinValue)
  }
  filterMana(mana?:string){
    this.mana = mana;
    const manaValue = `&manaCost=${mana}&page=1`;
    this.validate.page = '1';
    this.paginate=1;
    this.validateUrl(manaValue)
  }
  selectedSkin(skin:string){
    this.selectSkin = skin
    const skinValue = `&class=${skin},neutral&page=1`;
    this.validate.page = '1';
    this.paginate=1;
    this.validateUrl(skinValue)

  }
  validateUrl(attribute:string){
    //concateno gli attributi all'url
    this.urlAttribute = this.urlAttribute+attribute
    let splitUrl = this.urlAttribute.split('&')
    splitUrl.forEach(element => {
      let x = element.split('=')
      
      if(x.length == 2){
          if(x[0] == 'class'){
            this.validate.class = x[1]
          }else if(x[0] == 'manaCost'){
            if(x[1] == '*'){
              this.validate.manaCost = ''
            }else{
              this.validate.manaCost = x[1]
            }
            
          }else if(x[0] == 'page'){
            this.validate.page = x[1]
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
      
      //console.log('url: '+this.urlAttribute)
      //console.log(this.validate)
    
    
    this.apiService.getCards(this.urlAttribute).pipe(
      take(1),
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
