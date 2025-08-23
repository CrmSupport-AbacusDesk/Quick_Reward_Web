import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DatabaseService } from 'src/_services/DatabaseService';
import { MatSliderModule } from '@angular/material/slider';
import * as moment from 'moment';
declare const L: any
import { CheckinViewComponent } from 'src/app/checkin-view/checkin-view.component';
import { MatDialog } from '@angular/material';
import { CryptoService } from 'src/_services/CryptoService';

@Component({
  selector: 'app-tracker',
  templateUrl: './tracker.component.html',
  styleUrls: ['./tracker.component.scss']

})
export class TrackerComponent implements OnInit {
  @ViewChild('mapElement') mapElement: ElementRef;
  tabType: any = 'Play Back';
  payload: any = {};
  filter: any = {};
  datanotfound: boolean = false;
  selectedDate: any;
  empData: any = {};
  Checkincount: any
  mapPlaybackControl: any
  checkin_data: any = [];
  skLoading: boolean = false
  mapInitialized: boolean = false
  battery: any = [];
  Attendancedata: any = []
  CheckinData: any = []
  batteryTime: any = [];
  marker1: any;
  totalDistanceSummary: any
  animatedMarker: any
  map: any;
  route: any;
  batteryChart: any;
  pathCoords: any = [];
  latestLocation: any = {}
  btnValue: boolean = true
  sliderValue = 0;
  animationInterval: any;
  mapVisible: boolean = true;
  PlayBackStarted: boolean = false;
  today_date: any = new Date();
  waypoints = [];
  location: any = [];
  origin: any;
  destination: any;
  lat: any;
  lng: any;
  padding0: any;
  LocationDistance: any;
  interval: any;
  index = 0
  marker: any;
  myMap: any;
  locationMarkers: any = [];
  @Input() dataToReceive: any;
  location_timeanddate: any;
  Locationtype: any;
  distance: any;
  isChartVisible = false;
  Totaldistance: any;
  Trackerlat: any;
  Trackerlng: any;
  dateTimeKM: any;
  playBackSliding: boolean = true
  track: any
  isLoading: boolean = false
  showSpeedSlider: boolean = false
  location_accuracy: any
  control: any = {
    progress: 0,
    speed: 800
  };
  encryptedData: any;
  decryptedData: any;
  isTodayLatest: boolean = false;
  suspectedLocation: any = [];


  constructor(public router: ActivatedRoute, public cryptoService: CryptoService, public dialog2: MatDialog, public service: DatabaseService, public toast: ToastrManager, public rout: Router) {
    // this.onWindowScroll();
    if (this.myMap) {
      this.myMap.off(); // Remove the existing map if it exists
      this.myMap.remove(); // Remove the existing map if it exists
    }


  }



  AttendanceSummary() {
    this.encryptedData = this.service.payLoad ? { 'start_date': this.filter.date, 'user_id': this.payload.user_id } : this.cryptoService.encryptData({ 'start_date': this.filter.date, 'user_id': this.payload.user_id });
    this.service.post_rqst(this.encryptedData, "Location/attendanceSummary").subscribe((result => {
      this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
      if (this.decryptedData['statusCode'] == 200) {
        this.Attendancedata = this.decryptedData['data'];
        this.Checkincount = this.decryptedData['checkinCount'];
        this.totalDistanceSummary = this.decryptedData['total_distance'];
        if (this.Attendancedata.length == 0) {
          this.datanotfound = true
        } else {
          this.datanotfound = false
        }

      } else {
        this.toast.errorToastr(this.decryptedData['statusMsg']);
      }
    }))

  }


  ngOnInit(): void {
    if (this.dataToReceive != undefined) {
      this.padding0 = this.dataToReceive.padding0;
      this.payload = { 'start_date': this.dataToReceive.start_date, 'user_id': this.dataToReceive.user_id };
      this.selectedDate = this.payload.start_date;
      this.filter.date = this.payload.start_date;
      this.getLatesRoute()
      this.getDetails();

    }
    else {
      this.router.params.subscribe(params => {
        this.payload = this.router.queryParams['_value'];

        if (this.payload) {
          this.filter.date = this.payload.start_date;
          this.selectedDate = this.filter.date;
          this.getLatesRoute()
          this.getDetails();
        }
      });
    }

  }




  defaultCoordinates: any = {}
  getDetails() {

    let header
    if (this.filter.date) {
      header = { 'start_date': this.filter.date, 'user_id': this.payload.user_id }
    }
    else {
      header = this.payload;
    }

    this.encryptedData = this.service.payLoad ? header : this.cryptoService.encryptData(header);
    this.service.post_rqst(this.encryptedData, "Location/getLatestGeoLocation")
      .subscribe((result => {
        this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
        if (this.decryptedData['statusCode'] == 200) {
          this.empData = this.decryptedData['user_data'];
          this.latestLocation = this.decryptedData['latest_location'];
          this.pathCoords = this.decryptedData['data'];
          this.isTodayLatest = moment(this.today_date).format('YYYY-MM-DD') == moment(this.filter.date).format('YYYY-MM-DD');
        } else {
          this.toast.errorToastr(this.decryptedData['statusMsg'])
        }
      }))
  }


  getLatesRoute() {
    this.skLoading = true;
    this.isLoading = true
    let header
    if (this.filter.date) {
      header = { 'start_date': this.filter.date, 'user_id': this.payload.user_id }
    }
    else {
      header = this.payload;
    }
    this.encryptedData = this.service.payLoad ? header : this.cryptoService.encryptData(header);
    this.service.post_rqst(header, "Location/getLatestRoute")
      .subscribe((result => {
        this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));

        if (this.decryptedData['statusCode'] == 200) {
          this.defaultCoordinates = { lat: this.decryptedData['latest_location']['lat'], lng: this.decryptedData['latest_location']['lng'] };
          this.location = this.decryptedData['data'];
          this.checkin_data = this.decryptedData['checkin_summary'];

          this.LocationDistance = this.decryptedData['distance']
          this.location_accuracy = this.decryptedData['location_accuracy']
          this.locationMarkers = this.location;
          this.skLoading = false;
          if (this.locationMarkers.length && this.tabType != 'Battery' && this.tabType != 'Attendance Summary') {
            if (this.mapPlaybackControl) {
              this.mapPlaybackControl = '';
            }

            setTimeout(() => {

              this.initializeMap();

            }, 3000);
            setTimeout(() => {

              this.isLoading = false

            }, 4000);


          }
        } else {
          this.toast.errorToastr(this.decryptedData['statusMsg'])
          this.isLoading = false
          this.skLoading = false;
        }
      }))
  }


  initializeMap(): void {
    if (this.myMap) {
      this.myMap.off(); // Remove the existing map if it exists
      this.myMap.remove(); // Remove the existing map if it exists

    }
    this.dateTimeKM = ''
    if (this.tabType == 'Play Back') {

      this.myMap = L.map('map').setView([this.locationMarkers[0].lat, this.locationMarkers[0].lng], 16);
      var OSM = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 22,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      });
      var googleHybrid = L.tileLayer('http://{s}.google.com/vt?lyrs=s,h&x={x}&y={y}&z={z}', {
        maxZoom: 22,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
      });
      var googleStreets = L.tileLayer('http://{s}.google.com/vt?lyrs=m&x={x}&y={y}&z={z}', {
        maxZoom: 22,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
      });
      googleStreets.addTo(this.myMap);
      var Dark = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 22
      });
      const polylinePoints = this.locationMarkers
      const polylineColors = this.locationMarkers.map(marker => (marker.type === 'Virtual') ? '#f49314' : '#00007b');
      const waypoints = polylinePoints.map(point => L.latLng(point.lat, point.lng));
      var polyline = L.polyline(waypoints, { linecap: 'round', color: polylineColors, stroke: true, weight: 4, lineJoin: 'round', fill: false }).addTo(this.myMap);
      this.myMap.fitBounds(polyline.getBounds());
      var polyline = L.polyline(polylinePoints, { color: polylineColors, weight: 4 }).addTo(this.myMap);
      polylinePoints.forEach((point, index) => {
        const marker = L.marker([point.lat, point.lng]).addTo(this.myMap);
        if (point.type == 'Checkin') {
          marker.setIcon(L.icon({
            iconUrl: './assets/location/checkin.png',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            riseOnHover: true,
          }));
          marker.bindPopup(`<p><strong><span style="color: blue">Checkin</span></strong><br /><strong>Customer : </strong> ${point.dr_name}<br /><strong>Address : </strong> ${point.address}<br /><strong>id : </strong> ${point.id} </p>`);
        }
        else if (point.type == 'Checkout') {
          marker.setIcon(L.icon({
            iconUrl: './assets/location/checkout.png',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            riseOnHover: true,
          }));
          marker.bindPopup(`<p><strong><span style="color: blue">Checkout</span></strong><br /><strong>Customer : </strong> ${point.dr_name}<br /><strong>Address : </strong> ${point.address}</p>`);
        }
        else if (point.type == 'Attendence Start') {
          marker.setIcon(L.icon({
            iconUrl: './assets/location/start_point.png',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            riseOnHover: true,
          }));
          marker.bindPopup('Address : ' + point.address)
        }
        else if (point.type == 'Attendence Stop') {
          marker.setIcon(L.icon({
            iconUrl: './assets/location/end_point.png',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            riseOnHover: true,
          }));
          marker.bindPopup('Address : ' + point.address)
        }
        else if (point.type == 'Checkout') {
          marker.setIcon(L.icon({
            iconUrl: './assets/location/bg_location.png',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            riseOnHover: true,
          }));
        }

        else {
          marker.setIcon(L.icon({
            iconUrl: './assets/location/bg_location.png',
            iconSize: [0, 0],
            iconAnchor: [16, 32],
            riseOnHover: true,
          }));
        }
      });

      this.checkin_data.forEach((point, index) => {
        const marker = L.marker([point.lat, point.lng]).addTo(this.myMap);
        if (point.type == 'Checkin') {
          marker.setIcon(L.icon({
            iconUrl: './assets/location/checkin.png',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            riseOnHover: true,
          }));
          marker.bindPopup(`<p><strong><span style="color: blue">Checkin</span></strong><strong>&nbsp;(${point.startTime})</strong>--<strong>&nbsp;(${point.stopTime})</strong> <br /><strong>Customer : </strong> ${point.dr_name}<br /><strong>Address : </strong> ${point.start_address}</p>`);
        }
        else if (point.type == 'Checkout') {

          marker.setIcon(L.icon({
            iconUrl: './assets/location/checkout.png',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            riseOnHover: true,
          }));
          marker.bindPopup(`<p><strong><span style="color: blue">Check-Out</span></strong><strong>&nbsp;(${point.startTime})</strong>--<strong>&nbsp;(${point.stopTime})</strong><br /><strong>Customer : </strong> ${point.dr_name}<br /><strong>Address : </strong> ${point.address}</p>`);

        }
        else if (point.type == 'Attendence Start') {
          marker.setIcon(L.icon({
            iconUrl: './assets/location/start_point.png',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            riseOnHover: true,
          }));
          marker.bindPopup('Address : ' + point.address)
        }
        else if (point.type == 'Attendence Stop') {
          marker.setIcon(L.icon({
            iconUrl: './assets/location/end_point.png',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            riseOnHover: true,
          }));
          marker.bindPopup('Address : ' + point.address)
        }
        else if (point.type == 'Checkout') {
          marker.setIcon(L.icon({
            iconUrl: './assets/location/bg_location.png',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            riseOnHover: true,
          }));
        }

        else {
          marker.setIcon(L.icon({
            iconUrl: './assets/location/bg_location.png',
            iconSize: [0, 0],
            iconAnchor: [16, 32],
            riseOnHover: true,
          }));
        }
      });

      const TrackerPoints = []
      polylinePoints.map((marker) => { TrackerPoints.push({ lng: marker.lng, lat: marker.lat, dateTime: moment(marker.date_created).format('DD MMM YYYY , hh:mm a') + ' (' + marker.total_distance_from_start + ' KM )' }) })

      this.track = new L.TrackPlayer(TrackerPoints, {
        markerIcon: L.icon({
          iconUrl: "./assets/location/person.png",
          iconSize: [50, 50],
          iconAnchor: [16, 32],
        }),
        speed: 1000,
        markerRotation: true,
        panTo: true,
        maxInterpolationTime: 4000,  // Smoother transitions
        rotationAngle: 0,  // Initial rotation

        followMarker: true,  // Follow the marker for better user experience
        orientations: []  // W
      }).addTo(this.myMap);

      this.control = {
        speed: this.track.options.speed,
        progress: this.track.options.progress * 100,
        start: () => {
          this.track.start();
        },
        pause: () => {
          this.track.pause();
        },
        status: "original",
        carLatLng: "original",
      };

      this.track.on("start", () => {

        this.control.status = "start";
        this.startInterval();
      });

      this.track.on("pause", () => {
        this.control.status = "pause";
        this.stopInterval();
      });

      this.track.on("finished", () => {
        this.control.status = "finished";
        this.stopInterval();
      });

      this.track.on("progress", (progress, { lng, lat, dateTime }, index) => {

        this.dateTimeKM = dateTime
        this.control.carLatLng = `${lng},${lat}`;
        this.control.progress = progress * 100;
        this.control.status = "moving";

      });


      var baseLayers = {
        "Streets": googleStreets,
        "OpenStreetMap": OSM,
        "Hybrid": googleHybrid,
        "Dark": Dark
      };
      L.control.layers(baseLayers).addTo(this.myMap);



    } else {

      this.myMap = L.map('map').setView([this.latestLocation.lat, this.latestLocation.lng], 16);
      var OSM = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 22,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      });
      OSM.addTo(this.myMap);
      const marker = L.marker([this.latestLocation.lat, this.latestLocation.lng]).addTo(this.myMap);
      marker.setIcon(L.icon({
        iconUrl: './assets/location/person.png',
        iconSize: [40, 40],
        iconAnchor: [16, 32],
        riseOnHover: true,
      }));
      marker.bindPopup('Address :' + this.latestLocation.gps);
    }
  }
  formatLabel(value: number): string {
    this.track.setSpeed(value);

    return `${value}`;
  }
  updateSpeed(event: any) {
    this.track.setSpeed(event.value);
  }
  updateProgress(event: any) {
    this.playBackSliding = true
    this.control.progress = event.value
    this.track.setProgress(event.value / 100);
    this.control.status = "pause";
  }
  setShowSpeedSlider() {
    this.showSpeedSlider = !this.showSpeedSlider
  }
  startInterval(): void {
    this.interval = setInterval(() => {
      const progress = this.control.progress + 1;
      if (progress <= 100) {
        this.control.progress = progress;
        this.track.setProgress(progress / 100);
      } else {
        clearInterval(this.interval);
      }
    }, 800);
  }

  stopInterval(): void {
    clearInterval(this.interval);
  }





  refresh() {
    if (this.control.status == 'start' || this.control.status == 'moving') {
      this.control.pause()
    }
    this.getDetails();
    this.getLatesRoute()



  }

  refreshData() {
    this.filter.date = moment(this.today_date).format('YYYY-MM-DD');
    this.getDetails();
    this.getLatesRoute()
    this.getSuspectLocation();
    this.selectedDate = this.today_date;
  }


  dateFormat(): void {
    this.filter.date = moment(this.selectedDate).format('YYYY-MM-DD');
    // this.getDetails();
    // this.getLatesRoute()
    this.AttendanceSummary()
    this.refresh();
    this.getBatteryInfo();
    this.getSuspectLocation();
    // this.getSlidertracker();
  }



  getBatteryInfo() {
    this.skLoading = true;
    let payLoad = { 'date': this.filter.date, 'user_id': this.payload.user_id }
    this.encryptedData = this.service.payLoad ? payLoad : this.cryptoService.encryptData(payLoad);

    this.service.post_rqst(this.encryptedData, "Location/dateWiseBatteryConsumption")
      .subscribe((result => {
        this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));

        if (this.decryptedData['statusCode'] == 200) {
          for (let i = 0; i < this.decryptedData['data'].length; i++) {
            const batteryValue = parseFloat(this.decryptedData['data'][i]['battery']) * 100;
            const roundedBatteryValue = parseFloat(batteryValue.toFixed(2));
            const formattedTime = moment(this.decryptedData['data'][i]['date']).format('h:mm a');
            this.battery.push(roundedBatteryValue);
            this.batteryTime.push(formattedTime);

          }
          this.skLoading = false;
          this.batteryChart = {
            type: "line",
            scaleX: {
              labels: this.batteryTime,
              "step": "86400000",

              "item": {
                "font-size": 9
              },
            },
            "tooltip": {
              "visible": false
            },
            plot: {
              aspect: "spline",
              "tooltip-text": "%t views: %v<br>%k",
              "shadow": 0,
              "line-width": "2px",
              "marker": {
                "type": "circle",
                "size": 3
              }
            },
            plotarea: {
              backgroundColor: 'transparent',
              marginTop: '20px',
            },
            "crosshair-x": {
              "line-color": "#efefef",
              "plot-label": {
                "border-radius": "5px",
                "border-width": "1px",
                "border-color": "#f6f7f8",
                "padding": "10px",
                "font-weight": "bold"
              },
              "scale-label": {
                "font-color": "#000",
                "background-color": "#f6f7f8",
                "border-radius": "5px"
              }
            },
            series: [{
              values: this.battery,
              monotone: true,
              text: "Battey Percent",
              lineColor: '#0071bd',
              "marker": {
                "background-color": "#0071bd",
              },

            },
            ]
          }

        }
        else {
          this.toast.errorToastr(this.decryptedData['statusMsg'])
          this.skLoading = false;
        }
      }))
  }

  getSuspectLocation() {
    this.skLoading = true;
    let payLoad = { 'date': this.filter.date, 'user_id': this.payload.user_id }
    this.encryptedData = this.service.payLoad ? payLoad : this.cryptoService.encryptData(payLoad);

    this.service.post_rqst(this.encryptedData, "Location/suspectLocations")
      .subscribe((result => {
        this.decryptedData = this.service.payLoad ? result : this.cryptoService.decryptData(JSON.stringify(result));
        if (this.decryptedData['statusCode'] == 200) {
          this.suspectedLocation = this.decryptedData['data'];
          this.skLoading = false;

        }
        else {
          this.toast.errorToastr(this.decryptedData['statusMsg'])
          this.skLoading = false;
        }
      }))
  }

  navigateToCheckinDetailPage(checkinPoint: any) {

    const dialogRef = this.dialog2.open(CheckinViewComponent, {
      panelClass: 'full-width-modal',
      data: {
        'user_id': checkinPoint.user_id,
        'date': checkinPoint.date_created,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
    });


  }




}
