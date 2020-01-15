import { IonicModule } from '@ionic/angular';
import { ManaFilterComponent } from './mana-filter.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [
    ManaFilterComponent,
   
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    ManaFilterComponent,
  ],
})
export class ManaFilterModule { }
