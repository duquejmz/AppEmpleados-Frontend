import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SignalrService } from '../../services/signalr.service';
import { AuthService } from '../../services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat-room',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss']
})
export class ChatRoomComponent implements OnInit, OnDestroy {
  roomCode!: string;
  userName!: string;
  messageForm!: FormGroup;
  messages: { user: string, message: string }[] = [];
  private messageSubscription!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private signalrService: SignalrService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const roomCode = this.route.snapshot.paramMap.get('roomCode');
    if (roomCode) {
      this.roomCode = roomCode;
    }
    const userName = this.authService.getUserId(); // Or a proper user name
    if(userName) {
        this.userName = userName;
    }

    this.messageForm = this.fb.group({
      message: ['', Validators.required]
    });

    if(this.roomCode && this.userName) {
        this.signalrService.startConnection(this.roomCode, this.userName);
    }

    this.messageSubscription = this.signalrService.message$.subscribe(message => {
      this.messages.push(message);
    });
  }

  ngOnDestroy(): void {
    this.signalrService.stopConnection();
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
  }

  sendMessage(): void {
    if (this.messageForm.valid) {
      const message = this.messageForm.value.message;
      this.signalrService.sendMessage(this.roomCode, this.userName, message);
      this.messageForm.reset();
    }
  }
}
