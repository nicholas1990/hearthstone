import { SkinFilterComponent } from './skin-filter.component';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [
    SkinFilterComponent,
   
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    SkinFilterComponent,
  ],
})
export class SkinFilterModule { }
