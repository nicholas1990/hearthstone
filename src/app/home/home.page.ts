import { Component } from '@angular/core';
import { PopoverController, Events, ModalController } from '@ionic/angular';
import { Token, Authorization, LoggedUser, Cards, Card, urlAttr, Deck, Skin } from './../../models/home/home';
import { HomeStoreService } from '../services/home/home.store';
import { HomeService } from '../services/home/home.service';
// import { NotificationHandlerService } from '../core/services/notification/notification-handler.service';
// import { LoadingControllerService } from '../core/services';
import { LoadingHandlerService, NotificationHandlerService } from '../core/services/index';
import { myEnterAnimation, myLeaveAnimation } from '../core/animation';
import { ModalSkinComponent } from './../components/modal-skin/modal-skin.component';
import { SkinFilterComponent } from './../components/skin-filter/skin-filter.component';
import { ManaFilterComponent } from './../components/mana-filter/mana-filter.component';
import { tap, take } from 'rxjs/operators';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  // cards$: Observable<Cards>;
  cards : Array<Card>;
  paginate: number = 1;
  mana: string | number = '*';
  maxLength: number = 30;
  selectSkin: string = 'druid';
  urlAttribute: string = `&class=druid`;
  createDeck: boolean = false;
  skinCover:string;

  token:Token;

  deck : Deck = {
    id: 0,
    cards: [],
    counter: 0,
  }

  current: Card[]= [];

  private validate : urlAttr = {
    class: 'druid',
    manaCost: '',
    page: ''
  }

  constructor(
    public modalController: ModalController,
    private homeService: HomeService,
    public homeStore: HomeStoreService,
    // public authService: AuthenticationService,
    private loadingHandler: LoadingHandlerService,
    public popoverController: PopoverController,
    private statusBar : StatusBar,
  ) {
    statusBar.hide()
    screen.orientation.lock('landscape');
    window.addEventListener('orientationchange', () => {
      console.log(screen.orientation.type); // e.g. portrait
    });

  }

  async ionViewDidEnter(): Promise<void> {

    await this.loadingHandler.showLoading();

    // await this.homeService.getAuthorization();
    await this.homeService.getDataFromMultipleSource();

    this.loadingHandler.dismissLoading();

  }

  // async onClick(): Promise<Token> {
  //   // let control =  this.authService.isAuthenticated()
  //   // console.log(control)
  //   // const info = await this.authService.getStorageToken();
  //   // return of();
  // }

  async presentModalSkin() {
    const modal = await this.modalController.create({
      component: ModalSkinComponent
    });
    // this.events.subscribe('selectSkinEvent', res:Skin => {
    //   if(res.name){
    //   this.createDeck = res ? this.createDeck = true : false;
    //   }
    //   this.skinCover= res.path;
    //   this.selectedSkin(res.name);
    // });
    this.homeStore.skin$.pipe(
      take(1)
    ).subscribe(
      res => {
        if(res.name){
          this.createDeck = res ? this.createDeck = true : false;
        }
        this.skinCover= res.path;
        this.selectedSkin(res.name);
      }
    )
    return await modal.present();
  }
  async presentPopoverMana(ev: any) {
    const popover = await this.popoverController.create({
      component: ManaFilterComponent,
      event: ev,
      componentProps: { manaSelected: this.mana },
      cssClass:'mana-popover',
      enterAnimation:myEnterAnimation,
      leaveAnimation:myLeaveAnimation,
      translucent: true
    });
    this.homeStore.mana$.pipe(
      take(1)
    ).subscribe(
       res => this.filterMana(res)
    );
    
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
    // this.events.subscribe('selectSkinEvent', (res:Skin) => {
    //   this.filterSkin(res.name)
    //   this.events.unsubscribe('selectSkinEvent')
    // });
    this.homeStore.skin$.pipe(
      take(1)
    ).subscribe(
      res => {
       this.filterSkin(res.name);
      }
    )
  
    return await popover.present();
  }
  addCard(card:Card){
    if(this.deck.counter < this.maxLength){
      if(this.deck.cards.filter(element => element.id == card.id).length == 0){
        card.counter = 1
        this.deck.cards.push(card)
        this.deck.counter++
      }else if(this.deck.cards.filter(element => element.id == card.id ).filter(element => element.counter == 1).length == 1 ){
        card.counter = 2
        this.deck.cards.filter(element => element.id == card.id).length = 2
        this.deck.counter++
      }else{
        console.log("massimo carte")
      }
      console.log(this.deck)
      this.homeStore.emitDeck(this.deck);
    }
    
  }
  removeCard(card:Card){
    console.log(this.deck.cards.filter(element => element.id == card.id ).filter(element => element.counter == 2).length)
    if(this.deck.cards.filter(element => element.id == card.id ).filter(element => element.counter == 2).length == 1){
      card.counter = 1
      this.deck.counter--
    }else if(this.deck.cards.filter(element => element.id == card.id).length == 1){  
      card.counter = 0;
      this.deck.counter--
      this.deck.cards = this.deck.cards.filter(element => element.id != card.id);
    }else{
      console.log("errore")
    }
  }
  async backPage(){
    this.paginate--
    const page = `&page=${this.paginate}`
    this.validate.page = page
    await this.validateUrl(page);
  }
  async nextPage(){
    this.paginate++;
    const page = `&page=${this.paginate}`
    this.validate.page = page
    await this.validateUrl(page);
  }
  async filterSkin(skin?:string){
    this.selectSkin = skin
    const skinValue = `&class=${skin},neutral&page=1&manaCost=*`;
    this.validate.page = '1';
    this.paginate=1;
    this.mana='*';
    await this.validateUrl(skinValue)
  }
  async filterMana(mana?: number | string){
    this.mana = mana;
    const manaValue = `&manaCost=${mana}&page=1`;
    this.validate.page = '1';
    this.paginate=1;
    await this.validateUrl(manaValue)
  }
  async selectedSkin(skin:string){
    this.selectSkin = skin
    const skinValue = `&class=${skin},neutral&page=1&manaCost=*`;
    this.validate.page = '1';
    this.paginate=1;
    this.mana='*';
    await this.validateUrl(skinValue)
  }
  deleteDeck(){
    this.createDeck = false;
    console.log(this.createDeck)
  }
  async validateUrl(attribute:string): Promise<void> {

    console.log('attribue:', attribute);
    //concateno gli attributi all'url
    this.urlAttribute = this.urlAttribute+attribute;
    let splitUrl = this.urlAttribute.split('&');
    
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
    });
    
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

    const card = await this.homeService.getCardsFiltered(this.urlAttribute);
    card.pipe(take(1)).subscribe(
      (res) => this.homeStore.emitCards(res)
    );

  }
  
  saveDeck(): void {

    // Recupero il valore dell'observable

    // this.homeStore.deck$.pipe(
    //   map((res) => console.log(res))      
    // ).subscribe();

    console.log();
  }

}
