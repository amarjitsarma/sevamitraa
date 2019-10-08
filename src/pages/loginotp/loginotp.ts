import { Component, NgZone, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, Slides, Platform, Nav } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { Device } from '@ionic-native/device';
import { LandingPage } from './../landing/landing';

@IonicPage()
@Component({
  selector: 'page-loginotp',
  templateUrl: 'loginotp.html',
})
export class LoginotpPage {
	ShowAlert(Title, Detail) {
        let alert = this.alertCtrl.create({
            title: Title,
            subTitle: Detail,
            buttons: ['Ok']
        });
        alert.present();
    }
	OTP:any="";
	fullname:string="";
	MobileNo:any;
	DeviceID:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public device: Device, public platform: Platform, public nav:Nav){
	  this.MobileNo=this.navParams.get('MobileNo');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginotpPage');
  }
	Submit()
	{
		this.DeviceID=this.device.uuid;
		if(this.DeviceID==null)
		{
			this.DeviceID="534b8b5aeb906015";
		}
		
			this.httpClient.post<any>('https://www.sevamitraa.com/api/checkOtp',{
				device_id:this.DeviceID,
				otp:this.OTP,
				phone:this.navParams.get('MobileNo')
			})
			.subscribe(data => {
				if(data.error==1)
				{
					this.ShowAlert('Error','Wrong OPT');
				}
				else
				{
					this.Login();
				}
				
			},
			err => {
				
				//this.ShowAlert("Error", "Poor internet Connection");
			})
		
	}
	Login(){
			this.httpClient.post<any>('https://www.sevamitraa.com/api/login',{
				device_id:this.DeviceID,
				phone:this.navParams.get('MobileNo'),
				name:this.fullname
			})
			.subscribe(data => {
				location.reload();
				console.log(data);
			},
			err => {
				location.reload();
				this.ShowAlert("Error", "Poor internet Connection");
			})
	}
	Resend()
	{
		this.DeviceID=this.device.uuid;
		if(this.DeviceID==null)
		{
			this.DeviceID="534b8b5aeb906015";
		}
		if(this.MobileNo!='')
		{
				this.httpClient.get<any>('https://www.sevamitraa.com/api/send/otp-again/'+this.DeviceID+'/'+this.MobileNo)
				.subscribe(data => {
					this.ShowAlert('Success','OTP sent to your mobile again');
				},
				err => {
					//this.ShowAlert("Error", "Poor internet Connection");
				})
		}
	}
}
