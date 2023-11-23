import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AppConfig } from 'src/app/AppConfig/appconfig.interface';
import { APP_SERVICE_CONFIG } from 'src/app/AppConfig/appconfig.service';

@Injectable({
  providedIn: 'root'
})
export class TenantService {

  constructor(@Inject(APP_SERVICE_CONFIG) private config: AppConfig, private http: HttpClient) { }

  private getHeader(): any {
    const token = localStorage.getItem("token");
    if(token !== null){
      const headers = new HttpHeaders().set("Authorization", token);
      const options = {headers: headers}
      return options;
    }
    return null;
  }

  createTenant(name: string, roomId: number, birthdate: Date, gender: string, phone: string, email: string, idNumber: string, permanentAddress: any, licensePlate: string, rentDate: Date, description: string): Observable<any> {
    let headers = this.getHeader();
    let requestBody = {name, roomId, birthdate, gender, phone, email, idNumber, permanentAddress, licensePlate, rentDate, description};
    if(headers !== null){
      return this.http.post<any>(this.config.apiEndpoint +`/api/v1/tenants`, requestBody, headers);
    }
    return of(false);
  }
  
} 
