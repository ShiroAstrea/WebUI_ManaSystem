import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface ChatResponse {
  response: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // sendMessage gibt jetzt Observable<string> zurück
  sendMessage(message: string): Observable<string> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const payload = {
      message: message,
      session_id: 'api',
      username: 'USERNAME67',
      origin: 'local'
    };

    // http.post gibt Observable<ChatResponse> zurück
    return this.http.post<ChatResponse>(`${this.apiUrl}/Chat`, payload, { headers })
      .pipe(
        map(res => res.response) // nur der Text wird zurückgegeben
      );
  }
}
