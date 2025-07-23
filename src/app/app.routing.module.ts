import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './_core/service/auth.guard';
import { AdminBaseComponent } from './admin/admin.base.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { PaymentcustomerComponent } from './admin/features/Add payment/paymentcustomer/paymentcustomer.component';
import { PaymentalertComponent } from './admin/features/Add payment/paymentalert/paymentalert.component';
const routes: Routes = [
  { path: 'payment_customer/:id', component: PaymentcustomerComponent },
  { path: 'payment_customer', component: PaymentalertComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminBaseComponent, canActivate: [AuthGuard], loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
  { path: '', component: LoginComponent },
  { path: '**', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy },]

})
export class AppRoutingModule { }
