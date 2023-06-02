import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductServiceService } from '../product-service.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-bid-master',
  templateUrl: './bid-master.component.html',
  styleUrls: ['./bid-master.component.css']
})
export class BidMasterComponent implements OnInit {

  bidList: any[] = [];

  pagination = [5, 10, 20, 25]
  displayPage: number = 10;
  tablePage: number = 1;
  tableCount: number = 0;

  constructor(private route: Router, private diamondService: ProductServiceService, private toastr: ToastrService,
    private location: Location) {
  }

  ngOnInit(): void {
    this.verifyToken();
    this.getListOfBids();
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

  getListOfBids(){
    this.diamondService.ListBids().subscribe((res: any) => {
      this.bidList = res
    })
  }

  goback(){
    this.location.back();
  }

  // deleteBid(prod: any){
  //   var id = prod.id
  //   if(id){
  //     this.diamondService.deleteBid(id).subscribe((res: any) => {
  //       if(res.Response){
  //         if(res.Response.code == 0){
  //           this.toastr.success(res.Response.Message)
  //         }
  //       }
  //       this.getListOfBids();
  //     })
  //   }
  // }

  public onPageSizeChange() {
    this.tablePage = 1
  }

  public onTableDataChange(event: any) {
      this.tablePage = event;
  }

}
