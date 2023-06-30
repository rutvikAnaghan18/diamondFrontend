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

  OriginalProductList : any[] = []
  filteredProductList : any[] = []

  pagination = [5, 10, 20, 25]
  displayPage: number = 10;
  tablePage: number = 1;
  tableCount: number = 0;

  searchTender: String= "";

  constructor(private route: Router, private diamondService: ProductServiceService, private toastr: ToastrService,
    private location: Location) {
  }

  ngOnInit(): void {
    this.verifyToken();
    this.getListOfProduct();
  }

  verifyToken() {
    const token = sessionStorage.getItem('token');
    if (token == '' || token == null || token == undefined) {
      this.route.navigate(['login'])
    } else {
      return;
    }
  }

  goback() {
    this.location.back();
  }

  viewProduct(product: any) {
    this.route.navigate(['home', product.id])
  }

  getListOfProduct() {
    this.diamondService.getListProduct().subscribe((res: any) => {
      this.productList = res
      this.OriginalProductList = this.productList;
    })
  }

  // deleteProduct(prod: any) {
  //   var id = prod.stoneId

  //   var isColorReadingsDeleted: Boolean = false
  //   var isBidsDeleted: Boolean = false;
  //   var isProductDeleted: Boolean = false;

  //   if (id) {

  //     this.diamondService.deleteBids(id).subscribe((res) => {
  //       console.log(res)
  //       if (res.Response) {
  //         if (res.Response.code == 0) {
  //           isBidsDeleted = true;
  //         }
  //         else {
  //           isBidsDeleted = false;
  //         }
  //       }
  //     })

  //     this.diamondService.deleteColorReadings(id).subscribe((res) => {
  //       console.log(res)
  //       if (res.Response) {
  //         if (res.Response.code == 0) {
  //           isColorReadingsDeleted = true;
  //         } else {
  //           isColorReadingsDeleted = false;
  //         }
  //       }
  //     })

  //     this.diamondService.deleteProduct(id).subscribe((res: any) => {
  //       console.log(res)
  //       if (res.Response) {
  //         if (res.Response.code == 0) {
  //           isProductDeleted = true;
  //         } else {
  //           isProductDeleted = false;
  //         }
  //       }
  //     })

  //     if (isBidsDeleted == true && isColorReadingsDeleted == true && isProductDeleted == true) {
  //       this.toastr.success("Deleted Successfully")
  //       this.getListOfProduct();
  //     } else {
  //       this.getListOfProduct();
  //       this.toastr.error("Something Went Wrong");
  //     }

  //   }
  // }

  async deleteProduct(prod: any) {
    console.log("Product", prod)
    var id = prod.stoneId;
    var isColorReadingsDeleted = false;
    var isBidsDeleted = false;
    var isProductDeleted = false;
    var name = prod.TenderName
  
    if (id) {
      try {
        const bidsResponse = await this.diamondService.deleteBids(id, name).toPromise();
        if (bidsResponse.Response && bidsResponse.Response.code === 0) {
          isBidsDeleted = true;
        }
  
        const colorReadingsResponse = await this.diamondService.deleteColorReadings(id, name).toPromise();
        if (colorReadingsResponse.Response && colorReadingsResponse.Response.code === 0) {
          isColorReadingsDeleted = true;
        }
  
        const productResponse = await this.diamondService.deleteProduct(id).toPromise();
        if (productResponse.Response && productResponse.Response.code === 0) {
          isProductDeleted = true;
        }
  
        if (isBidsDeleted && isColorReadingsDeleted && isProductDeleted) {
          this.toastr.success("Deleted Successfully");
          this.getListOfProduct();
        } else {
          this.getListOfProduct();
          this.toastr.error("Something Went Wrong");
        }
      } catch (error) {
        console.error(error);
        this.getListOfProduct();
        this.toastr.error("Something Went Wrong");
      }
    }
  }
  

  public onPageSizeChange() {
    this.tablePage = 1
  }

  public onTableDataChange(event: any) {
    this.tablePage = event;
  }

  search(){

    console.log(this.productList);
   
    this.filteredProductList = this.OriginalProductList.filter(item => item.TenderName.toLowerCase().includes(this.searchTender.toLowerCase()))
    this.productList = this.filteredProductList;

    console.log(this.productList);
    console.log(this.filteredProductList);
    console.log(this.OriginalProductList);
  }

}
