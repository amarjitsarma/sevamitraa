import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OtpbookPage } from './otpbook';

@NgModule({
  declarations: [
    OtpbookPage,
  ],
  imports: [
    IonicPageModule.forChild(OtpbookPage),
  ],
})
export class OtpbookPageModule {}
