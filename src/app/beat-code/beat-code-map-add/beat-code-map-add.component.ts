import { Component, OnInit } from '@angular/core';
declare const L: any

@Component({
  selector: 'app-beat-code-map-add',
  templateUrl: './beat-code-map-add.component.html'
})
export class BeatCodeMapAddComponent implements OnInit {
  data:any = {}
  myMap: any;
  constructor() {

    

   }

  ngOnInit() {
    setTimeout(() => {
      this.getMap2();
    }, 2000);
  }

  ngAfterViewInit() {
    
}



  getMap2() {

    
  const geometry = {
    "bounds": {
        "northeast": {
            "lat": 28.436009,
            "lng": 77.5036006
        },
        "southwest": {
            "lat": 28.2170151,
            "lng": 77.1504997
        }
    },
    "location": {
        "lat": 28.2919383,
        "lng": 77.355413
    },
    "location_type": "APPROXIMATE",
    "viewport": {
        "northeast": {
            "lat": 28.436009,
            "lng": 77.5036006
        },
        "southwest": {
            "lat": 28.2170151,
            "lng": 77.1504997
        }
    }
};

// Extract lat-lng pairs
const latLngArray = [];

// Push bounds northeast and southwest
latLngArray.push(
    { lat: geometry.bounds.northeast.lat, lng: geometry.bounds.northeast.lng },
    { lat: geometry.bounds.southwest.lat, lng: geometry.bounds.southwest.lng }
);

// Push location
// latLngArray.push(
//     { lat: geometry.location.lat, lng: geometry.location.lng }
// );

// Push viewport northeast and southwest
// latLngArray.push(
//     { lat: geometry.viewport.northeast.lat, lng: geometry.viewport.northeast.lng },
//     { lat: geometry.viewport.southwest.lat, lng: geometry.viewport.southwest.lng }
// );







        if (this.myMap) {
            this.myMap.off();
            this.myMap.remove();
        }
        
        // this.myMap = L.map('map');
        this.myMap = L.map('map').setView([33.7456185, 75.1499867], 16);
        var OSM = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 22,
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        });
        OSM.addTo(this.myMap);
        const marker = L.marker([ 33.7456185, 75.1499867]).addTo(this.myMap);
        marker.setIcon(L.icon({
          iconUrl: './assets/location/person.png',
          iconSize: [40, 40],
          iconAnchor: [16, 32],
          riseOnHover: true,
        }));
        marker.bindPopup('Address :');
      

        
        // this.myMap = L.map('map').setView([33.7455747, 75.1499785], 16);
        
        // Add OpenStreetMap layer
        var OSM = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 22,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        });
        OSM.addTo(this.myMap);
        
        // Array of locations
        const locations = [
            { "lat": 33.7456185, "lng": 75.1499867, "address": "P5W2+937, Chee, Anantnag, 192101" },
            { "lat": 33.7455747, "lng": 75.1499785, "address": "P5W2+937, Chee, Anantnag, 192101" },
            { "lat": 33.7455407, "lng": 75.1494204, "address": "P5W2+937, Chee, Anantnag, 192101" },
            { "lat": 33.746091, "lng": 75.1496128, "address": "P5W2+937, Chee, Anantnag, 192101" },
            { "lat": 33.7446091, "lng": 75.1493265, "address": "P5W2+937, Chee, Anantnag, 192101" },
            { "lat": 33.7452662, "lng": 75.1500416, "address": "P5W2+937, Chee, Anantnag, 192101" },
            { "lat": 33.7453919, "lng": 75.1498028, "address": "P5W2+937, Chee, Anantnag, 192101" },
            { "lat": 33.7454068, "lng": 75.1499634, "address": "P5W2+937, Chee, Anantnag, 192101" },
            { "lat": 33.7452834, "lng": 75.150022, "address": "P5W2+937, Chee, Anantnag, 192101" },
            { "lat": 33.745277, "lng": 75.1500489, "address": "P5W2+937, Chee, Anantnag, 192101" },
            { "lat": 33.7445989, "lng": 75.149224, "address": "P5W2+937, Chee, Anantnag, 192101" },
            { "lat": 33.7455332, "lng": 75.1500015, "address": "P5W2+937, Chee, Anantnag, 192101" },
            { "lat": 33.7454073, "lng": 75.14988, "address": "P5W2+937, Chee, Anantnag, 192101" }
        ];

        // Add markers for each location
        locations.forEach(location => {
            const marker = L.marker([location.lat, location.lng]).addTo(this.myMap);
            marker.setIcon(L.icon({
                iconUrl: './assets/location/person.png',
                iconSize: [40, 40],
                iconAnchor: [16, 32],
                riseOnHover: true,
            }));
            marker.bindPopup('Address: ' + location.address);
        });
        
        // Define the boundary coordinates
        const boundaryCoordinates = [
            [33.7465, 75.1493],
            [33.7460, 75.1505],
            [33.7450, 75.1507],
            [33.7440, 75.1499],
            [33.7443, 75.1489],
            [33.7452, 75.1485],
            [33.7465, 75.1493]

            // [28.436009, 77.5036006],
            // [28.2170151, 77.1504997],

        ];

        // Add a polygon to represent the boundary
        L.polygon(boundaryCoordinates, {
            color: 'red',
            weight: 2,
            opacity: 0.8,
            dashArray: '5, 5' // Dotted line style
        }).addTo(this.myMap);
}

getMap() {
  if (this.myMap) {
      this.myMap.off();
      this.myMap.remove();
  }

  // Initialize the map
  this.myMap = L.map('map').setView([28.2919383, 77.355413], 13);

  // Add OpenStreetMap tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 22,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(this.myMap);

  // Boundary data from Google API

  

  const geometry = {

    "bounds": {
      "northeast": {
        "lat": 28.4391082,
        "lng": 77.3166808
      },
      "southwest": {
        "lat": 28.3431463,
        "lng": 77.2692256
      }
    },
    "location": {
      "lat": 28.3899664,
      "lng": 77.2979782
    },

      // "bounds": {
      //     "northeast": {
      //         "lat": 28.436009,
      //         "lng": 77.5036006
      //     },
      //     "southwest": {
      //         "lat": 28.2170151,
      //         "lng": 77.1504997
      //     }
      // },
      // "location": {
      //     "lat": 28.2919383,
      //     "lng": 77.355413
      // }
  };

  // Extract northeast and southwest coordinates
  const bounds = [
      [geometry.bounds.southwest.lat, geometry.bounds.southwest.lng],
      [geometry.bounds.northeast.lat, geometry.bounds.northeast.lng]
  ];

  // Draw a rectangle using the bounds
  const rectangle = L.rectangle(bounds, {
      color: "red", // Border color
      weight: 2,     // Border thickness
      fillColor: "lightred", // Fill color
      fillOpacity: 0.2,      // Fill transparency
      dashArray: '5, 5'
  });
  rectangle.addTo(this.myMap);

  // Fit the map to the boundary
  this.myMap.fitBounds(bounds);

  // Optional: Add a marker at the center
  L.marker([geometry.location.lat, geometry.location.lng])
      .addTo(this.myMap)
      .bindPopup("Center of the boundary")
      .openPopup();
}


}
