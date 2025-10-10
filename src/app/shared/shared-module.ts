import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from './components/input/input.component';
import { ButtonComponent } from './components/button/button.component';
import { FloatingButtonComponent } from './components/floating-button/floating-button.component';
import { CardComponent } from './components/card/card.component';
import { ModalComponent } from './components/modal/modal.component';
import { SheetModalComponent } from './components/sheet-modal/sheet-modal.component';

const modules = [
  IonicModule,
  RouterModule,
  FormsModule,
  ReactiveFormsModule,

];

const components = [
  InputComponent,
  ButtonComponent,
  FloatingButtonComponent,
  CardComponent,
  ModalComponent,
  SheetModalComponent
];


@NgModule({
  declarations: [
 ... components
  
],
  imports: [
    CommonModule,
    ...modules
  ],
  exports: [
  ...modules,
   ... components
  ],
 
})
export class SharedModule { }
