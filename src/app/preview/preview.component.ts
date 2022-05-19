import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookingDetail } from '../booking';
import { DetailService } from '../detail.service';
import { Location } from '@angular/common'
import { BookingService } from '../booking.service';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit {

  bookingDetail!: BookingDetail;
  isConfirm: boolean = false;

  constructor(
    private bookingService: BookingService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.onLoading();
  }

  onLoading() {
    try {
      this.bookingDetail = this.bookingService.getCurrentBooking();
    } catch (err) {
      console.log(err);
    }
  }

  buttonReturn(){
    this.location.back();
  }

  buttonConfirm(){
    this.bookingService.addBooking(this.bookingDetail).
    subscribe(data => 
      {
        this.isConfirm = true;
        console.log(data);
        alert("ขอบคุณครับ");
      });
    

  }
}
