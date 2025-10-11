import { NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// Firebase / AngularFire
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';



// Tus servicios
import { Auth } from './providers/auth/auth';
import { Capacitor } from '@capacitor/core';
import { environment } from 'src/environments/environment';



const providers = [Auth, ];

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [
    // 🔹 Inicializar Firebase
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),

    // 🔹 Tus servicios
    ...providers
  ]
})
export class CoreModule implements OnInit {
  // constructor(private readonly fileSrv: File) {
  //   if (Capacitor.isNativePlatform()) {
  //     this.ngOnInit();
  //   }
  // }

  async ngOnInit() {
    
  }
}

