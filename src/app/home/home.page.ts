import { Component } from '@angular/core';
import { PopoverController, Events, ModalController } from '@ionic/angular';
import { Token, Authorization, LoggedUser, Cards, Card, urlAttr, Deck } from './../../models/home/home';
import { ApiHomeService } from '../services/home/api-home.service';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { HomeStoreService } from '../services/home/home.store';
import { HomeService } from '../services/home/home.service';
// import { NotificationHandlerService } from '../core/services/notification/notification-handler.service';
// import { LoadingControllerService } from '../core/services';
import { LoadingHandlerService, NotificationHandlerService } from '../core/services/index';
import { myEnterAnimation, myLeaveAnimation } from '../core/animation';
import { ModalSkinComponent } from './../components/modal-skin/modal-skin.component';
import { SkinFilterComponent } from './../components/skin-filter/skin-filter.component';
import { ManaFilterComponent } from './../components/mana-filter/mana-filter.component';

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
  skinCover:string;

  token:Token;

  deck : Deck = {
    id: 0,
    cards: [],
    counter: 0,
  }

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
    private events: Events,
  ) {

    window.addEventListener('orientationchange', () => {
      console.log(screen.orientation.type); // e.g. portrait
    });

  }

  async ionViewDidEnter(): Promise<void> {

    await this.loadingHandler.showLoading();

    // await this.homeService.getAuthorization();
    await this.homeService.getDataFromMultipleSource();

    this.loadingHandler.dismissLoading();

    // const getInfo = async (): Promise<Token> => {
    //   return await this.authService.getStorageToken();
    // };
    // const asd = await getInfo();
    // console.log('token ', asd.access_token);

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
    this.events.subscribe('selectSkinEvent', res => {
      this.createDeck = res ? this.createDeck = true : false;
      this.skinCover= res.path;
      this.selectedSkin(res.name);
    });
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
    this.events.subscribe('selectManaEvent', res => {
      this.filterMana(res)
      this.events.unsubscribe('selectManaEvent')
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
      this.events.unsubscribe('selectSkinEvent')
    });
  
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
    const skinValue = `&class=${skin},neutral&page=1&manaCost=*`;
    this.validate.page = '1';
    this.paginate=1;
    this.mana='*';
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

    console.log('attribue:', attribute);
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
    console.log('asddsasad', this.urlAttribute)
    this.homeService.getCardsFiltered(this.urlAttribute);

      
      //console.log('url: '+this.urlAttribute)
      //console.log(this.validate)
    
    // this.apiService.getCards(this.urlAttribute).pipe(
    //   take(1),
    //   map((res: Cards): Card[] => {
    //     return res.cards;
    //   }),
    //   tap((res: Card[]) => {
    //     console.log(res)
    //     this.homeStore.emitCards(res)
    //     //this.cards = res.cards
    //   })        
    // ).subscribe();
  }
  
  saveDeck(): void {

    // Recupero il valore dell'observable

    // this.homeStore.deck$.pipe(
    //   map((res) => console.log(res))      
    // ).subscribe();

    console.log();
  }

}
