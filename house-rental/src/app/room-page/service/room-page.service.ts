import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { AppConfig } from 'src/app/AppConfig/appconfig.interface';
import { APP_SERVICE_CONFIG } from 'src/app/AppConfig/appconfig.service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoomPageService {

  constructor(private http: HttpClient, @Inject(APP_SERVICE_CONFIG) private config: AppConfig) { }
  
  private getHeader(): any {
    const authToken = localStorage.getItem("token");
    if(authToken !== null){
      const headers = new HttpHeaders().set("Authorization", authToken);
      const options = { headers: headers };
      return options;
    }
    return null;
  }

  getRoomList(houseName: string, floor: string, status: string, page: string): Observable<any>{
    const headers = this.getHeader()
    if(headers !== null) {
      return this.http.get<any>(this.config.apiEndpoint + `/api/v1/rooms/list?houseName=${houseName}&floor=${floor}&status=${status}&page=${page}`, headers);
    }
    return of([]);
  }

  searchRoom(keywords: string, page: string): Observable<any> {
    const headers = this.getHeader();
    if (headers !== null) {
      return this.http.get<any>(this.config.apiEndpoint + `/api/v1/rooms/search?keywords=${keywords}&page=${page}`, headers);
    }
    return of([]);
  }

  updateRoom(
    name: string,
    status: string,
    floor: number,
    area: number,
    capacity: number,
    rentFee: number,
    description: string,
    roomId: number
  ): Observable<any> {
    const requestBody = {
      name,
      status,
      floor,
      area,
      capacity,
      rentFee,
      description,
     
    };
  
    const option = this.getHeader();
    if (option !== null) {
      return this.http.put<any>(
        this.config.apiEndpoint + `/api/v1/rooms/${roomId}`,
        requestBody,
        option
      );
    }
  
    return of(false);
  }

  getInvoiceData(roomId: number): Observable<any> {
    const option = this.getHeader();
    if(option !== null) {
      return this.http.get<any>(this.config.apiEndpoint + `/api/v1/invoices/rooms/${roomId}`, option);
    }
  
    return of(false);
  }

  inactiveRoom(roomId: number): Observable<any> {
    const option = this.getHeader();
    if(option !== null) {
      return this.http.delete<any>(this.config.apiEndpoint + "/api/v1/rooms/" + roomId, option);
    }
  
    return of(false);
  }
}
