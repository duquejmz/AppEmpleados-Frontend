import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  private hubConnection!: signalR.HubConnection;
  private messageSubject = new Subject<{ user: string, message: string }>();
  public message$: Observable<{ user: string, message: string }> = this.messageSubject.asObservable();

  constructor() { }

  public startConnection(roomCode: string, userName: string): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(environment.apiUrl + '/chathub')
      .build();

    this.hubConnection
      .start()
      .then(() => {
        console.log('Connection started');
        this.addToGroup(roomCode, userName);
      })
      .catch(err => console.log('Error while starting connection: ' + err));

    this.hubConnection.on('ReceiveMessage', (user, message) => {
      this.messageSubject.next({ user, message });
    });
  }

  public addToGroup(roomCode: string, userName: string): void {
    this.hubConnection.invoke('AddToGroup', roomCode, userName)
      .catch(err => console.error(err));
  }

  public sendMessage(roomCode: string, userName: string, message: string): void {
    this.hubConnection.invoke('SendMessage', roomCode, userName, message)
      .catch(err => console.error(err));
  }

  public stopConnection(): void {
    this.hubConnection.stop()
      .then(() => console.log('Connection stopped'))
      .catch(err => console.log('Error while stopping connection: ' + err));
  }
}
