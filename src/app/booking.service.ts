import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BookingDetail } from './booking';

import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private bookingUrl = 'http://localhost:8080/v1/booking';

  uid: any
  constructor(private httpClient: HttpClient) {}

  httpOption = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  addBooking(booking: BookingDetail): Observable<BookingDetail> {
    console.log('This is Service');
    console.log(booking);
    return this.httpClient.post<BookingDetail>(
      this.bookingUrl,
      booking,
      this.httpOption
    ).pipe(map(data => {
      if (data) {
        this.uid = data.id;
      }
      return this.uid;
    }));
    
  }
}
