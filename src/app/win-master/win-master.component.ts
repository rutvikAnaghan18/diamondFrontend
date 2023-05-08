import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductServiceService } from '../product-service.service';

@Component({
  selector: 'app-win-master',
  templateUrl: './win-master.component.html',
  styleUrls: ['./win-master.component.css']
})
export class WinMasterComponent implements OnInit {

  productList: any[] = [];

  constructor(private route: Router, private diamondService: ProductServiceService, private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.getListOfProduct();
  }

  viewProduct(product: any){
    this.route.navigate(['home', product.id])
  }

  getListOfProduct(){
    this.diamondService.getListProduct().subscribe((res: any) => {
      this.productList = res
    })
  }

  deleteProduct(prod: any){
    var id = prod.id
    if(id){
      this.diamondService.deleteProduct(id).subscribe((res: any) => {
        if(res.Response){
          if(res.Response.code == 0){
            this.toastr.success(res.Response.Message)
          }
        }
        this.getListOfProduct();
      })
    }
  }

}
