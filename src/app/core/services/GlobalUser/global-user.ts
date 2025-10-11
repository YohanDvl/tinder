import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalUser {
  private name: string = '';
  private lastName: string = '';
  private email: string = '';
  private password: string = '';
  private country: string = '';
  private gender: string = '';
  private birthDate: string = '';
  private hobbits: string[] = [];
  private images: string[] = [];

  setName(name: string){
    this.name = name;
  }

  getName(): string{
    return this.name;
  }

  setlastName(lastName: string){
    this.lastName = lastName;
  }

  getlastName(): string{
    return this.lastName;
  }
  setEmail(email: string){
  this.email = email;
  }
  getEmail(): string{
    return this.email;
  }

  setPassword(password: string){
    this.password = password;
  }
  getPassword(): string{
    return this.password;
  }

  setcountry(country: string ){
    this.country = country;
  }

  getcontry(): string{
    return this.country;
  }
  setGender(geder: string){
    this.gender = geder;
  }

  getGender(): string{
    return this.gender;
  }

  setBirthDate(birthdate: string){
    this.birthDate = birthdate;
  }
  getBirthDate(): string{
    return this.birthDate;
  }

  setHobbits(hobbits: string []){
    this.hobbits = hobbits;
  }

  getHobbits(): string[]{
    return this.hobbits;
  }

  setImages(images: string[]){
   this.images = images;
  }

  getImages(): string[]{
    return this.images;
  }



}