import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'diamond';

  isLogin: boolean = false;

  constructor(private router: Router) {

  }

  ngOnInit(){

    if(window.location.pathname == '/login'){
      this.isLogin = true
    }else{
      console.log("path", this.isLogin)
      this.isLogin = false
    }

    this.verifyToken();
    // setTimeout(this.verifyToken, 1000)
  }

  home(){
    this.router.navigate(['home'])
  }

  verifyToken(){
    const token = sessionStorage.getItem('token');
    console.log(token);
    if (token == '' || token == null || token == undefined) {
      console.log("isLogin", this.isLogin)
      this.isLogin = true;
    }else{
      console.log("isLogin", this.isLogin)
      this.isLogin = false;
    }
  }

}
