import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { setTime } from 'ngx-bootstrap/chronos/utils/date-setters';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { routes } from 'src/app/shared/routes/routes';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public routes = routes;
  public passwordClass = false;
  public ERROR=false;

  form = new FormGroup({
    email: new FormControl('sergio16ht@gmail.com', [
      Validators.required,
      Validators.email,
    ]),
    password: new FormControl('12345678', [Validators.required]),
  });

  get f() {
    return this.form.controls;
  }

  constructor(public auth: AuthService,public router: Router) {}
  ngOnInit(): void {
    // if (localStorage.getItem('authenticated')) {
    //   localStorage.removeItem('authenticated');
    // }
  }

    loginFormSubmit() {
      if (this.form.valid) {
        this.ERROR=false;
        this.auth.login(this.form.value.email ? this.form.value.email : '', this.form.value.password ? this.form.value.password : '')
        .subscribe((resp:any) => {
          console.log(resp); 
          if(resp){
            //login exitoso
          setTimeout(() => {
            this.auth.saveLocalStorage(resp);
          },50); // retraso de 50 milisegundos para que se guarde el token y el usuario en el local storage antes de redireccionar al dashboard
          this.router.navigate([routes.adminDashboard]);
          } else{
            //login fallido
            this.ERROR=true;
          }

        }, (error: any) => { // Specify the type of 'error' parameter as 'any'
          console.log(error);
        });
    }
  }
    togglePassword() {
      this.passwordClass = !this.passwordClass;
    }
}
