import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  public getDataFromDB(formdata) {
    return this.http.post(
      environment.BASE_URL +
      environment.API_URL +
      's3/getSearchedFiles',
      formdata,
    );
  }
}
