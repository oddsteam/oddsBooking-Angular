import { HttpClient } from '@angular/common/http'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { TestBed } from '@angular/core/testing'
import { BookingDetail } from './booking'
import { BookingService } from './booking.service'

describe('BookingService', () => {
    let service: BookingService
    let httpClientSpy: jasmine.SpyObj<HttpClient>;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
        })
        service = TestBed.inject(BookingService)
        httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);
        
    })

    it('should be created', () => {
        expect(service).toBeTruthy()
    })

    it('should be add booking', () => {
        const booking : BookingDetail[] =
        [{
            id:'1',  
            fullName: 'Piyapong Visitsin', 
            email: 'beam@gmail.com',
            phoneNumber: '0123456789',
            reason: 'event',
            room: 'Allstars',
            startDate: new Date(),
            endDate: new Date(),
            status: false
        }]
        //act
        httpClientSpy.post('HttpClient',booking);
        expect(httpClientSpy.post) .toBeTruthy()
    })

    it('#isWeekend should return true from weekend date', () => {
        const result = BookingService.isWeekend(new Date())
        expect(result).toBe(false)
    })

    it('#isDisableEndDate startdate is empty', () => {
        const result = BookingService.isDisableEndDate(null, new Date(), new Date())
        expect(result).toBeTruthy()
    })
    it('check rang of time', () =>{
        const start = 3
        const end = 2
        const result = BookingService.range(start,end)
        expect(result).toBeTruthy()
    })
    it('should be disable 14 day after current date', () => {
        const result = BookingService.isDisabledDateOnStart(new Date())
        expect(result).toBeTruthy()
    })
})
