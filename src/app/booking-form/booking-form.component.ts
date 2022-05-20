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
  minDate: string = "";
  inputvalue: string = '';
  isRealValid: boolean = false;
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
    this.setMinDate();
    if(this.bookingService.getCurrentBooking()){
      var currentBooking = this.bookingService.getCurrentBooking();
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
      this.inputvalue = this.transform(currentBooking.name);
      this.checkStartDateNEndDate();
    }
  }
  buttonSubmit() {
    this.bookingService
      .saveBooking(this.bookingForm.value);
    this.router.navigateByUrl("preview");
  }
  transform(term: string): string {
    let nameFormatter = term.toLowerCase().split(' ');
    for (let _i = 0; _i < nameFormatter.length; _i++) {
      nameFormatter[_i] =
        nameFormatter[_i].charAt(0).toUpperCase() +
        nameFormatter[_i].substring(1);
    }
    return nameFormatter.join(' ');
  }

  setMinDate(){
    var currentDateTime:Date = new Date();
    var date = currentDateTime.getDate() < 10 ? "0" + currentDateTime.getDate() : currentDateTime.getDate();
    var month = currentDateTime.getMonth() < 10 ? "0" + (currentDateTime.getMonth() + 1) : (currentDateTime.getMonth() + 1);
    var year = currentDateTime.getFullYear();
    var hours = currentDateTime.getHours() < 10 ? "0" + (currentDateTime.getHours()) : (currentDateTime.getHours());
    var minutes = currentDateTime.getMinutes() < 10 ? "0" + currentDateTime.getMinutes() : currentDateTime.getMinutes();
    
    this.minDate = year + "-" + month + "-" + date + "T" + hours + ":" + minutes;

    console.log(this.minDate);
    
  }

  checkStartDateNEndDate(){
    this.setMinDate();
    var startDate:Date = this.bookingForm.get('startDate')?.value;
    var endDate:Date = this.bookingForm.get('endDate')?.value;

    var currentDateTime = new Date();
    var selectStartDateTime = new Date(startDate);
    var selectEndDateTime = new Date(endDate);
    //console.log("s : " + startDate + ", e : " + endDate);
    // if(currentDateTime <= selectStartDateTime){
    //     console.log("can't book : s");
    // }else{
    //   console.log("can book : s");
    // }

    if(selectStartDateTime >= currentDateTime){
      console.log("can book : s");
    }

    if(selectEndDateTime >= currentDateTime){
        console.log("can book : e");
    }

    if(selectStartDateTime >= currentDateTime &&
      selectEndDateTime >= currentDateTime &&
      startDate < endDate && 
      this.bookingForm.valid){
      this.isRealValid = true;
    }else{
      this.isRealValid = false;
    }
  }
  // isEnable(){
  //   if(this.name != ""){
  //     return true
  //   }
  // }
}
