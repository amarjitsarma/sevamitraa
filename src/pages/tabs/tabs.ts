import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LandingPage } from './../landing/landing';
import { ProfilePage } from './../profile/profile';
import { BookingsPage } from './../bookings/bookings';
@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {
	tab1Root = LandingPage;
	tab2Root = ProfilePage;
	tab3Root = BookingsPage;
	myIndex: number;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
	  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TabsPage');
  }

}
