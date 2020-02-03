import { HomeStoreService } from './../../services/home/home.store';
import { Component, OnInit } from '@angular/core';
import { PopoverController, Events, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-mana-filter',
  templateUrl: './mana-filter.component.html',
  styleUrls: ['./mana-filter.component.scss'],
})
export class ManaFilterComponent implements OnInit {


  selectedMana: number | string;
  mana: Array<number | string> = ['*', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  constructor(public popoverController: PopoverController, private events: Events,public homeStore : HomeStoreService, private navParams: NavParams) { }

  ngOnInit() {
    this.selectedMana = this.navParams.get('manaSelected')
  }

   async dismissPopover() {
    const popover = await this.popoverController.dismiss()
   }

   filterMana(mana: string | number){
     this.selectedMana = mana
    //const manaValue = `&manaCost=${mana}`
    this.homeStore.emitMana(this.selectedMana);

    //this.events.publish('selectManaEvent',this.selectedMana);
    this.popoverController.dismiss();
 }

}
