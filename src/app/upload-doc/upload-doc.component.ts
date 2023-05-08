import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import { ProductServiceService } from '../product-service.service';

@Component({
  selector: 'app-upload-doc',
  templateUrl: './upload-doc.component.html',
  styleUrls: ['./upload-doc.component.css']
})
export class UploadDocComponent implements OnInit {

  file: File;
  arrayBuffer: any;

  arrayList : any[] = []

  constructor(private toastr: ToastrService,
    private diamondService: ProductServiceService) { }

  ngOnInit(): void {
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
    if (this.arrayList) {
      this.diamondService.uploadFile(this.arrayList).subscribe((res) => {
        console.log(res.Response)
      })
    }
  }

}