import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookingService } from '../booking.service';
import { DetailService } from '../detail.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {

   bookingDetail: any
  
  constructor(
    private detailService : DetailService, 
    private bookingService : BookingService,
    private route : ActivatedRoute) {
      this.onLoading()
    
   }

  ngOnInit(): void {}
onLoading(){
  try{
    const id = String(this.route.snapshot.paramMap.get('id'));
    this.detailService.getBooking(id).subscribe((data)=>{
      this.bookingDetail = data
      console.log(this.bookingDetail);
    })
  }catch (err){
    console.log(err)
  }
}
}
