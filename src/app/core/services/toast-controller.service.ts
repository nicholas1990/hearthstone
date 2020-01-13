import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastControllerService {

  toast: any;

  constructor(private toastController: ToastController) { }

  createToast(error: object): void {
    const getMessageError = (err: object): string => {
      return `${err.status} - ${err.error.error}: ${err.error.error_description}`;
    };
    this.toast = this.toastController.create({
      message: getMessageError(error),
      duration: 3000,
    });
  }

  async presentToast(): Promise<void> {
    const toast = await this.toast;
    return toast.present();
  }

  async dismissToast(): Promise<boolean> {
    const toast = await this.toast;
    return toast.dismiss();
  }
}
