import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { environment } from 'src/environments/environment'
import { BookingDetail, BookingDetailRes } from './booking'

@Injectable({
    providedIn: 'root',
})
export class DetailService {
    private bookingUrl = `${environment.apiUrl}/v1/booking`;

    constructor(private httpClient: HttpClient) {}
    httpOption = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    }

    getBooking(id: String): Observable<BookingDetailRes> {
        
        return this.httpClient.get<BookingDetailRes>(this.bookingUrl + '/' + id, this.httpOption)
    }

    confirmBooking(bookingDetailRes: BookingDetailRes): Observable<BookingDetailRes> {
        return this.httpClient.put<BookingDetailRes>(this.bookingUrl + '/' + bookingDetailRes.id, bookingDetailRes, this.httpOption)
    }
}
