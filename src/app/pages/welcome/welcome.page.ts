import { Component, OnInit } from '@angular/core';
import { FirstLaunch } from '../../core/services/first-launch';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
  standalone: false,
})
export class WelcomePage implements OnInit {

  constructor(
    private readonly firstLaunchService: FirstLaunch,
    private readonly navCtrl: NavController
  ) { }

  ngOnInit() {
   
  }

  async agree() {

    await this.firstLaunchService.setLaunched();

    this.navCtrl.navigateRoot('/login');
  }
}