import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardManagerComponent } from './dashboard-manager/dashboard-manager.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMenuModule } from '@angular/material/menu';
import { NewHouseFormComponent } from './new-house-form/new-house-form.component';
import { MatTabsModule } from '@angular/material/tabs';
import { NewTenantFormComponent } from './new-tenant-form/new-tenant-form.component';
import { NewEmployeeFormComponent } from './new-employee-form/new-employee-form.component';
import { NewAccountFormComponent } from './new-account-form/new-account-form.component';
import { NewRoomFormComponent } from './new-room-form/new-room-form.component';
import { DashboardPageComponent } from './dashboard-page/dashboard-page.component';
import { APP_CONFIG, APP_SERVICE_CONFIG } from './AppConfig/appconfig.service';
import { HttpClientModule } from '@angular/common/http';
import { HousePageComponent } from './house-page/house-page.component';
import { RoomPageComponent } from './room-page/room-page.component';
import { TenantPageComponent } from './tenant-page/tenant-page.component';
import { EmployeePageComponent } from './employee-page/employee-page.component';
import { NewInvoiceFormComponent } from './new-invoice-form/new-invoice-form.component';
import { InvoicePageComponent } from './invoice-page/invoice-page.component';
import { SettingPageComponent } from './setting-page/setting-page.component';
import { InvoiceManagerPageComponent } from './invoice-manager-page/invoice-manager-page.component';
import { JwtModule } from '@auth0/angular-jwt';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { MatSnackBarModule } from '@angular/material/snack-bar';





@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    DashboardManagerComponent,
    NewHouseFormComponent,
    NewTenantFormComponent,
    NewEmployeeFormComponent,
    NewAccountFormComponent,
    NewRoomFormComponent,
    DashboardPageComponent,
    HousePageComponent,
    RoomPageComponent,
    TenantPageComponent,
    EmployeePageComponent,
    NewInvoiceFormComponent,
    InvoicePageComponent,
    SettingPageComponent,
    InvoiceManagerPageComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    MatMenuModule,
    MatTabsModule,
    HttpClientModule,
    JwtModule,
    SlickCarouselModule,
    MatSnackBarModule
  ],
  providers: [
    {
      provide: APP_SERVICE_CONFIG,
      useValue: APP_CONFIG
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
