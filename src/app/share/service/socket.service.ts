import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { io,Socket } from "socket.io-client";

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private http !: HttpClient
  socket !: Socket | null;
  rooms = []
  userName : string | undefined | null = ''
  userRoom : string | undefined | null = ''
  userInRoom : any[] = []

  constructor(private injector: Injector) { 
    this.http = this.injector.get(HttpClient)
  }

  init(){
    this.socket = io("http://localhost:3000/chat", {
      transports: ["websocket"],
    });
    this.socket.on('connect', () => {});
    this.socket.on('listRooms', (rooms) => {
      this.rooms = rooms
    });
    this.socket.on('userInRoom', (user) => {
      this.userInRoom = user.filter((u :any)=>u.room == this.userRoom)
    });
  }
}
