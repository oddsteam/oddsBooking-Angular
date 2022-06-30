import { TestBed } from '@angular/core/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { DetailService } from './detail.service'
import { BookingFormComponent } from './booking-form/booking-form.component'
import { BookingDetail, BookingRes } from './booking'
import { of } from 'rxjs'
import { environment } from 'src/environments/environment'
import { HttpClient, HttpHandler } from '@angular/common/http'

describe('DetailService', () => {
    let service: DetailService
    let httpClientSpy: HttpClient
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
        })

        httpClientSpy = new HttpClient({} as HttpHandler);
        service = new DetailService(httpClientSpy)

    })

    it('should be created', () => {
        expect(service).toBeTruthy()
    })

    it('#getBooking should have been call from url', () => {
        const booking : BookingRes = 
        {
            status:200,
            data:
            {
                id:'1',  
                fullName: 'Piyapong Visitsin', 
                email: 'mola@gmail.com',
                phoneNumber: '0123456789',
                reason: 'event',
                room: 'Allstars',
                startDate: '2022/07/14 13:00',
                endDate: '2022/07/14 14:00',
                status: false,
                createdAt: new Date,
                updatedAt: new Date
            }
        }

        //act
        spyOn(httpClientSpy, "get").and.returnValue(of(booking))
        service.getBooking('1').subscribe()

        expect(httpClientSpy.get).toHaveBeenCalledWith(`${environment.apiUrl}/v1/booking/1`)
    })
})
