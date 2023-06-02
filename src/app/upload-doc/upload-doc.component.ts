import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import { ProductServiceService } from '../product-service.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload-doc',
  templateUrl: './upload-doc.component.html',
  styleUrls: ['./upload-doc.component.css']
})
export class UploadDocComponent implements OnInit {

  file: File;
  arrayBuffer: any;
  arrayList: any[] = []

  @ViewChild('fileInput') fileInput: ElementRef;

  constructor(private toastr: ToastrService,
    private diamondService: ProductServiceService,
    private location: Location,
    private router: Router) { }

  ngOnInit(): void {
    this.verifyToken();
  }

  verifyToken() {
    const token = sessionStorage.getItem('token');
    if (token == '' || token == null || token == undefined) {
      this.router.navigate(['login'])
    } else {
      return;
    }
  }

  goback() {
    this.location.back();
  }

  uploadFile(event: any) {
    this.file = event.target.files[0];
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      let arrayBuffer = fileReader.result as ArrayBuffer;
      let workbook = XLSX.read(arrayBuffer, { type: 'array' });
      let firstSheetName = workbook.SheetNames[0];
      let worksheet = workbook.Sheets[firstSheetName];
      this.arrayList = XLSX.utils.sheet_to_json(worksheet, { raw: true, defval: '' });
  
      this.arrayList.forEach((row: any) => {
        if (row.date && !isNaN(row.date)) {
          let excelDate = parseFloat(row.date);
  
          let dateObject = XLSX.SSF.parse_date_code(excelDate);
          let formattedDate = new Date(
            dateObject.y,
            dateObject.m - 1,
            dateObject.d
          ).toISOString().split('T')[0];
  
          row.date = formattedDate;
        }
      });
    };
    fileReader.readAsArrayBuffer(this.file);
  }


  submit() {
    console.log(this.arrayList)
    if (this.arrayList) {
      this.diamondService.uploadFile(this.arrayList).subscribe((res) => {
        if (res.Response.code == 0) {
          this.arrayList = [];
          this.arrayBuffer = '';
          this.fileInput.nativeElement.value = "";
          this.toastr.success(res.Response.Message)
        } else {
          this.toastr.error(res.Response.Message)
        }
      })
    }
  }

}
