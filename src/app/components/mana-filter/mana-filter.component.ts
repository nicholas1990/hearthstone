import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-mana-filter',
  templateUrl: './mana-filter.component.html',
  styleUrls: ['./mana-filter.component.scss'],
})
export class ManaFilterComponent implements OnInit {

  mana: Array<number> = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  constructor(public popoverController: PopoverController) { }

  ngOnInit() {}

   async dismissPopover() {
    const popover = await this.popoverController.dismiss()
   }

}
