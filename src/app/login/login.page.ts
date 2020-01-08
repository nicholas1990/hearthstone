import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { tap, map } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup

  constructor(private fb:FormBuilder,private http: HttpClient) {
    this.loginForm = fb.group({
      email: ['',[Validators.required,Validators.email]],
      password:['',[Validators.required]],
      
    })
   }

  ngOnInit() {
  }
  getAuthorization(){
    let url="https://eu.battle.net/oauth/authorize"
    console.log(url)

    let params = new HttpParams();
    params = params.append('response_type', 'code');
    params = params.append('client_id', 'f901e9aa49944a8db7de799555203c02');
    params = params.append('redirect_uri', 'https://develop.battle.net/');

    this.http.get(url,{params:params}).subscribe(
      tap(console.log)
    )

  }

}
