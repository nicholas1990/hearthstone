import { SkinFilterModule } from './../components/skin-filter/skin-filter.module';
import { ManaFilterComponent } from './../components/mana-filter/mana-filter.component';
import { ManaFilterModule } from './../components/mana-filter/mana-filter.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, NavParams } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { InputModule } from './../components/input/input.module';

import { HomePage } from './home.page';
import { SkinFilterComponent } from '../components/skin-filter/skin-filter.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InputModule,
    ManaFilterModule,
    SkinFilterModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ])
  
  ],
  declarations: [HomePage],
  entryComponents:[ManaFilterComponent,SkinFilterComponent]
  
})
export class HomePageModule {}
