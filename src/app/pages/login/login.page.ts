import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Auth } from 'src/app/core/providers/auth/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone : false,
})
export class LoginPage implements OnInit {
  public email!: FormControl;
  public password!: FormControl;
  public loginForm!: FormGroup;

public async onlogin(){
  if (this.loginForm.invalid){
    this.loginForm.markAllAsTouched();
    return;
  }
  console.log(this.loginForm.value);
  this.auth.login(this.email.value, this.password.value);

  
}
private initForm(){
    this.email = new FormControl('', [Validators.email, Validators.required]);
    this.password = new FormControl('', [Validators.required]);


    this.loginForm = new FormGroup({
      email: this.email,
      password: this.password,
    })
  }


  constructor(private readonly auth: Auth) {
    this.initForm();
    }

  ngOnInit() {}
}