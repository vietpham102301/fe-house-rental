import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AppConfig } from 'src/app/AppConfig/appconfig.interface';
import { APP_SERVICE_CONFIG } from 'src/app/AppConfig/appconfig.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

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

  createEmployee(userCreateRequest: any): Observable<any> {
    let headers = this.getHeader();
    if(headers !== null){
      return this.http.post<any>(this.config.apiEndpoint +`/api/v1/auth/user`, userCreateRequest, headers);
    }
    return of(false);
  }
  
}
