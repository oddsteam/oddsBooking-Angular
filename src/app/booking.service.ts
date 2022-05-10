import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { bookingDetail } from './booking';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private bookingUrl = "localhost:3001/v1/booking"
  constructor(private httpClient: HttpClient) {
    
   }

   httpOption = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  }

  addBooking(booking:bookingDetail): Observable<bookingDetail>{
    return this.httpClient.post<bookingDetail>(this.bookingUrl, booking, this.httpOption)
  }
}
