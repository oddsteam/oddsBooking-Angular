import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { BookingService } from '../booking.service';
import { DetailService } from '../detail.service';

@Component({
  selector: 'app-booking-form',
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.css'],
})
export class BookingFormComponent implements OnInit {
  rooms: string[] = ['All Stars', 'Neon'];
  minDate: string = '';
  inputvalue: string = '';
  isRealValid: boolean = false;
  @Input() uid!: string;

  bookingForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    room: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10}')]),
    reason: new FormControl('', [Validators.required]),
    startDate: new FormControl('', [Validators.required]),
    endDate: new FormControl('', [Validators.required]),
  }, Validators.required);

  name = ""
  constructor(private bookingService: BookingService, private detailService: DetailService
    , private router: Router) { }

  ngOnInit(): void {
    //this.setMinDate();
    this.minDate = this.setMinDate(new Date());
    console.log(this.minDate);
    this.bookingForm.get('name')?.valueChanges
      .pipe(
        map(v => this.textAutoFormat(v))
      ).subscribe(
        v => this.bookingForm.get('name')?.setValue(v, { emitEvent: false })
      );

    // this.bookingForm.get('name')?.valueChanges
    //   .subscribe(
    //     v => this.bookingForm.get('name')?.setValue(this.transform(v), {emitEvent : false})
    //   );

    const currentBooking = this.bookingService.getCurrentBooking();
    if (currentBooking) {

      this.bookingForm.setValue(
        {
          name: currentBooking.name,
          email: currentBooking.email,
          room: currentBooking.room,
          phoneNumber: currentBooking.phoneNumber,
          reason: currentBooking.reason,
          startDate: currentBooking.startDate,
          endDate: currentBooking.endDate
        }
      );
      this.inputvalue = this.textAutoFormat(currentBooking.name);

      //this.checkStartDateNEndDate();
    }
  }
  onSubmit() {
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

  setMinDate(date : Date): string {
    var next2WeekDate = new Date();
    next2WeekDate.setDate(date.getDate() + 14);

    var next2WeekDateString = "";
    var strDate = next2WeekDate.getDate() < 10 ? "0" + next2WeekDate.getDate() : next2WeekDate.getDate();
    var strMonth = next2WeekDate.getMonth() < 10 ? "0" + (next2WeekDate.getMonth() + 1) : (next2WeekDate.getMonth() + 1);
    var strYear = next2WeekDate.getFullYear();
    var strHours = next2WeekDate.getHours() < 10 ? "0" + (next2WeekDate.getHours()) : (next2WeekDate.getHours());
    var strMinutes = next2WeekDate.getMinutes() < 10 ? "0" + next2WeekDate.getMinutes() : next2WeekDate.getMinutes();

    next2WeekDateString = strYear + "-" + strMonth + "-" + strDate + "T" + strHours + ":" + strMinutes;

    return next2WeekDateString;
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
