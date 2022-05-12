import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookingDetailComponent } from './booking-detail/booking-detail.component';
import { DetailComponent } from './detail/detail.component';

const routes: Routes = [
{path : 'booking_detail', component: BookingDetailComponent},
{path : 'detail/:id', component: DetailComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }