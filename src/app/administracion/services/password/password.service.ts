import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from './../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PasswordService {
  constructor(private http: HttpClient) {}
 SERVER_API_URL = environment.apiUrl;
  save(newPassword: string, currentPassword: string): Observable<{}> {
    return this.http.post(this.SERVER_API_URL + 'api/account/change-password', { currentPassword, newPassword });
  }
}
