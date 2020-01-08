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

  access_code: string

  tokenUrl="https://eu.battle.net/oauth/token"

  constructor(private activatedRoute: ActivatedRoute,private http: HttpClient,
    public loadingController: LoadingController) {
   
    
    window.addEventListener("orientationchange", function(){
      console.log(screen.orientation.type); // e.g. portrait
  });
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Hellooo',
      
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();

    console.log('Loading dismissed!');
  }
  async presentLoadingWithOptions() {
    const loading = await this.loadingController.create({
      spinner: null,
      duration: 5000,
      message: 'Please wait...',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    return await loading.present();
  }

  

  ngOnInit(){
  
    this.presentLoading()
   
    this.activatedRoute.queryParams.subscribe(parameter => {
      let access_code = parameter['code'];
      console.log(access_code); // Print the parameter to the console. 

      const params = new HttpParams()
      .append('code',parameter['code'])
      .append('grant_type','authorization_code')
      .append('redirect_uri','http://localhost:8100')
      
      const headers = new HttpHeaders()
      .append("Authorization", "Basic " + btoa("f901e9aa49944a8db7de799555203c02:3ndOs1oX3VHBx8NbFPo7IKsGbG7tWm1D"))
      .append("Content-Type", "application/x-www-form-urlencoded")

     
      this.http.post(this.tokenUrl,null,{params,headers}).subscribe(
        data  => {
        console.log("POST Request is successful ", data);
        this.loadingController.dismiss()
        },
        error  => {
        console.log("Error", error);
        
        }
        
        );
  });

  }
  
  
}

    
  

