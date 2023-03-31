import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ProductServiceService {

  BASE_URL: String = "http://localhost:3000"

  constructor(private http: HttpClient) { 
  }

  addNewProduct(data: any):Observable<any>{
    return this.http.post<any>(this.BASE_URL + '/api/goods/AddNewproduct', data)
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
    return this.http.get('http://localhost:3000/api/goods/DeletedListproducts')
  }

  // Plans
  addPlan(data: any):Observable<any>{
    return this.http.post<any>('http://localhost:3000/api/goods/AddPlans', data)
  }

  deletePlan(id: any):Observable<any>{
    return this.http.post<any>('http://localhost:3000/api/goods/deleteplan/', id)
  }

  listPlan(){
    return this.http.get('http://localhost:3000/api/goods/ListPlans')
  }

  deletedListPlans(){
    return this.http.get('http://localhost:3000/api/goods/DeletedListPlans')
  }

  getPlanById(id: any){
    return this.http.get<any>(this.BASE_URL + `/api/goods/SearchPlansById/${id}`)
  }

  updatePlanbyId(data: any, id: any){
    return this.http.post<any>(this.BASE_URL + `/api/goods/updatePlansById/${id}`, data)
  }

}
