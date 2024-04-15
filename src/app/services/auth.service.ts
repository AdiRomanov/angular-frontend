import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../interfaces/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) { }

  registerUser(UserDetails: User){
    return this.http.post(`${this.baseUrl}/users`, UserDetails);
  }
}
