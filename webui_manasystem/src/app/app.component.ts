import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './components/chat/chat.component'; // Pfad muss stimmen!

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ChatComponent], // WICHTIG: Hier laden wir den Chat
  templateUrl: './app.html',              // Dein Dateiname
  styleUrls: ['./app.css']                // Dein Dateiname
})
export class App {
  title = 'new_ui';
}