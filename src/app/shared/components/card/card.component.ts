import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { doc, getDoc } from 'firebase/firestore';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  standalone: false,
})
export class CardComponent  implements OnInit, OnChanges {
  @Input() uid?: string;
  @Input() profile?: {
    id?: string | null;
    name?: string | null;
    lastName?: string | null;
    gender?: string | null;
    dob?: string | null; // MM/DD/YYYY
    photos?: string[] | null;
  };

  data: {
    name: string;
    gender: string | null;
    age: number | null;
    photo: string | null;
  } = { name: 'Usuario', gender: null, age: null, photo: null };

  private photos: string[] = [];
  photoIndex = 0;

  get hasMultiplePhotos(): boolean {
    return this.photos && this.photos.length > 1;
  }

  constructor(private readonly firestore: Firestore) { }

  async ngOnInit() {
    await this.resolveData();
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['uid'] || changes['profile']) {
      await this.resolveData();
    }
  }

  private async resolveData() {
    let p = this.profile;
    if (!p && this.uid) {
      try {
        const ref = doc(this.firestore, 'profiles', this.uid);
        const snap: any = await getDoc(ref);
        if (snap.exists()) {
          p = snap.data() as any;
        }
      } catch (e) {
        console.error('Card load profile error:', e);
      }
    }

    const name = p?.name ? String(p.name) : 'Usuario';
    const gender = (p?.gender ?? null) as string | null;
    const dob = (p?.dob ?? null) as string | null;
    const age = this.calcAgeFromDob(dob);
    this.photos = Array.isArray(p?.photos) ? (p!.photos as any[]).map(v => String(v)) : [];
    this.photoIndex = 0;
    const photo = this.photos.length > 0 ? this.photos[this.photoIndex] : null;

    this.data = { name, gender, age, photo };
  }

  nextPhoto() {
    if (this.photos.length < 2) return;
    this.photoIndex = (this.photoIndex + 1) % this.photos.length;
    this.data = { ...this.data, photo: this.photos[this.photoIndex] };
  }

  prevPhoto() {
    if (this.photos.length < 2) return;
    this.photoIndex = (this.photoIndex - 1 + this.photos.length) % this.photos.length;
    this.data = { ...this.data, photo: this.photos[this.photoIndex] };
  }

  private calcAgeFromDob(dobStr: string | null): number | null {
    if (!dobStr) return null;
    const m = dobStr.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (!m) return null;
    const mm = parseInt(m[1], 10);
    const dd = parseInt(m[2], 10);
    const yyyy = parseInt(m[3], 10);
    const d = new Date(yyyy, mm - 1, dd);
    if (d.getFullYear() !== yyyy || d.getMonth() !== mm - 1 || d.getDate() !== dd) return null;
    const today = new Date();
    let age = today.getFullYear() - d.getFullYear();
    const mDiff = today.getMonth() - d.getMonth();
    if (mDiff < 0 || (mDiff === 0 && today.getDate() < d.getDate())) age--;
    return age;
  }
}
