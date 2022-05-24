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
  minDate: Date = dayjs().add(14, 'day').hour(18).minute(0).toDate();
  inputvalue: string = '';
  inputPhoneNumber: string = '';
  @Input() uid!: string;
  timeOption = { nzFormat: 'HH:mm' };

  range(start: number, end: number): number[] {
    const result: number[] = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  }

  disabledDateOnStart = (current: Date): boolean => {
    const endDate = this.bookingForm.get('endDate')?.value;
    if (endDate)
      return (
        dayjs().add(14, 'day').isAfter(current, 'date') ||
        dayjs(current).isAfter(dayjs(endDate))
      );
    return dayjs().add(14, 'day').isAfter(current, 'date');
  };

  disabledDateOnEnd = (current: Date): boolean => {
    const startDate = this.bookingForm.get('startDate')?.value;
    if (startDate)
      return (
        dayjs(current).add(1,'day').isBefore(dayjs(startDate)) || dayjs(current).add(-1,'day').isAfter(dayjs(startDate))
      );
    return dayjs().add(14, 'day').isAfter(current, 'date');
  };
  // Can not select days before today and today
  // differenceInCalendarDays(current, this.today) > 0;

  disabledDateTime: DisabledTimeFn = (_value) => ({
    nzDisabledHours: () => {
      const endDate = this.bookingForm.get('endDate')?.value;
      return this.range(7, 18);
    },
    nzDisabledMinutes: () => {
      if (_value) {
        if (dayjs(_value as Date).hour() === 6) return this.range(1, 60);
        return [];
      }
      return [];
    },
    nzDisabledSeconds: () => [],
  });

  

  disabledDateTimeOnEnd: DisabledTimeFn = (_value) => ({
    nzDisabledHours: () => {
      const startDate = this.bookingForm.get('startDate')?.value;
      if (
        startDate &&
        dayjs(_value as Date).isBefore(dayjs(startDate), 'millisecond')
      ) {
        return [
          ...this.range(0, dayjs(startDate).hour()),
          ...this.range(7, 18),
        ];
      }
      return this.range(7, 18);
    },
    nzDisabledMinutes: () => {
      const startDate = this.bookingForm.get('startDate')?.value;
      const endHours = dayjs(_value as Date).hour();

      if (startDate && dayjs(_value as Date).isSame(dayjs(startDate), 'D')) {
        return !dayjs(_value as Date).isSame(dayjs(startDate), 'h')
          ? []
          : [...this.range(0, dayjs(startDate).minute() + 1)];
      }
      if (_value) {
        if (endHours === 6) return this.range(1, 60);
        return [];
      }
      return [];
    },
    nzDisabledSeconds: () => [],
  });

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
      endDate: new FormControl('', [Validators.required]),
      startTime: new FormControl('', [Validators.required]),
    },
    Validators.required
  );

  constructor(
    private bookingService: BookingService,
    private router: Router
  ) {}

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

    const currentBooking = this.bookingService.getCurrentBooking();
    if (currentBooking) {
      this.bookingForm.setValue({
        name: currentBooking.name,
        email: currentBooking.email,
        room: currentBooking.room,
        phoneNumber: currentBooking.phoneNumber,
        reason: currentBooking.reason,
        startDate: currentBooking.startDate,
        endDate: currentBooking.endDate,
      });
      this.inputvalue = this.textAutoFormat(currentBooking.name);
      this.inputPhoneNumber = this.textAutoFormat(currentBooking.phoneNumber);

      //this.checkStartDateNEndDate();
    }
  }
  onSubmit() {
    this.bookingForm.value.startDate = this.convertDateToString(
      this.bookingForm.value.startDate
    );
    this.bookingForm.value.endDate = this.convertDateToString(
      this.bookingForm.value.endDate
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
