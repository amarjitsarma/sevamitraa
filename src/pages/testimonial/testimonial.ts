import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, Slides, Platform } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { NativeStorage } from '@ionic-native/native-storage';
import { Diagnostic } from '@ionic-native/diagnostic';
import { DomSanitizer } from '@angular/platform-browser';
@IonicPage()
@Component({
  selector: 'page-testimonial',
  templateUrl: 'testimonial.html',
})
export class TestimonialPage {
	Testimonial:any="";
  constructor(public platform:Platform, public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, public nativeStorage: NativeStorage, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public diagnostic:Diagnostic, public dom:DomSanitizer) {
	  this.LoadTestimonial();
  }
  LoadTestimonial()
  {
	  var id=this.navParams.get("id");
	  this.httpClient.get<any>('https://www.sevamitraa.com/api/GetTestimonials?ID='+id).subscribe(data => {
			this.Testimonial=data;
			console.log(data);
		},
		err => {
			//loading.dismiss();
			//this.ShowAlert("Error", "Poor internet Connection");
		});
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TestimonialPage');
  }
	video(url)
	{
		return this.dom.bypassSecurityTrustResourceUrl(url);
	}
}
