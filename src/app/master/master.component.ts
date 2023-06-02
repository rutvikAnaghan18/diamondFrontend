import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductServiceService } from '../product-service.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-master',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.css']
})
export class MasterComponent implements OnInit {

  productList: any[] = [];

  pagination = [5, 10, 20, 25]
  displayPage: number = 10;
  tablePage: number = 1;
  tableCount: number = 0;

  constructor(private route: Router, private diamondService: ProductServiceService, private toastr: ToastrService,
    private location: Location) {
  }

  ngOnInit(): void {
    this.verifyToken();
    this.getListOfProduct();
  }

  verifyToken(){
    const token = sessionStorage.getItem('token');
    if (token == '' || token == null || token == undefined) {
      this.route.navigate(['login'])
    }else{
      return ;
    }
  }

  goback(){
    this.location.back();
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

  public onPageSizeChange() {
    this.tablePage = 1
  }

  public onTableDataChange(event: any) {
      this.tablePage = event;
  }

}
