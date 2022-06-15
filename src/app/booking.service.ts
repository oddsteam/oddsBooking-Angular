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
    //test push
    currentBooking?: BookingDetail
    constructor(private httpClient: HttpClient) { }

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
        return dayjs(day).day() === 0 || dayjs(day).day() === 6
    }

    static isDisabledDateOnStart(current: Date, now: Date): boolean {
        return this.getAvailableStartDate(current, now)
    }

    static rangeDisabledHoursOnStart(startDate: Date, endDate: Date | undefined, endTime: Date | undefined): number[] {
        let futureRange: number[] = []
        const isHaveEndTime = dayjs(startDate).isSame(endDate, 'date') && endTime
        if (isHaveEndTime) {
            const startHours = dayjs(startDate).endOf('date').hour()
            const endHours = dayjs(endTime).hour()
            const endMinute = dayjs(endTime).minute()
            if (endMinute == 0) {
                futureRange = this.range(endHours, startHours)
            } else {
                futureRange = this.range(endHours + 1, startHours)
            }

        }
        if (!this.isWeekend(startDate)) {
            if (dayjs(startDate).day() === 1) {
                return [...this.range(0, 17), ...futureRange]
            }
            return [...this.range(6, 17), ...futureRange]
        }

        // let rangeDisable = [...this.range(0, 9).concat(this.range(21, 24)), ...futureRange]
        let rangeDisable = [...this.range(0, 8).concat(this.range(21, 23))]
        for (let i = 0; i < futureRange.length; ++i) {
            let found = false;
            for (let j = 0; j < rangeDisable.length; ++j) {
                if (futureRange[i] === rangeDisable[j]) {
                    found = true
                }
            }
            if (!found) {
                rangeDisable.push(futureRange[i])
            }
        }

        return [...new Set(rangeDisable)].sort((a, b) => a - b)
    }

    static rangeDisabledMinutesOnStart(
        hours: number,
        startDate: Date,
        endDate: Date,
        endTime: Date
    ): number[] {
        let futureRange: number[] = []
        const isHaveEndTime = dayjs(startDate).isSame(endDate, 'date') && endTime
        if (isHaveEndTime) {
            const endHours = dayjs(endTime).hour()
            if (hours === endHours) {
                const endMinutes = dayjs(endTime).minute()
                futureRange = this.range(endMinutes, 59)
            }
        }

        if (
            (this.isWeekend(startDate) && hours === 21) ||
            (!this.isWeekend(startDate) && hours === 6)
        ) {
            return this.range(1, 59)
        }
        if (hours === undefined) return this.range(0, 59)
        return [...futureRange]
    }

    static isDisableEndDate(startDate: Date | null, current: Date, now: Date): boolean {
        if (startDate) {
            const startDateDayjs = dayjs(startDate)
            if (this.isWeekend(startDate)) {
                if (dayjs(startDate).day() === 6) {
                    return this.getAvailableEndDate(startDateDayjs, current)
                }
                return !dayjs(current).isSame(startDateDayjs, 'date')
            } else {
                return (
                    startDateDayjs.isBefore(dayjs(current)) || !dayjs(current).add(1, 'day').isAfter(startDateDayjs, 'date')
                )
            }
            //return this.getAvailableEndDate(startDateDayjs, current)
        }
        return this.getAvailableStartDate(current, now)
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
                return this.range(0, startTimeHoursDayJs--).concat(this.range(22, 23))
            }
            // start != end
            else {
                return this.range(0, 8).concat(this.range(22, 23))
            }
        }
        // Mon-Fri
        else {
            // start = end
            if (this.isStartDateSameAsEndDate(startDate, endDate)) {
                if (dayjs(startTime).get('minute') === 59) {
                    startTimeHoursDayJs++
                }
                if (startTimeHoursDayJs <= 6) {
                    return this.range(0, startTimeHoursDayJs--).concat(this.range(7, 23))
                } else {
                    return this.range(0, startTimeHoursDayJs--)
                }
            }
            // start != end
            else {
                return this.range(7, 23)
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
            return this.range(0, dayjs(startTime).get('minute'))
        } else {
            if (
                (this.isWeekend(startDate) && hours === 21) ||
                (!this.isWeekend(startDate) && hours === 6)
            ) {
                return this.range(1, 59)
            }
        }
        if (hours === undefined) return this.range(0, 59)
        return []
    }

    private static isStartDateSameAsEndDate(startDate: Date, endDate: Date) {
        return dayjs(startDate).isSame(endDate, 'date')
    }

    private static getAvailableEndDate(startDateDayjs: dayjs.Dayjs, current: Date): boolean {
        return !dayjs(current).isBetween(startDateDayjs, startDateDayjs.add(1, 'd'), 'day', '[]')
        // return startDateDayjs.add(1, 'day').isBefore(dayjs(current)) ||
        //     !dayjs(current).add(1, 'day').isAfter(startDateDayjs, 'date')
    }

    private static getAvailableStartDate(dateOnCalendar: Date, today: Date): boolean {
        //dayjs(now: date)
        return dayjs(today).add(14, 'day').isAfter(dateOnCalendar, 'date')
    }
}
