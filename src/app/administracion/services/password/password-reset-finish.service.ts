import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from './../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PasswordResetFinishService {
  SERVER_API_URL = environment.apiUrl;
  constructor(private http: HttpClient) {}

  save(key: string, newPassword: string): Observable<{}> {
    return this.http.post(this.SERVER_API_URL + 'api/account/reset-password/finish', { key, newPassword });
  }
}
