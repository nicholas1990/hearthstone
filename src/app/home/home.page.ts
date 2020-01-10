import { ApiHomeService } from './../services/home/api-home.service';
import { Token, Authorization } from './../../models/home/home';

import { environment} from './../../environments/environment';
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

  access_code;
  mana: Array<number> = [0,1, 2, 3, 4,5,6,7,8,9,10]; 
  

  

  //tokenUrl: string = environment.token_url;

  constructor(private activatedRoute: ActivatedRoute, private http: HttpClient,
     public loadingController: LoadingController,
     private storage: Storage, private homeService: ApiHomeService) {
    window.addEventListener('orientationchange', () => {
      console.log(screen.orientation.type); // e.g. portrait
    });

    homeService.getCards().subscribe(
      tap(console.log)
    )

    
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Accesso in corso',
    });
    return await loading.present();
    // const { role, data } = await loading.onDidDismiss();
  }

  ngOnInit() {
    
    
    //this.presentLoading();

    this.activatedRoute.queryParams.subscribe((parameter: Authorization) => {
      const params = new HttpParams()
      .append('code', parameter.code)
      .append('grant_type', 'authorization_code')
      .append('redirect_uri', environment.redirect_uri)

      const headers = new HttpHeaders()
      .append('Authorization', 'Basic ' + btoa(environment.client_id+':'+environment.secret_id))
      .append('Content-Type', 'application/x-www-form-urlencoded');

      this.http.post<Object>(environment.token_url,null,{params, headers}).subscribe(
        (data:Token) => {
          console.log('POST Request is successful ', data);
          this.storage.set('token',data.access_token );
          this.loadingController.dismiss();
        },
        error  => {
          console.dir('Error', error);
        }
      );
    });

  }

}
