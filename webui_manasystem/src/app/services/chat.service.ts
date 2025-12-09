import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Message } from '../models/message.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  // Initialer State mit einer Begrüßungsnachricht
  private messagesSubject = new BehaviorSubject<Message[]>([
    { text: 'Hallo! Ich bin dein KI-Assistent. Schreibe mir etwas!', sender: 'bot', timestamp: new Date() }
  ]);

  public messages$: Observable<Message[]> = this.messagesSubject.asObservable();

  sendMessage(text: string): void {
    const currentMessages = this.messagesSubject.value;
    
    // 1. User Nachricht sofort anzeigen
    const userMsg: Message = { text, sender: 'user', timestamp: new Date() };
    this.messagesSubject.next([...currentMessages, userMsg]);

    // 2. Antwort simulieren (Verzögerung für Realismus)
    setTimeout(() => {
      this.generateBotResponse();
    }, 1500);
  }

  private generateBotResponse(): void {
    const currentMessages = this.messagesSubject.value;
    const botMsg: Message = {
      text: 'Das ist eine simulierte Antwort. Ich habe kein Backend, aber das UI funktioniert perfekt! 🤖',
      sender: 'bot',
      timestamp: new Date()
    };
    this.messagesSubject.next([...currentMessages, botMsg]);
  }
} 