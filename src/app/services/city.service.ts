import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CityService {

  constructor(private http: HttpClient) { }

  getCapitals(hint: string) {
    return this.http.get(
      'https://restcountries.eu/rest/v2/capital/' + hint
    );
  }
}
