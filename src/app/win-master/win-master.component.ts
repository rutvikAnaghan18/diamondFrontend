import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductServiceService } from '../product-service.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-win-master',
  templateUrl: './win-master.component.html',
  styleUrls: ['./win-master.component.css']
})
export class WinMasterComponent implements OnInit {

  winList: any[] = [];

  constructor(private route: Router, private diamondService: ProductServiceService, private toastr: ToastrService,
    private location: Location) {
  }

  ngOnInit(): void {
    this.verifyToken();
    this.getListOfWins();
  }

  verifyToken(){
    const token = sessionStorage.getItem('token');
    if (token == '' || token == null || token == undefined) {
      this.route.navigate(['login'])
    }else{
      return ;
    }
  }

  viewProduct(product: any){
    this.route.navigate(['home', product.id])
  }

  goback(){
    this.location.back();
  }

  getListOfWins(){
    this.diamondService.ListWins().subscribe((res: any) => {
      this.winList = res
    })
  }

}
