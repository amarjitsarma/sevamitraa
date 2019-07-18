import { Component, NgZone, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, Slides, ModalController, Content } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { BookPage } from './../book/book';
/**
 * Generated class for the ServicedetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-servicedetail',
  templateUrl: 'servicedetail.html',
})
export class ServicedetailPage {
	ShowAlert(Title, Detail) {
        let alert = this.alertCtrl.create({
            title: Title,
            subTitle: Detail,
            buttons: ['Ok']
        });
        alert.present();
    }
	SubCategory:any;
	Category:any;
	Coupons=[];
	Reviews=[];
	AverageRating=0;
	ReviewsAvailable=0;
  constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, private ngZone: NgZone, public modalCtrl : ModalController) {
	  this.LoadDetail();
	  this.ReadReviews();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ServicedetailPage');
  }
  LoadDetail()
  {
	  let loading = this.loadingCtrl.create();
	  
	  var CatID=this.navParams.get('Category');
	  var SubID=this.navParams.get('SubCategory');
	  loading.present().then(()=>{
	  this.httpClient.get<any>('https://www.sevamitraa.com/api/GetSubCategoryDetail?sub_id='+SubID+'&cat_id='+CatID)
		.subscribe(data => {
			this.SubCategory=data.Sub;
			this.Category=data.Cat;
			this.Coupons=data.Coupons;
			console.log(data);
			loading.dismiss();
		},
		err => {
			//this.ShowAlert("Error", "Poor internet Connection");
			loading.dismiss();
		});
	  });
  }
  Book()
  {
	  this.Category=this.navParams.get('Category');
		this.navCtrl.setRoot(BookPage, {
			Category: this.navParams.get('Category'),
			SubCategory:this.navParams.get('SubCategory')
		});
  }
  ReadReviews()
  {
	  var SubID=this.navParams.get('SubCategory');
	  this.httpClient.get<any>('https://www.sevamitraa.com/api/ReviewsBySubCategory?SubCategoryID='+SubID)
		.subscribe(data => {
			this.ReviewsAvailable=data.length;
			this.Reviews=data;
			var totalrating=0;
			for(var i=0;i<data.length;i++)
			{
				totalrating=totalrating+data[i].rating;
			}
			this.AverageRating=totalrating/this.ReviewsAvailable;
		},
		err => {
			//this.ShowAlert("Error", "Poor internet Connection");
		});
  }
}
