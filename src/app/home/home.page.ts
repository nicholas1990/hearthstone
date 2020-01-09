import { environment } from './../../environments/environment';
import { tap } from 'rxjs/operators';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  access_code: string;

  //tokenUrl: string = environment.token_url;

  constructor(private activatedRoute: ActivatedRoute, private http: HttpClient,
     public loadingController: LoadingController,
     private storage: Storage) {
    window.addEventListener('orientationchange', () => {
      console.log(screen.orientation.type); // e.g. portrait
    });

    
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Accesso in corso',
    });
    return await loading.present();
    // const { role, data } = await loading.onDidDismiss();
  }

  ngOnInit() {
    this.presentLoading();

    this.activatedRoute.queryParams.subscribe(parameter => {
        console.log(parameter['code'])
      const params = new HttpParams()
      .append('code', parameter['code'])
      .append('grant_type', 'authorization_code')
      .append('redirect_uri', environment.redirect_uri)
      console.log(params)

      const headers = new HttpHeaders()
      .append('Authorization', 'Basic ' + btoa(environment.client_id+':'+environment.secret_id))
      .append('Content-Type', 'application/x-www-form-urlencoded');

      this.http.post(environment.token_url,null,{params, headers}).subscribe(
        data  => {
          console.log('POST Request is successful ', data);
<<<<<<< HEAD
          debugger;
=======
          console.log(data['access_token']);
>>>>>>> b2fd510b0b18e343fb1f6765b6c143771436ad43
          this.loadingController.dismiss();
        },
        error  => {
          console.dir('Error', error);
        }
      );
    });

  }

}
