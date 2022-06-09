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
        const current = dayjs("09 Jun 2022").toDate()

        const result = BookingService.isDisabledDateOnStart(current, current)

        expect(result).toBeTruthy()
    })

    it('#isDisabledDateOnStart should return false form next 2 week date', () => {
        const current = dayjs("09 Jun 2022")

        const result = BookingService.isDisabledDateOnStart(current.add(14, 'day').toDate(), current.toDate())

        expect(result).toBeFalse()
    })

    it('#rangeDisabledHoursOnStart should return [6, 7, 8, ..., 17] from startDate: 2022/06/23, endDate: 2022/06/23, endTime: 23:59 *startDate is not weekend', () =>{
        //input 2022/06/23, 2022/06/23, 23:59
        //output [6, 7, 8, ..., 17]
        const startDate = dayjs("23 Jun 2022").toDate()
        const endDate = dayjs("23 Jun 2022").toDate()
        const endTime = dayjs("23 Jun 2022").hour(23).minute(59).toDate()

        const result = BookingService.rangeDisabledHoursOnStart(startDate, endDate, endTime)

        expect(result).toEqual([6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17])
    })

    it('#rangeDisabledHoursOnStart should return [0, 1, 2, ..., 8, 21, 22, 23] from startDate: 2022/06/25, endDate: 2022/06/25, endTime: 21:00 *startDate is weekend', () =>{
        //input 2022/06/25, 2022/06/25, 21:00
        //output [0, 1, 2, ..., 8 | 21, ..., 23]
        const startDate = dayjs("25 Jun 2022").toDate()
        const endDate = dayjs("25 Jun 2022").toDate()
        const endTime = dayjs("25 Jun 2022").hour(21).minute(0).toDate()

        const result = BookingService.rangeDisabledHoursOnStart(startDate, endDate, endTime)

        expect(result).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 21, 22, 23])
    })
    
    it('#rangeDisabledHoursOnStart should return [0, 1, 2, ..., 8, 21, 22, 23] from startDate: 2022/06/25, endDate: undefined, endTime: undefined *startDate is weekend', () =>{
        //input 2022/06/25, undefined, undefined
        //output [0, 1, 2, ..., 8 | 21, ..., 23]
        const startDate = dayjs("25 Jun 2022").toDate()

        const result = BookingService.rangeDisabledHoursOnStart(startDate, undefined, undefined)

        expect(result).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 21, 22, 23])
    })
    
    it('#rangeDisabledHoursOnStart should return [6, 7, 8, ..., 17] from startDate: 2022/06/23, endDate: null, endTime: null *startDate is not weekend', () =>{
        //input 2022/06/23, undefined, undefined
        //output [6, 7, 8, ..., 17]
        const startDate = dayjs("23 Jun 2022").toDate()

        const result = BookingService.rangeDisabledHoursOnStart(startDate, undefined, undefined)

        expect(result).toEqual([6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17])
    })
    
    it('#isDisableEndDate should return false from startDate: 2022/06/23, startTime: 18:00, current: 2022/06/23, now: 2022/06/23 *startDate is not weekend', () =>{
        //input 2022/06/23, 18:00, 2022/06/23, 2022/06/23
        //output false
        const startDate = dayjs("23 Jun 2022").toDate()
        const startTime = dayjs("23 Jun 2022").hour(18).minute(0).toDate()
        const current = startDate
        const now = startDate

        const result = BookingService.isDisableEndDate(startDate, startTime, current, now)

        expect(result).toBeFalse()
    })

    it('#isDisableEndDate should return true from startDate: 2022/06/23, startTime: 18:00, current: 2022/06/22, now: 2022/06/23 *startDate is not weekend', () =>{
        //input 2022/06/23, 18:00, 2022/06/23, 2022/06/23
        //output false
        const startDate = dayjs("23 Jun 2022").toDate()
        const startTime = dayjs("23 Jun 2022").hour(18).minute(0).toDate()
        const current = dayjs("22 Jun 2022").toDate()
        const now = startDate

        const result = BookingService.isDisableEndDate(startDate, startTime, current, now)

        expect(result).toBeTrue()
    })

    it('#range should return [2, 3, 4, .., 10] from start:2, end: 11', () =>{
        const start = 2
        const end = 11
        const result = BookingService.range(start,end)

        expect(result).toEqual([2, 3, 4, 5, 6, 7, 8, 9, 10])
    })
})
