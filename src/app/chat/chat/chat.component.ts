import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { SocketService } from '../../share/service/socket.service'
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit,OnDestroy{
 socketService : SocketService
 router !: Router
 chat = new FormGroup({
  massage: new FormControl('',Validators.required)
 })
 massage : any[] = []
  constructor(private injector: Injector){
    this.socketService = this.injector.get(SocketService);
    this.router = this.injector.get(Router);

  }

  ngOnInit(): void {
    if(!this.socketService.socket){
      this.router.navigate([''])
    }else{
      this.socketService.socket?.on('chat', (data) => {
        this.massage.push(data)
      });
      
    }
 }

 ngOnDestroy(): void {

 }

 sendMaessage(){
  this.socketService.socket?.emit('chat',{
    room :this.socketService.userRoom,
    name :this.socketService.userName,
    massage : this.chat.value.massage
  })
 }

 leaveRoom(){
  this.socketService.socket?.disconnect()
  this.socketService.socket = null
  this.router.navigate([''])
 }
}
