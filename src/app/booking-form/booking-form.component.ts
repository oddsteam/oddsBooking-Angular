import { Component, Input, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators
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
    name: new FormControl('',[Validators.required]),
    email: new FormControl('',[Validators.required,Validators.email]),
    room: new FormControl('',[Validators.required]),
    phoneNumber: new FormControl('',[Validators.required,Validators.pattern('^[0-9]{10}')]),
    reason: new FormControl('',[Validators.required]),
    startDate: new FormControl('',[Validators.required]),
    endDate: new FormControl('',[Validators.required]),
  },Validators.required);

  name = ""
  constructor(private bookingService: BookingService, private detailService : DetailService
    ,private router: Router) {}

  ngOnInit(): void {
    
  }
  buttonSubmit() {
    this.bookingService
      .saveBooking(this.bookingForm.value);
    this.router.navigateByUrl("preview");
  }
  // isEnable(){
  //   if(this.name != ""){
  //     return true
  //   }
  // }
}