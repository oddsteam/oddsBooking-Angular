import * as dayjs from 'dayjs'
import { BookingService } from 'src/app/booking.service'

type TimeOptionResponse = { time: string; duration: string }[]
export class BookingUtility {
    constructor() {}
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

    static mergeDateTime = (date: Date, time: string): Date => {
        const hour = Number(time.split(':')[0])
        const minute = Number(time.split(':')[1])
        return dayjs(date).hour(hour).minute(minute).second(0).toDate()
    }

    private static getTimeRange(startDate: Date, startHour?: number, endDate?: Date): number[] {
        if (startHour) {
            if (BookingService.isWeekend(startDate)) {
                if (!dayjs(startDate).isSame(endDate)) return BookingService.range(9, 21)
                return BookingService.range(startHour + 1, 21)
            }
            return BookingService.range(startHour + 1, 23)
        } else {
            if (BookingService.isWeekend(startDate)) return BookingService.range(9, 20)
            return BookingService.range(18, 22)
        }
    }

    //เขียน test --> เช็คขอบบนขอบล่าง --> cover case? : เขียนแบบ map
    //ปรับเวลาวันอาทิตย์ 9:30

    static timeOption(startDate: Date, time?: string, endDate?: Date): TimeOptionResponse {
        const hours = Number(time?.split(':')[0])
        let minutes = time ? Number(time?.split(':')[1]) : 0
        const timeRange = this.getTimeRange(startDate, hours, endDate)
        const times: TimeOptionResponse = []
        let endDateTime = dayjs(endDate).hour(hours).minute(minutes)
        const isSameDay = dayjs(startDate).isSame(endDate, 'day')
        timeRange.forEach((hour, index) => {
            // loop push 0 and 30 minutes with condition
            ;[0, 30].forEach((minute) => {
                let dateTime = dayjs(startDate).hour(hour).minute(minute)
                // if select startDate have 30 minute then don't show push index 0 and 0 minute of timeRange
                if (index === 0 && minutes === 30 && minute === 0) return
                // if isSunday then don't show push index 0 and 0 minute of timeRange
                if (!isSameDay && endDateTime.day() === 0 && minute === 0 && index === 0) return
                // don't show the last index of timeRange
                if (index === timeRange.length - 1 && minute === 30) return
                times.push({
                    time: dateTime.format('H:mm'),
                    duration: this.getDuration(dateTime, endDateTime),
                })
            })
        })
        return times
    }

    static getDuration(dateTime: dayjs.Dayjs, endDate: dayjs.Dayjs): string {
        const isSameDay = dayjs(dateTime).isSame(endDate, 'day')
        const different = dateTime.add(isSameDay ? 0 : 1, 'day').diff(endDate, 'minute', true) / 60
        let duration = isSameDay ? different : different + 12
        duration = isNaN(duration) ? 0 : duration
        return `${Math.round(duration * 10) / 10} ${duration > 1.0 ? 'hrs' : 'hr'}`
    }
}
