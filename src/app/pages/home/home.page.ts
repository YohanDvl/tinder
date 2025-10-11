import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from 'src/app/core/providers/auth/auth';
import { UserService, Profile } from 'src/app/shared/services/user.service';
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
    private auth: Auth,
    private userService: UserService,
  ) { }

  profiles: Profile[] = [];

  async ngOnInit() {
    const uid = await this.auth.waitForUid();
    this.profiles = await this.userService.getDiscoverProfilesFirestore(uid);
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