import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ChatService } from '../../services/chat.service';
import { AuthService } from '../../services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  createRoomForm!: FormGroup;
  joinRoomForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private chatService: ChatService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.createRoomForm = this.fb.group({
      roomName: ['', Validators.required]
    });

    this.joinRoomForm = this.fb.group({
      roomCode: ['', Validators.required]
    });
  }

  createRoom(): void {
    if (this.createRoomForm.valid) {
      const roomName = this.createRoomForm.value.roomName;
      const creatorId = this.authService.getUserId();
      if (creatorId) {
        this.chatService.createRoom(roomName, creatorId).subscribe(room => {
          this.router.navigate(['/chat', room.roomCode]);
        });
      }
    }
  }

  joinRoom(): void {
    if (this.joinRoomForm.valid) {
      const roomCode = this.joinRoomForm.value.roomCode;
      this.chatService.joinRoom(roomCode).subscribe(() => {
        this.router.navigate(['/chat', roomCode]);
      });
    }
  }
}
