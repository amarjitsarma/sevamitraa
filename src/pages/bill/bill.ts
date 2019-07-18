import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, Slides } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Device } from '@ionic-native/device';
import { NativeStorage } from '@ionic-native/native-storage';

@IonicPage()
@Component({
  selector: 'page-bill',
  templateUrl: 'bill.html',
})
export class BillPage {
	Bill:any;
	BillItems:any=[];
  constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, public nativeStorage: NativeStorage, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public device: Device) {
	  this.ViewBill();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BillPage');
  }
	ViewBill()
	{

			this.httpClient.post<any>('https://www.sevamitraa.com/api/GetBill',{BillID:this.navParams.get('BillID')})
			.subscribe(data => {
				this.Bill=data.Bill;
				this.BillItems=data.Items;
			},
			err => {
				//this.ShowAlert("Error", "Poor internet Connection");
			})

	}
}
