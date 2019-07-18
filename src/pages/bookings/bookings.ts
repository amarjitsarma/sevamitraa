import { Component, NgZone, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, Slides, Platform, Nav } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { Device } from '@ionic-native/device';
import { LoginPage } from './../login/login';
import { OrderPage } from './../order/order';
@IonicPage()
@Component({
  selector: 'page-bookings',
  templateUrl: 'bookings.html',
})
export class BookingsPage {
	Orders:any;
	DeviceID:any;
	login:any;
	ShowAlert(Title, Detail) {
        let alert = this.alertCtrl.create({
            title: Title,
            subTitle: Detail,
            buttons: ['Ok']
        });
        alert.present();
    }
	Balance:any=0;
	BillIDs:any=[];
	WalletBalance:any=0;
	UseWallet:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public device: Device, public platform: Platform, public nav:Nav) {
	  this.CheckLogin();
	  this.GetBills();
	  this.GetWallet();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BookingsPage');
  }
	LoadOrders()
	{
		this.DeviceID=this.device.uuid;
		if(this.DeviceID==null)
		{
			this.DeviceID="534b8b5aeb906015";
		}

			this.httpClient.get<any>('https://www.sevamitraa.com/api/allOrders/'+this.DeviceID)
			.subscribe(data => {
				this.Orders=data.orders;
				console.log(this.Orders);
			},
			err => {
				//this.ShowAlert("Error", "Poor internet Connection");
			})
	}
	ViewOrder(id)
	{
		this.navCtrl.push(OrderPage, {
			OrderID: id
		});
	}
	GetBills()
	{
		this.DeviceID=this.device.uuid;
		if(this.DeviceID==null)
		{
			this.DeviceID="534b8b5aeb906015";
		}

			this.httpClient.post<any>('https://www.sevamitraa.com/api/get_unpaid_bills',{device_id:this.DeviceID})
			.subscribe(data => {
				this.Balance=0;
				for(var i=0;i<data.length;i++)
				{
					this.Balance=this.Balance+parseFloat(data[i].total).toFixed(2);
					this.BillIDs.push(data[i].id);
				}
				this.Balance=parseFloat(this.Balance).toFixed(2);
			},
			err => {
				//this.ShowAlert("Error", "Poor internet Connection");
			})

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
				this.login=data.loggedin;
				if(data.loggedin!="yes")
				{
					//this.nav.setRoot(LoginPage);
					this.navCtrl.push(LoginPage);
					
				}
				else
				{
					this.LoadOrders();
				}
			},
			err => {
				//this.ShowAlert("Error", "Poor internet Connection");
			})

	}
	PayAll()
	{
		let OnlinePayable:any=parseInt(this.Balance);
		let WalletPayment:any=0;
		if(this.UseWallet==true)
		{
			if(this.WalletBalance>=0)
			{
				if(this.WalletBalance<this.Balance)
				{
					OnlinePayable=parseInt(this.Balance)-parseInt(this.WalletBalance);
					WalletPayment=parseInt(this.WalletBalance);
				}
				else
				{
					OnlinePayable=0;
					WalletPayment=parseInt(this.Balance);
				}
			}
		}
		
		if(OnlinePayable>1)
		{
			var options = {
				description: 'Payment of Pending Bills',
				image: 'https://lh3.googleusercontent.com/STP3UGkqIgyMWbm-JYxhowDVGPwIFH3kkO_EVoIXQqHN8CQDeIH6plS-qxlReaZLnU0=s180-rw',
				currency: 'INR',
				key: 'rzp_live_YtUE2lJxdwkCeP',
				amount: parseInt(OnlinePayable)*100,
				name: 'Sevamitraa Services',
				theme: {
					color: '#F37254'
				}
			}
			var successCallback = function(success) {
				this.MarkPaid();
				var orderId = success.razorpay_order_id;
				var signature = success.razorpay_signature;
				if(WalletPayment>0)
				{
					this.MakeWalletPayment(WalletPayment);
				}
			}
	
			var cancelCallback = function(error) {
				this.ShowAlert('Error','Payment failed or canceled');
			}
	
			RazorpayCheckout.on('payment.success', successCallback)
			RazorpayCheckout.on('payment.cancel', cancelCallback)
			RazorpayCheckout.open(options)
		}
		else
		{
			if(WalletPayment>0)
			{
				this.MakeWalletPayment(WalletPayment);
			}
			this.MarkPaid();
		}
	}
	MarkPaid()
	{
		
			this.httpClient.post<any>('https://www.sevamitraa.com/api/MarkBillsPaid',{
				ids:this.BillIDs
			})
			.subscribe(data => {
				this.LoadOrders();
				this.GetBills();
			},
			err => {
				console.log(err);
			})

	}
	GetWallet()
	{
		this.DeviceID=this.device.uuid;
		if(this.DeviceID==null)
		{
			this.DeviceID="534b8b5aeb906015";
		}
		
			this.httpClient.post<any>('https://www.sevamitraa.com/api/GetWalletBalance',{
				device_id:this.DeviceID
			})
			.subscribe(data => {
				if(data.length>0)
				{
					this.WalletBalance=data[0].Balance;
				}
			},
			err => {
				console.log(err);
			})

	}
	MakeWalletPayment(WalletPayment)
	{
		this.DeviceID=this.device.uuid;
		if(this.DeviceID==null)
		{
			this.DeviceID="534b8b5aeb906015";
		}
		
			this.httpClient.post<any>('https://www.sevamitraa.com/api/UseWalletBalance',{
				device_id:this.DeviceID,
				reason:"Balance Payment",
				out_amount:WalletPayment
			})
			.subscribe(data => {
				this.GetWallet();
			},
			err => {
				console.log(err);
			})

	}
}
