import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingControllerService {

  constructor(public loadingController: LoadingController) { }
}
