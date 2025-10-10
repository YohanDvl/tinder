import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false,
})
export class RegisterPage implements OnInit {
 name!: FormControl;
 lastName!: FormControl;
 email!: FormControl;
 password!: FormControl;
 country!: FormControl;
 gender!: FormControl;
 dob!: FormControl; // stores ISO date string
 interests!: FormControl; // string[]
 photos!: FormControl;    // File[]
 registerForm!: FormGroup;
 step = 1;

 countries: string[] = [
   'Argentina','Bolivia','Brasil','Chile','Colombia','Costa Rica','Ecuador','España','México','Perú','Uruguay'
 ];

 interestOptions: string[] = [
   'Music','K-pop','Yoga','Football','Gaming','Movies','Art','Travel','Fitness','Cooking','Pets','Outdoors'
 ];

 photoSlots = Array(6).fill(null);
 photosPreview: (string | null)[] = Array(6).fill(null);
 dobError = false;
 genderError = false;
 // Pattern for MM/DD/YYYY
 private dobRegex: RegExp = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;

  constructor(private router: Router) {
    this.initForm();
  }

  public async doRegister(){
    const payload = {
      ...this.registerForm.value,
      gender: this.gender.value,
      dob: this.dob.value,
      interests: this.interests.value || [],
      photos: (this.photos.value || []).length
    };
    console.log('Register payload', payload);
    // TODO: integrate with API
    this.router.navigate(['/home']);

  }

  ngOnInit() {
  }

  private initForm(){
    this.name = new FormControl('', [Validators.required]);
    this.lastName = new FormControl('', [Validators.required]);
    this.email = new FormControl('', [Validators.required, Validators.email]);
    this.password = new FormControl('', [Validators.required]);
    this.country = new FormControl('', [Validators.required]);
    this.gender = new FormControl<string | null>(null, [Validators.required]);
  this.dob = new FormControl<string | null>(null, [Validators.required, Validators.pattern(this.dobRegex)]);
    this.interests = new FormControl<string[]>([]);
    this.photos = new FormControl<File[]>([]);

    this.registerForm = new FormGroup({
      name: this.name,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
      country: this.country,
      gender: this.gender,
      dob: this.dob,
      interests: this.interests,
      photos: this.photos,

    });
  }

  // Navigation between steps with basic validation per step
  nextStep(){
    if(this.step === 1){
      if(!this.isStep1Valid()) return;
    }
    if(this.step === 2){
      if(!this.gender.value){
        this.genderError = true;
        return;
      }
      this.genderError = false;
    }
    if(this.step === 3){
      if(this.dob.invalid || this.dobError || !this.dob.value) return;
    }
    if(this.step < 5) this.step += 1;
  }

  private isStep1Valid(): boolean {
    const controls = [this.name, this.lastName, this.email, this.password, this.country];
    controls.forEach(c => c.markAsTouched());
    return controls.every(c => c.valid);
  }

  prevStep(){
    if(this.step > 1) this.step -= 1;
  }

  goLogin(){
    this.router.navigate(['/login']);
  }

  setGender(value?: string){
    if(!value) return;
    this.gender.setValue(value);
    this.genderError = false;
  }

  onGenderChange(ev: CustomEvent){
    const val = (ev?.detail as any)?.value;
    if (val == null) return;
    this.setGender(String(val));
  }

  // Called on each input change; validates format and 18+
  onDobTyped(){
    const raw = (this.dob.value || '').trim();
    // If format invalid, let the pattern validator show the error and don't show 18+ yet
    if(!this.dobRegex.test(raw)){
      this.dobError = false;
      return;
    }

    const date = this.parseDob(raw);
    if(!date){
      // Invalid combination like 02/30/2020
      this.dob.setErrors({ pattern: true });
      this.dobError = false;
      return;
    }
    this.dobError = !this.isAdultFromDate(date);
  }

  // Parse MM/DD/YYYY to Date ensuring month/day are valid
  private parseDob(str: string): Date | null {
    const m = str.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if(!m) return null;
    const mm = parseInt(m[1], 10);
    const dd = parseInt(m[2], 10);
    const yyyy = parseInt(m[3], 10);
    const d = new Date(yyyy, mm - 1, dd);
    if(d.getFullYear() !== yyyy || d.getMonth() !== mm - 1 || d.getDate() !== dd) return null;
    return d;
  }

  private isAdultFromDate(dob: Date): boolean {
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age >= 18;
  }

  toggleInterest(tag: string){
    const set = new Set(this.interests.value || []);
    if(set.has(tag)) set.delete(tag); else set.add(tag);
    this.interests.setValue(Array.from(set));
  }

  isInterestSelected(tag: string){
    return (this.interests.value || []).includes(tag);
  }

  onPhotoSelected(evt: Event, index: number){
    const input = evt.target as HTMLInputElement;
    if(!input.files || !input.files[0]) return;
    const file = input.files[0];

    const current = this.photos.value || [];
    const updated = [...current];
    updated[index] = file;
    this.photos.setValue(updated);

    const reader = new FileReader();
    reader.onload = () => {
      this.photosPreview[index] = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

}
