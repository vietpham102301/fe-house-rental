import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APP_SERVICE_CONFIG } from 'src/app/AppConfig/appconfig.service';
import { AppConfig } from 'src/app/AppConfig/appconfig.interface';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailServiceService {

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

  sendEmails(emailRequest: any): Observable<any> {
    const option = this.getHeader();
    if (option !== null) {
      return this.http.post<any>(this.config.apiEndpoint + "/api/v1/email/send-emails", emailRequest, option);
    }
    return of(false);
  }
}
