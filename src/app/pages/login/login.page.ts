import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Auth } from 'src/app/core/providers/auth/auth';
import { firstValueFrom } from 'rxjs';

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

  loginErrorMessage: string | null = null;
  isSubmitting = false;
  invalidToastOpen = false;
  invalidToastMessage = 'Usuario o contraseña incorrectos.';

  public async onlogin(){
    if (this.loginForm.invalid){
      this.loginForm.markAllAsTouched();
      this.showInvalidFeedback();
      return;
    }
    
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    this.loginErrorMessage = null;
    try {
      const call = this.auth.login(this.email.value, this.password.value);
      const result = (call as any)?.subscribe ? await firstValueFrom(call as any) : await call;

      // Éxito si el resultado es truthy; de lo contrario, mostrar advertencia
      const success = !!result;

      if (!success) {
        this.showInvalidFeedback();
        return;
      }
      // ...existing success navigation...
    } catch {
      this.showInvalidFeedback();
    } finally {
      this.isSubmitting = false;
    }
  }


  private showInvalidFeedback() {
    this.loginErrorMessage = 'Usuario o contraseña incorrectos.';
    this.invalidToastMessage = 'Usuario o contraseña incorrectos.';
    this.invalidToastOpen = true;
    try { this.password.setValue(''); } catch {}
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