import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { BookingDetail } from './booking'

import { map } from 'rxjs/operators'
import { environment } from 'src/environments/environment'
import * as dayjs from 'dayjs'
@Injectable({
    providedIn: 'root',
})
export class BookingService {
    private bookingUrl = `${environment.apiUrl}/v1/booking`

    uid: any
    currentBooking?: BookingDetail
    constructor(private httpClient: HttpClient) {}

    httpOption = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    }

    addBooking(booking: BookingDetail): Observable<string> {
        console.log('This is Service')
        console.log(booking)
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

    static isDisableEndDate(startDate: Date | null, startTime: Date, current: Date): boolean {
        if (startDate) {
            const startDateDayjs = dayjs(startDate)
            if (this.isWeekend(startDate)) {
                if (dayjs(startDate).day() === 6) {
                    return (
                        startDateDayjs.add(1, 'day').isBefore(dayjs(current)) ||
                        !dayjs(current).add(1, 'day').isAfter(startDateDayjs, 'date')
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
                            startDateDayjs.add(1, 'day').isBefore(dayjs(current)) ||
                            !dayjs(current).add(1, 'day').isAfter(startDateDayjs, 'date')
                        )
                    }
                }
            }
            return (
                startDateDayjs.add(1, 'day').isBefore(dayjs(current)) ||
                !dayjs(current).add(1, 'day').isAfter(startDateDayjs, 'date')
            )
        }
        return dayjs().add(14, 'day').isAfter(current, 'date')
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
        return []
    }

    static rangeDisabledHoursOnEnd(startDate: Date): number[] {
        if (this.isWeekend(startDate)) {
            return this.range(0, 9).concat(this.range(22, 24))
        }
        return this.range(7, 18)
    }

    static rangeDisabledMinutesOnEnd(hours: number, startDate: Date): number[] {
        if (
            (this.isWeekend(startDate) && hours === 21) ||
            (!this.isWeekend(startDate) && hours === 6)
        ) {
            return this.range(1, 60)
        }
        return []
    }

    static isDisabledDateOnStart(current: Date): boolean {
        return dayjs().add(14, 'day').isAfter(current, 'date')
    }
}
