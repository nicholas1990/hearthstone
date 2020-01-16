import { Component, OnInit } from '@angular/core';
import { PopoverController, Events } from '@ionic/angular';

@Component({
  selector: 'app-mana-filter',
  templateUrl: './mana-filter.component.html',
  styleUrls: ['./mana-filter.component.scss'],
})
export class ManaFilterComponent implements OnInit {


  selectedMana: string;
  mana: Array<number> = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  constructor(public popoverController: PopoverController,private events: Events) { }

  ngOnInit() {}

   async dismissPopover() {
    const popover = await this.popoverController.dismiss()
   }

   filterMana(mana:string){
    this.selectedMana = `&manaCost=${mana}`
    this.events.publish('selectManaEvent',this.selectedMana);
    this.popoverController.dismiss();
 }

}
