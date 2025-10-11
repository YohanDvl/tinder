import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
    private fb: FormBuilder,
  ) {
    // Create form synchronously to avoid template errors before async load
    this.editForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      gender: ['man', [Validators.required]],
      interests: ['']
    });
  }

  profiles: Profile[] = [];
  editForm!: FormGroup;
  isSaving = false;
  meUid: string | null = null;

  async ngOnInit() {
    const uid = await this.auth.waitForUid();
    this.meUid = uid;
    this.profiles = await this.userService.getDiscoverProfilesFirestore(uid);
    if (uid) {
      await this.initEditForm(uid);
    }
  }

  private async initEditForm(uid: string) {
    const me = await this.userService.getProfile(uid);
    if (!me) return;
    this.editForm.patchValue({
      name: me.name ?? '',
      lastName: me.lastName ?? '',
      gender: me.gender ?? 'man',
      interests: (me.interests ?? []).join(', '),
    });
  }

  async saveProfile() {
    if (!this.editForm || !this.meUid) return;
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }
    this.isSaving = true;
    const { name, lastName, gender, interests } = this.editForm.value;
    const arr = String(interests || '')
      .split(',')
      .map((s: string) => s.trim())
      .filter((s: string) => !!s);
    try {
      await this.userService.updateProfile(this.meUid, {
        name,
        lastName,
        gender,
        interests: arr,
      });
    } finally {
      this.isSaving = false;
    }
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