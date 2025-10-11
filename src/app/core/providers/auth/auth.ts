
import { Injectable } from '@angular/core';
import { Auth as AuthFirebase, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signOut
} from '@angular/fire/auth';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class Auth {
  constructor(private readonly authFirebase: AuthFirebase, private readonly router: Router){}

  async register(email: string, password: string){
   const resp = await createUserWithEmailAndPassword(this.authFirebase, email, password);
    console.log(resp);

   return resp.user.uid;

  }

   async login(email: string, password:string): Promise<boolean> {
      try {
        const em = (email ?? '').trim();
        const pw = (password ?? '').trim();
        if (!em || !pw) return false;
        const response = await signInWithEmailAndPassword(this.authFirebase, em, pw);
        if (response && response.user) {
          await this.router.navigateByUrl('/home', { replaceUrl: true });
          return true;
        }
        return false;
      } catch (error) {
        console.error('Login error:', (error as any)?.code || (error as any)?.message || error);
        return false;
      }
  }

      async logOut(){
      try {
        await signOut(this.authFirebase)
      } catch (error) {
        console.log((error as any).message);

      }
    }

    // Exponer el UID del usuario actual (o null si no hay sesión)
    getUid(): string | null {
      return this.authFirebase.currentUser?.uid ?? null;
    }

    getEmail(): string | null {
      return this.authFirebase.currentUser?.email ?? null;
    }

    // Espera hasta que el UID esté disponible (útil al entrar tras login o recarga)
    async waitForUid(timeoutMs = 5000): Promise<string | null> {
      const start = Date.now();
      while (Date.now() - start < timeoutMs) {
        const uid = this.getUid();
        if (uid) return uid;
        await new Promise((r) => setTimeout(r, 100));
      }
      return this.getUid();
    }

}
