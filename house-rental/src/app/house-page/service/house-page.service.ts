import { Injectable, Inject } from '@angular/core';
import {HttpClient, HttpHeaders } from '@angular/common/http'
import { APP_SERVICE_CONFIG } from 'src/app/AppConfig/appconfig.service';
import { AppConfig } from 'src/app/AppConfig/appconfig.interface';
import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class HousePageService {
  constructor(private http: HttpClient, @Inject(APP_SERVICE_CONFIG) private config: AppConfig) { }


  private getHeader(): any{
    const authToken = localStorage.getItem("token"); 
    if(authToken !== null){
      const headers = new HttpHeaders().set('Authorization', authToken);
      const options = { headers: headers };
      return options
    }
    return null;
  }
  
 
  getHouseList(city:string, district: string, ward: string, status: string, page: string, size: string): Observable<any> {
    const options = this.getHeader();
    if(options !== null){
      return this.http.get<any>(this.config.apiEndpoint + `/api/v1/houses/list?city=${city}&district=${district}&ward=${ward}&status=${status}&page=${page}&size=${size}`, options);
    }
   
    return of([]);
  }

  searchHouseList(keywords: string, page: string): Observable<any>{
    const options = this.getHeader();
    if(options !== null){
      return this.http.get<any>(this.config.apiEndpoint + `/api/v1/houses/search?keywords=${keywords}&page=${page}`, options);
    }
   
    return of([]);
  }

  getCities(): Observable<any> {
    const options = this.getHeader();
    if(options !== null){
    return this.http.get<any>(this.config.apiEndpoint + `/api/v1/addresses/cities`, options);
    }
    return of([]);
  }

  getDistricts(city: string): Observable<any> {
    const options = this.getHeader();
    if(options !== null){
    return this.http.get<any>(this.config.apiEndpoint+ `/api/v1/addresses/districts?city=${city}`, options);}
    return of([]);
  }

  getWards(city: string, district: string): Observable<any> {
    const options = this.getHeader();
    if(options !== null){
    return this.http.get<any>(this.config.apiEndpoint+ `/api/v1/addresses/wards?city=${city}&district=${district}`, options)
    }
    return of([]);
  }

  updateHouse(name: string, address: any, facilities: any, establishDate: any, manager: any,status: string, description: string, houseId: number): Observable<any>{
    const requestBody = {
      name, address, facilities, establishDate, manager, status, description
    }
    const option = this.getHeader();
    if(option !== null) {
      return this.http.put<any>(this.config.apiEndpoint+"/api/v1/houses/"+houseId, requestBody, option);
    }

    return of(false);
  }

  inactiveHouse(houseId: number): Observable<any> {
    const option = this.getHeader();
    if(option !== null) {
      return this.http.delete<any>(this.config.apiEndpoint+"/api/v1/houses/"+houseId, option);
    }

    return of(false);
  }

  deleteImage(imageId: number): Observable<any> {
    const option = this.getHeader();
    if(option !== null) {
      return this.http.delete<any>(this.config.apiEndpoint+"/api/v1/images/"+imageId, option);
    }

    return of(false);
  }
  
}
