import * as dayjs from 'dayjs'
import { BookingService } from 'src/app/booking.service'

export class BookingUtility {
    constructor() { }
    static getEnableHours(startDate: Date, startTime: Date, endDate: Date): number[] {
        const rangeDisableHoursOnEnd = BookingService.rangeDisabledHoursOnEnd(
            startDate,
            startTime,
            endDate
        )
        const enableHours = []
        for (let i = 0; i < 25; i++) {
            if (!rangeDisableHoursOnEnd.includes(i)) {
                enableHours.push(i)
            }
        }
        return enableHours
    }

    static getEnableMinutes(
        startHours: number,
        startDate: Date,
        startTime: Date,
        endDate: Date
    ): number[] {
        const rangeDisabledMinutesOnEnd = BookingService.rangeDisabledMinutesOnEnd(
            startHours,
            startDate,
            startTime,
            endDate
        )
        const enableMinutes = []
        for (let i = 0; i < 60; i++) {
            if (!rangeDisabledMinutesOnEnd.includes(i)) {
                enableMinutes.push(i)
            }
        }
        return enableMinutes
    }

    static getEnableTime(
        startHours: number,
        startDate: Date,
        startTime: Date,
        endDate: Date
    ): { [key: string]: number[] } {
        const enableHours = this.getEnableHours(startDate, startTime, endDate)
        const enableMinutes = this.getEnableMinutes(startHours, startDate, startTime, endDate)
        return { enableHours, enableMinutes }
    }

    static mergeDateTime = (date: Date, time: Date): Date => {
        const dateDayjs = dayjs(date)
        const timeDayjs = dayjs(time)
        const hours = timeDayjs.hour()
        const minutes = timeDayjs.minute()
        const newDate = dateDayjs.hour(hours).minute(minutes).toDate()
        return newDate
    }

    // static getSplitTime(time: string): string[] {
    //     return time.split(":");
    // }

    static getTimeRange(date: Date, startHour?: number): number[] {
        if (startHour) {
            if (BookingService.isWeekend(date)) {
                if(dayjs(date).day()==6){
                    return BookingService.range(9, 20)
                }
                return BookingService.range(startHour + 1, 21)
            } else {
                return BookingService.range(startHour + 1, 23)
            }
        } else {
            if (BookingService.isWeekend(date)) {
                return BookingService.range(9, 20)
            }
            return BookingService.range(18, 22)
        }

    }

    static timeOption(date: Date, time?: string): string[] {
        const hour = Number(time?.split(":")[0])
        const minute = Number(time?.split(":")[1])
        const timeRange = this.getTimeRange(date, hour)
        var times: string[] = []
        timeRange.forEach((hour, index) => {
            if (index == 0 && minute == 30) {
                times.push(hour.toString() + ":30")
            } else if (index == timeRange.length-1) {
                times.push(hour.toString() + ":00")
            } else {
                times.push(hour.toString() + ":00")
                times.push(hour.toString() + ":30")
            }
        })
        return times
    }
}
