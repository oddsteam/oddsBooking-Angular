import * as dayjs from 'dayjs'
import { BookingService } from 'src/app/booking.service'

export class BookingUtility {
    constructor() {}
    static getEnableHours(startTime: Date): number[] {
        const rangeDisableHoursOnEnd = BookingService.rangeDisabledHoursOnEnd(startTime)
        const enableHours = []
        for (let i = 0; i < 25; i++) {
            if (!rangeDisableHoursOnEnd.includes(i)) {
                enableHours.push(i)
            }
        }
        return enableHours
    }

    static isTimeDiff30Minutes(startTime: Date, endTime: Date): boolean {
        return dayjs(endTime).diff(dayjs(startTime), 'minute') === 30
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
