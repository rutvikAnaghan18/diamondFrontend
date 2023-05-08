import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductServiceService } from '../product-service.service';

@Component({
  selector: 'app-bid-master',
  templateUrl: './bid-master.component.html',
  styleUrls: ['./bid-master.component.css']
})
export class BidMasterComponent implements OnInit {

  bidList: any[] = [];

  constructor(private route: Router, private diamondService: ProductServiceService, private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.getListOfBids();
  }

  viewProduct(product: any){
    this.route.navigate(['home', product.id])
  }

  getListOfBids(){
    this.diamondService.ListBids().subscribe((res: any) => {
      this.bidList = res
      console.log(this.bidList)
    })
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

}
