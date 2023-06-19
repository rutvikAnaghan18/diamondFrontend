import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductServiceService } from '../product-service.service';
import { ThemePalette } from '@angular/material/core';

import * as XLSX from 'xlsx';

interface Shape {
  id: string;
  value: string;
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
  colourMeasureReading: any[] = [];
  colorReadings: any[] = [];
  planTable: any[] = [];
  planFormTable: any[] = [];
  tenderName: String;
  stoneId: Number = NaN;
  stoneWeight: Number = NaN;
  stoneFL: String;
  tention: String = '';
  imageFile: any;
  isUpdate: boolean = false;
  productId: Number;

  file: File;
  arrayBuffer: any;
  filelist: any;
  url: String = "";
  image_uploaded: Boolean = false;
  isSearchHide: Boolean = false;

  planDetailArray: any[] = [];

  planShow: Boolean = false;

  shapes: Shape[] = [
    {
      id: '1',
      value: 'RD'
    },
    {
      id: '2',
      value: 'MQ'
    },
    {
      id: '3',
      value: 'OV'
    },
    {
      id: '4',
      value: 'PE'
    },
    {
      id: '5',
      value: 'PR'
    },
    {
      id: '6',
      value: 'HT'
    },
    {
      id: '7',
      value: 'CUS'
    },
    {
      id: '8',
      value: 'RAD'
    },
    {
      id: '9',
      value: 'EM'
    },
    {
      id: '9',
      value: 'BR'
    }
  ]

  colors: Shape[] = [
    {
      id: '1',
      value: 'D'
    },
    {
      id: '2',
      value: 'E'
    },
    {
      id: '3',
      value: 'F'
    },
    {
      id: '4',
      value: 'G'
    },
    {
      id: '5',
      value: 'H'
    },
    {
      id: '5',
      value: 'I'
    },
    {
      id: '6',
      value: 'J'
    },
    {
      id: '7',
      value: 'K'
    },
    {
      id: '8',
      value: 'L'
    },
    {
      id: '9',
      value: 'M'
    },
    {
      id: '10',
      value: 'N'
    },
    {
      id: '11',
      value: 'O'
    },
    {
      id: '12',
      value: '1'
    },
    {
      id: '13',
      value: 'LB'
    },
    {
      id: '14',
      value: 'FN'
    },
  ]

  constructor(private toastr: ToastrService,
    private diamondService: ProductServiceService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router) {
    this.date = new FormControl('', Validators.required)
    this.time = new FormControl('', Validators.required)
  }


  ngOnInit(): void {

    var dateTime = new Date();
    this.date.setValue(dateTime.toISOString().slice(0, 10))
    this.time.setValue(dateTime.toTimeString().slice(0, 5))
    this.colourMeasureReading.push([{
      result: '',
      colorMeasure: '',
      reading: '',
      comment: ''
    }])

    this.planFormTable.push([{
      shape: '',
      weight: '',
      color: '',
      purity: '',
      cps: '',
      search: false,
      isColorMannual: false,
      rapPrice: '',
      discount: '',
      priceCT: '',
      totalPrice: ''
    }])

    this.planTable.push([]);

    this.planDetailArray.push({
      totalPlanPrice: '',
      lessOfPlan: '',
      finalTotal: ''
    })

    this.route.params.subscribe((params: Params) => {
      this.productId = params['id'];
      if (this.productId) {
        this.isUpdate = true;
        this.getProductById(this.productId);
      } else {

        this.verifyToken();
      }
    })

    // this.colorReadings.push([]);


  }


  verifyToken() {
    const token = sessionStorage.getItem('token');
    if (token == '' || token == null || token == undefined) {
      this.router.navigate(['login'])
    } else {
      this.router.navigate(['']);
    }
  }

  lessPlan(plan: any) {
    var totalPlanPrice = plan.totalPlanPrice
    var lessAmount = totalPlanPrice * plan.lessOfPlan / 100;
    plan.finalTotal = totalPlanPrice - lessAmount
  }

  changeColor(plan: any) {
    var color = plan.color;
    if (color == "FN") {
      plan.isColorMannual = true;
      plan.search = true;
      this.isSearchHide = true;
    } else {
      plan.isColorMannual = false;
      plan.search = false;
    }
  }

  addColorMeasure() {
    var pushObject = {
      result: this.colourMeasureReading[0].result,
      colorMeasure: this.colourMeasureReading[0].colorMeasure,
      reading: this.colourMeasureReading[0].reading,
      comment: this.colourMeasureReading[0].comment
    }

    if ((pushObject.result === '' || pushObject.result === undefined) || (pushObject.colorMeasure === '' || pushObject.colorMeasure === undefined) || (pushObject.reading === '' || pushObject.reading === undefined)) {
      this.toastr.error("Fill All Details In Color Machine Table!")
    } else {
      this.colorReadings.push(pushObject)
      this.colourMeasureReading[0].result = '';
      this.colourMeasureReading[0].colorMeasure = '';
      this.colourMeasureReading[0].reading = '';
      this.colourMeasureReading[0].comment = '';
    }
  }

  SubmitPlan(index: any) {
    var len = this.planFormTable[index].length

    var totalPricePlan = 0

    if (this.planFormTable[index][len - 1].shape == "" || this.planFormTable[index][len - 1].weight == "" ||
      this.planFormTable[index][len - 1].color == "" || this.planFormTable[index][len - 1].purity == "" ||
      this.planFormTable[index][len - 1].cps == "" || this.planFormTable[index][len - 1].rapPrice == "" ||
      this.planFormTable[index][len - 1].discount == "" || this.planFormTable[index][len - 1].priceCT == "" ||
      this.planFormTable[index][len - 1].totalPrice == "") {

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

      for (let j = 0; j < this.planTable[index].length; j++) {
        totalPricePlan = totalPricePlan + this.planTable[index][j].totalPrice
      }

      if (this.planDetailArray[index]) {
        this.planShow = true;
        this.planDetailArray[index].totalPlanPrice = totalPricePlan
      } else {
        this.planDetailArray.push({
          totalPlanPrice: totalPricePlan,
          lessOfPlan: '',
          finalTotal: ''
        })
      }

      this.planFormTable[index][length - 1].shape = ""
      this.planFormTable[index][length - 1].weight = ""
      this.planFormTable[index][length - 1].color = ""
      this.planFormTable[index][length - 1].purity = ""
      this.planFormTable[index][length - 1].cps = ""
      this.planFormTable[index][length - 1].search = false
      this.planFormTable[index][length - 1].isColorMannual = false
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

    if (this.planTable[this.planTable.length - 1] == '') {
      this.toastr.warning("Please Add Atleast 1 Plan To Add Another!")
    } else {
      this.planFormTable.push([{
        shape: '',
        weight: '',
        color: '',
        purity: '',
        cps: '',
        search: false,
        isColorMannual: false,
        rapPrice: '',
        discount: '',
        priceCT: '',
        totalPrice: ''
      }])

      this.planTable.push([])
    }

    // if(this.planFormTable[this.planFormTable.length - 1].shape == undefined || 
    // this.planFormTable[this.planFormTable.length - 1].color == undefined || 
    // this.planFormTable[this.planFormTable.length - 1].weight == undefined || 
    // this.planFormTable[this.planFormTable.length - 1].purity == undefined ||
    // this.planFormTable[this.planFormTable.length - 1].cps == undefined ||
    // this.planFormTable[this.planFormTable.length - 1].rapPrice == undefined ||
    // this.planFormTable[this.planFormTable.length - 1].discount == undefined ||
    // this.planFormTable[this.planFormTable.length - 1].priceCT == undefined ||
    // this.planFormTable[this.planFormTable.length - 1].totalPrice == undefined){
    //   this.toastr.warning("Please Add Atleast 1 Plan To Add Another!")
    // }else{
    //   this.planFormTable.push([{
    //     shape: '',
    //     weight: '',
    //     color: '',
    //     purity: '',
    //     cps: '',
    //     rapPrice: '',
    //     discount: '',
    //     priceCT: '',
    //     totalPrice: ''
    //   }])

    //   this.planTable.push([])
    // }
  }

  searchPlan(plan: any) {

    console.log(plan)

    var searchObj = {
      shape: plan[plan.length - 1][plan[plan.length - 1].length - 1].shape,
      color: plan[plan.length - 1][plan[plan.length - 1].length - 1].color,
      weight: plan[plan.length - 1][plan[plan.length - 1].length - 1].weight,
      purity: plan[plan.length - 1][plan[plan.length - 1].length - 1].purity
    }

    if (searchObj.shape == '' || searchObj.color == '' || searchObj.weight == '' || searchObj.purity == '') {
      this.toastr.warning("Please Filled All Plan Details!")
    } else {

      if (searchObj.shape == "RD") {
        searchObj.shape = "BR"
      }else if(searchObj.shape == "BR"){
        searchObj.shape = "BR"
      }else{
        searchObj.shape = "PS"
      }

      if (searchObj.shape == "BR") {
        this.diamondService.searchRoundPlan(searchObj).subscribe((res: any) => {
          if (res && res.length) {
            plan[plan.length - 1][plan[plan.length - 1].length - 1].rapPrice = res[0].price
            this.planFormTable = plan
            this.isSearchHide = true
            plan[plan.length - 1][plan[plan.length - 1].length - 1].search = true;
  
          } else {
            this.toastr.error("Record Not Found")
          }
        })
      }else{
        this.diamondService.searchFancyPlan(searchObj).subscribe((res: any) => {
          if (res && res.length) {
            plan[plan.length - 1][plan[plan.length - 1].length - 1].rapPrice = res[0].price
            this.planFormTable = plan
            this.isSearchHide = true
            plan[plan.length - 1][plan[plan.length - 1].length - 1].search = true;
  
          } else {
            this.toastr.error("Record Not Found")
          }
        })
      }

      
    }

  }

  addDiscount(plan: any) {
    plan.priceCT = (plan.rapPrice - ((plan.rapPrice * plan.discount) / 100))
    plan.totalPrice = plan.priceCT * plan.weight
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
        "isDeleted": false,
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
    this.tention = '';
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
      search: false,
      isColorMannual: false,
      rapPrice: '',
      discount: '',
      priceCT: '',
      totalPrice: ''
    }])
    this.planTable.push([])

    this.planShow = false;
    this.planDetailArray = [];
    this.planDetailArray.push({
      totalPlanPrice: '',
      lessOfPlan: '',
      finalTotal: ''
    })
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
          search: false,
          isColorMannual: false,
          rapPrice: '',
          discount: '',
          priceCT: '',
          totalPrice: ''
        }])
      }
      this.planTable = res.plans
    })
  }

  addfile(event: any) {
    this.file = event.target.files[0];
    let fileReader = new FileReader();
    // fileReader.readAsArrayBuffer(this.file);
    fileReader.readAsDataURL(this.file)
    fileReader.onload = (e) => {
      this.image_uploaded = true;
      // this.arrayBuffer = fileReader.result;
      this.url = e.target?.result as String;
      // var data = new Uint8Array(this.arrayBuffer);
      // var arr = new Array();
      // for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      // var bstr = arr.join("");
      // var workbook = XLSX.read(bstr, { type: "binary" });
      // var first_sheet_name = workbook.SheetNames[0];
      // var worksheet = workbook.Sheets[first_sheet_name];
      // var arraylist = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      // console.log(arraylist)
    }
  }

}
