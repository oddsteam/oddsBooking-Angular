import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BookingDetail } from './booking';

import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class DetailService {

  uData : any
  private bookingUrl = 'http://localhost:8080/v1/booking';
  
  constructor(private httpClient: HttpClient) { }
  httpOption = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  getBooking(booking: String): Observable<BookingDetail> {
    return this.httpClient.get<BookingDetail>(this.bookingUrl + '/' + booking, this.httpOption);
  }
}
