import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingControllerService {

  loading: Promise<HTMLIonLoadingElement>;

  constructor(public loadingController: LoadingController) { }

  createLoading(text: string): void {
    this.loading = this.loadingController.create({
      message: text,
    });
  }

  async presentLoading(): Promise<void> {
    const loading = await this.loading;
    return loading.present();
  }

  async dismissLoading(): Promise<boolean> {
    const loading = await this.loading;
    return loading.dismiss();
  }

}
