import { Injectable } from '@angular/core';
import { LoadingControllerService } from './loading-controller.service';

@Injectable({
  providedIn: 'root'
})
export class LoadingHandlerService {

  constructor(
    private loadingControllerService: LoadingControllerService,
  ) { }

  showLoading(): void {
    const accessInProgress: string = `Accesso in corso...`;
    this.loadingControllerService.createLoading(accessInProgress);
    this.loadingControllerService.presentLoading();
  }

  dismissLoading(): void {
    this.loadingControllerService.dismissLoading();
  }

}
