import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductServiceService } from '../product-service.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(private service: ProductServiceService,
     private router: Router,
     private formBuilder: FormBuilder,
     private toastr: ToastrService) {
      
      }

  ngOnInit(): void {
    this.verifyToken();
    this.initLoginForm();
  }

  verifyToken(){
    const token = sessionStorage.getItem('token');
    if (token == '' || token == null || token == undefined) {
      return;
    }else{
      this.router.navigate(['home'])
    }
  }

  initLoginForm(){
    this.loginForm = this.formBuilder.group({
      username: ["", Validators.required],
      password: ["", Validators.required]
    })
  }

  login(){
    if(this.loginForm.valid){
      var loginObj = {
        username: this.loginForm.value.username,
        password: this.loginForm.value.password
      }

      this.service.Login(loginObj).subscribe((res) => {

        if(res && res.message === "Auth successful"){
          this.toastr.success(res.message)
          var token = res.token;
          sessionStorage.setItem("token", token)
          this.loginForm.reset();
          this.router.navigate(['/home']);
        }
      }, (error) => {
        if(error && error.status === 401)
        this.toastr.error("Invalid Credentials!")
      }
      )
      
    }else{
      this.toastr.error("Please Fill All the Details!")
    }


    

  }

}
