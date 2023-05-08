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

  winList: any[] = [];

  constructor(private route: Router, private diamondService: ProductServiceService, private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.getListOfWins();
  }

  viewProduct(product: any){
    this.route.navigate(['home', product.id])
  }

  getListOfWins(){
    this.diamondService.ListWins().subscribe((res: any) => {
      this.winList = res
    })
  }

}
