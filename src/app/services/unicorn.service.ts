import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { ChildProfile } from "../models/child-profile.model";
import { UniProfile } from '../models/uni-profile.model';

@Injectable({
  providedIn: 'root'
})

export class UnicornService {

  // VARIABLES PERMETTANT L'AFFICHAGE DES DONNÉES DYNAMIQUES DANS LE TEMPLATE
  matchInProgress: boolean = false;
  wantABaby: boolean = false;


  // UTILISATION D'UNE OBSERVABLE AFIN D'INFORMER LE COMPOSANT PARENT D'UN CHANGEMENT D'ÉTAT DANS LE COMPOSANT ENFANT POUR LA VARIABLE "wantABaby"
  modifyWantABabyStatus$!: Observable<boolean>;
  wantABabyObservable = new Subject<boolean>();

  constructor(){
    this.modifyWantABabyStatus$ = this.wantABabyObservable.asObservable();

    // LOCAL STORAGE
    if(localStorage.getItem('myUnicorns')) {
      this.uniProfiles = JSON.parse(localStorage.getItem('myUnicorns') || '');
    } else {
      localStorage.setItem('myUnicorns', JSON.stringify(this.uniProfiles));
    }
  }

  modifyWantABabyStatus(data: boolean) {
    this.wantABabyObservable.next(data);
  }

  // FOR CHILD PROFILES
  childProfiles!: ChildProfile[];
  newChildProfiles!: ChildProfile[];

  // FOR UNICORN PROFILES
  newUnicornProfiles!: UniProfile[];

  uniProfiles: UniProfile[] = [
    {
      id: 1,
      name: 'Lucinda',
      gender: 'Female',
      age: 18,
      loverName: "",
      firstSelected: false,
      secondSelected: false,
      color: "#c7738d"
    },
    {
      id: 2,
      name: 'Carl',
      gender: 'Male',
      age: 42,
      loverName: "",
      firstSelected: false,
      secondSelected: false,
      color: "#01af00"
    },
    {
      id: 3,
      name: 'Miaou',
      gender: 'Female',
      age: 22,
      loverName: "",
      firstSelected: false,
      secondSelected: false,
      color: "#8981a3"
    },
    {
      id: 4,
      name: 'Ka',
      gender: 'Female',
      age: 54,
      loverName: "",
      firstSelected: false,
      secondSelected: false,
      color: "#efc610"
    },
    {
      id: 5,
      name: 'Philou',
      gender: 'Male',
      age: 55,
      loverName: "",
      firstSelected: false,
      secondSelected: false,
      color: "#ea4d3e"
    },
  ]

  // CREATION D'UNE NOUVELLE LICORNE
  addUniProfile(uniFormValue: { name: any; gender: any; age: any; color: string }) {
    let nextId = 0;
    uniFormValue.gender = uniFormValue.gender.type;
    this.uniProfiles.forEach(element => { if ( nextId <= element.id ) nextId = element.id + 1 });
    const newUniProfile = {
      id: nextId,
      name: uniFormValue.name, 
      gender: uniFormValue.gender, 
      age: uniFormValue.age,
      firstSelected: false,
      secondSelected: false,
      loverName: '',
      color: uniFormValue.color
    }

    if(!localStorage.getItem('myUnicorns')) {
      this.newUnicornProfiles = [];
    } else {
      this.newUnicornProfiles = JSON.parse(localStorage.getItem('myUnicorns') || '');
    }
    this.newUnicornProfiles.push(newUniProfile);

    localStorage.setItem('myUnicorns', JSON.stringify(this.newUnicornProfiles));
  }

  // SELECTION D'UNE LICORNE (DANS LA CONDITION DE MAKE A MATCH)
  selectThisOne(uniProfileId: number) {
    if (this.isFirstSelected()) {
      if (this.isSecondSelected()) {
        this.getUnicornById(uniProfileId).secondSelected = false;
      } else {
        this.getUnicornById(uniProfileId).secondSelected = true;
      }
    } else {
      this.getUnicornById(uniProfileId).firstSelected = true;
    }
  }

  // PERMET DE SAVOIR SI LE PROFIL CLIQUÉ EST LE "firstSelected" OU NON (DANS LA CONDITION DE MAKE A MATCH)
  isFirstSelected() {
    const firstUniProfile = this.uniProfiles.find(
      uniProfile => uniProfile.firstSelected === true
    );
    if (firstUniProfile) {
      return true;
    } else {
      return false;
    }
  }

  // PERMET DE SAVOIR SI LE PROFIL CLIQUÉ EST LE "secondSelected" OU NON (DANS LA CONDITION DE MAKE A MATCH)
  isSecondSelected() {
    const secondUniProfile = this.uniProfiles.find(
      uniProfile => uniProfile.secondSelected === true
    );
    if (secondUniProfile) {
      return true;
    } else {
      return false;
    }
  }

  // POUR LE TEMPLATE : PERMET DE PERMUTTER LES BOUTONS (si le "firstSelected" est CANCEL, le "secondSelected" prend la place du "firstSelected")
  modifySecondSelected() {
    const secondUniProfile = this.uniProfiles.find(
      uniProfile => uniProfile.secondSelected === true
    );
    if (secondUniProfile) {
      secondUniProfile.firstSelected = true;
      secondUniProfile.secondSelected = false;
    }
  }

  // METHODE "FIND" POUR ACCÉDER AU PROFIL DONT L'ID CORRESPOND À L'IDENTIFIANT ENTRÉ EN PARAMÈTRE
  getUnicornById(uniProfileId: number) {
    const uniProfile = this.uniProfiles.find(
      uniProfile => uniProfile.id === uniProfileId
    );
    if (uniProfile) {
      return uniProfile;
    } else {
      throw new Error ('Ce profile n\'existe pas !');
    }
  }

  // PERMET DE REMETTRE LE PROFIL SELECTIONNÉ À SON STATUT INITIAL (le bouton SELECT THIS ONE apparaît à nouveau)
  cancelMatch(uniProfileId: number) {
    if (this.getUnicornById(uniProfileId).firstSelected) {
      if(!this.isSecondSelected()) {
        this.getUnicornById(uniProfileId).firstSelected = false;
      } else {
        this.getUnicornById(uniProfileId).firstSelected = false;
        this.modifySecondSelected();
      }
    } else {
      this.getUnicornById(uniProfileId).secondSelected = false;
    }
  }

  // EN CONDITION DE MAKE A MATCH, lors du clique sur CANCEL (bouton en haut de page)
  // -> CETTE METHODE ANNULE LES MATCHES EN COURS (si un profil est sélectionné mais qu'aucun match n'est confirmé)
  cancelSelectedMatches() {
    const firstUniProfile = this.uniProfiles.find(
      uniProfile => uniProfile.firstSelected === true
    );
    if (firstUniProfile) {
      firstUniProfile.firstSelected = false;
      const secondUniProfile = this.uniProfiles.find(
        uniProfile => uniProfile.secondSelected === true
      );
      if (secondUniProfile) {
        secondUniProfile.secondSelected = false;
      }
    }
  }

  // CREATION D'UN ENFANT
  createABabyUnicorn(uniProfileId: number) {
    let nextBabyId = 0;
    if (this.childProfiles) {
      this.childProfiles.forEach(element => { if ( nextBabyId <= element.id ) nextBabyId = element.id + 1});
    }
    const firstParentSelected = this.getUnicornById(uniProfileId);
    const secondParentSelected = this.getUnicornById(firstParentSelected.loverId ? firstParentSelected.loverId : -1);
    if (firstParentSelected && secondParentSelected) {
      const newBaby = {
        id: nextBabyId,
        firstParentId: firstParentSelected.id,
        secondParentId: secondParentSelected.id,
        name: firstParentSelected.name+secondParentSelected.name,
        color1: firstParentSelected.color,
        color2: secondParentSelected.color + '80'
      }
      this.wantABaby = !this.wantABaby;
      this.modifyWantABabyStatus(this.wantABaby);
      firstParentSelected.childFirstColor = newBaby.color1;
      firstParentSelected.childSecondColor = newBaby.color2;
      secondParentSelected.childFirstColor = newBaby.color1;
      secondParentSelected.childSecondColor = newBaby.color2;
      firstParentSelected.childName = newBaby.name;
      secondParentSelected.childName = newBaby.name;
      firstParentSelected.childId = newBaby.id;
      secondParentSelected.childId = newBaby.id;

      if(!localStorage.getItem('children')) {
        this.newChildProfiles = [];
      } else {
        this.newChildProfiles = JSON.parse(localStorage.getItem('children') || '');
      }
      this.newChildProfiles.push(newBaby);
  
      localStorage.setItem('children', JSON.stringify(this.newChildProfiles));
      this.updateMyUnicorns();
    }

  }

  // POUR LE TEMPLATE => On récupère la couleur du parent 1 puis du parent 2 (voir méthode getChildColor2) afin de les mélanger 
  // (opacité gérée depuis le service > création d'un enfant)
  getChildFirstColor(uniProfileId: number) {
    return this.getUnicornById(uniProfileId).childFirstColor;
  }

  getChildSecondColor(uniProfileId: number) {
    return this.getUnicornById(uniProfileId).childSecondColor;
  }

  // MISE À JOUR DU PROFIL DES PARENTS DANS LE LOCAL STORAGE, SUITE À LA CREATION D'UN ENFANT
  updateMyUnicorns() {
    localStorage.setItem('myUnicorns', JSON.stringify(this.uniProfiles));
  }
}