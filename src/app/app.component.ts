import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'diamond';

  isLogin: boolean = false;

  constructor() {

  }

  ngOnInit(){

    if(window.location.pathname == '/login'){
      this.isLogin = true
    }else{
      this.isLogin = false
    }
  }

}
