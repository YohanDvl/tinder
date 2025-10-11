import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { register } from 'swiper/element/bundle';
import { AppModule } from './app/app.module';

// Register Swiper Web Components (swiper-container / swiper-slide)
register();

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
