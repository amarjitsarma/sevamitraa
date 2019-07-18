import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { ViewController } from 'ionic-angular';
import { Device } from '@ionic-native/device';

@IonicPage()
@Component({
  selector: 'page-otpbook',
  templateUrl: 'otpbook.html',
})
export class OtpbookPage {
	DeviceID="";
	MobileNo:string="";
	OTP:any="";
	fullname:string="";
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public alertCtrl: AlertController, private httpClient: HttpClient, public device: Device, public loadingCtrl: LoadingController){
	  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OtpbookPage');
  }
	public closeModal(){
		this.viewCtrl.dismiss();
	}
	SendOTP(){
		this.DeviceID=this.device.uuid;
		if(this.DeviceID==null)
		{
			this.DeviceID="534b8b5aeb906015";
		}
		if(this.MobileNo!="")
		{
			/*let loading = this.loadingCtrl.create({
				content: 'Please wait...'
			});*/
			//loading.present().then(()=>{
				this.httpClient.post<any>('https://www.sevamitraa.com/api/send/otp',{
					device_id:this.DeviceID,
					phone:this.MobileNo
				})
				.subscribe(data => {
					
					//loading.dismiss();
				},
				err => {
					//loading.dismiss();
					//this.ShowAlert("Error", "Poor internet Connection");
				})
			//});
		}
		else
		{
			this.ShowAlert('Error','Invalid mobile no');
		}
	}
	Submit(){
		this.DeviceID=this.device.uuid;
		if(this.DeviceID==null)
		{
			this.DeviceID="534b8b5aeb906015";
		}
		/*let loading = this.loadingCtrl.create({
			content: 'Please wait...'
		});*/
		/*loading.present().then(()=>{*/
			this.httpClient.post<any>('https://www.sevamitraa.com/api/checkOtp',{
				device_id:this.DeviceID,
				otp:this.OTP,
				phone:this.MobileNo
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
				//loading.dismiss();
			},
			err => {
				//loading.dismiss();
				//this.ShowAlert("Error", "Poor internet Connection");
			})
		/*});*/
	}
	Login(){
		this.httpClient.post<any>('https://www.sevamitraa.com/api/login',{
			device_id:this.DeviceID,
			phone:this.MobileNo,
			name:this.fullname,
		})
		.subscribe(data => {
			console.log(data);
			//this.ShowAlert("Success","You are logged in successfully");
			//loading.dismiss();
			this.closeModal();
		},
		err => {
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
	Resend()
	{
		this.DeviceID=this.device.uuid;
		if(this.DeviceID==null)
		{
			this.DeviceID="534b8b5aeb906015";
		}
		if(this.MobileNo!="")
		{
			let loading = this.loadingCtrl.create();
			loading.present().then(()=>{
				this.httpClient.get<any>('https://www.sevamitraa.com/api/send/otp-again/'+this.DeviceID+'/'+this.MobileNo)
				.subscribe(data => {
					this.ShowAlert('Success','OTP sent to your mobile again');
					loading.dismiss();
				},
				err => {
					loading.dismiss();
					//this.ShowAlert("Error", "Poor internet Connection");
				})
			});
		}
	}
}
