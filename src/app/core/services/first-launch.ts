import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class FirstLaunch {
 private readonly FirstLaunchKey = "FirstLaunch";
  private ready: Promise<void>;

  constructor(private readonly str: Storage) {
    this.ready = this.init();
  }

  private async init() {
    await this.str.create();
  }

  async isFirstLaunch(): Promise<boolean> {
    await this.ready;
    const value = await this.str.get(this.FirstLaunchKey);
    console.log('valor en el storage:', value);
    return value !== true;
  }

  async setLaunched(): Promise<void> {
    await this.ready;
    await this.str.set(this.FirstLaunchKey, true);
    console.log('Bien hecho guardado :', await this.str.get(this.FirstLaunchKey));
  }
}

