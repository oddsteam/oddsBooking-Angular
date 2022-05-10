import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormArray, Form } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field'
import { bookingDetail } from '../booking';

@Component({
  selector: 'app-booking-detail',
  templateUrl: './booking-detail.component.html',
  styleUrls: ['./booking-detail.component.css']
})
export class BookingDetailComponent implements OnInit {

  Room: string[] =["All Star", "Neon"];
  bookingForm = new FormGroup ({
    name: new FormControl(),
    email: new FormControl(),
    room: new FormControl(),
    phoneNumber: new FormControl(),
    reason: new FormControl(),
    dateStart: new FormControl(),
    dateEnd: new FormControl(),
  })

  constructor() { }

  ngOnInit(): void {
  }
buttonSubmit(){
  console.log(this.bookingForm.value)
}
get email(){
  return this.bookingForm.get('email') as FormArray;
}
get name(){
  return this.bookingForm.get('name') as FormArray;
}
get phoneNumber(){
  return this.bookingForm.get('phoneNumber') as FormArray;
}
get reason(){
  return this.bookingForm.get('reason') as FormArray;
}
  
}
