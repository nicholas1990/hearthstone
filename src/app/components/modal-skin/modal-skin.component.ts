import { Skin } from './../../../models/home/home';
import { HomeStoreService } from './../../services/home/home.store';
import { Component, OnInit } from '@angular/core';
import { ModalController, Events } from '@ionic/angular';

@Component({
  selector: 'app-modal-skin',
  templateUrl: './modal-skin.component.html',
  styleUrls: ['./modal-skin.component.scss'],
})
export class ModalSkinComponent implements OnInit {
  skins: Skin[] = [
    {
      name:'druid',
      path: '../../../assets/img/druid.png',
    },
    {
      name:'hunter',
      path: '../../../assets/img/hunter.png',
    },
    {
      name:'mage',
      path: '../../../assets/img/mage.png',
    },
    {
      name:'paladin',
      path:  '../../../assets/img/paladin.png',
    },
    {
      name:'rogue',
      path: '../../../assets/img/rogue.png',
    },
    {
      name:'shaman',
      path: '../../../assets/img/shaman.png',
    },
    {
      name:'warlock',
      path: '../../../assets/img/warlock.png',
    },
    {
      name:'warrior',
      path: '../../../assets/img/warrior.png',
    },
    {
      name:'priest',
      path: '../../../assets/img/priest.png',
    }
  ];


  constructor(public modalController: ModalController,private events: Events,
    public homeStore : HomeStoreService) { }

  ngOnInit() {}

  async dismissModal() {

    return await this.modalController.dismiss();
  }

  selectSkin(skin:Skin){
    //this.events.publish('selectSkinEvent',skin);
    this.homeStore.emitSkin(skin)
    return  this.modalController.dismiss();

  }

}
