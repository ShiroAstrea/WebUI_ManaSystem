import { Component, ElementRef, ViewChild, AfterViewChecked, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';
import { Observable, BehaviorSubject } from 'rxjs';

interface Message {
  content: string;
  from: 'user' | 'bot';
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'] 
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  messages$!: Observable<Message[]>;
  private messagesSubject = new BehaviorSubject<Message[]>([]);
  userInput: string = '';

  constructor(private chatService: ChatService) {
    this.messages$ = this.messagesSubject.asObservable();
  }

  ngOnInit(): void {
    this.messagesSubject.next([]);
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  sendMessage(): void {
    const trimmedMessage = this.userInput.trim();
    if (!trimmedMessage) return;

    // User-Nachricht ins UI einfügen
    const currentMessages = this.messagesSubject.value;
    this.messagesSubject.next([...currentMessages, { content: trimmedMessage, from: 'user' }]);
    this.userInput = '';

    // API-Aufruf
    this.chatService.sendMessage(trimmedMessage).subscribe({
      next: (botReply: string) => {
        // botReply ist jetzt bereits reiner Text
        const updatedMessages = this.messagesSubject.value;
        this.messagesSubject.next([...updatedMessages, { content: botReply, from: 'bot' }]);
      },
      error: (err) => {
        const updatedMessages = this.messagesSubject.value;
        this.messagesSubject.next([...updatedMessages, { content: 'Fehler beim Senden!', from: 'bot' }]);
        console.error('API Fehler:', err);
      }
    });
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  private scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }
}
