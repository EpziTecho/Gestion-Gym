import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
// import { BehaviorSubject } from 'rxjs';
import { routes } from '../routes/routes';
import { URL_SERVICIOS } from 'src/app/config/config';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
 
   user:any;
   token:any;
  constructor(
    private router: Router,
    public http: HttpClient,) {

      this.getLocalStorage(); // Se obtiene el token y el usuario del local storage para mostrarlo en el header cada vez que se recargue la pagina
       
    }

  getLocalStorage(){
    if(localStorage.getItem("token")&&localStorage.getItem("user")){
      let USER= localStorage.getItem("user");
      this.user=JSON.parse(USER ? USER : '');
      this.token = localStorage.getItem("token");
    }else{
    this.user=null;
    this.token=null;
    }
  } // Se obtiene el token y el usuario del local storage para mostrarlo en el header


  login(email:string,password:string){
    //localStorage.setItem('authenticated', 'true');
    //this.router.navigate([routes.adminDashboard]);
    let URL=URL_SERVICIOS+"/auth/login"; 
    return this.http.post(URL,{email: email,password: password}).pipe(
      map((auth: any) => {
        console.log(auth);
       const result= this.saveLocalStorage(auth);
        return result;
      }), 
      catchError((error:any) => {
      console.log(error);
      return of(undefined);
      })
    );
}

saveLocalStorage(auth:any){
  if(auth && auth.access_token){
    localStorage.setItem('token', auth.access_token); // Aqui se guarda el token en el local storage
    localStorage.setItem('user', JSON.stringify(auth.user)); // Aqui se guarda el usuario en el local storage , JSON.stringify() convierte el objeto a string
    localStorage.setItem('authenticated', 'true');
    return true;
  }
  return false;
}

logout() {
  localStorage.removeItem('token'); // Se remueve el token del local storage
  localStorage.removeItem('user'); // Se remueve el usuario del local storage
  localStorage.removeItem('authenticated'); // Se remueve el authenticated del local storage
  this.router.navigate([routes.login]); // Se redirige al login
}
}
