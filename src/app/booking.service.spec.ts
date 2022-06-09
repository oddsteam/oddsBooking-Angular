import { HttpClient } from '@angular/common/http'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { TestBed } from '@angular/core/testing'
import * as dayjs from 'dayjs'
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
        const result = BookingService.isWeekend(dayjs().day(6).toDate())

        expect(result).toBe(true)
    })

    it('#isWeekend should return false from monday', () => {
        const result = BookingService.isWeekend(dayjs().day(1).toDate())

        expect(result).toBeFalse()
    })

    it('#isDisabledDateOnStart should return true form 09 Jun 2022', () => {
        const result = BookingService.isDisabledDateOnStart(dayjs("09 Jun 2022").toDate())

        expect(result).toBeTruthy()
    })

    it('#isDisabledDateOnStart should return false form next 2 week date', () => {
        const result = BookingService.isDisabledDateOnStart(dayjs().add(14, 'day').toDate())

        expect(result).toBeFalse()
    })

    it('#isDisableEndDate startdate is empty', () => {
        const result = BookingService.isDisableEndDate(null, new Date(), new Date())
        expect(result).toBeTruthy()
    })

    it('#rangeDisabledHoursOnStart should return [0, ..., 17, 22] from startDate: today, endDate: today, endTime book at 22 *today is not weekend', () =>{
        //input 2022/06/23, 2022/06/23, 23:59
        //output [6, 7, 8, ..., 17]
        const startDate = dayjs("23 Jun 2022").toDate()
        const endDate = dayjs("23 Jun 2022").toDate()
        const endTime = dayjs("23 Jun 2022").hour(23).minute(59).toDate()

        const result = BookingService.rangeDisabledHoursOnStart(startDate, endDate, endTime)

        expect(result).toEqual([6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17])
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
