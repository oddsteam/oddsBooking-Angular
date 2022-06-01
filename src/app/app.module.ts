import { HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { BookingFormComponent } from './booking-form/booking-form.component'
import { DetailComponent } from './detail/detail.component'
import { MatCardModule } from '@angular/material/card'
import { MatIconModule } from '@angular/material/icon'
import { PreviewComponent } from './preview/preview.component'
import { ThankPageComponent } from './thank-page/thank-page.component'
import { NZ_I18N } from 'ng-zorro-antd/i18n'
import { en_US } from 'ng-zorro-antd/i18n'
import { registerLocaleData } from '@angular/common'
import en from '@angular/common/locales/en'
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker'
import { NzFormModule } from 'ng-zorro-antd/form'
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { ExpiredComponent } from './expired/expired.component';
import { DialogSpinnerComponent } from './dialog-spinner/dialog-spinner.component'
import {MatDialogModule} from '@angular/material/dialog';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { DialogConfirmComponent } from './dialog-confirm/dialog-confirm.component';


registerLocaleData(en)

@NgModule({
    declarations: [
        AppComponent,
        BookingFormComponent,
        DetailComponent,
        PreviewComponent,
        ThankPageComponent,
        ExpiredComponent,
        DialogSpinnerComponent,
        DialogConfirmComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        NzDatePickerModule,
        NzFormModule,
        NzTimePickerModule,
        MatDialogModule,
        MatProgressSpinnerModule
    ],
    providers: [{ provide: NZ_I18N, useValue: en_US }],
    bootstrap: [AppComponent],
})
export class AppModule {}
