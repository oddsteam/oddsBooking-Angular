import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as dayjs from 'dayjs';
import { map } from 'rxjs';
import { BookingService } from '../booking.service';
import { DetailService } from '../detail.service';
import { DisabledTimeFn } from 'ng-zorro-antd/date-picker';

@Component({
  selector: 'app-booking-form',
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.css'],
})
export class BookingFormComponent implements OnInit {
  rooms: string[] = ['All Stars', 'Neon'];
  minDate: Date =
    dayjs().add(14, 'day').day() !== 0 || dayjs().add(14, 'day').day() !== 6
      ? dayjs().add(14, 'day').startOf('D').toDate()
      : dayjs().add(14, 'day').hour(9).minute(0).toDate();
  inputvalue: string = '';
  inputPhoneNumber: string = '';
  @Input() uid!: string;

  range(start: number, end: number): number[] {
    const result: number[] = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  }

  nzDisabledHoursOnStart = () => {
    return this.range(7, 18);
  };

  nzDisabledMinutesOnStart = (hours: number) => {
    if (hours === 6) return this.range(1, 60);
    return [];
  };

  nzDisabledHoursOnEnd = () => {
    return this.range(7, 18);
  };

  nzDisabledMinutesOnEnd = (hours: number) => {
    if (hours === 6) return this.range(1, 60);
    return [];
  };

  disabledDateOnStart = (current: Date): boolean => {
    const endDate = this.bookingForm.get('endDate')?.value;
    if (endDate) return dayjs().add(14, 'day').isAfter(current, 'date');
    return dayjs().add(14, 'day').isAfter(current, 'date');
  };

  disabledDateOnEnd = (current: Date): boolean => {
    const startDate = this.bookingForm.get('startDate')?.value;
    if (startDate) {
      const startDateDayjs = dayjs(startDate);
      const dayInWeek = dayjs(startDate).day();
      if (dayInWeek === 0 || dayInWeek === 6) {
        return !dayjs(current).isSame(startDateDayjs, 'date');
      } else {
        return (
          startDateDayjs.add(1, 'day').isBefore(dayjs(current)) ||
          !dayjs(current).add(1, 'day').isAfter(startDateDayjs, 'date')
        );
      }
    }
    return dayjs().add(14, 'day').isAfter(current, 'date');
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

  constructor(private bookingService: BookingService, private router: Router) {}

  ngOnInit(): void {
    //this.setMinDate();
    this.bookingForm
      .get('name')
      ?.valueChanges.pipe(map((v) => this.textAutoFormat(v)))
      .subscribe((v) =>
        this.bookingForm.get('name')?.setValue(v, { emitEvent: false })
      );

    this.bookingForm
      .get('phoneNumber')
      ?.valueChanges.pipe(map((v) => this.checkPhoneNumberInput(v)))
      .subscribe((v) =>
        this.bookingForm.get('phoneNumber')?.setValue(v, { emitEvent: false })
      );

    // this.bookingForm.get('name')?.valueChanges
    //   .subscribe(
    //     v => this.bookingForm.get('name')?.setValue(this.transform(v), {emitEvent : false})
    //   );

    this.bookingForm.get('startDate')?.valueChanges.subscribe((v) => {});

    this.bookingForm.get('startTime')?.valueChanges.subscribe((v) => {});

    this.bookingForm.get('endDate')?.valueChanges.subscribe((v) => {});
    this.bookingForm.get('endTime')?.valueChanges.subscribe((v) => {});

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
      this.inputvalue = this.textAutoFormat(currentBooking.name);
      this.inputPhoneNumber = this.textAutoFormat(currentBooking.phoneNumber);

      //this.checkStartDateNEndDate();
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

    // var next2WeekDateString = "";
    // var strDate = next2WeekDate.getDate() < 10 ? "0" + next2WeekDate.getDate() : next2WeekDate.getDate();
    // var strMonth = next2WeekDate.getMonth() < 10 ? "0" + (next2WeekDate.getMonth() + 1) : (next2WeekDate.getMonth() + 1);
    // var strYear = next2WeekDate.getFullYear();
    // var strHours = next2WeekDate.getHours() < 10 ? "0" + (next2WeekDate.getHours()) : (next2WeekDate.getHours());
    // var strMinutes = next2WeekDate.getMinutes() < 10 ? "0" + next2WeekDate.getMinutes() : next2WeekDate.getMinutes();

    // next2WeekDateString = strYear + "-" + strMonth + "-" + strDate + "T" + strHours + ":" + strMinutes;

    // var date = currentDateTime.getDate() < 10 ? "0" + currentDateTime.getDate() : currentDateTime.getDate();
    // var month = currentDateTime.getMonth() < 10 ? "0" + (currentDateTime.getMonth() + 1) : (currentDateTime.getMonth() + 1);
    // var year = currentDateTime.getFullYear();
    // var hours = currentDateTime.getHours() < 10 ? "0" + (currentDateTime.getHours()) : (currentDateTime.getHours());
    // var minutes = currentDateTime.getMinutes() < 10 ? "0" + currentDateTime.getMinutes() : currentDateTime.getMinutes();

    // this.minDate = year + "-" + month + "-" + date + "T" + hours + ":" + minutes;

    // console.log(this.minDate);
  }
  // checkStartDateNEndDate() {
  //   this.setMinDate();
  //   var startDate: Date = this.bookingForm.get('startDate')?.value;
  //   var endDate: Date = this.bookingForm.get('endDate')?.value;

  //   var currentDateTime = new Date();
  //   var selectStartDateTime = new Date(startDate);
  //   var selectEndDateTime = new Date(endDate);

  //   if (selectStartDateTime >= currentDateTime &&
  //     selectEndDateTime >= currentDateTime &&
  //     startDate < endDate &&
  //     this.bookingForm.valid) {
  //     this.isRealValid = true;
  //   } else {
  //     this.isRealValid = false;
  //   }
  // }
}
