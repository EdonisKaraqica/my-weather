import { Component, OnInit, ViewChild } from '@angular/core';
import { WeatherServiceService } from 'src/app/services/weather-service.service';
import { CityService } from 'src/app/services/city.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  savedLocations = [];
  rememberedLocations = [];
  currentLocation: any;
  filteredCities: any;
  geolocationPosition: any;
  weatherCurrent: any;
  location: string = '';
  selectedLocation: string = '';
  showWeather: boolean = false;
  showBar: boolean = false;

  constructor(
    private weatherService: WeatherServiceService,
    private cityService: CityService
    ) { }

  ngOnInit() {
    this.refreshEntries();
  }

  refreshEntries() {
    if (JSON.parse(localStorage.getItem('locations'))) {
      this.savedLocations = JSON.parse(localStorage.getItem('locations'));
      this.rememberedLocations = [];
      this.savedLocations.forEach(element => {
        this.weatherService.getWeatherCurrent(element).subscribe(data => {
          if (this.rememberedLocations.length < 3) {
            if (this.rememberedLocations.indexOf(data)) {
              this.rememberedLocations.push(data);
            }
          }
        });
      });
    }
  }

  onAllowLocation() {
    if (window.navigator && window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(
          position => {
              this.geolocationPosition = position;
              this.weatherService.getWeatherCurrentByGeo(position.coords.latitude, position.coords.longitude).subscribe(data => {
                this.currentLocation = data;
                this.selectLocation(this.currentLocation.name);
              });
          },
          error => {
              switch (error.code) {
                  case 1:
                      console.log('Permission Denied');
                      break;
                  case 2:
                      console.log('Position Unavailable');
                      break;
                  case 3:
                      console.log('Timeout');
                      break;
              }
          }
      );
  };
  }

  searchForCities() {
    if (this.location.length > 1) {
      this.cityService.getCapitals(this.location).subscribe(data => {
        this.filteredCities = data;
      },
      () => {
        this.filteredCities = [];
      })
    } else {
      this.filteredCities = [];
    }
  }

  selectLocation(selectedLocation) {
    this.filteredCities = [];
    this.location = selectedLocation;
    this.rememberLocation(selectedLocation);
    this.getWeatherCurrent(selectedLocation);
    this.refreshEntries();
  }

  getWeatherCurrent(selectedLocation){
    this.weatherService.getWeatherCurrent(selectedLocation).subscribe(data => {
      this.showWeather = true;
      this.weatherCurrent = data;
    });
  }

  rememberLocation(location) {
    if (this.savedLocations.length < 3) {
      if (this.savedLocations.indexOf(location) === -1) {
        this.savedLocations.push(location);
      }
    } else {
      this.savedLocations.shift();
      if (this.savedLocations.indexOf(location) === -1) {
        this.savedLocations.push(location);
      }
    }
    localStorage.setItem('locations', JSON.stringify(this.savedLocations));
  }
}
