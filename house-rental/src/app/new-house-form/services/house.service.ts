import { Injectable, Inject } from '@angular/core';
import {HttpClient, HttpHeaders } from '@angular/common/http'
import { APP_SERVICE_CONFIG } from 'src/app/AppConfig/appconfig.service';
import { AppConfig } from 'src/app/AppConfig/appconfig.interface';
import { Observable, of } from 'rxjs';

// declare var window:any;


@Injectable({
  providedIn: 'root'
})
export class HouseService {
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


  getManagerList(): Observable<any> {
    const options = this.getHeader();
    if(options !== null){
      return this.http.get<any>(this.config.apiEndpoint + `/api/v1/auth/user/list?size=100`, options);
    }
   
    return of([]);
  }

  createHouse(name: string, address:any, facilities: any, establishDate: any,
     manager:number, status: string, description: string): Observable<any> {
    const requestBody = {name, address, facilities, establishDate, manager, status, description}
    const options = this.getHeader();
    if(options !==null){
      return this.http.post<any>(this.config.apiEndpoint + `/api/v1/houses`, requestBody, options);
    }
    return of(false);
  }

  uploadFiles(formData: FormData, houseId: number, imageType: string): Observable<any> {
    const options = this.getHeader();
    if(options !==null){
      return this.http.post<any>(this.config.apiEndpoint + `/api/v1/images?entityId=${houseId}&imageType=${imageType}`, formData, options);
    }
    return of(false);
  }
}
