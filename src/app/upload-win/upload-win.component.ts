import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import { ProductServiceService } from '../product-service.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload-win',
  templateUrl: './upload-win.component.html',
  styleUrls: ['./upload-win.component.css']
})
export class UploadWinComponent implements OnInit {

  file: File;
  arrayBuffer: any;

  arrayList : any[] = []

  constructor(private toastr: ToastrService,
    private diamondService: ProductServiceService,
    private location: Location,
    private router: Router) { }

  ngOnInit(): void {
    this.verifyToken();
  }

  verifyToken(){
    const token = sessionStorage.getItem('token');
    if (token == '' || token == null || token == undefined) {
      this.router.navigate(['login'])
    }else{
      return ;
    }
  }

  goback(){
    this.location.back();
  }
  
  uploadFile(event: any) {
    this.file = event.target.files[0];
    let fileReader = new FileReader();
    fileReader.readAsArrayBuffer(this.file);
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary" });
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      this.arrayList = XLSX.utils.sheet_to_json(worksheet, { raw: true });

    }
  }

  submit(){
    console.log(this.arrayList);
    if (this.arrayList) {
      this.diamondService.uploadWinFile(this.arrayList).subscribe((res) => {
        if (res.Response.code == 0) {
          this.toastr.success(res.Response.Message)
        }else{
          this.toastr.error(res.Response.Message)
        }
      })
    }else{
      this.toastr.error("Please Upload Win/Loss File!")
    }
  }
}
