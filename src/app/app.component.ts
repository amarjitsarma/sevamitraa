import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController, LoadingController,ToastController, MenuController  } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpClient } from '@angular/common/http';
import { Device } from '@ionic-native/device';



import { FormGroup, FormControl } from '@angular/forms';
/*import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { BookPage } from '../pages/book/book';
import { BookingsPage } from '../pages/bookings/bookings';*/
import { LandingPage } from '../pages/landing/landing';
import { ProfilePage } from '../pages/profile/profile';
/*import { SubcategoryPage } from '../pages/subcategory/subcategory';*/
import { LoginPage } from '../pages/login/login';
import { TutorialPage } from '../pages/tutorial/tutorial';
/*import { MarkerPage } from '../pages/marker/marker';
import { OrderPage } from '../pages/order/order';*/
import { TabsPage } from '../pages/tabs/tabs';
/*import { SearchPage } from '../pages/search/search';*/

import { FcmProvider } from '../providers/fcm/fcm';

import { Subject } from 'rxjs/Subject';
import { tap } from 'rxjs/operators';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
	ShowAlert(Title, Detail) {
        let alert = this.alertCtrl.create({
            title: Title,
            subTitle: Detail,
            buttons: ['Ok']
        });
        alert.present();
    }
  rootPage: any = LoginPage;
	FullName="";
	EmailID="";
	MobileNo="";
	Login="no";
	DeviceID="";
  pages: Array<{title: string, component: any, icon: string}>;
	 public counter=0;
  constructor(
  public platform: Platform,
  public statusBar: StatusBar,
  public splashScreen: SplashScreen,
  public httpClient: HttpClient,
  public device: Device,
  public loadingCtrl: LoadingController,
  public alertCtrl: AlertController,
  public toastCtrl: ToastController,
  public menuController:MenuController,
  public fcm: FcmProvider,
  ) {
    this.initializeApp();


    // used for an example of ngFor and navigation
    this.pages = [
	  { title: 'Home', component: LandingPage, icon: 'home' },
	  { title: 'Profile', component: ProfilePage, icon: 'person' },
    ];
	this.LoadProfile();
	platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
	  platform.registerBackButtonAction(() => {
        if (this.counter == 0) {
          this.counter++;
          this.presentToast();
          setTimeout(() => { this.counter = 0 }, 3000)
        } else {
          // console.log("exitapp");
          platform.exitApp();
        }
      }, 0)
    });
  }
	
  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
  LoadProfile()
  {
		this.DeviceID=this.device.uuid;
		if(this.DeviceID==null)
		{
			this.DeviceID="1d48a6370ea5373f";
		}
		this.httpClient.get<any>('https://www.sevamitraa.com/api/checklogin/'+this.DeviceID)
		.subscribe(data => {
			try
			{
				console.log(data);
				this.Login=data.loggedin;
				if(data.loggedin!="no")
				{
					this.FullName=data.user_data.name;
					this.EmailID=data.user_data.email;
					this.MobileNo=data.user_data.phone;
				}
			}
			catch(err)
			{
				console.log(err);
			}
			
		},
		err => {
			this.ShowAlert("Error", "Poor internet Connection");
		})
  }
  GotoLogin()
  {
	  this.nav.setRoot(LoginPage);
  }
  presentToast() {
    let toast = this.toastCtrl.create({
      message: "Press again to exit",
      duration: 3000,
      position: "middle"
    });
    toast.present();
  }
}
