import { Injectable, Inject } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http'
import { APP_SERVICE_CONFIG } from 'src/app/AppConfig/appconfig.service';
import { AppConfig } from 'src/app/AppConfig/appconfig.interface';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardPageService {

  constructor(private http: HttpClient, @Inject(APP_SERVICE_CONFIG) private config: AppConfig) { }
  getChartInfor(endpoint:string) {
    return this.http.get("http://localhost:3000"+endpoint);
  }

  private getHeader(): any {
    const authToken = localStorage.getItem("token");
    if (authToken !== null) {
      const headers = new HttpHeaders().set('Authorization', authToken);
      const options = { headers: headers };
      return options;
    }
    return null;
  }

  getGeneralGrow(): Observable<any> {
    const option = this.getHeader();
    if (option !== null) {
      return this.http.get<any>(this.config.apiEndpoint + "/api/v1/statistics/general-grow", option);
    }
    return of(false);
  }
}
