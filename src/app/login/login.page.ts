
import { environment } from './../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { tap, map } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  loginForm: FormGroup;
  loginURL: string;

  constructor(private fb:FormBuilder, private http: HttpClient) {
    this.loginForm = fb.group({
      email: ['',[Validators.required,Validators.email]],
      password:['',[Validators.required]],
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

}
