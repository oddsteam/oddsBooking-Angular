import { Component, Input, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup
} from '@angular/forms';
import { Router } from '@angular/router';
import { BookingService } from '../booking.service';
import { DetailService } from '../detail.service';

@Component({
  selector: 'app-booking-form',
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.css'],
})
export class BookingFormComponent implements OnInit {
  rooms: string[] = ['All Stars', 'Neon'];
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
    ,private router: Router) {}

  ngOnInit(): void {}
  buttonSubmit() {
    this.bookingService
      .addBooking(this.bookingForm.value)
      .subscribe((booking) => {
        this.router.navigate([`/detail/${booking}`])
      });
  }
}