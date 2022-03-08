import { Component, OnInit } from '@angular/core';
import { UniProfile } from '../models/uni-profile.model';
import { UnicornService } from 'src/app/services/unicorn.service';
import { Router } from '@angular/router';
import { ChildProfile } from '../models/child-profile.model';

@Component({
  selector: 'app-uni-list',
  templateUrl: './uni-list.component.html',
  styleUrls: ['./uni-list.component.scss']
})

export class UniListComponent implements OnInit {

  // FOR UNICORNS
  uniProfiles!: UniProfile[];
  newUnicornProfiles!: UniProfile[];

  // FOR CHILDREN
  childProfiles!: ChildProfile[];
  newChildProfiles!: ChildProfile[];

  // POUR LE TEMPLATE
  matchInProgress!: boolean;
  wantABaby: boolean = false;
  
  // UTILISATION D'UNE OBSERVABLE AFIN D'INFORMER CE COMPOSANT (PARENT) D'UN CHANGEMENT D'ÉTAT DANS LE COMPOSANT ENFANT POUR LA VARIABLE "wantABaby"
  // Lorsqu'un enfant est créé, le bouton CREATE A BABY revient à son état initial (passe de CANCEL à CREATE A BABY)
  constructor(private unicornService: UnicornService, private router: Router) {
    this.unicornService.modifyWantABabyStatus$.subscribe(
      (data) => {
        this.wantABaby = data;
      }
    )
  }

  // INITIALISATION DES DONNÉES NÉCESSAIRES À L'AFFICHAGE ET AU TRAITEMENT DES INFORMATIONS
  ngOnInit() {
    this.uniProfiles = this.unicornService.uniProfiles;
    this.matchInProgress = this.unicornService.matchInProgress;
    this.wantABaby = this.unicornService.wantABaby;
    this.childProfiles = this.unicornService.childProfiles;

    // AJOUT D'UNE NOUVELLE LICORNE DANS LE LOCAL STORAGE
    if(localStorage.getItem('myUnicorns')) {
      this.newUnicornProfiles = JSON.parse(localStorage.getItem('myUnicorns') || '');

      for(let i = 0; i < this.newUnicornProfiles.length; i++) {
        let isUnicornFound = this.uniProfiles.find(
          uniProfile => this.newUnicornProfiles[i].id === uniProfile.id
        );
        if (isUnicornFound == null) {
          this.uniProfiles.push(this.newUnicornProfiles[i]);
        } 
      }
    }

    // // AJOUT D'UN ENFANT DANS LE LOCAL STORAGE
    if(localStorage.getItem('children')) {
      this.newChildProfiles = JSON.parse(localStorage.getItem('children') || '');
      let isChildFound;
      if (!this.childProfiles) {
        this.childProfiles = [];
      }
      for(let i = 0; i < this.newChildProfiles.length; i++) {
        isChildFound = this.childProfiles.find(
          childProfile => this.newChildProfiles[i].id === childProfile.id
        );
        if (isChildFound == null) {
          this.childProfiles.push(this.newChildProfiles[i]);
        } 
      }
    }
  }
  
  // ACCÈS AU FORMULAIRE VIA LE ROUTER
  openUnicornForm() {
    this.router.navigateByUrl('create_unicorn');
  }

  // TOGGLE DU BOUTON MAKE A MATCH
  onClickMakeAMatchOrCancel() {
    this.unicornService.matchInProgress = !this.unicornService.matchInProgress;
    this.matchInProgress = this.unicornService.matchInProgress;
    if (!this.unicornService.matchInProgress) {
      this.unicornService.cancelSelectedMatches();
    }
      if (this.wantABaby) {
        this.wantABaby = false;
      }
  }

  // TOGGLE DU BOUTON MAKE A BABY
  onClickWantABabyOrCancel() {
    this.unicornService.wantABaby = !this.unicornService.wantABaby;
    this.wantABaby = this.unicornService.wantABaby;
      if (this.matchInProgress) {
        this.wantABaby = false;
      }
  }

}
