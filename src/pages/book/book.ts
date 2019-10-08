import { Component, NgZone, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, Slides, ModalController, Content } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { Geolocation } from '@ionic-native/geolocation';
import { GoogleMaps, GoogleMap, GoogleMapsEvent, GoogleMapOptions, CameraPosition, MarkerOptions, Marker, BaseArrayClass } from '@ionic-native/google-maps';

import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal';

import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder';

import { MapsAPILoader } from '@agm/core';
import { Device } from '@ionic-native/device';
import { Diagnostic } from '@ionic-native/diagnostic';
import { BookingsPage } from './../bookings/bookings';
import { TabsPage } from './../tabs/tabs';

@IonicPage()
@Component({
  selector: 'page-book',
  templateUrl: 'book.html',
})
export class BookPage {
	@ViewChild(Slides) slides: Slides;
	@ViewChild(Content) content: Content;
	ShowAlert(Title, Detail) {
        let alert = this.alertCtrl.create({
            title: Title,
            subTitle: Detail,
            buttons: ['Ok']
        });
        alert.present();
    }
	Category="";
	SubCategory="";
	Windows=[];
	Coupons=[];
	Services=[];
	Types: any;
	ServiceList=[];
	TypeList=[];
	OptionList=[];
	valType=[];
	opType=[];
	valOption="";
	valOptionMain="";
	types;
	Tips=[];
	typeForm;
	dates=[];
	times=[];
	Options=[];
	Addresses=[];
	NewAddress=0;
	map: GoogleMap;
	
	OrderItems:any;
	house_flat:any="";
	location1="";
	landmark:any="";
	type:any="Office";
	pincode:any="";
	DeviceID="";
	Coupon="";
	PaymentMethod="cod";
	//Angular Map
	public latitude=0.00;
	public longitude=0.00;
	Address:any;
	HouseNo:any;
	Pincode:any;
	LandMark:any;
	Date:any;
	Time:any;
	public zoom:any;
	@ViewChild("search")
	public searchElementRef;
	error:string="";
	holidays:any=[];
	//Angular map
  constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public geolocation: Geolocation, public googlemap: GoogleMaps, private mapsAPILoader: MapsAPILoader, private ngZone: NgZone, public nativeGeocoder: NativeGeocoder, public modalCtrl : ModalController, public device: Device, public diagnostic:Diagnostic, private payPal: PayPal) {
	  this.LoadWindows();
	  this.LoadTimes();
	  this.LoadCoupons();
	  this.setCurrentPosition();
	  this.Date="";
	  this.Time="";
	  this.LoadAddresses();
	  this.LoadHolidays();
	  
  }
	doSubmit(event) {
		//console.log('Submitting form', this.typeForm.value);
		event.preventDefault();
  }
  LoadHolidays()
  {
	  this.httpClient.post<any>('https://www.sevamitraa.com/api/get_holidays',{sub_category:this.navParams.get('SubCategory')})
		.subscribe(data => {
			this.holidays=data;
		},
		err => {
		})
  }
  LoadCoupons()
  {
		this.Category=this.navParams.get('Category');
		this.SubCategory=this.navParams.get('SubCategory');
		this.httpClient.get<any>('https://www.sevamitraa.com/api/category-coupon/'+this.SubCategory)
		.subscribe(data => {
			this.Coupons=data.data;
			//console.log(this.Coupons);
		},
		err => {
			//this.ShowAlert("Error", "Poor internet Connection");
		})
  }
  ionViewDidLoad() {
    //console.log('ionViewDidLoad BookPage');
	this.slides.onlyExternal=true;
  }
  private setCurrentPosition() {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.latitude = position.coords.latitude;
                this.longitude = position.coords.longitude;
                this.zoom = 12;
            });
        }
    }
	WindowsValue=[];
	LoadWindows()
	{
		let loading = this.loadingCtrl.create();
		this.Category=this.navParams.get('Category');
		this.SubCategory=this.navParams.get('SubCategory');
		loading.present().then(()=>{
			this.httpClient.get<any>('https://www.sevamitraa.com/api/sub-category-window/'+this.SubCategory)
			.subscribe(data => {
				loading.dismiss();
				this.Windows=data.Windows;
				for(var i=0;i<this.Windows.length;i++)
				{
					this.WindowsValue.push({
						"Index":i,
						"TypeValues":[],
						"OptionValue":"",
						"OptionalValue":"",
						"ServiceValues":[]
					});
					if(this.Windows[i].window_type=="Type")
					{
						for(var j=0;j<this.Windows[i].Types.length;j++)
						{
							this.WindowsValue[i].TypeValues.push({"WindowIndex":i,"Index":j,"Value":0,"id":this.Windows[i].Types[j].id,"Services":this.Windows[i].Types[j].Services});
						}
					}
					else if(this.Windows[i].window_type=="Service")
					{
						for(var j=0;j<this.Windows[i].Services.length;j++)
						{
							this.WindowsValue[i].ServiceValues.push({"WindowIndex":i,"Index":j,"Value":0,"id":this.Windows[i].Services[j].id});
							this.Windows[i].Services[j]["Display"]=1;
						}
					}
					else if(this.Windows[i].window_type=="Option")
					{
						for(var j=0;j<this.Windows[i].Options.length;j++)
						{
							this.Windows[i].Options[j]["Display"]=1;
						}

					}
					//console.log("Window Value");
					//console.log(this.WindowsValue);
					console.log("Windows");
					console.log(this.Windows);
				}
				
			},
			err => {
				loading.dismiss();
				//this.ShowAlert("Error", "Poor internet Connection");
			})
		});
	}
	SearchServicesByType(windowindex,typeindex)
	{
		var ServiceListNew="";
		for(var i=0;i<this.WindowsValue[windowindex].TypeValues.length;i++)
		{
			if(this.WindowsValue[windowindex].TypeValues[i].Value>0)
			{
				if(this.WindowsValue[windowindex].TypeValues[i].Services!=null)
				{
					if(ServiceListNew!="")
					{
						ServiceListNew=ServiceListNew+",";
					}
					ServiceListNew=ServiceListNew+this.WindowsValue[windowindex].TypeValues[i].Services.services;
				}
			}
		}
		while(ServiceListNew.indexOf(" ")!=-1)
		{
			ServiceListNew=ServiceListNew.replace(" ","");
		}
		var KhabangServices=ServiceListNew.split(",");
		for(var j=windowindex+1;j<this.Windows.length;j++)
		{
			if(this.Windows[j].window_type=="Service")
			{
				console.log(this.Windows[j].Services);
				for(var k=0;k<this.Windows[j].Services.length;k++)
				{
					if(KhabangServices.indexOf(this.Windows[j].Services[k].id.toString())!=-1)
					{
						this.Windows[j].Services[k].Display=1;
					}
					else
					{
						this.Windows[j].Services[k].Display=0;
						this.Windows[j].Services[k].Value=0;
					}
				}
			}
		}
	}
	SearchServices(WindowIndex, OptionIndex)
	{
		var UnderOption=this.Windows[WindowIndex].Options[OptionIndex].under_option;
		var ServiceList=[];
		var BojroServices="";
		if(this.Windows[WindowIndex].Options[OptionIndex].services!=null)
		{
			BojroServices=this.Windows[WindowIndex].Options[OptionIndex].services;
		}
		while(BojroServices.indexOf(" ")!=-1)
		{
			BojroServices=BojroServices.replace(" ","");
		}
		if(BojroServices!="")
		{
			ServiceList=BojroServices.split(",");
		}
		if(UnderOption!=null)
		{
			for(var i=WindowIndex+1;i<this.Windows.length;i++)
			{
				if(this.Windows[i].window_type=="Option")
				{
					for(var j=0; j<this.Windows[i].Options.length;j++)
					{
						if(this.Windows[i].Options[j].option_id==UnderOption)
						{
							this.Windows[i].Options[j].Display=1;
						}
						else
						{
							this.Windows[i].Options[j].Display=0;
						}
					}
				}
			}
		}
		for(var i=WindowIndex+1;i<this.Windows.length;i++)
		{
			if(ServiceList.length!=0)
			{
				if(this.Windows[i].window_type=="Service")
				{
					for(var j=0; j<this.Windows[i].Services.length;j++)
					{
						
						if(ServiceList.indexOf(this.Windows[i].Services[j].id.toString())!=-1)
						{
							this.Windows[i].Services[j].Display=1;
						}
						else
						{
							this.Windows[i].Services[j].Display=0;
						}
					}
				}
			}
			else
			{
				if(this.Windows[i].window_type=="Service")
				{
					for(var j=0; j<this.Windows[i].Services.length;j++)
					{
						this.Windows[i].Services[j].Display=1;
					}
				}
			}
		}
		console.log(this.WindowsValue);
	}
	LoadTimes()
	{
		this.Category=this.navParams.get('Category');
		this.SubCategory=this.navParams.get('SubCategory');
		this.httpClient.get<any>('https://www.sevamitraa.com/api/GetTiming')
		.subscribe(data => {
			this.dates=data.Dates;
			this.times=data.Times;
		},
		err => {
			//this.ShowAlert("Error", "Poor internet Connection");
		});
	}
	SelectService(windowindex,index, check)
	{
		const foundAt = this.WindowsValue[windowindex].ServiceValues[index].Value;
		console.log(check);
		if(check==true)
		{
			console.log(check);
			this.WindowsValue[windowindex].ServiceValues[index].Value=1;
			console.log(this.WindowsValue[windowindex].ServiceValues[index]);
		}
		else
		{
			this.WindowsValue[windowindex].ServiceValues[index].Value=0;
		}
		console.log(this.WindowsValue[windowindex].ServiceValues[index]);
	}
	SelectType(itemKey)
	{
		const foundAt = this.TypeList.indexOf(itemKey);
		if (foundAt >= 0) {
			this.TypeList.splice(foundAt, 1);
		} else {
			this.TypeList.push(itemKey);
		}
	}
	GetOptions(ops)
	{
		this.OptionList=[];
		if(this.OptionList.length==0)
		{
			while(ops!="")
			{
				
				if(ops.indexOf(",")==-1)
				{
					this.OptionList.push(ops);
					ops="";
				}else
				{
					this.OptionList.push(ops.substring(0,ops.indexOf(",")));
					ops=ops.substring(ops.indexOf(",")+1);
				}
				if(ops=="")
				{
					break;
				}
			}
		}
		return this.OptionList;
	}
	option_selected=[];
	Show(data,index)
	{
		
	}
	AddTo(windowindex,typeindex)
	{
		this.WindowsValue[windowindex].TypeValues[typeindex].Value++;
		this.SearchServicesByType(windowindex,typeindex);
		console.log(this.WindowsValue);
	}
	RemoveFrom(windowindex,typeindex)
	{
		if(this.WindowsValue[windowindex].TypeValues[typeindex].Value!=0)
		{
			this.WindowsValue[windowindex].TypeValues[typeindex].Value--;
		}
		this.SearchServicesByType(windowindex,typeindex);
		console.log(this.WindowsValue);
	}
	GoNext(WindowIndex)
	{
		
		var Validation=0;
		if(WindowIndex!=1000 && WindowIndex!=900)
		{
			if((WindowIndex+1)<this.Windows.length)
			{
				if(this.Windows[WindowIndex+1].window_type=="service")
				{
					for(var j=0;j<this.WindowsValue[WindowIndex+1].ServiceValues.length;j++)
					{
						if(this.Services[j].Display==0)
						{
							this.WindowsValue[WindowIndex+1].ServiceValues[j].Value=0;
						}
					}
				}
			}
			if(this.Windows[WindowIndex].window_type=="Type")
			{
				var qty=0;
				for(var i=0;i<this.WindowsValue[WindowIndex].TypeValues.length;i++)
				{
					qty=qty+parseInt(this.WindowsValue[WindowIndex].TypeValues[i].Value);
				}
				if(qty>0)
				{
					Validation=1;
				}
				else
				{
					Validation=0;
				}
			}
			else if(this.Windows[WindowIndex].window_type=="Service")
			{
				for(var i=0;i<this.WindowsValue[WindowIndex].ServiceValues.length;i++)
				{
					console.log(this.WindowsValue[WindowIndex].ServiceValues[i].Value)
					if(parseInt(this.WindowsValue[WindowIndex].ServiceValues[i].Value)==1)
					{
						Validation=1;
						break;
					}
					else
					{
						Validation=0;
					}
				}
			}
			else if(this.Windows[WindowIndex].window_type=="Option")
			{
				console.log(this.WindowsValue[WindowIndex].OptionValue);
				if(parseInt(this.WindowsValue[WindowIndex].OptionValue)>=0)
				{
					Validation=1;
				}
			}
			else if(this.Windows[WindowIndex].window_type.indexOf("Optional")!=-1)
			{
				//console.log(this.WindowsValue[WindowIndex].OptionalValue);
				if(this.WindowsValue[WindowIndex].OptionalValue!="")
				{
					Validation=1;
				}
				else
				{
					Validation=0;
				}
			}
			else
			{
				Validation=1;
			}
		}
		else if(WindowIndex==900)
		{
			if(this.Date!="" && this.Time!="")
			{
				Validation=1;
			}
			else
			{
				Validation=0;
			}
		}
		else
		{
			Validation=1;
		}
		if(Validation==1)
		{
			let index=this.slides.getActiveIndex()+1;
			this.slides.slideTo(index, 500);
			this.Calculate();
		}
		else
		{
			this.ShowAlert("Error","Please fill up correctly");
		}
		this.content.scrollToTop();
		
		for(var z=0;z<this.opType.length;z++)
		{
			this.opType[z]=false;
		}
		
	}
	OnlyDisplayOption(Options)
	{
		var OptionsNew=[];
		for(var i=0;i<Options.length;i++)
		{
			if(Options[i].Display==1)
			{
				OptionsNew.push(Options[i]);
				OptionsNew[OptionsNew.length-1]["Index"]=i;
			}
		}
		return OptionsNew;
	}
	OnlyDisplayService(Services, WindowIndex)
	{
		var ServicesNew=[];
		for(var i=0;i<Services.length;i++)
		{
			if(Services[i].Display==1)
			{
				ServicesNew.push(Services[i]);
				ServicesNew[ServicesNew.length-1]["Index"]=i;
			}
		}
		console.log(ServicesNew);
		return ServicesNew;
	}
	GoPrevious(WindowIndex)
	{
		if(WindowIndex!=1000)
		{
			if(this.Windows[WindowIndex].window_type=="Type")
			{
				for(var i=0;i<this.WindowsValue[WindowIndex].TypeValues.length;i++)
				{
					this.WindowsValue[WindowIndex].TypeValues[i].Value=0;
				}
				if(WindowIndex>0)
				{
					if(this.Windows[WindowIndex-1].window_type=="Service")
					{
						for(var j=0;j<this.WindowsValue[WindowIndex-1].ServiceValues.length;j++)
						{
							this.WindowsValue[WindowIndex-1].ServiceValues[j].Value=0;
						}
					}
				}
			}
			else if(this.Windows[WindowIndex].window_type=="Service")
			{
				for(var i=0;i<this.WindowsValue[WindowIndex].ServiceValues.length;i++)
				{
					this.WindowsValue[WindowIndex].ServiceValues[i].Value=0;
				}
				if(WindowIndex>0)
				{
					if(this.Windows[WindowIndex-1].window_type=="Service")
					{
						for(var j=0;j<this.WindowsValue[WindowIndex-1].ServiceValues.length;j++)
						{
							this.WindowsValue[WindowIndex-1].ServiceValues[j].Value=0;
						}
					}
				}
			}
			else if(this.Windows[WindowIndex].window_type=="Option")
			{
				this.WindowsValue[WindowIndex].OptionValue="";
				if(WindowIndex>0)
				{
					if(this.Windows[WindowIndex-1].window_type=="Service")
					{
						for(var j=0;j<this.WindowsValue[WindowIndex-1].ServiceValues.length;j++)
						{
							this.WindowsValue[WindowIndex-1].ServiceValues[j].Value=0;
						}
					}
				}
			}
			else if(this.Windows[WindowIndex].window_type.indexOf("Optional")!=-1)
			{
				this.WindowsValue[WindowIndex].OptionalValue="";
				if(WindowIndex>0)
				{
					if(this.Windows[WindowIndex-1].window_type=="Service")
					{
						for(var j=0;j<this.WindowsValue[WindowIndex-1].ServiceValues.length;j++)
						{
							this.WindowsValue[WindowIndex-1].ServiceValues[j].Value=0;
						}
					}
				}
			}
		}
		
		let index=this.slides.getActiveIndex()-1;
		this.slides.slideTo(index, 500);
		this.Calculate();
		this.content.scrollToTop();
	}
	
	GetMyLocation()
	{
		let scope=this;
		let loading = this.loadingCtrl.create();
		this.DeviceID=this.device.uuid;
		if(this.DeviceID==null)
		{
			this.DeviceID="534b8b5aeb906015";
		}
		this.httpClient.get<any>('https://www.sevamitraa.com/api/checklogin/'+this.DeviceID)
		.subscribe(data1 => {
			if(data1.loggedin=="no")
			{
				var modalPage = this.modalCtrl.create('OtpbookPage');
				modalPage.present();
			}
			else
			{
				loading.present().then(()=>{
					loading.dismiss();
					this.geolocation.getCurrentPosition().then((resp) => 
					{
						this.latitude = resp.coords.latitude;
						this.longitude = resp.coords.longitude;
						let options: NativeGeocoderOptions = {
							useLocale: true,
							maxResults: 5
						};
						this.nativeGeocoder.reverseGeocode(this.latitude, this.longitude, options)
						.then((result: NativeGeocoderReverseResult[]) => {
							scope.location1=result[0].thoroughfare+", "+result[0].subLocality;
							scope.pincode=result[0].postalCode;
						})
						.catch((error: any) => this.error=error);
					},
					err => {
						loading.dismiss();
						//this.ShowAlert("Error", "Poor internet Connection");
					});
				});
			}
		});
	}
	LoadMyAddress()
	{
		let geocoder = new google.maps.Geocoder;
		let latlng = {lat: this.latitude, lng: this.longitude};
		geocoder.geocode({'location': latlng}, function(results, status) {
			this.Address=results[0].formatted_address;
			document.getElementById('txtHome').getElementsByTagName('input')[0].value=results[0].formatted_address;
			this.Pincode=results[0].address_components[results[0].address_components.length-1].long_name;
			document.getElementById('Pincode').getElementsByTagName('input')[0].value=results[0].address_components[results[0].address_components.length-1].long_name;
		});
	}
	LoadPinCode()
	{
		let geocoder = new google.maps.Geocoder;
		let latlng = {lat: this.latitude, lng: this.longitude};
		geocoder.geocode({'location': latlng}, function(results, status) {
			////console.log(results[0].address_components[results[0].address_components.length-1].long_name);
			this.Pincode=results[0].address_components[results[0].address_components.length-1].long_name;
			document.getElementById('Pincode').getElementsByTagName('input')[0].value=results[0].address_components[results[0].address_components.length-1].long_name;
		});
	}
	LoadMap(Lat, Long)
	{
		let mapOptions: GoogleMapOptions = {
      camera: {
         target: {
           lat: Lat,
           lng: Long
         },
         zoom: 18,
         tilt: 30
       }
    };

    this.map = GoogleMaps.create('map', mapOptions);

    let marker: Marker = this.map.addMarkerSync({
      title: 'My Location',
      icon: 'red',
      animation: 'DROP',
      position: {
        lat: Lat,
        lng: Long
      }
    });
    marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(data => {
      //alert('clicked');
    });
	}
	SelectedServices=[];
	Amount:any=0.00;
	Qty:any=0;
	distype:any="";
	dis:any=0;
	Calculate()
	{
		this.SelectedServices=[];
		var Item="";
		var Quantity=0;
		var Rate=0.00;
		var Total=0.00;
		var Types=[];
		var Services=[];
		for(var i=0;i<this.WindowsValue.length;i++)
		{
			if(this.WindowsValue[i].TypeValues.length>0)
			{
				Types=this.WindowsValue[i].TypeValues;
			}
			else if(this.WindowsValue[i].ServiceValues.length>0)
			{
				Services=this.WindowsValue[i].ServiceValues;
			}
		}
		this.OrderItems=[];
		if(Types.length>0)
		{
			this.Amount=0;
			for(var j=0;j<Types.length;j++)
			{
				if(Types[j].Value!=0)
				{
					for(var k=0;k<Services.length;k++)
					{
						if(Services[k].Value!=0)
						{
							if(Types[j].Services!=null)
							{
								var KhabangServices=Types[j].Services.services.split(",");
								if(KhabangServices.indexOf(Services[k].id.toString())!=-1)
								{
									this.OrderItems.push({
										"Item":this.Windows[Types[j].WindowIndex].Types[Types[j].Index].title+this.Windows[Services[k].WindowIndex].Services[Services[k].Index].title,
										"Rate":this.Windows[Services[k].WindowIndex].Services[Services[k].Index].price,
										"Quantity":Types[j].Value,
										"Total":parseFloat(this.Windows[Services[k].WindowIndex].Services[Services[k].Index].price)*parseInt(Types[j].Value)
									});
									this.Amount=this.Amount+parseFloat(this.Windows[Services[k].WindowIndex].Services[Services[k].Index].price)*parseInt(Types[j].Value);
								}
							}
							else
							{
								this.OrderItems.push({
									"Item":this.Windows[Types[j].WindowIndex].Types[Types[j].Index].title+this.Windows[Services[k].WindowIndex].Services[Services[k].Index].title,
									"Rate":this.Windows[Services[k].WindowIndex].Services[Services[k].Index].price,
									"Quantity":Types[j].Value,
									"Total":parseFloat(this.Windows[Services[k].WindowIndex].Services[Services[k].Index].price)*parseInt(Types[j].Value)
								});
								this.Amount=this.Amount+parseFloat(this.Windows[Services[k].WindowIndex].Services[Services[k].Index].price)*parseInt(Types[j].Value);
							}
						}
					}
				}
			}
		}
		else
		{
			this.Amount=0;
			for(var k=0;k<Services.length;k++)
			{
				if(Services[k].Value!=0)
				{

					this.OrderItems.push({
						"Item":this.Windows[Services[k].WindowIndex].Services[Services[k].Index].title,
						"Rate":this.Windows[Services[k].WindowIndex].Services[Services[k].Index].price,
						"Quantity":1,
						"Total":this.Windows[Services[k].WindowIndex].Services[Services[k].Index].price
					});
					this.Amount=this.Amount+parseFloat(this.Windows[Services[k].WindowIndex].Services[Services[k].Index].price);
				}
			}
		}
		if(this.Coupon!=undefined || this.Coupon!="")
		{
			this.distype=this.Coupon.substring(this.Coupon.indexOf(".")+1);
			this.dis=parseFloat(this.Coupon.substring(0,this.Coupon.indexOf(".")));
		}
	}
	CloseBook()
	{
		//this.MakePayment();
		this.navCtrl.setRoot(TabsPage);
	}
	BookOrder()
	{
		
		this.DeviceID=this.device.uuid;
		if(this.DeviceID==null)
		{
			this.DeviceID="534b8b5aeb906015";
		}
		//this.ShowAlert("DeviceID",this.DeviceID);
		let geocoder = new google.maps.Geocoder;
		let latlng = {lat: this.latitude, lng: this.longitude};
		
		
		var data={Address:this.location1,
				HouseNo:this.house_flat,
				LandMark:this.landmark,
				Pincode:this.pincode,
				SelectedServices: this.SelectedServices,
				valType:this.valType,
				valOption:this.valOption,
				BookDate:this.Date,
				BookTime:this.Time,
				Coupon: this.Coupon,
				Amount: this.Amount
				};
		if(this.Coupon!=undefined || this.Coupon!="")
		{
			this.distype=this.Coupon.substring(this.Coupon.indexOf(".")+1);
			this.dis=parseFloat(this.Coupon.substring(0,this.Coupon.indexOf(".")));
		}
		geocoder.geocode({'location': latlng}, function(results, status) {
			this.Pincode=results[0].address_components[results[0].address_components.length-1].long_name;
			data.Pincode=this.Pincode;
		});
		
		let loading = this.loadingCtrl.create();
		loading.present().then(()=>{
			this.httpClient.get<any>('https://www.sevamitraa.com/api/checklogin/'+this.DeviceID)
			.subscribe(data1 => {
				loading.dismiss();
				if(data1.loggedin=="no")
				{
					loading.dismiss();
					//this.ShowAlert("Caution!","You're not logged in");
					var modalPage = this.modalCtrl.create('OtpbookPage');
					modalPage.present();
				}
				else
				{
					if(this.Address!="" && this.HouseNo!="")
					{
						if(this.Amount==0 && this.Services.length!=0)
						{
							this.ShowAlert("Error","Selection of service or type may be empty");
						}
						else
						{
							let PostData={
								device_id:this.DeviceID,
								option1:[data.valOption],
								discount_type:this.distype,
								discount:this.dis,
								sub_category:this.SubCategory,
								_location:data.Address,
								book_time:data.BookTime,
								book_date:data.BookDate,
								pincode:data.Pincode,
								landmark:data.LandMark,
								house_flat:data.HouseNo,
								latitude:this.latitude,
								longitude:this.longitude,
								amount:this.Amount,
								service_title: data.SelectedServices,
								order_items:this.OrderItems,
								tot_qty:data.valType,
								payment_type:this.PaymentMethod
								
							};
							this.httpClient.post<any>('https://www.sevamitraa.com/api/book-order',PostData).subscribe(data => {
								
								if(data.error==1)
								{
									loading.dismiss();
									this.ShowAlert("Error",data.message);
								}
								else
								{
									this.ShowAlert("Success","Booking successful");
									setTimeout(function () {
										loading.dismiss();
										location.reload();
									}, 5000);
								}
							},
							err => {
								loading.dismiss();
								this.error=JSON.stringify(err);
							})
						}
					}
					else
					{
						loading.dismiss();
						this.ShowAlert("Error","Invalid Details");
					}
				}
			},
			err => {
				loading.dismiss();
				//this.ShowAlert("Error", "Poor internet Connection");
			})
		});
	}
	OffTime:any="";
	TimeByDate(mytimes)
	{
		var showTimes=[];
		var Month=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
		var Today=new Date();
		var FormatDate=Today.getDate()+" "+Month[Today.getMonth()]+" "+Today.getFullYear();
		if(Today.getDate()<10)
		{
			FormatDate="0"+FormatDate;
		}
		var FormatTime=Today.getHours();
		console.log(JSON.stringify(this.holidays).search(this.Date));
		if(this.Date=="")
		{
			return showTimes;
		}
		else if(JSON.stringify(this.holidays).search(this.Date)!=-1)
		{
			for(var ih=0;ih<this.holidays.length;ih++)
			{
				if(this.holidays[ih].mydate==this.Date)
				{
					if(this.holidays[ih].time_slot=="" || this.holidays[ih].time_slot=="All")
					{
						return showTimes;
					}
					else
					{
						this.OffTime=this.holidays[ih].time_slot;
						var i=0;
						if(FormatTime<9 && FormatDate==this.Date)
						{
							i=0;
						}
						else if((FormatTime==9 || FormatTime==10) && FormatDate==this.Date)
						{
							i=1;
						}
						else if((FormatTime==11 || FormatTime==12) && FormatDate==this.Date)
						{
							i=2;
						}
						else if((FormatTime==13 || FormatTime==14) && FormatDate==this.Date)
						{
							i=3;
						}
						else if((FormatTime==15 || FormatTime==16) && FormatDate==this.Date)
						{
							i=4;
						}
						for(var j=i;j<mytimes.length;j++)
						{
							if(mytimes[j]!=this.OffTime)
							{
								showTimes.push(mytimes[j]);
							}
						}
						console.log(showTimes);
						if(showTimes.length==0)
						{
							this.Time="";
						}
						return showTimes;
					}
				}
			}
		}
		else
		{
			if(FormatDate==this.Date)
			{
				var i=0;
				if(FormatTime<9)
				{
					return mytimes;
				}
				else if(FormatTime==9 || FormatTime==10)
				{
					i=1;
				}
				else if(FormatTime==11 || FormatTime==12)
				{
					i=2;
				}
				else if(FormatTime==13 || FormatTime==14)
				{
					i=3;
				}
				else if(FormatTime==15 || FormatTime==16)
				{
					i=4;
				}
				else
				{
					return showTimes;
				}
				for(var j=i;j<mytimes.length;j++)
				{
					showTimes.push(mytimes[j]);
				}
				console.log(showTimes);
				if(showTimes.length==0)
				{
					this.Time="";
				}
				return showTimes;
			}
			else
			{
				return mytimes;
			}
		}
		
	}
	slideChanged()
	{
		console.log(this.WindowsValue);
		var index=this.slides.getActiveIndex();
		if(index<this.Windows.length)
		{
			if(this.Windows[index].window_type=='Service')
			{
				for(var i=0;i<this.WindowsValue[index].ServiceValues.length;i++)
				{
					this.WindowsValue[index].ServiceValues[i].Value=0;
				}
			}
		}
		this.content.scrollToTop();
	}
	FOF(i)
	{
		if(this.Addresses[i].pincode=="0")
		{
			this.NewAddress=1;
			this.house_flat="";
			this.location1="";
			this.pincode="";
			this.landmark="";
			this.latitude=0;
			this.longitude=0;
		}
		else
		{
			this.NewAddress=0;
			this.house_flat=this.Addresses[i].house_flat;
			this.location1=this.Addresses[i].address;
			this.pincode=this.Addresses[i].pincode;
			this.landmark=this.Addresses[i].landmark;
			this.latitude=this.Addresses[i].latitude;
			this.longitude=this.Addresses[i].longitude;
		}
	}
	BookPrevious()
	{
		this.NewAddress=0;
	}
	LoadAddresses()
	{
		this.DeviceID=this.device.uuid;
		if(this.DeviceID==null)
		{
			this.DeviceID="534b8b5aeb906015";
		}
		this.httpClient.get<any>('https://www.sevamitraa.com/api/checklogin/'+this.DeviceID)
		.subscribe(data1 => {
			
			if(data1.loggedin!="no")
			{
				this.httpClient.post<any>('https://www.sevamitraa.com/api/GetAddressByUser',{device_id:this.DeviceID}).subscribe(data => {
					this.Addresses=data.Addresses;
					if(data.Addresses.length==0)
					{
						this.NewAddress=1;
					}
					else
					{
						this.NewAddress=0;
					}
				},
				err => {
					this.error=JSON.stringify(err);
					this.NewAddress=1;
				});
			}
			else
			{
				this.NewAddress=1;
			}
		},
		err=>{
			this.NewAddress=1;
		});
	}
	INRToUSD(INR)
	{
		this.httpClient.get<any>('https://free.currconv.com/api/v7/convert?q=INR_USD&compact=ultra&apiKey=c2da3c9aee6dd729bd4f').subscribe(data => {
			var value=(parseFloat(INR)*parseFloat(data.INR_USD));
			return value;
		},
		err => {
			return INR;
		});
	}
}
