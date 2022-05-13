import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BookingDetail } from './booking';

@Injectable({
  providedIn: 'root'
})
export class DetailService {

  uData : any
  private bookingUrl = `${environment.apiUrl}/v1/booking`;
  
  constructor(private httpClient: HttpClient) {
    
   }
  httpOption = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  getBooking(id: String): Observable<BookingDetail> {
    return this.httpClient.get<BookingDetail>(this.bookingUrl + '/' + id, this.httpOption);
  }
}
