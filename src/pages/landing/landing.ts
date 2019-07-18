import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, Slides, Platform } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { NativeStorage } from '@ionic-native/native-storage';
import { Diagnostic } from '@ionic-native/diagnostic';

import { TutorialPage } from './../tutorial/tutorial';
import { SubcategoryPage } from './../subcategory/subcategory';
import { BookPage } from './../book/book';
import { SearchPage } from './../search/search';
import { ServicedetailPage } from './../servicedetail/servicedetail';
import { TestimonialPage } from './../testimonial/testimonial';


@IonicPage()
@Component({
  selector: 'page-landing',
  templateUrl: 'landing.html',
})
export class LandingPage {
	Categories: any;
	SubCategories: any;
	Promotions=[];
	Testimonials=[];
	Coupons=[];
	Category:any;
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
	showall=0;
	ShowAll(sts){
		this.showall=sts;
		this.LoadSubcategories();
	}
	TestPost()
  {
	  this.httpClient.post<any>("http://blist.ptezone.com.au/api.php",{ID:15})
		.subscribe(data => {
			alert(data.ID);
		},
		err => {
		})
  }
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
  constructor(public platform:Platform, public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, public nativeStorage: NativeStorage, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public diagnostic:Diagnostic) {
		this.LoadCategories();
		this.LoadCoupons();
		this.LoadSubcategories();
		this.LocationAccuracy();
		this.LoadTestimonials();
		this.LoadPromotions();
		this.TestPost();
  }
  LoadTestimonials()
  {
	  this.httpClient.get<any>('https://www.sevamitraa.com/api/GetTestimonials').subscribe(data => {
			this.Testimonials=data;
			console.log(data);
		},
		err => {
			//loading.dismiss();
			//this.ShowAlert("Error", "Poor internet Connection");
		});
  }
  LoadPromotions()
  {
	  this.httpClient.get<any>('https://www.sevamitraa.com/api/promotions').subscribe(data => {
			this.Promotions=data;
			console.log(data);
		},
		err => {
			//loading.dismiss();
			//this.ShowAlert("Error", "Poor internet Connection");
		});
  }
  LoadSubcategories()
  {
		this.httpClient.get<any>('https://www.sevamitraa.com/api/sub-categories-full/0').subscribe(data => {
			this.SubCategories=data;
			if(this.showall==0)
			{
				this.SubCategories.length=9;
			}
			else
			{
				this.SubCategories.length=data.length;
			}
			console.log(data);
		},
		err => {
			//loading.dismiss();
			//this.ShowAlert("Error", "Poor internet Connection");
		});
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad LandingPage');
  }
	LoadCategories()
	{
		this.httpClient.get<any>('https://www.sevamitraa.com/api/categories')
		.subscribe(data => {
			this.Categories=data;
			console.log(data);
		},
		err => {
			//this.ShowAlert("Error", "Poor internet Connection");
		})
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
			this.httpClient.get<any>('https://www.sevamitraa.com/api/sub-category/'+id)
			.subscribe(data => {
				console.log(data);
				this.navCtrl.push(BookPage, {
					Category: data.category_id,
					SubCategory:data.id
				});
			},
			err => {
				//this.ShowAlert("Error", "Poor internet Connection");
			});
		}
	}
	BookSub(id,category_id)
	{
		/*this.Category=this.navParams.get('Category');
		this.navCtrl.push(BookPage, {
			Category: category_id,
			SubCategory:id
		});*/
		this.Category=this.navParams.get('Category');
		this.navCtrl.push(ServicedetailPage, {
			Category: category_id,
			SubCategory:id
		});
	}
	GetProducts(CouponID)
	{
		this.navCtrl.push(SubcategoryPage, {
			CouponID: CouponID
		});
	}
	LoadCoupons()
	{
		this.httpClient.get<any>('https://www.sevamitraa.com/api/coupon-all')
		.subscribe(data => {
			this.Coupons=data.data;
			console.log("Coupons");
			console.log(this.Coupons);
		},
		err => {
			//this.ShowAlert("Error", "Poor internet Connection");
		});
	}
	GotoSearch()
	{
		this.navCtrl.push(SearchPage,{animate:true});
	}
	LocationAccuracy()
	{
		this.platform.ready().then(() => {
			this.diagnostic.isLocationEnabled().then(isOn=>{
				if(isOn==false)
				{
					this.diagnostic.switchToLocationSettings();
				}
			}).catch(error=>{
				this.diagnostic.switchToLocationSettings();
			});
		});
	}
	ViewTestimonial(id)
	{
		this.navCtrl.push(TestimonialPage, {
			id: id
		});
	}
}
