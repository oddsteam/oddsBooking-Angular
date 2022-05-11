import { Component, OnInit } from '@angular/core';
import {
  FormArray, FormControl,
  FormGroup
} from '@angular/forms';
import { BookingService } from '../booking.service';

@Component({
  selector: 'app-booking-detail',
  templateUrl: './booking-detail.component.html',
  styleUrls: ['./booking-detail.component.css'],
})
export class BookingDetailComponent implements OnInit {
  rooms: string[] = ['All Star', 'Neon'];

  bookingForm = new FormGroup({
    name: new FormControl(),
    email: new FormControl(),
    room: new FormControl(),
    phoneNumber: new FormControl(),
    reason: new FormControl(),
    dateStart: new FormControl(),
    dateEnd: new FormControl(),
  });

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {}
  buttonSubmit() {
    console.log('This is Component.ts');
    console.log(this.bookingForm.value);
    console.log('This is Component.ts');
    this.bookingService
      .addBooking(this.bookingForm.value)
      .subscribe((Booking) => {
        console.log(Booking);
      });
  }
}
