import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'app/shared/messages/notification.service';
import { LoginService } from './login.service';

@Component({
  selector: 'mt-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  navigatoTo: string

  loginForm: FormGroup
  // emailPattern = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i

  //Validators.email Permite teste@teste
  // emailPattern não permite teste@teste, apenas teste@teste.com ou .com.br ... etc

  constructor(private fb: FormBuilder,
    private loginService: LoginService,
    private notificationService: NotificationService,
    private activatedRoute: ActivatedRoute,
    private router: Router) {
    this.loginForm = this.fb.group({
      email: this.fb.control('', [Validators.required, Validators.email]), //Permite 
      password: this.fb.control('', [Validators.required]),
    });

    this.navigatoTo = this.activatedRoute.snapshot.params['to'] || btoa('/')
  }

  ngOnInit() {
  }

  login() {
    this.loginService.login(this.loginForm.value.email,
      this.loginForm.value.password)
      .subscribe(user => this.notificationService.notify(`Bem vindo, ${user.name}!`),
        response => //HttpErrorResponse
          this.notificationService.notify(response.error.message),
        () => { //callback não tem parâmetros
          this.router.navigate([atob(this.navigatoTo)])
        })
  }

}
