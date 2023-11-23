import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { AppConfig } from 'src/app/AppConfig/appconfig.interface';
import { APP_SERVICE_CONFIG } from 'src/app/AppConfig/appconfig.service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TenantPageService {

  constructor(private http: HttpClient, @Inject(APP_SERVICE_CONFIG) private config: AppConfig) { }
  private getHeader(): any {
    const authToken = localStorage.getItem("token");
    if(authToken !== null){
      const headers = new HttpHeaders().set("Authorization", authToken);
      const options = {headers: headers};
      return options;
    }
    return null;
  }


  getTenantList(houseName: string, roomName: string, status: string, page: string): Observable<any>{
    const headers = this.getHeader()
    if(headers !== null) {
      return this.http.get<any>(this.config.apiEndpoint+ `/api/v1/tenants/list?houseName=${houseName}&roomName=${roomName}&status=${status}&page=${page}`, headers);
    }
    return of([])
  }

  searchTenant(keywords:string, page: string): Observable<any>{
    const headers = this.getHeader()
    if(headers !== null) {
      return this.http.get<any>(this.config.apiEndpoint+ `/api/v1/tenants/search?keywords=${keywords}&page=${page}`, headers);
    }
    return of([])
  }

  getRoomList(houseName: string): Observable<any>{
    const headers = this.getHeader()
    if(headers !== null) {
      return this.http.get<any>(this.config.apiEndpoint+ `/api/v1/rooms/list?houseName=${houseName}&size=100`, headers);
    }
    return of([])
  }


  updateTenant(
    tenantName: string,
    roomID: number,
    birthDate: Date,
    gender: string,
    phone: string,
    email: string,
    idNumber: string,
    permanentAddress: any,
    licensePlates: string,
    rentDate: Date,
    status: string,
    description: string,
    tenantId: number
  ): Observable<any> {
    const requestBody = {
      tenantName,
      roomID,
      birthDate,
      gender,
      phone,
      email,
      idNumber,
      permanentAddress,
      licensePlates,
      rentDate,
      status,
      description
    };
  
    const option = this.getHeader();
    if (option !== null) {
      return this.http.put<any>(
        "http://localhost:8080/api/v1/tenants/"+tenantId,
        requestBody,
        option
      );
    }
  
    return of(false);
  }
  

  inactiveTenant(tenantId: number): Observable<any> {
    const option = this.getHeader();
    if(option !== null) {
      return this.http.delete<any>(this.config.apiEndpoint+"/api/v1/tenants/"+tenantId, option);
    }

    return of(false);
  }
}
