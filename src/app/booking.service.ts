import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BookingDetail } from './booking';

import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private bookingUrl = `${environment.apiUrl}/v1/booking`;

  uid: any
  currentBooking!: BookingDetail;
  constructor(private httpClient: HttpClient) {}

  httpOption = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  addBooking(booking: BookingDetail): Observable<string> {
    console.log('This is Service');
    console.log(booking);
    return this.httpClient.post<BookingDetail>(
      this.bookingUrl,
      booking,
      this.httpOption
    ).pipe(map(data => data.id ));
  }

  saveBooking(booking: BookingDetail){
    this.currentBooking = booking;
  }

  getCurrentBooking(): BookingDetail{
    return this.currentBooking;
  }
}
