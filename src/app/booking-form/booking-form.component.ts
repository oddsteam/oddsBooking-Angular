import { Component, OnInit } from '@angular/core'
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import * as dayjs from 'dayjs'
import { map } from 'rxjs'
import { BookingUtility } from 'src/functions/booking.utility'
import { BookingValidate } from 'src/functions/booking.validate'
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
    inputReason: string = ''
    inputPhoneNumber: string = ''
    isEndTimeValid: boolean = false
    minuteStep: number = 30

    disabledDateOnStart = (current: Date): boolean => {
        return BookingService.isDisabledDateOnStart(current, dayjs().toDate())
    }

    disabledHoursOnStart = () => {
        const { startDate, endDate, endTime } = this.getTimeOnForm()
        return BookingService.rangeDisabledHoursOnStart(startDate, endDate, endTime)
    }

    disabledMinutesOnStart = (hours: number) => {
        const { startDate } = this.getTimeOnForm()
        return BookingService.rangeDisabledMinutesOnStart(hours, startDate)
    }

    disabledDateOnEnd = (current: Date): boolean => {
        const { startDate } = this.getTimeOnForm()
        return BookingService.isDisableEndDate(startDate, current, dayjs().toDate())
    }

    disabledHoursOnEnd = () => {
        const { startTime, startDate, endDate } = this.getTimeOnForm()
        const dateAtStart = (startDate as Date).getDate()
        const monthAtStart = (startDate as Date).getMonth()
        const yearAtStart = (startDate as Date).getFullYear()
        let nStartTime =  dayjs(startTime).date(dateAtStart).month(monthAtStart).year(yearAtStart).toDate()
        return BookingService.rangeDisabledHoursOnEnd(nStartTime, endDate)
    }
    
    disabledMinutesOnEnd = (hours: number) => {
        const { startDate } = this.getTimeOnForm()
        return BookingService.rangeDisabledMinutesOnEnd(hours, startDate)
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
            ?.valueChanges.pipe(map((v) => BookingValidate.textAutoFormat(v)))
            .subscribe((v) => this.setValue('fullName', v))

        this.bookingForm
            .get('reason')
            ?.valueChanges.pipe(map((v) => v.trimStart()))
            .subscribe((v) => this.setValue('reason', v))

        this.bookingForm
            .get('phoneNumber')
            ?.valueChanges.pipe(map((v) => BookingValidate.checkPhoneNumberInput(v)))
            .subscribe((v) => this.setValue('phoneNumber', v))

        this.bookingForm.get('startDate')?.valueChanges.subscribe((v) => {
            const chainControlName = ['startTime', 'endDate', 'endTime']
            if (v) {
                this.setValue('startTime', BookingValidate.getDefaultFromTime(v))
                const { startDate, startTime } = this.getTimeOnForm()
                ;['endDate', 'endTime'].forEach((name) => this.onClearValue(name))
                this.setValue('endDate', v)
                this.enableForm(chainControlName)
                this.setValue('endTime', BookingValidate.getDefaultToTime(startDate, startTime, v))
            } else {
                chainControlName.forEach((name) => this.onClearValue(name))
            }
        })

        this.bookingForm.get('startTime')?.valueChanges.subscribe((v) => {
            if (v) {
                const disableHoursStartTime = this.disabledHoursOnStart()
                const valueHoursTime = dayjs(v).hour()
                const valueMinutesTime = dayjs(v).minute()
                const { startDate, endTime } = this.getTimeOnForm()

                // typing validate check
                const isIncludeTime =
                    disableHoursStartTime.includes(valueHoursTime) ||
                    ![0, 30].includes(valueMinutesTime)

                this.enableForm('endDate')
                // Mon-Fri startime <= 6
                if (dayjs(v).hour() <= 6) {
                    this.enableForm('endTime')
                    this.setValue('endTime', BookingValidate.getCustomTime(6, 0))
                    this.setValue('endDate', startDate)
                }
                if (isIncludeTime) {
                    this.setValue('startTime', null)
                    ;['endDate', 'endTime'].forEach((name) => this.onClearValue(name))
                }

                if (endTime && BookingUtility.isTimeDiff30Minutes(v, endTime)) {
                    const endTimeadd30Minutes = dayjs(endTime).add(30, 'minute').toDate()
                    this.setValue('endTime', endTimeadd30Minutes)
                }
            } else {
                ;['endDate', 'endTime'].forEach((name) => this.onClearValue(name))
            }
        })

        this.bookingForm.get('endDate')?.valueChanges.subscribe((v) => {
            if (!v) this.onClearValue('endTime')
        })

        this.bookingForm.get('endTime')?.valueChanges.subscribe((v) => {
            if (v) {
                const { startTime } = this.getTimeOnForm()
                const disableHoursEndTime = this.disabledHoursOnEnd()
                const valueEndHours = dayjs(v).hour()
                const valueEndMinutes = dayjs(v).minute()

                // typing validate check
                const isIncludeTime =
                    disableHoursEndTime.includes(valueEndHours) ||
                    ![0, 30].includes(valueEndMinutes)

                if (isIncludeTime) {
                    this.setValue('endTime', null)
                } else if (startTime && BookingUtility.isTimeDiff30Minutes(startTime, v)) {
                    const endTimeadd30Minutes = dayjs(startTime).subtract(30, 'minute').toDate()
                    this.setValue('startTime', endTimeadd30Minutes)
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
            this.inputValue = BookingValidate.textAutoFormat(currentBooking.fullName)
            this.inputPhoneNumber = BookingValidate.textAutoFormat(currentBooking.phoneNumber)
        }
    }

    onSubmit() {
        const { startDate, startTime, endDate, endTime } = this.getTimeOnForm()
        const startDateTime = BookingUtility.mergeDateTime(startDate, startTime)
        this.bookingForm.value.startDate = BookingValidate.convertDateToString(startDateTime)

        const endDateTime = BookingUtility.mergeDateTime(endDate, endTime)
        this.bookingForm.value.endDate = BookingValidate.convertDateToString(endDateTime)
        this.bookingService.saveBooking(this.bookingForm.value)
        this.router.navigateByUrl('preview')
    }

    onClearValue(formControlName: string): void {
        this.setValue(formControlName, null)
        this.bookingForm.get(formControlName)?.disable({ onlySelf: true, emitEvent: false })
    }

    getFormValue = (formControlName: string) => {
        return this.bookingForm.get(formControlName)?.value
    }

    setValue(formControlName: string, value?: string | number | Date | null) {
        return this.bookingForm.get(formControlName)?.setValue(value, { emitEvent: false })
    }

    enableForm = (formControlName: string | string[]) => {
        if (Array.isArray(formControlName)) {
            formControlName.forEach((name) => this.enableForm(name))
        } else {
            const formControl = this.bookingForm.get(formControlName)
            formControl?.enable({ onlySelf: true, emitEvent: false })
        }
    }

    getTimeOnForm = () => {
        const startDate = this.getFormValue('startDate')
        const startTime = this.getFormValue('startTime')
        const endDate = this.getFormValue('endDate')
        const endTime = this.getFormValue('endTime')
        return { startDate, startTime, endDate, endTime }
    }

    get phoneNumber() {
        return this.bookingForm.get('phoneNumber') as FormArray
    }
}
