import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import * as dayjs from 'dayjs'
import { map } from 'rxjs'
import { BookingUtility } from 'src/functions/booking.utility'
import { BookingService } from '../booking.service'

const next2WeekMinDate = dayjs().add(14, 'day')
@Component({
    selector: 'app-booking-form',
    templateUrl: './booking-form.component.html',
    styleUrls: ['./booking-form.component.css', '../app.component.css'],
})
export class BookingFormComponent implements OnInit {
    rooms: string[] = ['All Stars', 'Neon']
    minDate: Date = !BookingService.isWeekend(next2WeekMinDate.toDate())
        ? next2WeekMinDate.startOf('D').toDate()
        : next2WeekMinDate.hour(9).minute(0).toDate()
    inputValue: string = ''
    inputPhoneNumber: string = ''
    isEndTimeValid: boolean = false

    disabledHoursOnStart = () => {
        const { startDate } = this.getTimeonForm()
        return BookingService.rangeDisabledHoursOnStart(startDate)
    }

    disabledMinutesOnStart = (hours: number) => {
        const { startDate } = this.getTimeonForm()
        return BookingService.rangeDisabledMinutesOnStart(hours, startDate)
    }

    disabledHoursOnEnd = () => {
        const { startDate, startTime, endDate } = this.getTimeonForm()
        return BookingService.rangeDisabledHoursOnEnd(startDate, startTime, endDate)
    }

    disabledMinutesOnEnd = (hours: number) => {
        const { startDate, startTime, endDate } = this.getTimeonForm()
        return BookingService.rangeDisabledMinutesOnEnd(hours, startDate, startTime, endDate)
    }

    disabledDateOnStart = (current: Date): boolean => {
        return BookingService.isDisabledDateOnStart(current)
    }

    disabledDateOnEnd = (current: Date): boolean => {
        const { startDate, startTime } = this.getTimeonForm()
        return BookingService.isDisableEndDate(startDate, startTime, current)
    }

    bookingForm = new FormGroup(
        {
            fullName: new FormControl('', [Validators.required]),
            email: new FormControl('', [Validators.required, Validators.email]),
            room: new FormControl('', [Validators.required]),
            phoneNumber: new FormControl('', [
                Validators.required,
                Validators.pattern(/^0[9, 8, 6, 2][0-9]{8}$/),
            ]),
            reason: new FormControl('', [Validators.required]),
            startDate: new FormControl('', [Validators.required]),
            startTime: new FormControl(null, [Validators.required]),
            endDate: new FormControl('', [Validators.required]),
            endTime: new FormControl(null, [Validators.required]),
        },
        Validators.required
    )

    constructor(private bookingService: BookingService, private router: Router) {}

    ngOnInit(): void {
        ;['startTime', 'endDate', 'endTime'].forEach((name) =>
            this.bookingForm.get(name)?.disable({ onlySelf: true, emitEvent: false })
        )

        this.bookingForm
            .get('fullName')
            ?.valueChanges.pipe(map((v) => this.textAutoFormat(v)))
            .subscribe((v) => this.bookingForm.get('fullName')?.setValue(v, { emitEvent: false }))

        this.bookingForm
            .get('phoneNumber')
            ?.valueChanges.pipe(map((v) => this.checkPhoneNumberInput(v)))
            .subscribe((v) =>
                this.bookingForm.get('phoneNumber')?.setValue(v, { emitEvent: false })
            )

        this.bookingForm.get('startDate')?.valueChanges.subscribe((v) => {
            if (v) {
                this.bookingForm.get('startTime')?.setValue(null, { emitEvent: false })
                this.bookingForm.get('startTime')?.enable({ onlySelf: true, emitEvent: false })
                ;['endDate', 'endTime'].forEach((name) => this.onClearValue(name))
            } else {
                ;['startTime', 'endDate', 'endTime'].forEach((name) => this.onClearValue(name))
            }
        })

        this.bookingForm.get('startTime')?.valueChanges.subscribe((v) => {
            if (v) {
                const disableHoursStartTime = this.disabledHoursOnStart()
                const valueHoursTime = dayjs(v).hour()
                const valueMinutesTime = dayjs(v).minute()
                const disableMinutesStartTime = this.disabledMinutesOnStart(valueHoursTime)

                this.bookingForm.get('endDate')?.enable({ onlySelf: true, emitEvent: false })
                // Mon-Fri startime <= 6
                if (dayjs(v).hour() <= 6) {
                    const { startDate } = this.getTimeonForm()
                    this.bookingForm.get('endTime')?.enable({ onlySelf: true, emitEvent: false })
                    this.bookingForm.get('endDate')?.setValue(dayjs(startDate).toDate(), {
                        emitEvent: false,
                    })
                } else if (
                    disableHoursStartTime.includes(valueHoursTime) ||
                    disableMinutesStartTime.includes(valueMinutesTime)
                ) {
                    this.bookingForm.get('startTime')?.setValue(null, { emitEvent: false })
                    ;['endDate', 'endTime'].forEach((name) => this.onClearValue(name))
                }
            } else {
                ;['endDate', 'endTime'].forEach((name) => this.onClearValue(name))
            }
        })

        this.bookingForm.get('endDate')?.valueChanges.subscribe((v) => {
            if (v) {
                this.bookingForm.get('endTime')?.setValue(null, { emitEvent: false })
                this.bookingForm.get('endTime')?.enable({ onlySelf: true, emitEvent: false })
            } else {
                this.onClearValue('endTime')
            }
        })
        this.bookingForm.get('endTime')?.valueChanges.subscribe((v) => {
            const { startDate, startTime, endDate } = this.getTimeonForm()
            const startHours = dayjs(startTime).hour()
            if (v) {
                const { enableHours, enableMinutes } = BookingUtility.getEnableTime(
                    startHours,
                    startDate,
                    startTime,
                    endDate
                )
                const minHours = Math.min(...enableHours)
                const maxHours = Math.max(...enableHours)

                const disableHoursEndTime = this.disabledHoursOnEnd()
                const valueEndHours = dayjs(v).hour()
                const valueEndMinutes = dayjs(v).minute()
                const disableMinutesEndTime = this.disabledMinutesOnEnd(valueEndHours)

                if (dayjs(v).hour() === minHours && !enableMinutes.includes(dayjs(v).minute())) {
                    const startTimeWithMinute = dayjs(startTime).add(1, 'minute').minute()
                    const time = dayjs(v).minute(0).add(startTimeWithMinute, 'minute').toDate()
                    this.bookingForm.get('endTime')?.setValue(time, { emitEvent: false })
                } else if (dayjs(v).hour() === maxHours) {
                    const zeroMinute = dayjs(v).minute(0).toDate()
                    this.bookingForm.get('endTime')?.setValue(zeroMinute, { emitEvent: false })
                } else if (
                    disableHoursEndTime.includes(valueEndHours) ||
                    disableMinutesEndTime.includes(valueEndMinutes)
                ) {
                    this.bookingForm.get('endTime')?.setValue(null, { emitEvent: false })
                }
            }
        })

        const currentBooking = this.bookingService.getCurrentBooking()
        if (currentBooking) {
            const startDate = dayjs(currentBooking.startDate)
            const endDate = dayjs(currentBooking.endDate)

            this.bookingForm.setValue({
                fullName: currentBooking.fullName,
                email: currentBooking.email,
                room: currentBooking.room,
                phoneNumber: currentBooking.phoneNumber,
                reason: currentBooking.reason,
                startDate: startDate.toDate(),
                endDate: endDate.toDate(),
                startTime: startDate.toDate(),
                endTime: endDate.toDate(),
            })
            this.inputValue = this.textAutoFormat(currentBooking.fullName)
            this.inputPhoneNumber = this.textAutoFormat(currentBooking.phoneNumber)
        }
    }

    onSubmit() {
        const { startDate, startTime, endDate, endTime } = this.getTimeonForm()
        const startDateTime = BookingUtility.mergeDateTime(startDate, startTime)
        this.bookingForm.value.startDate = this.convertDateToString(startDateTime)

        const endDateTime = BookingUtility.mergeDateTime(endDate, endTime)
        this.bookingForm.value.endDate = this.convertDateToString(endDateTime)
        this.bookingService.saveBooking(this.bookingForm.value)
        this.router.navigateByUrl('preview')
    }

    onClearValue(formName: string): void {
        this.bookingForm.get(formName)?.setValue(null, { emitEvent: false })
        this.bookingForm.get(formName)?.disable({ onlySelf: true, emitEvent: false })
    }

    textAutoFormat(term: string): string {
        let nameFormatter = term.toLowerCase().split(' ')
        for (let _i = 0; _i < nameFormatter.length; _i++) {
            nameFormatter[_i] =
                nameFormatter[_i].charAt(0).toUpperCase() + nameFormatter[_i].substring(1)
        }
        return nameFormatter.join(' ')
    }

    checkPhoneNumberInput(term: string): string {
        const pattern = /^[0-9]*$/
        let phoneNumberFormatted = term
        if (!pattern.test(phoneNumberFormatted)) {
            phoneNumberFormatted = phoneNumberFormatted.replace(/[^0-9]/g, '')
        }
        return phoneNumberFormatted
    }

    convertDateToString(date: Date): string {
        if (!date) return ''
        const next2WeekDate = dayjs(date).add(14, 'day').toDate()
        return dayjs(next2WeekDate).format('YYYY-MM-DDTHH:mm')
    }

    getFormValue = (formControlName: string) => {
        return this.bookingForm.get(formControlName)?.value
    }

    getTimeonForm = () => {
        const startDate = this.getFormValue('startDate')
        const startTime = this.getFormValue('startTime')
        const endDate = this.getFormValue('endDate')
        const endTime = this.getFormValue('endTime')
        return { startDate, startTime, endDate, endTime }
    }
}
