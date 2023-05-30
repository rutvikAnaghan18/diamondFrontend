import { NgModule } from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import {MatNativeDateModule} from '@angular/material/core';
import {MaterialExampleModule} from '../../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { MasterComponent } from './master/master.component';
import { HttpClientModule } from '@angular/common/http';
import { UploadDocComponent } from './upload-doc/upload-doc.component';
import { MatInputModule } from '@angular/material/input';
import { UploadBidComponent } from './upload-bid/upload-bid.component';
import { UploadWinComponent } from './upload-win/upload-win.component';
import { BidMasterComponent } from './bid-master/bid-master.component';
import { WinMasterComponent } from './win-master/win-master.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    PagenotfoundComponent,
    MasterComponent,
    UploadDocComponent,
    UploadBidComponent,
    UploadWinComponent,
    BidMasterComponent,
    WinMasterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    MatNativeDateModule,
    MaterialExampleModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule,
    ToastrModule.forRoot({
      timeOut: 1500,
      positionClass: 'toast-top-right'
    }),
    MatInputModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore())
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
