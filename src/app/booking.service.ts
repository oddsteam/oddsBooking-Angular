import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { BookingDetail } from './booking'
import { map } from 'rxjs/operators'
import { environment } from 'src/environments/environment'
import * as dayjs from 'dayjs'
import * as isBetween from 'dayjs/plugin/isBetween'
@Injectable({
    providedIn: 'root',
})
export class BookingService {
    private bookingUrl = `${environment.apiUrl}/v1/booking`
    //test push1
    currentBooking?: BookingDetail
    constructor(private httpClient: HttpClient) {}

    httpOption = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    }

    addBooking(booking: BookingDetail): Observable<string> {
        booking.status = false
        return this.httpClient
            .post<BookingDetail>(this.bookingUrl, booking)
            .pipe(map((data) => data.id))
    }

    saveBooking(booking: BookingDetail) {
        this.currentBooking = booking
    }

    getCurrentBooking(): BookingDetail | undefined {
        return this.currentBooking
    }

    clearCurrentBooking() {
        this.currentBooking = undefined
    }

    static range(start: number, end: number): number[] {
        const result: number[] = []
        for (let i = start; i <= end; i++) {
            result.push(i)
        }
        return result
    }

    static isWeekend(day: Date): boolean {
        return dayjs(day).day() % 6 === 0
    }

    static isDisabledDateOnStart(current: Date, now: Date): boolean {
        return dayjs(now).add(14, 'day').isAfter(current, 'date')
    }

    static getFutureRange(startDate: Date, endDate?: Date, endTime?: Date): number[] {
        const isHaveEndTime = dayjs(startDate).isSame(endDate, 'date') && endTime
        if (!isHaveEndTime) return []
        const startHours = dayjs(startDate).endOf('date').hour()
        const endHours = dayjs(endTime).hour()
        return this.range(endHours, startHours)
    }

    static rangeDisabledHoursOnStart(startDate: Date, endDate?: Date, endTime?: Date): number[] {
        const futureRange = this.getFutureRange(startDate, endDate, endTime)
        if (!this.isWeekend(startDate)) {
            return [...this.range(0, 17), ...futureRange]
            // return [...this.range(6, 17), ...futureRange]
        }
        let rangeDisable = [...this.range(0, 8), ...this.range(21, 23), ...futureRange]
        return [...new Set(rangeDisable)].sort((a, b) => a - b)
    }

    static isDisableEndDate(startDate: Date, current: Date, now: Date): boolean {
        const startDateDayjs = dayjs(startDate)
        if(dayjs(startDateDayjs).day()==6){
            return dayjs(current).isAfter(dayjs(startDate).add(1,"day")) || dayjs(current).isBefore(startDate)
        }
        return !dayjs(current).isSame(startDateDayjs, 'date')
    }

    static rangeDisabledHoursOnEnd(startTime: Date, endDate?: Date): number[] {
        // console.log(startTime)
        const startTimeHoursDayJs = dayjs(startTime).get('hour')
        const isWeekend = this.isWeekend(startTime)
        // console.log(isWeekend)
        const defaultDisabled = this.range(0, startTimeHoursDayJs)
        const isBefore6AM = startTimeHoursDayJs < 6

        if (isWeekend) {
            if(!dayjs(startTime).isSame(endDate, 'date')){
                return [...this.range(0, 8), ...this.range(22, 23)]
            }
            return [...defaultDisabled, ...this.range(22, 23)]
        } 
        else if (isBefore6AM) return [...defaultDisabled, ...this.range(7, 23)]
        else return defaultDisabled
    }

    static rangeDisabledMinutesOnStart(hours: number, startDate: Date): number[] {
        const isWeekend = this.isWeekend(startDate) && hours === 20
        const isWeekDayAt10PM = hours === 22
        return isWeekend ? [30] : isWeekDayAt10PM ? [30] : []
    }
    
    static rangeDisabledMinutesOnEnd(hours: number, startDate: Date): number[] {
        
        const isWeekend = this.isWeekend(startDate) && hours === 21
        const isNormalDayAt11PM = hours === 23
        return isWeekend ? [30] : isNormalDayAt11PM ? [30] : []
    }
}
