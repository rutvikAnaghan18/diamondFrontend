import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductServiceService } from '../product-service.service';

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

  @ViewChild('stoneInput') stoneInput: ElementRef;
  @ViewChild('weightInput') weightInput: ElementRef;
  @ViewChild('stoneFLInput') stoneFLInput: ElementRef;
  @ViewChild('tentionInput') tentionInput: ElementRef;
  @ViewChild('resultInput') resultInput: ElementRef;
  @ViewChild('colorMeasureInput') colorMeasureInput: ElementRef;
  @ViewChild('readingInput') readingInput: ElementRef;
  @ViewChild('commentInput') commentInput: ElementRef;

  @ViewChild('shapeInput') shapeInput!: ElementRef<HTMLInputElement>;
  @ViewChild('planWeightInput') planWeightInput!: ElementRef<HTMLInputElement>;
  @ViewChild('colorInput') colorInput!: ElementRef<HTMLInputElement>;
  @ViewChild('purityInput') purityInput!: ElementRef<HTMLInputElement>;

  @ViewChild('cpsInput') cpsInput!: ElementRef<HTMLInputElement>;
  @ViewChild('rapPriceInput') rapPriceInput!: ElementRef<HTMLInputElement>;
  @ViewChild('discountInput') discountInput!: ElementRef<HTMLInputElement>;
  @ViewChild('priceInput') priceInput!: ElementRef<HTMLInputElement>;
  @ViewChild('totalInput') totalInput!: ElementRef<HTMLInputElement>;

  time: FormControl;
  date: FormControl;
  isshowPlanB: boolean = false;
  colourMeasureReading: Array<{ result: string, colorMeasure: string, reading: string, comment: string }> = [];
  colorReadings: any[] = [];
  planTable: any[] = [];

  planFormTable: Array<Array<{ shape: string; weight: string; color: string; purity: string; cps: string; search: boolean; isColorMannual: boolean; rapPrice: string; discount: string; priceCT: string; totalPrice: string }>> = [];

  tenderName: String;
  stoneId: Number = NaN;
  stoneWeight: any;
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

  basePriceArr: any[] = [];

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

    this.colourMeasureReading.push({
      result: '',
      colorMeasure: '',
      reading: '',
      comment: ''
    });

    this.planFormTable.push([
      {
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
      }
    ]);


    this.planTable.push([]);

    this.planDetailArray.push({
      isSelected: false,
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

  focusNext(event: any, nextInput: HTMLInputElement) {
    event.preventDefault();
    nextInput.focus();
  }

  focusNext2(event: any, nextInput: HTMLInputElement): void {
    event.preventDefault();
    nextInput.focus();
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
    plan.finalTotal = (totalPlanPrice - lessAmount).toFixed(2);
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

      this.planFormTable[index][len - 1].shape = ""
      this.planFormTable[index][len - 1].weight = ""
      this.planFormTable[index][len - 1].color = ""
      this.planFormTable[index][len - 1].purity = ""
      this.planFormTable[index][len - 1].cps = ""
      this.planFormTable[index][len - 1].search = false
      this.planFormTable[index][len - 1].isColorMannual = false
      this.planFormTable[index][len - 1].rapPrice = ""
      this.planFormTable[index][len - 1].discount = ""
      this.planFormTable[index][len - 1].priceCT = ""
      this.planFormTable[index][len - 1].totalPrice = ""
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

  searchPlan(plan: any, event: any, nextInput: HTMLInputElement) {

    var searchObj = {
      shape: plan.shape,
      color: plan.color,
      weight: plan.weight,
      purity: plan.purity
    }
    // var searchObj = {
    //   shape: plan[plan.length - 1][plan[plan.length - 1].length - 1].shape,
    //   color: plan[plan.length - 1][plan[plan.length - 1].length - 1].color,
    //   weight: plan[plan.length - 1][plan[plan.length - 1].length - 1].weight,
    //   purity: plan[plan.length - 1][plan[plan.length - 1].length - 1].purity
    // }

    if (searchObj.shape == '' || searchObj.color == '' || searchObj.weight == '' || searchObj.purity == '') {
      this.toastr.warning("Please Filled All Plan Details!")
    } else {

      if (searchObj.shape == "RD") {
        searchObj.shape = "BR"
      } else if (searchObj.shape == "BR") {
        searchObj.shape = "BR"
      } else {
        searchObj.shape = "PS"
      }

      if (searchObj.shape == "BR") {
        this.diamondService.searchRoundPlan(searchObj).subscribe((res: any) => {
          if (res && res.length) {
            plan.rapPrice = res[0].price
            this.isSearchHide = true
            event.preventDefault();
            nextInput.focus();
          } else {
            this.toastr.error("Record Not Found")
          }
        })
      } else {
        this.diamondService.searchFancyPlan(searchObj).subscribe((res: any) => {
          if (res && res.length) {
            plan.rapPrice = res[0].price
            this.isSearchHide = true
            event.preventDefault();
            nextInput.focus();
          } else {
            this.toastr.error("Record Not Found")
          }
        })
      }


    }
  }

  addDiscount(plan: any) {
    plan.priceCT = (plan.rapPrice - ((plan.rapPrice * plan.discount) / 100))
    plan.totalPrice = Number((plan.priceCT * plan.weight).toFixed(2));
  }

  async submit() {
    var inValid = false;

    var isColorReadingPost = false;
    var isBidsPost = false;
    var isTenderPost = false;

    for (let i = 0; i < this.planTable.length; i++) {
      if (this.planTable[i].length == 0) {
        inValid = true
      }
    }

    if (this.tenderName == '' || this.date.invalid || this.time.invalid || this.stoneId == null || this.stoneWeight == null ||
      this.stoneFL == '' || this.tention == null) {
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

      var bidArr = new Array();

      for (let i = 0; i < this.planDetailArray.length; i++) {
        if (this.planDetailArray[i].isSelected === true) {
          bidArr.push({
            stoneId: this.stoneId,
            TenderName: this.tenderName,
            stoneWeight: this.stoneWeight,
            basePricePerCT: this.basePriceArr[0].basePricePerCT,
            totalBasePrice: this.basePriceArr[0].basePrice,
            bidPricePerCT: Number(this.planDetailArray[i].finalTotal) / this.stoneWeight,
            bidPrice: this.planDetailArray[i].finalTotal
          })
        }
      }

      var colorReadingsArr = new Array();

      for (let i = 0; i < this.colorReadings.length; i++) {
        colorReadingsArr.push({
          stoneId: this.stoneId,
          result: this.colorReadings[i].result,
          colorMeasure: this.colorReadings[i].colorMeasure,
          fluorescenceReading: this.colorReadings[i].reading,
          comment: this.colorReadings[i].comment
        })
      }

      try {
        const colorResponse = await this.diamondService.addColorMeasurements(colorReadingsArr).toPromise();
        if (colorResponse.Response && colorResponse.Response.code === 0) {
          isColorReadingPost = true;
        }

        const bidResponse = await this.diamondService.addBids(bidArr).toPromise();
        if (bidResponse.Response && bidResponse.Response.code === 0) {
          isBidsPost = true;
        }

        const tenderResponse = await this.diamondService.addNewProduct(obj[0]).toPromise();
        if (tenderResponse.Response && tenderResponse.Response.code === 0) {
          isTenderPost = true;
        }

        if (isBidsPost && isColorReadingPost && isTenderPost) {
          this.toastr.success("Tender Successfully Saved");
          this.resetValues();
        } else {
          this.toastr.error("Something Went Wrong!");
        }
      } catch (error) {
        console.error(error);
        this.toastr.error("Something Went Wrong!");
      }
    }
  }

  async update() {
    var inValid = false;
    var isColorReadingPost = false;
    var isBidsPost = false;
    var isTenderPost = false;

    for (let i = 0; i < this.planTable.length; i++) {
      if (this.planTable[i].length == 0) {
        inValid = true
      }
    }

    if (this.tenderName == '' || this.date.invalid || this.time.invalid || this.stoneId == null || this.stoneWeight == null ||
      this.stoneFL == '' || this.tention == null) {
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

      // this.diamondService.updateProduct(obj[0], this.productId).subscribe((res: any) => {
      //   if (res.Response) {
      //     if (res.Response.code == 0) {
      //       this.toastr.success(res.Response.Message)
      //       this.resetValues();
      //     } else {
      //       this.toastr.error("Something Went Wrong!")
      //     }
      //   }
      // })

      var bidArr = new Array();

      for (let i = 0; i < this.planDetailArray.length; i++) {
        if (this.planDetailArray[i].isSelected === true) {
          bidArr.push({
            stoneId: this.stoneId,
            stoneWeight: this.stoneWeight,
            basePricePerCT: this.basePriceArr[0].basePricePerCT,
            totalBasePrice: this.basePriceArr[0].basePrice,
            bidPricePerCT: (Number(this.planDetailArray[i].finalTotal) / this.stoneWeight).toFixed(2),
            bidPrice: this.planDetailArray[i].finalTotal
          })
        }
      }

      var colorReadingsArr = new Array();

      for (let i = 0; i < this.colorReadings.length; i++) {
        colorReadingsArr.push({
          stoneId: this.stoneId,
          result: this.colorReadings[i].result,
          colorMeasure: this.colorReadings[i].colorMeasure,
          fluorescenceReading: this.colorReadings[i].reading,
          comment: this.colorReadings[i].comment
        })
      }

      try {
        if (colorReadingsArr.length > 0) {
          const colorResponse = await this.diamondService.updateColorMachineById(colorReadingsArr, this.stoneId).toPromise();
          if (colorResponse.Response && colorResponse.Response.code === 0) {
            isColorReadingPost = true;
          }
        }

        if (bidArr.length > 0) {
          const bidResponse = await this.diamondService.updateBidsById(bidArr[0], this.stoneId).toPromise();
          if (bidResponse.Response && bidResponse.Response.code === 0) {
            isBidsPost = true;
          }
        } else {
          isBidsPost = false;
        }

        const tenderResponse = await this.diamondService.updateProduct(obj[0], this.productId).toPromise();
        if (tenderResponse.Response && tenderResponse.Response.code === 0) {
          isTenderPost = true;
        }

        if (isBidsPost && isColorReadingPost && isTenderPost) {
          this.toastr.success("Tender Successfully Saved");
          this.resetValues();
        } else {
          this.toastr.error("Something Went Wrong!");
        }
      } catch (error) {
        console.error(error);
        this.toastr.error("Something Went Wrong!");
      }
    }
  }

  resetValues() {
    this.tenderName = '';
    this.stoneId = NaN;
    this.stoneWeight = "";
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

    this.colorReadings = []

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

      this.diamondService.searchColorMachineReadings(res.stoneId).subscribe((res) => {
        this.colorReadings = res
        this.colorReadings.map((item) => {
          item.reading = item.fluorescenceReading
        })
      })

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

      var totalPricePlan = 0

      console.log(this.planTable)
      this.planDetailArray = [];
      for (let i = 0; i < this.planTable.length; i++) {
        totalPricePlan = 0
        for (let j = 0; j < this.planTable[i].length; j++) {
          totalPricePlan = totalPricePlan + this.planTable[i][j].totalPrice
        }
        this.planShow = true;
        this.planDetailArray.push({
          totalPlanPrice: totalPricePlan,
          lessOfPlan: '',
          finalTotal: ''
        })
      }

      this.findTender();
      // if (this.planDetailArray[index]) {
      //   this.planShow = true;
      //   this.planDetailArray[index].totalPlanPrice = totalPricePlan
      // } else {

      // }
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

  validTenderName(tenderName: String) {
    this.diamondService.ListTender().subscribe((res) => {
      if (res) {
        tenderName = tenderName + '.xlsx'
        if (tenderName === res[0].tenderName) {
          return
        } else {
          this.toastr.error("Cannot Find Tender Name!")
        }
      }
    })
  }

  findTender() {
    if (this.stoneId == null) {
      this.toastr.error("Please Provide Stone Id");
    } else {
      var tenderObj = {
        stoneId: this.stoneId
      };

      this.diamondService.searchTender(tenderObj).subscribe(async (res) => {
        this.basePriceArr = await res;
        console.log(this.basePriceArr);
        if (this.basePriceArr.length > 0) {
          this.stoneWeight = this.basePriceArr[0].weight;
        } else {
          this.toastr.error("Tender not found for the given Stone Id");
        }
      });
    }
  }

}
