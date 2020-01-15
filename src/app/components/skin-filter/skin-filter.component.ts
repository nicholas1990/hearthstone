import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-skin-filter',
  templateUrl: './skin-filter.component.html',
  styleUrls: ['./skin-filter.component.scss'],
})
export class SkinFilterComponent implements OnInit {

  skin: Array<string> = [
    '../../../assets/img/druid.png',
    '../../../assets/img/hunter.png',
    '../../../assets/img/mage.png',
    '../../../assets/img/paladin.png',
    '../../../assets/img/rouge.png',
    '../../../assets/img/shaman.png',
    '../../../assets/img/warlock.png',
    '../../../assets/img/warrior.png',

];

  constructor(public popoverController: PopoverController){ }

  ngOnInit() {}

  async dismissPopover() {
    const popover = await this.popoverController.dismiss()
   }

}
