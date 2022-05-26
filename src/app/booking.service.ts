import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { BookingDetail } from './booking'

import { map } from 'rxjs/operators'
import { environment } from 'src/environments/environment'
import * as dayjs from 'dayjs'
import * as isBetween from 'dayjs/plugin/isBetween'

dayjs.extend(isBetween)
@Injectable({
    providedIn: 'root',
})
export class BookingService {
    private bookingUrl = `${environment.apiUrl}/v1/booking`

    currentBooking?: BookingDetail
    constructor(private httpClient: HttpClient) {}

    httpOption = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    }

    addBooking(booking: BookingDetail): Observable<string> {
        console.log('This is Service')
        console.log(booking)
        booking.status = false;
        return this.httpClient
            .post<BookingDetail>(this.bookingUrl, booking, this.httpOption)
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
        for (let i = start; i < end; i++) {
            result.push(i)
        }
        return result
    }

    static isWeekend(day: Date): boolean {
        return dayjs(day).day() === 0 || dayjs(day).day() === 6
    }

    static isDisabledDateOnStart(current: Date): boolean {
        return this.getAvailableStartDate(current)
    }

    static rangeDisabledHoursOnStart(startDate: Date): number[] {
        if (!this.isWeekend(startDate)) {
            if (dayjs(startDate).day() === 1) {
                return this.range(0, 18)
            }
            return this.range(6, 18)
        }
        return this.range(0, 9).concat(this.range(21, 24))
    }

    static rangeDisabledMinutesOnStart(hours: number, startDate: Date): number[] {
        if (
            (this.isWeekend(startDate) && hours === 21) ||
            (!this.isWeekend(startDate) && hours === 6)
        ) {
            return this.range(1, 60)
        }
        if (hours === undefined) return this.range(0, 60)
        return []
    }

    static isDisableEndDate(startDate: Date | null, startTime: Date, current: Date): boolean {
        if (startDate) {
            const startDateDayjs = dayjs(startDate)
            if (this.isWeekend(startDate)) {
                if (dayjs(startDate).day() === 6) {
                    return (
                        this.getAvailableEndDate(startDateDayjs, current)
                    )
                }
                return !dayjs(current).isSame(startDateDayjs, 'date')
            } else {
                if (startTime) {
                    const startTimeDayjs = dayjs(startTime)
                    if (dayjs(startTimeDayjs).hour() <= 6) {
                        return (
                            startDateDayjs.isBefore(dayjs(current)) ||
                            !dayjs(current).add(1, 'day').isAfter(startDateDayjs, 'date')
                        )
                    } else {
                        return (
                            this.getAvailableEndDate(startDateDayjs, current)
                        )
                    }
                }
            }
            return (
                this.getAvailableEndDate(startDateDayjs, current)
            )
        }
        return this.getAvailableStartDate(current)
    }

    static rangeDisabledHoursOnEnd(startDate: Date, startTime: Date, endDate: Date): number[] {
        let startTimeHoursDayJs = dayjs(startTime).get('hour')
        // Sat-Sun
        if (this.isWeekend(startDate)) {
            // start = end
            if (this.isStartDateSameAsEndDate(startDate, endDate)) {
                if (dayjs(startTime).get('minute') === 59) {
                    startTimeHoursDayJs++
                }
                return this.range(0, startTimeHoursDayJs).concat(this.range(22, 24))
            }
            // start != end
            else {
                return this.range(0, 9).concat(this.range(22, 24))
            }
        }
        // Mon-Fri
        else {
            // start = end
            if (this.isStartDateSameAsEndDate(startDate,endDate)) {
                if (dayjs(startTime).get('minute') === 59) {
                    startTimeHoursDayJs++
                }
                if (startTimeHoursDayJs <= 6) {
                    return this.range(0, startTimeHoursDayJs).concat(this.range(7, 24))
                } else {
                    return this.range(0, startTimeHoursDayJs)
                }
            }
            // start != end
            else {
                return this.range(7, 24)
            }
        }
    }

    static rangeDisabledMinutesOnEnd(
        hours: number,
        startDate: Date,
        startTime: Date,
        endDate: Date
    ): number[] {
        if (
            this.isStartDateSameAsEndDate(startDate, endDate) &&
            hours === dayjs(startTime).get('hour')
        ) {
            return this.range(0, dayjs(startTime).add(1, 'm').get('minute'))
        } else {
            if (
                (this.isWeekend(startDate) && hours === 21) ||
                (!this.isWeekend(startDate) && hours === 6)
            ) {
                return this.range(1, 60)
            }
        }
        if (hours === undefined) return this.range(0, 60)
        return []
    }

    private static isStartDateSameAsEndDate(startDate: Date, endDate: Date) {
        return dayjs(startDate).isSame(endDate, 'date')
    }

    private static getAvailableEndDate(startDateDayjs: dayjs.Dayjs, current: Date): boolean {
        return !dayjs(current).isBetween(startDateDayjs,startDateDayjs.add(1, 'd') , 'day', '[]')
        // return startDateDayjs.add(1, 'day').isBefore(dayjs(current)) ||
        //     !dayjs(current).add(1, 'day').isAfter(startDateDayjs, 'date')
    }

    private static getAvailableStartDate(current: Date): boolean {
        return dayjs().add(14, 'day').isAfter(current, 'date')
    }

    
}
