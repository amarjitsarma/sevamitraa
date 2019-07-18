import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, Slides } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';

import { NativeStorage } from '@ionic-native/native-storage';
import { TutorialPage } from './../tutorial/tutorial';
import { SubcategoryPage } from './../subcategory/subcategory';
import { ServicedetailPage } from './../servicedetail/servicedetail';
@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {
	ShowAlert(Title, Detail) {
        let alert = this.alertCtrl.create({
            title: Title,
            subTitle: Detail,
            buttons: ['Ok']
        });
        alert.present();
    }
	searchQuery: string = '';
	items:any=[];
	SubCategories:any;
	Category:any;
  initializeItems() {
	this.httpClient.get<any>('https://www.sevamitraa.com/api/sub-categories/0')
	.subscribe(data => {
		this.items =data;
		this.SubCategories=data;
		console.log(data);
	},
	err => {
		//this.ShowAlert("Error", "Poor internet Connection");
	});
  }
	getItems(ev: any) {
    // Reset items back to all of the items
	if(this.items.length==0)
	{
		this.initializeItems();
	}
    // set val to the value of the searchbar
	if(this.items.length!=0)
	{
		const val = ev.target.value;
	
		// if the value is an empty string don't filter the items
		if (val && val.trim() != '') {
		this.items = this.items.filter((item) => {
			return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
		})
		}
	}
  }
   constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, public nativeStorage: NativeStorage, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController){
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
  }
  Book(id)
	{
		if(!isNaN(id))
		{
			this.navCtrl.push(SubcategoryPage, {
				Category: id
			});
		}
		else
		{
			let loading = this.loadingCtrl.create();
			loading.present().then(()=>{
				this.httpClient.get<any>('https://www.sevamitraa.com/api/sub-category/'+id)
				.subscribe(data => {
					loading.dismiss();
					console.log(data);
					/*this.navCtrl.push(BookPage, {
						Category: data.category_id,
						SubCategory:data.id
					});*/
					this.Category=this.navParams.get('Category');
					this.navCtrl.push(ServicedetailPage, {
						Category: data.category_id,
						SubCategory:data.id
					});
				},
				err => {
					loading.dismiss();
					//this.ShowAlert("Error", "Poor internet Connection");
				})
			});
		}
	}

}
