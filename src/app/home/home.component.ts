import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductServiceService } from '../product-service.service';

import * as XLSX from 'xlsx';

export class details {
  shape: String;
  purity: String;
  color: String;

  constructor(shape: String, purity: String, color: String) {
    this.shape = shape;
    this.purity = purity;
    this.color = color;
  }
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  time: FormControl;
  date: FormControl;
  isshowPlanB: boolean = false;
  planTable: any[] = [];
  planFormTable: any[] = [];
  tenderName: String;
  stoneId: Number = NaN;
  stoneWeight: Number = NaN;
  stoneFL: String;
  tention: Number = NaN;
  imageFile: any;
  isUpdate: boolean = false;
  productId: Number;

  public detailsArray: details[] = [];

  file: File;
  arrayBuffer: any;
  filelist: any;

  constructor(private toastr: ToastrService,
    private diamondService: ProductServiceService,
    private http: HttpClient,
    private route: ActivatedRoute) {
    this.date = new FormControl('', Validators.required)
    this.time = new FormControl('', Validators.required)
  }


  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.productId = params['id'];

      if (this.productId) {
        this.isUpdate = true;
        this.getProductById(this.productId);
      }

    })

    var dateTime = new Date();
    this.date.setValue(dateTime.toISOString().slice(0, 10))
    this.time.setValue(dateTime.toTimeString().slice(0, 5))
    this.planFormTable.push([{
      shape: '',
      weight: '',
      color: '',
      purity: '',
      cps: '',
      rapPrice: '',
      discount: '',
      priceCT: '',
      totalPrice: ''
    }])

    this.planTable.push([])

    // this.getReadcsv();
  }

  SubmitPlan(index: any) {
    var len = this.planFormTable[index].length

    if (this.planFormTable[index][length - 1].shape == "" || this.planFormTable[index][length - 1].weight == "" ||
      this.planFormTable[index][length - 1].color == "" || this.planFormTable[index][length - 1].purity == "" ||
      this.planFormTable[index][length - 1].cps == "" || this.planFormTable[index][length - 1].rapPrice == "" ||
      this.planFormTable[index][length - 1].discount == "" || this.planFormTable[index][length - 1].priceCT == "" ||
      this.planFormTable[index][length - 1].totalPrice == "") {

      this.toastr.error("Please Fill All Plan Details!")
    } else {

      for (let i = 0; i < len; i++) {
        this.planTable[index].push({
          shape: this.planFormTable[index][i].shape,
          weight: this.planFormTable[index][i].weight,
          color: this.planFormTable[index][i].color,
          purity: this.planFormTable[index][i].purity,
          cps: this.planFormTable[index][i].cps,
          rapPrice: this.planFormTable[index][i].rapPrice,
          discount: this.planFormTable[index][i].discount,
          priceCT: this.planFormTable[index][i].priceCT,
          totalPrice: this.planFormTable[index][i].totalPrice
        })
      }

      this.planFormTable[index][length - 1].shape = ""
      this.planFormTable[index][length - 1].weight = ""
      this.planFormTable[index][length - 1].color = ""
      this.planFormTable[index][length - 1].purity = ""
      this.planFormTable[index][length - 1].cps = ""
      this.planFormTable[index][length - 1].rapPrice = ""
      this.planFormTable[index][length - 1].discount = ""
      this.planFormTable[index][length - 1].priceCT = ""
      this.planFormTable[index][length - 1].totalPrice = ""
    }

  }

  editPlan(planindex: any, index: any) {

    this.planFormTable[planindex][0].shape = this.planTable[planindex][index].shape
    this.planFormTable[planindex][0].weight = this.planTable[planindex][index].weight
    this.planFormTable[planindex][0].color = this.planTable[planindex][index].color
    this.planFormTable[planindex][0].purity = this.planTable[planindex][index].purity
    this.planFormTable[planindex][0].cps = this.planTable[planindex][index].cps
    this.planFormTable[planindex][0].rapPrice = this.planTable[planindex][index].rapPrice
    this.planFormTable[planindex][0].discount = this.planTable[planindex][index].discount
    this.planFormTable[planindex][0].priceCT = this.planTable[planindex][index].priceCT
    this.planFormTable[planindex][0].totalPrice = this.planTable[planindex][index].totalPrice

    this.planTable[planindex].splice(index, 1);
  }

  cancelPlan(index: any) {
    this.planFormTable.splice(index, 1)
    this.planTable.splice(index, 1)
  }


  addPlan() {
    this.planFormTable.push([{
      shape: '',
      weight: '',
      color: '',
      purity: '',
      cps: '',
      rapPrice: '',
      discount: '',
      priceCT: '',
      totalPrice: ''
    }])

    this.planTable.push([])
  }

  submit() {
    var inValid = false;
    for (let i = 0; i < this.planTable.length; i++) {
      if (this.planTable[i].length == 0) {
        inValid = true
      }
    }

    if (this.tenderName == '' || this.date.invalid || this.time.invalid || this.stoneId == null || this.stoneWeight == null ||
      this.stoneFL == '' || this.tention == null || this.imageFile == null) {
      this.toastr.error("Please Enter ALL Details Of Product!")
    } else if (inValid == true) {
      this.toastr.error("Please Add Atleast 1 Plan!")
    }
    else {
      var obj = new Array();
      obj.push({
        "TenderName": this.tenderName,
        "Date": this.date.value,
        "time": this.time.value,
        "stoneId": this.stoneId,
        "stoneWeight": this.stoneWeight,
        "stoneFL": this.stoneFL,
        "tention": this.tention,
        "image_url": this.imageFile,
        "isDeleted": "fasle",
        "plans": this.planTable
      })

      this.diamondService.addNewProduct(obj[0]).subscribe((res: any) => {
        if (res.Response) {
          if (res.Response.code == 0) {
            this.toastr.success(res.Response.Message)
            this.resetValues();
          } else {
            this.toastr.error("Something Went Wrong!")
          }
        }
      })
    }
  }

  update() {
    var inValid = false;
    for (let i = 0; i < this.planTable.length; i++) {
      if (this.planTable[i].length == 0) {
        inValid = true
      }
    }

    if (this.tenderName == '' || this.date.invalid || this.time.invalid || this.stoneId == null || this.stoneWeight == null ||
      this.stoneFL == '' || this.tention == null || this.imageFile == null) {
      this.toastr.error("Please Enter ALL Details Of Product!")
    } else if (inValid == true) {
      this.toastr.error("Please Add Atleast 1 Plan!")
    }
    else {
      var obj = new Array();
      obj.push({
        "id": this.productId,
        "TenderName": this.tenderName,
        "Date": this.date.value,
        "time": this.time.value,
        "stoneId": this.stoneId,
        "stoneWeight": this.stoneWeight,
        "stoneFL": this.stoneFL,
        "tention": this.tention,
        "image_url": this.imageFile,
        "isDeleted": "fasle",
        "plans": this.planTable
      })
      console.log(obj)
      this.diamondService.updateProduct(obj[0], this.productId).subscribe((res: any) => {
        if (res.Response) {
          if (res.Response.code == 0) {
            this.toastr.success(res.Response.Message)
            this.resetValues();
          } else {
            this.toastr.error("Something Went Wrong!")
          }
        }
      })
    }
  }

  resetValues() {
    this.tenderName = '';
    this.stoneId = NaN;
    this.stoneWeight = NaN;
    this.stoneFL = '';
    this.tention = NaN;
    this.date.reset();
    this.time.reset();
    var dateTime = new Date();
    this.date.setValue(dateTime.toISOString().slice(0, 10))
    this.time.setValue(dateTime.toTimeString().slice(0, 5))

    this.planTable = []
    this.planFormTable = []
    this.planFormTable.push([{
      shape: '',
      weight: '',
      color: '',
      purity: '',
      cps: '',
      rapPrice: '',
      discount: '',
      priceCT: '',
      totalPrice: ''
    }])
    this.planTable.push([])
  }

  getProductById(id: any) {
    this.diamondService.getProductById(id).subscribe((res: any) => {

      console.log(res)
      this.date.setValue(res.Date.slice(0, 10))
      this.tenderName = res.TenderName
      this.stoneId = res.stoneId
      // this.imageFile = res[0].image_url
      this.stoneFL = res.stoneFL
      this.stoneWeight = res.stoneWeight
      this.tention = res.tention
      this.time.setValue(res.time)

      for (let i = 0; i < res.plans.length - 1; i++) {
        this.planFormTable.push([{
          shape: '',
          weight: '',
          color: '',
          purity: '',
          cps: '',
          rapPrice: '',
          discount: '',
          priceCT: '',
          totalPrice: ''
        }])
      }
      this.planTable = res.plans
    })
  }

  // getReadcsv() {
  //   this.http.get('../../assets/TENDER.csv', { responseType: 'text' }).subscribe(
  //     data => {
  //       let csvToRowArray = data.split("\n");
  //       for (let index = 1; index < csvToRowArray.length - 1; index++) {
  //         let row = csvToRowArray[index].split(",");
  //         this.detailsArray.push(new details(row[0], row[1], row[2].trim()));
  //       }
  //       console.log(this.detailsArray);
  //     }
  //   )
  // }

  addfile(event: any) {
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
      var arraylist = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      console.log(arraylist)
    }
  }

}
