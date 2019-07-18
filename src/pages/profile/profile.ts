import { Component, NgZone, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, Slides, Platform, Nav } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { Device } from '@ionic-native/device';
import { LoginPage } from './../login/login';
import { BookingsPage } from './../bookings/bookings';
@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
	DeviceID:string="";
	FullName:any="";
	EmailID:any="";
	MobileNo:number=0;
	isUpdate:any=false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public device: Device, public platform: Platform, public nav:Nav) {
	 this.CheckLogin();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
	this.CheckLogin();
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
				if(data.loggedin!="yes")
				{
					//this.nav.setRoot(LoginPage);
					this.navCtrl.push(LoginPage);
				}
				else
				{
					this.FullName=data.user_data.name;
					this.EmailID=data.user_data.email;
					this.MobileNo=data.user_data.phone;
				}
			},
			err => {
				//this.ShowAlert("Error", "Poor internet Connection");
			})
	}
	Update()
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
					this.showPrompt();
					loading.dismiss();
				},
				err => {
					loading.dismiss();
					//this.ShowAlert("Error", "Poor internet Connection");
				})

		}
		else
		{
			this.ShowAlert('Error','Invalid mobile no');
		}
	}
	Logout()
	{
		this.DeviceID=this.device.uuid;
		if(this.DeviceID==null)
		{
			this.DeviceID="534b8b5aeb906015";
		}
		
			this.httpClient.get<any>('https://www.sevamitraa.com/api/logout?device_id='+this.DeviceID)
			.subscribe(data => {
				location.reload();
			},
			err => {
				//this.ShowAlert("Error", "Poor internet Connection");
			})

	}
	showPrompt() {
    const prompt = this.alertCtrl.create({
      title: 'Confirm',
      message: "Enter otp sent to your mobile",
      inputs: [
        {
          name: 'OTP',
          placeholder: 'OTP'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            this.CheckLogin();
          }
        },
        {
          text: 'Save',
          handler: data => {
			this.DeviceID=this.device.uuid;

				this.httpClient.post<any>('https://www.sevamitraa.com/api/checkOtp',{
					device_id:this.DeviceID,
					otp:data.OTP,
					phone:this.MobileNo
				})
				.subscribe(data => {
					if(data.error==1)
					{
						this.ShowAlert('Error','Wrong OPT');
						this.showPrompt();
					}
					else
					{
						this.ShowAlert("Success","Profile Updated");
						this.UpdateProfile();
					}
					loading.dismiss();
				},
				err => {
					loading.dismiss();
					//this.ShowAlert("Error", "Poor internet Connection");
				})

          }
        }
      ]
    });
    prompt.present();
  }
  UpdateProfile()
  {
	  
			this.httpClient.post('https://www.sevamitraa.com/api/UpdateProfile',{
				device_id:this.DeviceID,
				email:this.EmailID,
				phone:this.MobileNo,
				name:this.FullName
			})
			.subscribe(data => {
				this.ShowAlert('Success','Profile Updated');
				this.isUpdate=false;
				loading.dismiss();
			},
			err => {
				loading.dismiss();
				//this.ShowAlert("Error", "Poor internet Connection");
			})

  }
  ShowAlert(Title, Detail) {
        let alert = this.alertCtrl.create({
            title: Title,
            subTitle: Detail,
            buttons: ['Ok']
        });
        alert.present();
    }
	ViewOrders()
	{
		this.nav.setRoot(BookingsPage);
	}
	EnableUpdate()
	{
		this.isUpdate=true;
	}
}
