import { Component, OnInit } from '@angular/core'
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms'
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
    //default value
    rooms: string[] = ['All Stars', 'Neon']
    minDateStart: Date = next2WeekMinDate.toDate()
    minDateEnd : Date = next2WeekMinDate.toDate()
    inputValue: string = ''
    inputReason: string = ''
    inputPhoneNumber: string = ''
    isEndTimeValid: boolean = false
    startTimeOption: string[] = []
    endTimeOption: string[] = []

    //disable datepicker
    disabledDateOnStart = (current: Date): boolean => {
        return BookingService.isDisabledDateOnStart(current, dayjs().toDate())
    }

    disabledDateOnEnd = (current: Date): boolean => {
        const { startDate } = this.getTimeOnForm()
        return BookingService.isDisableEndDate(startDate, current, dayjs().toDate())
    }

    //formControl
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
            startTime: new FormControl('', [Validators.required]),
            endDate: new FormControl('', [Validators.required]),
            endTime: new FormControl('', [Validators.required]),
        },
        Validators.required
    )

    constructor(private bookingService: BookingService, private router: Router) { }

    ngOnInit(): void {
        ;['startTime', 'endDate', 'endTime'].forEach((name) =>
            this.bookingForm.get(name)?.disable({ onlySelf: true, emitEvent: false })
        )

        this.bookingForm
            .get('fullName')
            ?.valueChanges.pipe(map((v) => this.textAutoFormat(v)))
            .subscribe((v) => this.bookingForm.get('fullName')?.setValue(v, { emitEvent: false }))

        this.bookingForm
            .get('reason')
            ?.valueChanges.pipe(map((v) => v.trimStart()))
            .subscribe((v) => this.bookingForm.get('reason')?.setValue(v, { emitEvent: false }))

        this.bookingForm.get('phoneNumber')?.valueChanges.pipe(map((v) => this.checkPhoneNumberInput(v)))
            .subscribe((v) => this.bookingForm.get('phoneNumber')?.setValue(v, { emitEvent: false }))

        //startDateSelected
        this.bookingForm.get('startDate')?.valueChanges.subscribe((v) => {
            if (v) {
                this.startTimeOption = BookingUtility.timeOption(v)
                this.endTimeOption = BookingUtility.timeOption(v, this.startTimeOption[0])
                this.bookingForm.get('startTime')?.enable({ onlySelf: true, emitEvent: false })
                this.bookingForm.get('startTime')?.setValue(this.startTimeOption[0], { emitEvent: false })
                this.bookingForm.get('endDate')?.setValue(v, { emitEvent: false })
                ;['endDate', 'endTime'].forEach((name) => this.onClearValue(name))
                this.bookingForm.get('endDate')?.enable({ onlySelf: true, emitEvent: false })
            } else {
                ;['startTime', 'endDate', 'endTime'].forEach((name) => this.onClearValue(name))
            }
        })

        //startTimeSelected
        this.bookingForm.get('startTime')?.valueChanges.subscribe((v) => {
            if (v) {
                this.endTimeOption = BookingUtility.timeOption(this.bookingForm.get("startDate")?.value,v)
            } else {
                ;['endDate', 'endTime'].forEach((name) => this.onClearValue(name))
            }
        })

        //endDateSelected
        this.bookingForm.get('endDate')?.valueChanges.subscribe((v) => {
            if (v) {
                this.bookingForm.get('endTime')?.setValue(this.endTimeOption[0],{ emitEvent: false })
                this.bookingForm.get('endTime')?.enable({ onlySelf: true, emitEvent: false })
            } else {
                this.onClearValue('endTime')
            }
        })

        this.bookingForm.get('endTime')?.valueChanges.subscribe((v) => {
            if (v) {
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
        const { startDate, startTime, endDate, endTime } = this.getTimeOnForm()
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
        let nameFormatter = term.trimStart().toLowerCase().split(' ')
        for (let _i = 0; _i < nameFormatter.length; _i++) {
            nameFormatter[_i] =
                nameFormatter[_i].charAt(0).toUpperCase() + nameFormatter[_i].substring(1)
        }
        return nameFormatter.join(' ')
    }

    checkReasonInput(term: string) {
        let reasonFormatter = term.trim()
        return reasonFormatter
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
        const next2WeekDate = dayjs(date).toDate()
        return dayjs(next2WeekDate).format('YYYY-MM-DDTHH:mm')
    }

    getFormValue = (formControlName: string) => {
        return this.bookingForm.get(formControlName)?.value
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

    private getCustomTime(hour: number, minute: number): Date {
        return dayjs().set('hour', hour).set('minute', minute).toDate()
    }

    private getDefaultFromTime(startDate: Date): Date {
        if (BookingService.isWeekend(startDate)) {
            return this.getCustomTime(9, 0)
        }
        return this.getCustomTime(18, 0)
    }

    private getDefaultToTime(startDate: Date, startTime: Date, endDate: Date): Date {
        if (!dayjs(endDate).isSame(startDate, 'date')) {
            if (endDate.getDay() == 0) {
                return this.getCustomTime(21, 0)
            }
            return this.getCustomTime(6, 0)
        } else {
            if (BookingService.isWeekend(startDate) && BookingService.isWeekend(endDate)) {
                return this.getCustomTime(21, 0)
            } else if (
                !BookingService.isWeekend(startDate) &&
                !BookingService.isWeekend(endDate) &&
                startTime.getHours() < 6
            ) {
                return this.getCustomTime(6, 0)
            }
            return this.getCustomTime(23, 59)
        }
    }
}
