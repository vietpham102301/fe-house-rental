import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { AppConfig } from 'src/app/AppConfig/appconfig.interface';
import { APP_SERVICE_CONFIG } from 'src/app/AppConfig/appconfig.service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvoicePageService {

  constructor(private http: HttpClient, @Inject(APP_SERVICE_CONFIG) private config: AppConfig) { }

  private getHeader(): any {
    const authToken = localStorage.getItem("token");
    if (authToken !== null) {
      const headers = new HttpHeaders().set("Authorization", authToken);
      const options = { headers: headers };
      return options;
    }
    return null;
  }

  getInvoiceList(from: any, houseId: number, status: string, page: string): Observable<any> {
    const headers = this.getHeader();
    if (headers !== null) {
      return this.http.get<any>(this.config.apiEndpoint + `/api/v1/invoices/list?houseId=${houseId}&status=${status}&from=${from}&page=${page}`, headers);
    }
    return of([]);
  }

  searchInvoice(keywords: string, page: string): Observable<any> {
    const headers = this.getHeader();
    if (headers !== null) {
      return this.http.get<any>(this.config.apiEndpoint + `/api/v1/invoices/search?keywords=${keywords}&page=${page}`, headers);
    }
    return of([]);
  }

  getInvoiceDetails(invoiceId: number): Observable<any> {
    const headers = this.getHeader();
    if (headers !== null) {
      return this.http.get<any>(this.config.apiEndpoint + `/api/v1/invoices/${invoiceId}`, headers);
    }
    return of({});
  }

  getTenantList(houseName: string, roomName: string, status: string): Observable<any>{
    const headers = this.getHeader()
    if(headers !== null) {
      return this.http.get<any>(this.config.apiEndpoint+ `/api/v1/tenants/list?houseName=${houseName}&roomName=${roomName}&status=${status}&size=100`, headers);
    }
    return of([])
  }

  updateInvoice(updateRequest:any, invoiceId: number): Observable<any> {


    const option = this.getHeader();
    if (option !== null) {
      return this.http.put<any>(
        this.config.apiEndpoint + `/api/v1/invoices/${invoiceId}`,
        updateRequest,
        option
      );
    }

    return of(false);
  }

  cancelInvoice(invoiceId: number): Observable<any> {
    const option = this.getHeader();
    if (option !== null) {
      return this.http.delete<any>(this.config.apiEndpoint + `/api/v1/invoices/${invoiceId}`, option);
    }

    return of(false);
  }

  getFacilitiesList(roomId: number): Observable<any>{
    const headers = this.getHeader();
    if(headers !== null) {
      return this.http.get<any>(this.config.apiEndpoint + `/api/v1/facilities/list/${roomId}`, headers);
    }
    return of([]);
  }

  createInvoice(createRequest:any): Observable<any> {
    const headers = this.getHeader();
    if(headers !== null) {
      return this.http.post<any>(this.config.apiEndpoint + `/api/v1/invoices`, createRequest,headers);
    }
    return of([]);
  }
}
