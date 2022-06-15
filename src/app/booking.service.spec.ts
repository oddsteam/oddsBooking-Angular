import { HttpClient, HttpHandler } from '@angular/common/http'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { TestBed } from '@angular/core/testing'
import * as dayjs from 'dayjs'
import { of } from 'rxjs'
import { environment } from 'src/environments/environment'
import { BookingUtility } from 'src/functions/booking.utility'
import { BookingDetail } from './booking'
import { BookingService } from './booking.service'

describe('BookingService', () => {
    let service: BookingService
    let httpClientSpy: HttpClient
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
        })

        httpClientSpy = new HttpClient({} as HttpHandler)
        service = new BookingService(httpClientSpy)
    })

    it('should be created', () => {
        expect(service).toBeTruthy()
    })

    it('#addBooking should have been called from url, booking', () => {
        const booking: BookingDetail = {
            id: '1',
            fullName: 'Piyapong Visitsin',
            email: 'beam@gmail.com',
            phoneNumber: '0123456789',
            reason: 'event',
            room: 'Allstars',
            startDate: new Date(),
            endDate: new Date(),
            status: false,
        }
        //act
        spyOn(httpClientSpy, 'post').and.returnValue(of())
        service.addBooking(booking).subscribe()

        expect(httpClientSpy.post).toHaveBeenCalledWith(`${environment.apiUrl}/v1/booking`, booking)
    })

    it('#addBooking should return id:2 from url, booking', () => {
        const booking: BookingDetail = {
            id: '1',
            fullName: 'Piyapong Visitsin',
            email: 'beam@gmail.com',
            phoneNumber: '0123456789',
            reason: 'event',
            room: 'Allstars',
            startDate: new Date(),
            endDate: new Date(),
            status: false,
        }
        //act
        spyOn(httpClientSpy, 'post').and.returnValue(of({ id: '2' }))
        service.addBooking(booking).subscribe((res) => {
            expect(res).toEqual('2')
        })

        expect(httpClientSpy.post).toHaveBeenCalledWith(`${environment.apiUrl}/v1/booking`, booking)
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
        const current = dayjs('09 Jun 2022').toDate()

        const result = BookingService.isDisabledDateOnStart(current, current)

        expect(result).toBeTruthy()
    })

    it('#isDisabledDateOnStart should return false form next 2 week date', () => {
        const current = dayjs('09 Jun 2022')

        const result = BookingService.isDisabledDateOnStart(
            current.add(14, 'day').toDate(),
            current.toDate()
        )

        expect(result).toBeFalse()
    })

    it('#rangeDisabledHoursOnStart should return [0, 1, 2, ..., 17 | 23] from startDate: 2022/06/23, endDate: 2022/06/23, endTime: 23:00 *startDate is not weekend', () => {
        //input 2022/06/23, 2022/06/23, 23:59
        //output [6, 7, 8, ..., 17 | 23]
        const startDate = dayjs('23 Jun 2022').toDate()
        const endDate = dayjs('23 Jun 2022').toDate()
        const endTime = dayjs('23 Jun 2022').endOf('date').toDate()

        const result = BookingService.rangeDisabledHoursOnStart(startDate, endDate, endTime)

        expect(result).toEqual(BookingService.range(0, 17).concat([23]))
    })

    it('#rangeDisabledHoursOnStart should return [0, 1, 2, ..., 8, 21, 22, 23] from startDate: 2022/06/25, endDate: 2022/06/25, endTime: 21:00 *startDate is weekend', () => {
        //input 2022/06/25, 2022/06/25, 21:00
        //output [0, 1, 2, ..., 8 | 21, ..., 23]
        const startDate = dayjs('25 Jun 2022').toDate()
        const endDate = dayjs('25 Jun 2022').toDate()
        const endTime = dayjs('25 Jun 2022').hour(21).minute(0).toDate()

        const result = BookingService.rangeDisabledHoursOnStart(startDate, endDate, endTime)

        expect(result).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 21, 22, 23])
    })

    it('#rangeDisabledHoursOnStart should return [0, 1, 2, ..., 8, 21, 22, 23] from startDate: 2022/06/25, endDate: undefined, endTime: undefined *startDate is weekend', () => {
        //input 2022/06/25, undefined, undefined
        //output [0, 1, 2, ..., 8 | 21, ..., 23]
        const startDate = dayjs('25 Jun 2022').toDate()

        const result = BookingService.rangeDisabledHoursOnStart(startDate, undefined, undefined)

        expect(result).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 21, 22, 23])
    })

    it('#rangeDisabledHoursOnStart should return [0, 1, 2, ..., 17] from startDate: 2022/06/23, endDate: null, endTime: null *startDate is not weekend', () => {
        //input 2022/06/23, undefined, undefined
        //output [6, 7, 8, ..., 17]
        const startDate = dayjs('23 Jun 2022').toDate()

        const result = BookingService.rangeDisabledHoursOnStart(startDate, undefined, undefined)

        expect(result).toEqual(BookingService.range(0, 17))
    })

    it('#isDisableEndDate should return false from startDate: 2022/06/24, startTime: 18:00, current: 2022/06/23, now: 2022/06/23 *startDate is not weekend', () => {
        //input 2022/06/24, 18:00, 2022/06/23, 2022/06/10
        //output true
        const startDate = dayjs('24 Jun 2022').toDate()
        const dateOnCalendar = dayjs('23 Jun 2022').toDate()
        const today = dayjs('10 Jun 2022').toDate()

        const result = BookingService.isDisableEndDate(startDate, dateOnCalendar, today)

        expect(result).toBeTruthy()
    })

    it('#isDisableEndDate should return true from startDate: 2022/06/23, startTime: 18:00, current: 2022/06/22, now: 2022/06/23 *startDate is not weekend', () => {
        //input 2022/06/23, 18:00, 2022/06/23, 2022/06/23
        //output false
        const startDate = dayjs('23 Jun 2022').toDate()
        const dateOnCalendar = dayjs('22 Jun 2022').toDate()
        const today = startDate

        const result = BookingService.isDisableEndDate(startDate, dateOnCalendar, today)

        expect(result).toBeTrue()
    })

    it('#range should return [2, 3, 4, .., 10] from start:2, end: 10', () => {
        const start = 2
        const end = 10
        const result = BookingService.range(start, end)

        expect(result).toEqual([2, 3, 4, 5, 6, 7, 8, 9, 10])
    })
})
