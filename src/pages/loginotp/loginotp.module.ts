import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginotpPage } from './loginotp';

@NgModule({
  declarations: [
    LoginotpPage,
  ],
  imports: [
    IonicPageModule.forChild(LoginotpPage),
  ],
})
export class LoginotpPageModule {}
