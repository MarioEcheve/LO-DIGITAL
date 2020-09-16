import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../../environments/environment';

//import { SERVER_API_URL } from 'app/app.constants';
import { IUser } from '../TO/user.model';

@Injectable({ providedIn: 'root' })
export class RegisterService {
   SERVER_API_URL = environment.apiUrl;
  constructor(private http: HttpClient) {}

  save(account: IUser): Observable<{}> {
    return this.http.post(this.SERVER_API_URL + 'api/register', account);
  }
}
