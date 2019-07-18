import { Component, NgZone, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, Slides, Platform, Nav } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';

import { Device } from '@ionic-native/device';
import { LandingPage } from './../landing/landing';
import { TutorialPage } from './../tutorial/tutorial';
import { LoginotpPage } from './../loginotp/loginotp';
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
	ShowAlert(Title, Detail) {
        let alert = this.alertCtrl.create({
            title: Title,
            subTitle: Detail,
            buttons: ['Ok']
        });
        alert.present();
    }
	MobileNo:any="";
	DeviceID:any="";
	error="";
  constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public device: Device, public platform: Platform, private fb: Facebook, public nav:Nav, public googlePlus: GooglePlus) {
	  this.CheckLogin();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }
	SendOTP()
	{
		this.DeviceID=this.device.uuid;
		if(this.DeviceID==null)
		{
			this.DeviceID="534b8b5aeb906015";
		}
		if(this.MobileNo!=10)
		{

				this.httpClient.post<any>('https://www.sevamitraa.com/api/send/otp',{
					device_id:this.DeviceID,
					phone:this.MobileNo
				})
				.subscribe(data => {
					this.navCtrl.push(LoginotpPage, {
						MobileNo: this.MobileNo
					});
				},
				err => {
					//this.ShowAlert("Error", "Poor internet Connection");
				})

		}
		else
		{
			this.ShowAlert('Error','Invalid mobile no');
		}
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
					this.nav.setRoot(TutorialPage);
				}
			},
			err => {
				location.reload();
				//this.ShowAlert("Error", "Poor internet Connection");
			})

	}
	FBLogin()
	{
		this.fb.login(['public_profile', 'email'])
		.then((res: FacebookLoginResponse) => {
			this.fb.api('me?fields=id,name,email,first_name,picture.width(720).height(720).as(picture_large)', []).then(profile =>{
				this.DeviceID=this.device.uuid;
				if(this.DeviceID==null)
				{
					this.DeviceID="534b8b5aeb906015";
				}

					this.httpClient.get<any>('https://www.sevamitraa.com/api/FBLogin?email='+profile.email+"&name="+profile.name+"&device_id="+this.DeviceID)
					.subscribe(data => {
						location.reload();
					},
					err => {
						this.error=JSON.stringify(err);
						location.reload();
					})

			}).catch(e => {
        this.error=JSON.stringify(e);
    });
		}).catch(e => {
        this.error=JSON.stringify(e);
    });;
	}
	GoogleLogin()
	{
			this.googlePlus.login({})
			.then(res => {
				alert("Success");
				this.error=JSON.stringify(res);
			})
			.catch(err => {
				alert("fail");
				this.error=JSON.stringify(err);
			});
	}
}
