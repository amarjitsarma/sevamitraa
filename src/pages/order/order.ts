import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, Slides } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Device } from '@ionic-native/device';
import { NativeStorage } from '@ionic-native/native-storage';
import { BillPage } from './../bill/bill';
@IonicPage()
@Component({
  selector: 'page-order',
  templateUrl: 'order.html',
})
export class OrderPage {
	Order:any;
	order_number:any="";
	booking_date:any="";
	type:any="";
	order_date:any="";
	order_time:any="";
	address:any="";
	amount:any="";
	payment_type:any="";
	status:any="";
	remarks:any="";	
	OrderItems:any;
	feedbackGiven:number=0;
	ShowAlert(Title, Detail) {
        let alert = this.alertCtrl.create({
            title: Title,
            subTitle: Detail,
            buttons: ['Ok']
        });
        alert.present();
    }
	star:number=1;
	feedback:string="";
	Bill:any;
	WalletBalance:any=0;
	UseWallet:any=false;
	DeviceID:any="";
  constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, public nativeStorage: NativeStorage, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public device: Device) {
	  this.LoadOrder();
	  this.ReadFeedback();
	  this.GetWallet();
	  
  }
	LoadOrder()
	{
		let loading = this.loadingCtrl.create();
		 let OrderID=this.navParams.get('OrderID');
		 loading.present().then(()=>{
			this.httpClient.get<any>('https://www.sevamitraa.com/api/getOrder/'+OrderID)
			.subscribe(data => {
				console.log(data);
				loading.dismiss();
				this.Order=data.order;
				if(data.order!=null)
				{
					this.order_number=data.order.order_number;
					this.booking_date=data.order.booking_date;
					this.type=data.order.type;
					this.OrderItems=data.order.OrderItems;
					this.order_date=data.order.order_date;
					this.order_time=data.order.order_time;
					this.address=data.order.address;
					this.amount=data.order.amount;
					this.payment_type=data.order.payment_type;
					this.status=data.order.status;
					this.remarks=data.order.remarks;				
					console.log(this.Order.order_number);
					this.Bill=data.order.bill;
					
				}
			},
			err => {
				loading.dismiss();
				//this.ShowAlert("Error", "Poor internet Connection");
			})
		});
	}
  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderPage');
  }
  SaveFeedback()
  {
	  var star=this.star;
	  var feedback=this.feedback;
	  if(this.feedback==null)
	  {
		  this.feedback="";
	  }
	  let order_id=this.navParams.get('OrderID');
	  let loading = this.loadingCtrl.create();
	  loading.present().then(()=>{
			this.httpClient.post<any>('https://www.sevamitraa.com/api/SaveReview',{
				rating:star,
				feedback:feedback,
				order_id:order_id
			})
			.subscribe(data => {
				this.ShowAlert("Success","Feedback submitted");
				this.ReadFeedback();
				loading.dismiss();
			},
			err => {
				loading.dismiss();
				console.log(err);
			})
		});
  }
  ReadFeedback()
  {
	  let order_id=this.navParams.get('OrderID');
	  this.httpClient.get<any>('https://www.sevamitraa.com/api/ReviewsByOrderID?OrderID='+order_id)
			.subscribe(data => {
				console.log(data);
				this.feedback=data;
				this.feedbackGiven=data.length;
			},
			err => {
				//this.ShowAlert("Error", "Poor internet Connection");
			})
  }
  CalcelOrder(){
	  let order_id=this.navParams.get('OrderID');
	  let loading = this.loadingCtrl.create();
	  loading.present().then(()=>{
			this.httpClient.post<any>('https://www.sevamitraa.com/api/cancel_order',{
				id:order_id
			})
			.subscribe(data => {
				this.ShowAlert("Success","Order Canceled");
				this.LoadOrder();
				loading.dismiss();
			},
			err => {
				loading.dismiss();
				console.log(err);
			})
		});
  }
  PayBill()
  {
	  let OnlinePayable:any=parseInt(this.Bill.total);
		let WalletPayment:any=0;
		if(this.UseWallet==true)
		{
			if(this.WalletBalance>=0)
			{
				if(parseFloat(this.WalletBalance)<=parseFloat(this.Bill.total))
				{
					OnlinePayable=parseInt(this.Bill.total)-parseInt(this.WalletBalance);
					WalletPayment=parseInt(this.WalletBalance);
				}
				else
				{
					OnlinePayable=0;
					WalletPayment=parseInt(this.Bill.total);
				}
			}
		}
		if(OnlinePayable>=1)
		{
			var options = {
				description: 'Payment Towards Order No:'+this.Order.id,
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
				var orderId = success.razorpay_order_id;
				var signature = success.razorpay_signature;
				this.MarkPaid();
				if(WalletPayment>0)
				{
					this.MakeWalletPayment(WalletPayment);
				}
				
			}
	
			var cancelCallback = function(error) {
				alert(error.description + ' (Error '+error.code+')');
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
	  let bill_id=this.Bill.id;
	  let loading = this.loadingCtrl.create();
	  loading.present().then(()=>{
			this.httpClient.post<any>('https://www.sevamitraa.com/api/MarkBillsPaid',{
				ids:[bill_id]
			})
			.subscribe(data => {
				this.LoadOrder();
				loading.dismiss();
			},
			err => {
				loading.dismiss();
				console.log(err);
			})
		});
  }
  GetWallet()
	{
		this.DeviceID=this.device.uuid;
		if(this.DeviceID==null)
		{
			this.DeviceID="534b8b5aeb906015";
		}
		let loading = this.loadingCtrl.create();
		loading.present().then(()=>{
			this.httpClient.post<any>('https://www.sevamitraa.com/api/GetWalletBalance',{
				device_id:this.DeviceID
			})
			.subscribe(data => {
				if(data.length>0)
				{
					this.WalletBalance=data[0].Balance;
				}
				loading.dismiss();
			},
			err => {
				loading.dismiss();
				console.log(err);
			})
		});
	}
	MakeWalletPayment(WalletPayment)
	{
		this.DeviceID=this.device.uuid;
		if(this.DeviceID==null)
		{
			this.DeviceID="534b8b5aeb906015";
		}
		let loading = this.loadingCtrl.create();
		loading.present().then(()=>{
			this.httpClient.post<any>('https://www.sevamitraa.com/api/UseWalletBalance',{
				device_id:this.DeviceID,
				reason:"Balance Payment",
				out_amount:WalletPayment
			})
			.subscribe(data => {
				this.GetWallet();
				loading.dismiss();
			},
			err => {
				loading.dismiss();
				console.log(err);
			})
		});
	}
	ViewBill(id)
	{
		this.navCtrl.push(BillPage, { BillID: id });
	}

}
