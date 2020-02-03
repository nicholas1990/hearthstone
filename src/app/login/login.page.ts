import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { environment } from './../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  loginForm: FormGroup;
  loginURL: string;
  code: string = "codice";

  constructor(
    private fb: FormBuilder,
    // public modalController: ModalController,
    private authService: AuthenticationService,
    private iab: InAppBrowser,
    private router: Router,
    private route: ActivatedRoute,
    private statusBar : StatusBar,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    /**
     * Componi url per il redirect.
     */
    const getLoginUrl = (): string => {
      const url = environment.authorize_url;
      const responsetype = `code`;
      const redirectURL = environment.redirect_uri;
      return `${url}?response_type=${responsetype}&client_id=${environment.client_id}&redirect_uri=${redirectURL}`;
    };
    this.loginURL = getLoginUrl();
    screen.orientation.lock('portrait');

    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
        console.log(statusBar);
    }
    statusBar.hide();

  }

  ionViewDidEnter(): void {
  }

  openBrowser() {
    this.code = "ONCLICK";
    const browser = this.iab.create(this.loginURL, '_blank');  // open in-app browser

    browser.on('loadstart').subscribe(async event => {
      console.log("evento browser : ");
      console.log(JSON.stringify(event));
      const url = event.url;
      const urlTrim = url.split('code=');
      this.code = urlTrim[1];
      console.log("code: ");
      console.log(this.code);
      if (this.code) {
        browser.close();
        const token = await this.authService.getAuthorization(this.code);

        // let token;
        // this.authService.getAuthorization().then(res => {
        //   token = res;
        // });
        if (token) {
          this.router.navigate(['/home']);
        }

        // this.router.navigate(['/login'], navigationExtras);
      }
    });
  }

}
