import { ModalSkinComponent } from './modal-skin.component';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [
    ModalSkinComponent,
   
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    ModalSkinComponent
  ],
})
export class ModalSkinModule { }
