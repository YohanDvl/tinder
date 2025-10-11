import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Firestore, doc } from '@angular/fire/firestore';
import { getDoc } from 'firebase/firestore';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  standalone: false,
})

export class CardComponent  implements OnInit, OnChanges {
  @Input() uid?: string; // opcional: si se pasa, el componente carga el perfil desde Firestore
  @Input() profile?: {
    id?: string;
    name?: string;
    lastName?: string;
    gender?: string | null;
    dob?: string | null; // MM/DD/YYYY
    photos?: string[];
  };

  data: {
    name: string;
    gender: string | null;
    age: number | null;
    photo: string | null;
  } = { name: 'Usuario', gender: null, age: null, photo: null };

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
        const snap = await getDoc(ref as any);
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
    const photo = (p?.photos && p.photos.length > 0) ? String(p.photos[0]) : null;

    this.data = { name, gender, age, photo };
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
