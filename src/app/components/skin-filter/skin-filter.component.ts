import { HomeStoreService } from './../../services/home/home.store';
import { Component, OnInit, } from '@angular/core';
import { PopoverController, Events, NavParams } from '@ionic/angular';
import { Skin } from 'src/models/home/home';




@Component({
  selector: 'app-skin-filter',
  templateUrl: './skin-filter.component.html',
  styleUrls: ['./skin-filter.component.scss'],
})
export class SkinFilterComponent implements OnInit {

  selectedSkin : Skin;
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
    },
    {
      name:'neutral',
      path: '../../../assets/img/neutral.png',
    },
  ];

  constructor(public popoverController: PopoverController,private events: Events,
    private navParams: NavParams,
    public homeStore : HomeStoreService){ }

  ngOnInit() {
    this.selectedSkin = this.navParams.get('skinSelected')
    console.log(this.selectedSkin)
  }

  async dismissPopover() {
    const popover = await this.popoverController.dismiss()
   }

   filterSkin(skin:Skin){
     this.selectedSkin=skin;
      //this.selectedSkin = `&class=${skin}`
      //this.events.publish('selectSkinEvent',this.selectedSkin);
      this.homeStore.emitSkin(skin);
      this.popoverController.dismiss();
   }



}
