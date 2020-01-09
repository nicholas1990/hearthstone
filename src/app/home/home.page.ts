import { environment } from './../../environments/environment';
import { tap } from 'rxjs/operators';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  access_code: string;

  tokenUrl: string = environment.token_url;

  constructor(private activatedRoute: ActivatedRoute, private http: HttpClient, public loadingController: LoadingController) {
    window.addEventListener('orientationchange', () => {
      console.log(screen.orientation.type); // e.g. portrait
    });
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Hellooo',
    });
    return await loading.present();
    // const { role, data } = await loading.onDidDismiss();
  }

  ngOnInit() {
    this.presentLoading();

    this.activatedRoute.queryParams.subscribe(parameter => {

      const params = new HttpParams();
      params.append('code', parameter['code']);
      params.append('grant_type', 'authorization_code');
      params.append('redirect_uri', 'http://localhost:8100');

      const headers = new HttpHeaders();
      headers.append('Authorization', 'Basic ' + btoa('f901e9aa49944a8db7de799555203c02:3ndOs1oX3VHBx8NbFPo7IKsGbG7tWm1D'));
      headers.append('Content-Type', 'application/x-www-form-urlencoded');

      this.http.post(this.tokenUrl, null, {params, headers}).subscribe(
        data  => {
          console.log('POST Request is successful ', data);
          this.loadingController.dismiss();
        },
        error  => {
          console.dir('Error', error);
        }
      );
    });

  }

}
