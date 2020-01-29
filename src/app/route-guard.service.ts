import { async } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from './services/authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class RouteGuardService implements CanActivate  {

  constructor(private authService: AuthenticationService, private router: Router ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let control = '';
    console.log(control);
    if (control) {
      console.log("la funzione è true")
      return true;
    } else {
      return true;
      //this.router.navigate(['login']);
    }
  
   }
  
}
