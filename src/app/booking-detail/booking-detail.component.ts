import { Component, Input, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup
} from '@angular/forms';
import { BookingService } from '../booking.service';
import { DetailService } from '../detail.service';
import { Router } from '@angular/router';
import { LocalStorage, LocalStorageService } from 'angular-web-storage'

@Component({
  selector: 'app-booking-detail',
  templateUrl: './booking-detail.component.html',
  styleUrls: ['./booking-detail.component.css'],
})
export class BookingDetailComponent implements OnInit {
  rooms: string[] = ['All Star', 'Neon'];
  data: any
  @Input() uid!: string;

  bookingForm = new FormGroup({
    name: new FormControl(),
    email: new FormControl(),
    room: new FormControl(),
    phoneNumber: new FormControl(),
    reason: new FormControl(),
    startDate: new FormControl(),
    endDate: new FormControl(),
  });

  constructor(private bookingService: BookingService, private detailService : DetailService
    ,private router: Router, public local: LocalStorageService ) {}

  ngOnInit(): void {}
  buttonSubmit() {
    this.bookingService
      .addBooking(this.bookingForm.value)
      .subscribe((Booking) => {
        console.log("BD component")
        console.log(Booking);
        this.router.navigate([`/detail/${Booking}`])
      });
  }
}