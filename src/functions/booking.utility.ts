import * as dayjs from 'dayjs'
import { BookingService } from 'src/app/booking.service'

export class BookingUtility {
    constructor() {}
    static getEnableHours(startDate: Date, startTime: Date, endDate: Date): number[] {
        const rangeDisableHoursOnEnd = BookingService.rangeDisabledHoursOnEnd(
            startDate,
            startTime,
            endDate
        )
        const enableHours = []
        for (let i = 0; i < 24; i++) {
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
}
