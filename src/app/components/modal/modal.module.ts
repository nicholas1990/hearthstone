import { ModalComponent } from './modal.component';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [
    ModalComponent,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ModalComponent,
  ],
})
export class ModalModule { }
