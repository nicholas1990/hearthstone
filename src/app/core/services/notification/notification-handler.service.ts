import { Injectable, ErrorHandler, } from '@angular/core';
import { ToastControllerService } from './toast-controller.service';
import { ErrorResponse } from 'src/models/home/home';

@Injectable({
  providedIn: 'root'
})
export class NotificationHandlerService {

  constructor(
    private toastControllerService: ToastControllerService,
  ) { }

  showError(error: ErrorResponse) {

    const getMessageError = (err: ErrorResponse): string => {
      return `${err.status} - ${err.error.error}: ${err.error.error_description}`;
    };
    const color = `danger`;

    this.toastControllerService.createToast(getMessageError(error), color);
    this.toastControllerService.presentToast();

  }

  showWarning() {}

}
