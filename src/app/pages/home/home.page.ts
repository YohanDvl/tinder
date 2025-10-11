import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from 'src/app/core/providers/auth/auth';
import { UserService, Profile } from 'src/app/shared/services/user.service';
import { Uploader } from 'src/app/core/providers/uploader/uploader';
// import { AuthService } from 'src/app/services/auth.service'; // opcional

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone:false,
})
export class HomePage implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  constructor(
    private router: Router,
    private auth: Auth,
    private userService: UserService,
    private fb: FormBuilder,
    private upload: Uploader,
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
  saveToastOpen = false;
  saveToastMessage = '';
  saveToastColor: 'success' | 'danger' | 'warning' = 'success';
  myPhotos: string[] = [];

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
    this.myPhotos = Array.isArray(me.photos) ? me.photos : [];
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
      this.saveToastColor = 'success';
      this.saveToastMessage = 'Profile updated';
      this.saveToastOpen = true;
    } finally {
      this.isSaving = false;
    }
  }

  onAddPhoto() {
    const input = this.fileInput?.nativeElement;
    input?.click();
  }

  async onFilePicked(evt: Event) {
    if (!this.meUid) return;
    const input = evt.target as HTMLInputElement;
    const file = input.files && input.files[0];
    if (!file) return;
    try {
      // Read file as base64
      const b64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const ext = file.type.split('/')[1] || 'jpg';
      const name = `${this.meUid}_${Date.now()}.${ext}`;
      const path = await this.upload.upload('imagen', name, file.type, b64);
      const url = await this.upload.getUrl('imagen', path);
      this.myPhotos = [...this.myPhotos, url];
      await this.userService.updateProfile(this.meUid, { photos: this.myPhotos as any });
    } catch (e) {
      console.error('Add photo error', e);
    } finally {
      (evt.target as HTMLInputElement).value = '';
    }
  }

  async onDeletePhoto(index: number) {
    if (!this.meUid) return;
    try {
      const ok = window.confirm('Delete this photo?');
      if (!ok) return;
      const clone = [...this.myPhotos];
      clone.splice(index, 1);
      this.myPhotos = clone;
      await this.userService.updateProfile(this.meUid, { photos: this.myPhotos as any });
    } catch (e) {
      console.error('Delete photo error', e);
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