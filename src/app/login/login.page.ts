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
    
  }

}
