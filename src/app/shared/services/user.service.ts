import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { doc, setDoc, collection, getDocs, query, limit, getDoc, updateDoc } from 'firebase/firestore';
import { Auth } from 'src/app/core/providers/auth/auth';
import { supabase } from 'src/app/database/supabase';
import { Auth as AuthFirebase, signInWithEmailAndPassword } from '@angular/fire/auth';

export interface IUser {
  uid: string;
  name: string;
  lastName: string;
  email: string;
  password: string;
}

export interface IAuth extends Pick<IUser, 'email' | 'password'> {}

export interface IUserCreate extends Omit<IUser, 'uid'> {}

export interface IUserProfileCreate extends IUserCreate {
  country: string;
  gender: string;
  dob: string; // MM/DD/YYYY
  interests: string[];
  photos: string[];
}

export interface Profile {
  id: string;
  name: string | null;
  lastName?: string | null;
  email?: string | null;
  gender: string | null;
  dob?: string | null; // MM/DD/YYYY
  country?: string | null;
  interests?: string[];
  photos: string[];
}

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(
    private readonly auth: Auth,
    private readonly firestore: Firestore,
    private readonly afAuth: AuthFirebase,
  ) {}

  // Create auth account if needed and store profile in Firestore
  async create(data: IUserProfileCreate): Promise<{ uid: string }> {
      
     const uid = await this.auth.register(data.email, data.password);
    // if (!uid) {
    //   try {
    //   } catch (e) {
    //     // Si ya existe la cuenta u otro error, intentamos iniciar sesión con esas credenciales
    //     try {
    //       const cred = await signInWithEmailAndPassword(this.afAuth, data.email, data.password);
    //       uid = cred.user?.uid ?? null;
    //     } catch (e2) {
    //       throw e2;
    //     }
    //   }
    //   if (!uid) throw new Error('No se pudo obtener UID del usuario');
    // }

    const profile = {
      id: uid,
      name: data.name,
      lastName: data.lastName,
      email: data.email,
      country: data.country,
      gender: data.gender,
      dob: data.dob,
      interests: data.interests || [],
      photos: data.photos || [],
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    const ref = doc(this.firestore, 'profiles', uid);
    await setDoc(ref, profile, { merge: true });
    return { uid };
  }

  // Get a single profile by uid
  async getProfile(uid: string): Promise<Profile | null> {
    try {
      const ref = doc(this.firestore, 'profiles', uid);
      const snap: any = await getDoc(ref);
      if (!snap.exists()) return null;
      const d = snap.data() || {};
      return {
        id: String(d.id ?? uid),
        name: d.name ?? null,
        lastName: d.lastName ?? null,
        email: d.email ?? null,
        gender: d.gender ?? null,
        dob: d.dob ?? null,
        country: d.country ?? null,
        interests: Array.isArray(d.interests) ? d.interests : [],
        photos: Array.isArray(d.photos) ? d.photos.map((p: any) => String(p)) : [],
      };
    } catch (e) {
      console.error('getProfile error:', e);
      return null;
    }
  }

  // Update editable fields of profile
  async updateProfile(uid: string, partial: Partial<Pick<Profile, 'name' | 'lastName' | 'gender' | 'interests'>>): Promise<void> {
    const ref = doc(this.firestore, 'profiles', uid);
    const payload: any = { ...partial, updatedAt: new Date().toISOString() };
    // Ensure interests is array
    if (partial.interests && !Array.isArray(partial.interests)) {
      payload.interests = [partial.interests].filter(Boolean);
    }
    await updateDoc(ref as any, payload);
  }

  // Optional: fetch profiles from Supabase table 'profiles' if you sync there, else adapt to Firestore
  async getDiscoverProfiles(currentUid?: string | null): Promise<Profile[]> {
    const query = supabase.from('profiles').select('id, name, gender, photos');
    if (currentUid) query.neq('id', currentUid);
    const { data, error } = await query;
    if (error) {
      console.error('Supabase profiles error:', error.message);
      return [];
    }
    return (data ?? []).map((row: any) => ({
      id: String(row.id),
      name: row.name ?? null,
      gender: row.gender ?? null,
      photos: Array.isArray(row.photos) ? row.photos.map((p: any) => String(p)) : [],
    }));
  }

  // Fetch profiles from Firestore, excluding the current user (client-side filter), limited for performance
  async getDiscoverProfilesFirestore(excludeUid?: string | null, pageSize = 50): Promise<Profile[]> {
    const col = collection(this.firestore, 'profiles');
    const q = query(col, limit(pageSize));
    const snap = await getDocs(q as any);
    const list: Profile[] = [];
    snap.forEach((docSnap: any) => {
      const d = docSnap.data() || {};
      const id = String(d.id ?? docSnap.id);
      if (excludeUid && id === excludeUid) return; // exclude self
      list.push({
        id,
        name: d.name ?? null,
        lastName: d.lastName ?? null,
        email: d.email ?? null,
        gender: d.gender ?? null,
        dob: d.dob ?? null,
        country: d.country ?? null,
        interests: Array.isArray(d.interests) ? d.interests : [],
        photos: Array.isArray(d.photos) ? d.photos.map((p: any) => String(p)) : [],
      });
    });
    return list;
  }
}
