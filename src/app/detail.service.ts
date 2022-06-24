import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import * as dayjs from 'dayjs'
import { Observable } from 'rxjs'
import { environment } from 'src/environments/environment'
import { BookingDetail, BookingDetailRes, BookingRes } from './booking'

@Injectable({
    providedIn: 'root',
})
export class DetailService {
    private bookingUrl = `${environment.apiUrl}/v1/booking`;

    constructor(private httpClient: HttpClient) {}
    httpOption = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    }

    getBooking(id: String): Observable<BookingRes> {
        
        return this.httpClient.get<BookingRes>(this.bookingUrl + '/' + id, this.httpOption)
    }

    confirmBooking(bookingDetailRes: BookingRes): Observable<BookingRes> {
        
        console.log(bookingDetailRes.data)
        
        return this.httpClient.put<BookingRes>(this.bookingUrl + '/' + bookingDetailRes.data.id, bookingDetailRes.data, this.httpOption)
    }
}
