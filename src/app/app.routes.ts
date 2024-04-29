import { Routes } from '@angular/router';

export const routes: Routes = [
 {
  path:'',
  loadChildren:() => import('./register/register.routes').then(mod => mod.routes)
 },
 {
  path:'chat',
  loadChildren:() => import('./chat/chat.routes').then(mod => mod.routes)
 }
];