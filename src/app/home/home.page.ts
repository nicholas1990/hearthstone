import { Component } from '@angular/core';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor() {
    window.addEventListener('orientationchange', () => {
      console.log(screen.orientation.type); // e.g. portrait
    });
  }

}
