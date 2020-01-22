import { Component, OnInit } from '@angular/core';
import { ModalController, Events } from '@ionic/angular';

@Component({
  selector: 'app-modal-skin',
  templateUrl: './modal-skin.component.html',
  styleUrls: ['./modal-skin.component.scss'],
})
export class ModalSkinComponent implements OnInit {
  skin: Object = [
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
    },
    
  ]


  constructor(public modalController: ModalController,private events: Events) { }

  ngOnInit() {}

  async dismissModal() {

    return await this.modalController.dismiss();
  }

  selectSkin(skin:string){
    this.events.publish('selectSkinEvent',skin);
    return  this.modalController.dismiss();

  }

}
