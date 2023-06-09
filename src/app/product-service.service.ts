import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ProductServiceService {

  BASE_URL: String = "http://5.183.9.118:5000"
  // BASE_URL: String = "http://localhost:3000"

  constructor(private http: HttpClient) { 
  }

  addNewProduct(data: any):Observable<any>{
    return this.http.post<any>(this.BASE_URL + '/api/goods/AddNewproduct', data)
  }

  addBids(data: any):Observable<any>{
    return this.http.post<any>(this.BASE_URL + `/api/goods/AddBids`, data);
  }

  addColorMeasurements(data: any):Observable<any>{
    return this.http.post<any>(this.BASE_URL + `/api/goods/AddcolorMachineReading`, data);
  }

  // Product
  getListProduct(){
    return this.http.get(this.BASE_URL+'/api/goods/Listproducts')
  }

  addProduct(data: any):Observable<any>{
    return this.http.post<any>(this.BASE_URL + "/api/goods/Addproducts", data)
  }

  getProductById(id: any):Observable<any>{
    return this.http.get<any>(this.BASE_URL+ `/api/goods/SearchProductById/${id}`)
  }

  deleteProduct(id: any):Observable<any>{
    return this.http.get<any>(this.BASE_URL + `/api/goods/deleteproduct/${id}`)
  }
  
  updateProduct(data: any, id: any):Observable<any>{
    return this.http.post<any>(this.BASE_URL + `/api/goods/updateProductById/${id}`, data)
  }

  deleteListProduct(){
    return this.http.get(this.BASE_URL + `/api/goods/DeletedListproducts`)
  }

  // Plans
  addPlan(data: any):Observable<any>{
    return this.http.post<any>(this.BASE_URL + '/api/goods/AddPlans', data)
  }

  deletePlan(id: any):Observable<any>{
    return this.http.post<any>(this.BASE_URL + '/api/goods/deleteplan/', id)
  }

  listPlan(){
    return this.http.get(this.BASE_URL + '/api/goods/ListPlans')
  }

  deletedListPlans(){
    return this.http.get(this.BASE_URL + '/api/goods/DeletedListPlans')
  }

  getPlanById(id: any){
    return this.http.get<any>(this.BASE_URL + `/api/goods/SearchPlansById/${id}`)
  }

  updatePlanbyId(data: any, id: any):Observable<any>{
    return this.http.post<any>(this.BASE_URL + `/api/goods/updatePlansById/${id}`, data)
  }

  // Upload File

  uploadFancyFile(data: any):Observable<any>{
    return this.http.post<any>(this.BASE_URL + '/api/goods/AddFancyRAP', data);
  }

  uploadRoundFile(data: any):Observable<any>{
    return this.http.post<any>(this.BASE_URL + '/api/goods/AddRoundRAP', data);
  }

  uploadBidFile(data: any):Observable<any>{
    return this.http.post<any>(this.BASE_URL + `/api/goods/AddBids`, data);
  }

  uploadWinFile(data : any):Observable<any>{
    return this.http.post<any>(this.BASE_URL + `/api/goods/AddWonLoss`, data);
  }

  uploadBaseFile(data: any):Observable<any>{
    return this.http.post<any>(this.BASE_URL+ '/api/goods/basePrice', data);
  }


  // Search
  searchRoundPlan(data: any):Observable<any>{
    return this.http.post<any>(this.BASE_URL+ '/api/goods/SearchRoundRAP', data);
  }
  
  searchFancyPlan(data: any):Observable<any>{
    return this.http.post<any>(this.BASE_URL+ '/api/goods/SearchFancyRAP', data);
  }

  searchBid(id: any):Observable<any>{
    return this.http.get<any>(this.BASE_URL + `/api/goods/SearchBids/${id}`)
  }
  
  searchWin(id: any):Observable<any>{
    return this.http.get<any>(this.BASE_URL + `/api/goods/SearchWin/${id}`)
  }

  searchTender(data: any):Observable<any>{
    return this.http.post<any>(this.BASE_URL + `/api/goods/searchTender`, data)
  }

  searchColorMachineReadings(id: any):Observable<any>{
    return this.http.get<any>(this.BASE_URL + `/api/goods/SearchColormachinereadingById/${id}`)
  }


  // List
  ListBids():Observable<any>{
    return this.http.get(this.BASE_URL + `/api/goods/ListBids`);
  }
  
  ListWins():Observable<any>{
    return this.http.get(this.BASE_URL + `/api/goods/ListWins`);
  }

  Login(data: any):Observable<any>{
    return this.http.post<any>(this.BASE_URL+ `/api/admin/login`, data)
  }

  ListTender():Observable<any>{
    return this.http.get<any>(this.BASE_URL+ "/api/goods/ListBasePrice")
  }

  // DELETE

  deleteColorReadings(id: any, name: any):Observable<any>{
    return this.http.get(this.BASE_URL + `/api/goods/deleteColorReadings/${id}/${name}`)
  }

  deleteBids(id: any, name: any):Observable<any>{
    return this.http.get(this.BASE_URL+ `/api/goods/deleteBids/${id}/${name}`)
  }


  // Update

  updateBidsById(data: any, id: any):Observable<any>{
    return this.http.post(this.BASE_URL+ `/api/goods/updateBids/${id}`, data)
  }
  
  updateColorMachineById(data: any, id: any):Observable<any>{
    return this.http.post(this.BASE_URL+ `/api/goods/updateColorMachineById/${id}`, data)
  }

}
