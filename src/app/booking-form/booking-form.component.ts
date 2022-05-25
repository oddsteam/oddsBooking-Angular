import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as dayjs from 'dayjs';
import { map } from 'rxjs';
import { BookingService } from '../booking.service';

@Component({
  selector: 'app-booking-form',
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.css'],
})

export class BookingFormComponent implements OnInit {
  rooms: string[] = ['All Stars', 'Neon'];
  minDate: Date = (dayjs().add(14, 'day').day() !== 0 || dayjs().add(14, 'day').day() !== 6) ? dayjs().add(14, 'day').startOf('D').toDate() : dayjs().add(14, 'day').hour(9).minute(0).toDate();
  inputValue: string = '';
  inputPhoneNumber: string = '';
  disabledHoursOnStart = () => {
    return BookingService.rangeDisabledHoursOnStart(this.bookingForm.get('startDate')?.value)
  };

  disabledMinutesOnStart = (hours: number) => {
    return BookingService.rangeDisabledMinutesOnStart(hours, this.bookingForm.get('startDate')?.value)
  };

  disabledHoursOnEnd = () => {
    return BookingService.rangeDisabledHoursOnEnd(this.bookingForm.get('startDate')?.value)
  };

  disabledMinutesOnEnd = (hours: number) => {
    return BookingService.rangeDisabledHoursOnEnd(this.bookingForm.get('startDate')?.value)
  };

  disabledDateOnStart = (current: Date): boolean => {
    return BookingService.isDisabledDateOnStart(current)
  };

  disabledDateOnEnd = (current: Date): boolean => {
    const startDate = this.bookingForm.get('startDate')?.value;
    return BookingService.isDisableEndDate(startDate, current)
  };

  bookingForm = new FormGroup(
    {
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      room: new FormControl('', [Validators.required]),
      phoneNumber: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]{10}'),
      ]),
      reason: new FormControl('', [Validators.required]),
      startDate: new FormControl('', [Validators.required]),
      startTime: new FormControl(null, [Validators.required]),
      endDate: new FormControl('', [Validators.required]),
      endTime: new FormControl(null, [Validators.required]),
    },
    Validators.required
  );

  constructor(private bookingService: BookingService, private router: Router) { }

  ngOnInit(): void {
    this.bookingForm
      .get('name')?.valueChanges
      .pipe(map((v) => this.textAutoFormat(v)))
      .subscribe((v) =>
        this.bookingForm.get('name')?.setValue(v, { emitEvent: false })
      );

    this.bookingForm
      .get('phoneNumber')?.valueChanges
      .pipe(map((v) => this.checkPhoneNumberInput(v)))
      .subscribe((v) =>
        this.bookingForm.get('phoneNumber')?.setValue(v, { emitEvent: false })
      );

    this.bookingForm.get('startDate')?.valueChanges.subscribe((v) => { });

    this.bookingForm.get('startTime')?.valueChanges.subscribe((v) => { });

    this.bookingForm.get('endDate')?.valueChanges.subscribe((v) => { });
    this.bookingForm.get('endTime')?.valueChanges.subscribe((v) => { });

    const currentBooking = this.bookingService.getCurrentBooking();
    if (currentBooking) {
      const startDate = dayjs(currentBooking.startDate);
      const endDate = dayjs(currentBooking.endDate);

      this.bookingForm.setValue({
        name: currentBooking.name,
        email: currentBooking.email,
        room: currentBooking.room,
        phoneNumber: currentBooking.phoneNumber,
        reason: currentBooking.reason,
        startDate: startDate.toDate(),
        endDate: endDate.toDate(),
        startTime: startDate.toDate(),
        endTime: endDate.toDate(),
      });
      this.inputValue = this.textAutoFormat(currentBooking.name);
      this.inputPhoneNumber = this.textAutoFormat(currentBooking.phoneNumber);
    }
  }

  onSubmit() {
    const startDate = dayjs(this.bookingForm.get('startDate')?.value);
    const startTime = dayjs(this.bookingForm.get('startTime')?.value);

    this.bookingForm.value.startDate = this.convertDateToString(
      startDate.hour(startTime.hour()).minute(startTime.minute()).toDate()
    );

    const endDate = dayjs(this.bookingForm.get('endDate')?.value);
    const endTime = dayjs(this.bookingForm.get('endTime')?.value);
    this.bookingForm.value.endDate = this.convertDateToString(
      endDate.hour(endTime.hour()).minute(endTime.minute()).toDate()
    );
    this.bookingService.saveBooking(this.bookingForm.value);
    this.router.navigateByUrl('preview');
  }

  textAutoFormat(term: string): string {
    let nameFormatter = term.toLowerCase().split(' ');
    for (let _i = 0; _i < nameFormatter.length; _i++) {
      nameFormatter[_i] =
        nameFormatter[_i].charAt(0).toUpperCase() +
        nameFormatter[_i].substring(1);
    }
    return nameFormatter.join(' ');
  }

  checkPhoneNumberInput(term: string): string {
    const pattern = /^[0-9]*$/;
    let phoneNumberFormatted = term;
    if (!pattern.test(phoneNumberFormatted)) {
      phoneNumberFormatted = phoneNumberFormatted.replace(/[^0-9]/g, '');
    }
    return phoneNumberFormatted;
  }

  convertDateToString(date: Date): string {
    if (!date) return '';
    const next2WeekDate = dayjs(date).add(14, 'day').toDate();
    return dayjs(next2WeekDate).format('YYYY-MM-DDTHH:mm');
  }
}

