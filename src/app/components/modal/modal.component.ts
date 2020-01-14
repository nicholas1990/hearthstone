import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal',
})
export class ModalComponent implements OnInit {

  constructor(public modalController: ModalController) { }

  ngOnInit() {}

}
