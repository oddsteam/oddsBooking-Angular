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
                if (!dayjs(startDate).isSame(endDate)) {
                    return BookingService.range(9, 21)
                }
                return BookingService.range(startHour + 1, 21)
            } else {
                return BookingService.range(startHour + 1, 23)
            }
        } else {
            if (BookingService.isWeekend(startDate)) {
                return BookingService.range(9, 20)
            }
            return BookingService.range(18, 22)
        }
    }

    //เขียน test --> เช็คขอบบนขอบล่าง --> cover case? : เขียนแบบ map
    //ปรับเวลาวันอาทิตย์ 9:30
    static timeOption(
        startDate: Date,
        time?: string,
        endDate?: Date
    ): { time: string; duration: string }[] {
        const hour = Number(time?.split(':')[0])
        const minute = Number(time?.split(':')[1])
        const timeRange = this.getTimeRange(startDate, hour, endDate)
        let times: { time: string; duration: string }[] = []

        timeRange.forEach((hour, index) => {
            if (
                (index === 0 && minute === 30) ||
                (index === 0 && !dayjs(startDate).isSame(endDate) && dayjs(endDate).day() === 0)
            ) {
                times.push({
                    time: hour.toString() + ':30',
                    duration: this.getDuration(minute, 30, index),
                })
            } else if (index === timeRange.length - 1) {
                times.push({
                    time: hour.toString() + ':00',
                    duration: this.getDuration(minute, 0, index),
                })
            } else {
                times.push({
                    time: hour.toString() + ':00',
                    duration: this.getDuration(minute, 0, index),
                })
                times.push({
                    time: hour.toString() + ':30',
                    duration: this.getDuration(minute, 30, index),
                })
            }
        })
        return times
    }

    static getDuration(startMin: number, minute: number, index: number): string {
        if (startMin === 0) {
            if (index === 0) {
                return minute === 30 ? String(index + 1.5) + ' hrs' : String(index + 1) + ' hr'
            } else {
                return minute === 30 ? String(index + 1.5) + ' hrs' : String(index + 1) + ' hrs'
            }
        } else {
            if (index === 0) {
                return minute === 30 ? String(index + 1) + ' hrs' : String(index + 0.5) + ' hr'
            } else {
                return minute === 30 ? String(index + 1) + ' hrs' : String(index + 0.5) + ' hrs'
            }
        }
    }
}
