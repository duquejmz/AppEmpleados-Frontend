import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Room } from 'src/app/models/room';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = environment.apiUrl + '/chat';

  constructor(private http: HttpClient) { }

  createRoom(name: string, creatorId: string): Observable<Room> {
    return this.http.post<Room>(`${this.apiUrl}/room`, { name, creatorId });
  }

  joinRoom(roomCode: string): Observable<Room> {
    return this.http.get<Room>(`${this.apiUrl}/room/${roomCode}`);
  }
}
