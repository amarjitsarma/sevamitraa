import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  ILatLng,
  Marker,
  BaseArrayClass
} from '@ionic-native/google-maps';

/**
 * Generated class for the MarkerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-marker',
  templateUrl: 'marker.html',
})
export class MarkerPage {

  map: GoogleMap;

  constructor(private googleMaps: GoogleMaps) {
	   
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad MarkerPage');
  }
	ngAfterViewInit() {
		this.loadMap();
	}
loadMap() {
}
}