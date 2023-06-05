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

  Roundfile: File;
  RoundarrayList: any[] = []
  
  Fancyfile: File;
  FancyarrayList: any[] = []

  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('fancyFileInput') fancyFileInput: ElementRef;

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

  uploadRoundFile(event: any) {
    this.Roundfile = event.target.files[0];
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      let arrayBuffer = fileReader.result as ArrayBuffer;
      let workbook = XLSX.read(arrayBuffer, { type: 'array' });
      let firstSheetName = workbook.SheetNames[0];
      let worksheet = workbook.Sheets[firstSheetName];
      this.RoundarrayList = XLSX.utils.sheet_to_json(worksheet, { raw: true, defval: '' });
  
      this.RoundarrayList.forEach((row: any) => {
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
    fileReader.readAsArrayBuffer(this.Roundfile);
  }
  
  uploadFancyFile(event: any) {
    this.Fancyfile = event.target.files[0];
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      let arrayBuffer = fileReader.result as ArrayBuffer;
      let workbook = XLSX.read(arrayBuffer, { type: 'array' });
      let firstSheetName = workbook.SheetNames[0];
      let worksheet = workbook.Sheets[firstSheetName];
      this.FancyarrayList = XLSX.utils.sheet_to_json(worksheet, { raw: true, defval: '' });
  
      this.FancyarrayList.forEach((row: any) => {
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
    fileReader.readAsArrayBuffer(this.Fancyfile);
  }


  uploadFancy() {
    console.log(this.FancyarrayList)
    if (this.FancyarrayList) {
      this.diamondService.uploadFancyFile(this.FancyarrayList).subscribe((res) => {
        if (res.Response.code == 0) {
          this.FancyarrayList = [];
          this.fancyFileInput.nativeElement.value = "";
          this.toastr.success(res.Response.Message)
        } else {
          this.toastr.error(res.Response.Message)
        }
      })
    }
  }
  
  uploadRound() {
    console.log(this.RoundarrayList)
    if (this.RoundarrayList) {
      this.diamondService.uploadRoundFile(this.RoundarrayList).subscribe((res) => {
        if (res.Response.code == 0) {
          this.RoundarrayList = [];
          this.fileInput.nativeElement.value = "";
          this.toastr.success(res.Response.Message)
        } else {
          this.toastr.error(res.Response.Message)
        }
      })
    }
  }

}
