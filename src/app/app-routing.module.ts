import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MasterComponent } from './master/master.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { UploadDocComponent } from './upload-doc/upload-doc.component';
import { UploadBidComponent } from './upload-bid/upload-bid.component';
import { UploadWinComponent } from './upload-win/upload-win.component';
import { BidMasterComponent } from './bid-master/bid-master.component';
import { WinMasterComponent } from './win-master/win-master.component';

const routes: Routes = [
  {path:'home', component: HomeComponent},
  {path:'home/:id', component: HomeComponent},
  {path:'', redirectTo:'home', pathMatch:'full'},
  {path:'login', component:LoginComponent},
  {path:'pagenotfound', component:PagenotfoundComponent},
  {path:'master', component:MasterComponent},
  {path:'uploadSheet', component: UploadDocComponent},
  {path:'uploadBid', component: UploadBidComponent},
  {path:'uploadWin', component: UploadWinComponent},
  {path:'bid-master', component: BidMasterComponent},
  {path:'win-master', component: WinMasterComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
