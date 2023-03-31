import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductServiceService } from '../product-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  time: FormControl;
  date: FormControl;

  isshowPlanB: boolean = false;
  planForm: FormGroup;
  planTable: any[] = [];
  planFormTable: any[] = [];

  tenderName: String;
  stoneId: Number = NaN;
  stoneWeight: Number;
  stoneFL: String;
  tention: Number;
  imageFile: any;

  isUpdate: boolean = false;

  productId: Number;

  constructor(private toastr: ToastrService,
    private diamondService: ProductServiceService,
    private route: ActivatedRoute) {
    this.date = new FormControl('', Validators.required)
    this.time = new FormControl('', Validators.required)
  }


  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.productId = params['id'];

      if(this.productId){
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

  canclePlan() {
    this.planForm.reset()
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

  deleteProduct(id: any) {
    this.diamondService.deleteProduct(id).subscribe((res: any) => {
      console.log(res)
    })
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

      this.diamondService.addNewProduct(obj[0]).subscribe((res : any) => {
        if(res.Response){
          if(res.Response.code == 0){
            this.toastr.success(res.Response.Message)
            this.resetValues();
          }else{
            this.toastr.error("Something Went Wrong!")
          }
        }
      })
    }
  }

  update(){
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
      this.diamondService.updateProduct(obj[0], this.productId).subscribe((res : any) => {
        if(res.Response){
          if(res.Response.code == 0){
            this.toastr.success(res.Response.Message)
            this.resetValues();
          }else{
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
      this.date.setValue(res.Date.slice(0,10))
      this.tenderName = res.TenderName
      this.stoneId = res.stoneId
      // this.imageFile = res[0].image_url
      this.stoneFL = res.stoneFL
      this.stoneWeight = res.stoneWeight
      this.tention = res.tention
      this.time.setValue(res.time)

      for (let i = 0; i < res.plans.length-1; i++) {
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


  deletedPlanList() {
    this.diamondService.deletedListPlans().subscribe((res: any) => {
      console.log(res)
    })
  }

  deletePlanById(id: any) {
    this.diamondService.deletePlan(id).subscribe((res: any) => {
      console.log(res)
    })
  }

}
