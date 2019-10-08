import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, Slides, Platform } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { TabsPage } from './../tabs/tabs';
import { LoginPage } from './../login/login';
import { Device } from '@ionic-native/device';
/**
 * Generated class for the TutorialPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html',
})
export class TutorialPage {
	ShowAlert(Title, Detail) {
        let alert = this.alertCtrl.create({
            title: Title,
            subTitle: Detail,
            buttons: ['Remind me later',{
				text: 'Do not show me again',
				handler: () => {
						this.DisableNotification();
					}
				}
			]
        });
        alert.present();
    }
	DeviceID:string="";
	NotificationID:any=0;
  constructor(public platform:Platform, public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public device: Device) {
	  this.LoadNotification();
  }
	
  ionViewDidLoad() {
    console.log('ionViewDidLoad TutorialPage');
  }
	GoToMain()
	{
		this.CheckLogin();//this.navCtrl.setRoot(TabsPage);
	}
	LoadNotification()
	{
		this.DeviceID=this.device.uuid;
		if(this.DeviceID==null)
		{
			this.DeviceID="534b8b5aeb906015";
		}
		this.httpClient.get<any>('https://www.sevamitraa.com/api/getNotification?device_id='+this.DeviceID).subscribe(data => {
			var Notification=data.notification;
			if(Notification!="")
			{
				this.ShowAlert("Notification",Notification.description);
				this.NotificationID=Notification.id;
			}
		},
		err => {
			//loading.dismiss();
			//this.ShowAlert("Error", "Poor internet Connection");
		});
	}
	DisableNotification()
	{
		this.DeviceID=this.device.uuid;
		if(this.DeviceID==null)
		{
			this.DeviceID="534b8b5aeb906015";
		}
		this.httpClient.post<any>('https://www.sevamitraa.com/api/stopNotification',{device_id:this.DeviceID,
		NotificationID:this.NotificationID}).subscribe(data => {
			
		},
		err => {
		});
	}
	CheckLogin()
	{
		this.DeviceID=this.device.uuid;
		if(this.DeviceID==null)
		{
			this.DeviceID="534b8b5aeb906015";
		}
		this.httpClient.get<any>('https://www.sevamitraa.com/api/checklogin/'+this.DeviceID)
		.subscribe(data => {
			if(data.loggedin!="no")
			{
				//window.location.reload()
				this.navCtrl.setRoot(TabsPage);
			}
			else
			{
				this.navCtrl.setRoot(LoginPage);
			}
		},
		err => {
			location.reload();
		})

	}
}
