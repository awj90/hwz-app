import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Country } from '../models/country';
import { State } from '../models/state';

@Injectable()
export class LocationService {
  private SPRINGBOOT_BASE_API_URL_ENDPOINT: string =
    'http://localhost:8080/api';
  NUMBER_OF_COUNTRIES: number = 250; // constant
  NUMBER_OF_STATES: number = 250; // constant

  private EXTERNAL_IP_GEOLOCATION_API_URL_ENDPOINT: string =
    'https://jsonip.com/';

  constructor(private http: HttpClient) {}

  getCurrentCountryCode(): Observable<string> {
    return this.http
      .get<ApiGetResponseForCurrentCountryCode>(
        this.EXTERNAL_IP_GEOLOCATION_API_URL_ENDPOINT
      )
      .pipe(map((resp) => resp.country));
  }

  // GET /api/countries
  // select * from countries limit 250;
  // @RequestParam Integer size
  getCountries(): Observable<Country[]> {
    const FULL_API_URL_ENDPOINT = `${this.SPRINGBOOT_BASE_API_URL_ENDPOINT}/countries`;
    return this.http
      .get<ApiGetResponseForCountries>(FULL_API_URL_ENDPOINT, {
        params: new HttpParams().set('size', this.NUMBER_OF_COUNTRIES),
      })
      .pipe(map((resp) => resp._embedded.countries));
  }

  getStates(countryCode: string): Observable<State[]> {
    const FULL_API_URL_ENDPOINT = `${this.SPRINGBOOT_BASE_API_URL_ENDPOINT}/states/search/findByCountryCode`;
    return this.http
      .get<ApiGetResponseForStates>(FULL_API_URL_ENDPOINT, {
        params: new HttpParams()
          .set('code', countryCode)
          .set('size', this.NUMBER_OF_STATES),
      })
      .pipe(map((resp) => resp._embedded.states));
  }
}

// JSON format of the server response
interface ApiGetResponseForCountries {
  _embedded: {
    countries: Country[];
  };
}

// JSON format of the server response
interface ApiGetResponseForStates {
  _embedded: {
    states: State[];
  };
}

interface ApiGetResponseForCurrentCountryCode {
  ip: string;
  country: string;
}
