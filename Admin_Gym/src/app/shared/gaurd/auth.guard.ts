import { Injectable } from '@angular/core';
import {
  
  CanActivate,
  Router,
  
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { routes } from '../routes/routes';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, public auth: AuthService) {}
  canActivate(
    
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
      // if (localStorage.getItem('authenticated')) {
      //   return true;
      // } else {
      //   this.router.navigate([routes.login]);
      //   return false;
      // }
      // console.log(this.auth.token,this.auth.user);
      if(!localStorage.getItem("token") || !localStorage.getItem("user")){
        this.router.navigate([routes.login]);
        return false;
      } // Se evalua si existe un token y un usuario en el local storage , si no existe se redirecciona al login

      let token:any =localStorage.getItem("token"); // Se obtiene el token del local storage
      //console.log(token);
      let expiration =(JSON.parse(atob(token.split('.')[1]))).exp; // Se obtiene la fecha de expiracion del token
      if(Math.floor((new Date().getTime())/1000)>=expiration){ // Se compara la fecha de expiracion del token con la fecha actual , si la fecha actual es mayor a la fecha de expiracion del token , el token ya expiro
        this.auth.logout();// Se cierra sesion automaticamente si el token ya expiro 
        return false;
      }
      //console.log(true);
      return true;
  }
}
