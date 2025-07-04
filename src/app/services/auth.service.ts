import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl + '/api/auth';
  private userIdKey = 'userId';
  private userNameKey = 'userName';

  constructor(private http: HttpClient) { }

  register(user: any): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, user).pipe(
      tap(response => {
        this.saveUserId(response.id);
        this.saveUserName(response.name);
      })
    );
  }

  login(credentials: any): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        this.saveUserId(response.id);
        this.saveUserName(response.name);
      })
    );
  }

  private saveUserId(userId: string) {
    localStorage.setItem(this.userIdKey, userId);
  }

  private saveUserName(userName: string) {
    localStorage.setItem(this.userNameKey, userName);
  }

  getUserId(): string | null {
    return localStorage.getItem(this.userIdKey);
  }

  getUserName(): string | null {
    return localStorage.getItem(this.userNameKey);
  }

  isLoggedIn(): boolean {
    return !!this.getUserId();
  }

  logout() {
    localStorage.removeItem(this.userIdKey);
    localStorage.removeItem(this.userNameKey);
  }
}
