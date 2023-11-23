import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APP_SERVICE_CONFIG } from 'src/app/AppConfig/appconfig.service';
import { AppConfig } from 'src/app/AppConfig/appconfig.interface';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeePageService {
  constructor(private http: HttpClient, @Inject(APP_SERVICE_CONFIG) private config: AppConfig) { }

  private getHeader(): any {
    const authToken = localStorage.getItem("token");
    if (authToken !== null) {
      const headers = new HttpHeaders().set('Authorization', authToken);
      const options = { headers: headers };
      return options;
    }
    return null;
  }

  getEmployeeList(houseName: string, status: string, page: string): Observable<any> {
    const options = this.getHeader();
    if (options !== null) {
      return this.http.get<any>(this.config.apiEndpoint + `/api/v1/auth/user/list?houseName=${houseName}&status=${status}&page=${page}`, options);
    }
    return of([]);
  }

  searchEmployeeList(keywords: string, page: string): Observable<any> {
    const options = this.getHeader();
    if (options !== null) {
      return this.http.get<any>(this.config.apiEndpoint + `/api/v1/auth/user/search?keywords=${keywords}&page=${page}`, options);
    }
    return of([]);
  }

  updateEmployee(updatedRequest: any, employeeId: number): Observable<any> {
    
    const option = this.getHeader();
    if (option !== null) {
      return this.http.put<any>(this.config.apiEndpoint + "/api/v1/auth/user/"+employeeId, updatedRequest, option);
    }
    return of(false);
  }

  inactiveEmployee(employeeId: number): Observable<any> {
    const option = this.getHeader();
    if (option !== null) {
      return this.http.delete<any>(this.config.apiEndpoint + "/api/v1/auth/user/" + employeeId, option);
    }
    return of(false);
  }
}
