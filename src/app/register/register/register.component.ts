import { CommonModule } from '@angular/common';
import { Component,OnInit,OnDestroy,Injector } from '@angular/core';
import { FormsModule,ReactiveFormsModule,FormGroup,FormControl,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SocketService } from '../../share/service/socket.service'
@Component({
 selector: 'app-register',
 standalone: true,
 imports: [
 CommonModule,
 FormsModule,
 ReactiveFormsModule
 ],
 templateUrl: './register.component.html',
 styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit,OnDestroy{
 title = 'socket-io';
 router !: Router


 newRooms = new FormGroup({
 rooms : new FormControl('',[Validators.required,Validators.pattern(/^(?!.*-).*$/)]),
  name: new FormControl('',Validators.required),
 })

 listRooms = new FormGroup({
  rooms : new FormControl('',Validators.required),
  name: new FormControl('',Validators.required),
 })

 selectType = 'newRooms'
 socketService : SocketService
 constructor(private injector: Injector){
    this.router = this.injector.get(Router);
    this.socketService = this.injector.get(SocketService);
 }

 ngOnInit(): void {
    this.socketService.init()
  
 }

 ngOnDestroy(): void {

 }

 newRoomsSubmit(){
  this.socketService.socket?.emit('joinRoom',this.newRooms.value.rooms+'-'+this.newRooms.value.name)
  this.socketService.userName = this.newRooms.value.name
  this.socketService.userRoom = this.newRooms.value.rooms
  this.router.navigate(['chat'])
 }

 listRoomsSubmit(){
    this.socketService.socket?.emit('joinRoom',this.listRooms.value.rooms+'-'+this.listRooms.value.name)
    this.socketService.userName = this.listRooms.value.name
    this.socketService.userRoom = this.listRooms.value.rooms
    this.router.navigate(['chat'])
 }
}