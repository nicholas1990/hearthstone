import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { ErrorResponse } from 'src/models/home/home';

@Injectable({
  providedIn: 'root'
})
export class ToastControllerService {

  toast: any;

  constructor(private toastController: ToastController) { }

  createToast(error: string, color: string): void {

    this.toast = this.toastController.create({
      message: error,
      color: color,
      duration: 5000,
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
