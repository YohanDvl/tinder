import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { AuthService } from 'src/app/services/auth.service'; // opcional

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone:false,
})
export class HomePage implements OnInit {
  constructor(
    private router: Router,
    // private auth: AuthService,
  ) { }

  ngOnInit() {
  }

  async onLogout() {
    try {
      // await this.auth.signOut(); // <-- tu cierre de sesión real si existe
    } catch {}
    // Limpia estado local
    sessionStorage.clear();
    localStorage.clear();
    // Redirige al login reemplazando el historial
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}