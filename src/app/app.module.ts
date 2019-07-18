import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule, Slides, Platform } from 'ionic-angular';
import { HttpClientModule } from '@angular/common/http';
import { Device } from '@ionic-native/device';
import { PayPal } from '@ionic-native/paypal';


import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { BookPage } from '../pages/book/book';
import { BookingsPage } from '../pages/bookings/bookings';
import { LandingPage } from '../pages/landing/landing';
import { ProfilePage } from '../pages/profile/profile';
import { SubcategoryPage } from '../pages/subcategory/subcategory';
import { LoginPage } from '../pages/login/login';
import { TutorialPage } from '../pages/tutorial/tutorial';
import { MarkerPage } from '../pages/marker/marker';
import { LoginotpPage } from '../pages/loginotp/loginotp';
import { OrderPage } from '../pages/order/order';
import { TabsPage } from '../pages/tabs/tabs';
import { SearchPage } from '../pages/search/search';
import { ServicedetailPage } from '../pages/servicedetail/servicedetail';
import { TestimonialPage } from '../pages/testimonial/testimonial';
import { CouponservicesPage } from '../pages/couponservices/couponservices';
import { BillPage } from '../pages/bill/bill';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { NativeStorage } from '@ionic-native/native-storage';
import { Geolocation } from '@ionic-native/geolocation';
import { GoogleMaps } from '@ionic-native/google-maps';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';

import { NativeGeocoder } from '@ionic-native/native-geocoder';

import { AgmCoreModule } from '@agm/core';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Diagnostic } from '@ionic-native/diagnostic';

import { Firebase } from '@ionic-native/firebase';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { FcmProvider } from '../providers/fcm/fcm';

import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';

const firebase = {
	apiKey: "AIzaSyD_hrTP9_tew0o3wAPzmGhzzdzMIQ2vSF4",
    authDomain: "sevamitraa-8873a.firebaseapp.com",
    databaseURL: "https://sevamitraa-8873a.firebaseio.com",
    projectId: "sevamitraa-8873a",
    storageBucket: "sevamitraa-8873a.appspot.com",
    messagingSenderId: "859791403054"
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
	BookPage,
	BookingsPage,
	LandingPage,
	ProfilePage,
	SubcategoryPage,
	LoginPage,
	TutorialPage,
	MarkerPage,
	LoginotpPage,
	OrderPage,
	TabsPage,
	SearchPage,
	ServicedetailPage,
	TestimonialPage,
	CouponservicesPage,
	BillPage
  ],
  imports: [
    BrowserModule,
	HttpClientModule,
    IonicModule.forRoot(MyApp),
	AgmCoreModule.forRoot({
      apiKey: "AIzaSyAK74DvBsnv94bCoJrKKTVdKY75YaEUgDg"
    }),
    AngularFireModule.initializeApp(firebase), 
    AngularFirestoreModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
	BookPage,
	BookingsPage,
	LandingPage,
	ProfilePage,
	SubcategoryPage,
	LoginPage,
	TutorialPage,
	MarkerPage,
	LoginotpPage,
	OrderPage,
	TabsPage,
	SearchPage,
	ServicedetailPage,
	TestimonialPage,
	CouponservicesPage,
	BillPage
  ],
  providers: [
	StatusBar,
	Slides,
    SplashScreen,
	NativeStorage,
	Geolocation,
	GoogleMaps,
	NativeGeocoder,
	Device,
	Facebook,
	GooglePlus,
	LocationAccuracy,
	Diagnostic,
	Firebase,
	PayPal,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
	File,
    FileOpener,
    FcmProvider
  ]
})
export class AppModule {}
