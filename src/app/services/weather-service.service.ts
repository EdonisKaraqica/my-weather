import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherServiceService {

  constructor(private http: HttpClient) { }

  getWeatherCurrent(location: string){
    return this.http.get(
        'http://api.weatherstack.com/current?access_key=b3c71ba83caba952f3b7d1f68ddb95d0&query=' + location
    );
  }

  getWeatherCurrentByGeo(latitude, longitude) {
    return this.http.get(
      'http://api.openweathermap.org/data/2.5/weather?lat=42.6451358&lon=21.1510039&&APPID=1f29714fa063dbfff5cdd614b5a024ba'
    );
  }

  getCurrentIpLocation(): Observable<any> {
    return this.http.get('http://ipinfo.io');
  }
}
