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
    this.bookingDetail = this.bookingService.getCurrentBooking()!;
  }

  onReturn(){
    if(this.isConfirm){
      this.bookingService.clearCurrentBooking();
    }
    this.location.back();
  }

  onConfirm(){
    this.bookingService.addBooking(this.bookingDetail).
    subscribe(data => 
      {
        this.isConfirm = true;
        alert("ขอบคุณครับ");
      });
    

  }
}
