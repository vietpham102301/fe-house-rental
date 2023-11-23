import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardManagerComponent } from './dashboard-manager/dashboard-manager.component';
import { NewHouseFormComponent } from './new-house-form/new-house-form.component';
import { NewTenantFormComponent } from './new-tenant-form/new-tenant-form.component';
import { NewEmployeeFormComponent } from './new-employee-form/new-employee-form.component';
import { NewAccountFormComponent } from './new-account-form/new-account-form.component';
import { NewRoomFormComponent } from './new-room-form/new-room-form.component';
import { DashboardPageComponent } from './dashboard-page/dashboard-page.component';
import { HousePageComponent } from './house-page/house-page.component';
import { RoomPageComponent } from './room-page/room-page.component';
import { TenantPageComponent } from './tenant-page/tenant-page.component';
import { EmployeePageComponent } from './employee-page/employee-page.component';
import { NewInvoiceFormComponent } from './new-invoice-form/new-invoice-form.component';
import { InvoicePageComponent } from './invoice-page/invoice-page.component';
import { SettingPageComponent } from './setting-page/setting-page.component';
import { InvoiceManagerPageComponent } from './invoice-manager-page/invoice-manager-page.component';
import { AuthGuard } from './auth/auth.guard';
import { LoginGuard } from './login/login.guard';



const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full'},
  { path: 'login', component: LoginComponent, canActivate:[LoginGuard]},
  { path: 'dashboard', component: DashboardComponent},
  {path: 'dashboard-manager', component: DashboardManagerComponent, canActivate: [AuthGuard], data: { authorities: ['MANAGER'] }, children:[
    {path: 'room-page', component:RoomPageComponent},
    {path: 'tenant-page', component:TenantPageComponent},
    {path:'invoice-manager-page', component:InvoiceManagerPageComponent},
    {path:'dashboard-page', component:DashboardPageComponent}
  ]},
  {path: 'new-house', component: NewHouseFormComponent},
  {path: 'new-tenant', component: NewTenantFormComponent},
  {path: 'new-employee', component: NewEmployeeFormComponent},
  {path: 'new-account', component: NewAccountFormComponent},
  {path: 'new-room', component: NewRoomFormComponent},
  {path:'dashboard-page', component: DashboardPageComponent},
  {path:'house-page', component: HousePageComponent},
  {path:'room-page', component: RoomPageComponent},
  {path: 'tenant-page', component:TenantPageComponent},
  {path: 'employee-page', component:EmployeePageComponent},
  {path: 'new-invoice', component: NewInvoiceFormComponent},
  {path: 'invoice-page', component:InvoicePageComponent},
  {path: 'setting-page', component:SettingPageComponent},
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], data: { authorities: ['ADMIN'] }, children: [
    {path: 'tenant-page', component:TenantPageComponent},
    {path: 'dashboard-page', component:DashboardPageComponent},
    {path: 'house-page', component:HousePageComponent},
    {path:'employee-page',component:EmployeePageComponent},
    {path:'invoice-page', component:InvoicePageComponent}
  ]},
  {path: 'invoice-manager-page', component:InvoiceManagerPageComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
