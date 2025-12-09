import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
// 1. WICHTIG: Den Chat importieren
import { ChatComponent } from './components/chat/chat.component';

@Component({
  selector: 'app-root',
  standalone: true,
  // 2. WICHTIG: ChatComponent hier in die Liste schreiben!
  imports: [CommonModule, RouterOutlet, ChatComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  title = 'new_ui';
}