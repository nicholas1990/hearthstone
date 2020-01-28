import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';

import { environment } from './../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { tap, map } from 'rxjs/operators';
import { ModalController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  loginForm: FormGroup;
  loginURL: string;
  code: string = "codice";

  constructor(private fb: FormBuilder, private http: HttpClient,
     public modalController: ModalController,
     private iab: InAppBrowser, private router : Router, private route: ActivatedRoute) {
    this.loginForm = fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  
  ionViewDidEnter(): void {
    const getLoginUrl = (): string => {
      const url = environment.authorize_url;
      const responsetype = `code`;
      const redirectURL = environment.redirect_uri;
      return `${url}?response_type=${responsetype}&client_id=${environment.client_id}&redirect_uri=${redirectURL}`;
    };
    this.loginURL = getLoginUrl();
    
  }
  openBrowser(){
    this.code = "ONCLICK"
    const browser = this.iab.create(this.loginURL,'_blank');
    browser.on('loadstart').subscribe(event => {
      let url = event.url;
      let urlTrim = url.split('code=')
      this.code = urlTrim[1];
      let navigationExtras: NavigationExtras = {
        queryParams: {
          special: JSON.stringify(this.code)
        }
      };
      if (this.code) {
        browser.close();
        this.router.navigate(['/home'],navigationExtras);
      }
    });
    //browser.close();
    
  }

}
