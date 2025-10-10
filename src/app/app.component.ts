import { Component } from '@angular/core';
import { FirstLaunch } from './core/services/first-launch';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
   constructor(
    private readonly firstLaunchService: FirstLaunch,
    private readonly navCtrl: NavController
  ) {}

  async ngOnInit() {
    await this.checkFirstLaunch();
  }

  private async checkFirstLaunch() {
    const firstTime = await this.firstLaunchService.isFirstLaunch();

    if (firstTime) {
      console.log('primera vez mami entra');
      this.navCtrl.navigateRoot('/welcome'); 
      
    } else {
      console.log('entra al login ombe');
      this.navCtrl.navigateRoot('/login');
    }
  }
}

