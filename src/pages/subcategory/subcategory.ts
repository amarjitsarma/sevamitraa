import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController  } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { ServicedetailPage } from './../servicedetail/servicedetail';
@IonicPage()
@Component({
  selector: 'page-subcategory',
  templateUrl: 'subcategory.html',
})
export class SubcategoryPage {
	SubCategories: any;
	ShowAlert(Title, Detail) {
        let alert = this.alertCtrl.create({
            title: Title,
            subTitle: Detail,
            buttons: ['Ok']
        });
        alert.present();
    }
	Category: string;
	CouponID:string;
  constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController) {
	  this.LoadSubCategories();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad SubcategoryPage');
  }
  LoadSubCategories()
	{
		this.Category=this.navParams.get('Category');
		this.CouponID=this.navParams.get('CouponID');
		if(this.CouponID==null || this.CouponID=="")
		{
			this.httpClient.get<any>('https://www.sevamitraa.com/api/sub-categories/'+this.Category)
			.subscribe(data => {
				this.SubCategories=data;
				console.log(data);
			},
			err => {
				//this.ShowAlert("Error", "Poor internet Connection");
			})
		}
		else
		{
			this.httpClient.get<any>('https://www.sevamitraa.com/api/GetSubCategoryByCoupon?id='+this.CouponID)
			.subscribe(data => {
				this.SubCategories=data.SubCategories;
				console.log(data);
			},
			err => {
				//this.ShowAlert("Error", "Poor internet Connection");
			})
		}
	}
	Book(id,category_id)
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

}
