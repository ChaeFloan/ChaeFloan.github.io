import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UnicornService } from 'src/app/services/unicorn.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-uni-form',
  templateUrl: './uni-form.component.html',
  styleUrls: ['./uni-form.component.scss']
})
export class UniFormComponent implements OnInit {

  genders = [
    {type: 'Female',
    },
    {type: 'Male',
    },
    {type: 'Other',
    }
  ]

  uniForm = new FormGroup(
    {
      'name': new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(15)]),
      'gender': new FormControl(this.genders[0], Validators.required),
      'age': new FormControl(null, [Validators.required, Validators.max(150), Validators.maxLength(3)]),
      'color': new FormControl('', [Validators.required, Validators.maxLength(7), Validators.minLength(7)]),
    }
  )

  constructor(private unicornService: UnicornService, private router: Router) {}

  ngOnInit() {}

  // SOUMISSION DU FORMULAIRE => TRANSMISSION DES DONNEES AU SERVICE
  onSubmit() {
    this.unicornService.addUniProfile(this.uniForm.value);
    this.uniForm.reset(this.uniForm.value);
    this.router.navigateByUrl('/home');
  }

}
