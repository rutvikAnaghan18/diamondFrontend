import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { saveAs } from 'file-saver';
import * as Papa from 'papaparse';
import { ProductServiceService } from './product-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'diamond';

  isLogin: boolean = false;

  constructor(private router: Router,
    private diamondService: ProductServiceService) {

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

  downloadCSV(): void {
    
    this.diamondService.ListTender().subscribe((data) => {
      console.log(data);
      const csv = this.convertToCSV(data);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      saveAs(blob, 'data.csv');
    })
  
  }

  convertToCSV(data: any[]): string {
    const csv = Papa.unparse(data);
    return csv;
  }
  

}
