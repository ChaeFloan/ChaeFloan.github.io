import { Component, Input, OnInit } from '@angular/core';
import { UniProfile } from 'src/app/models/uni-profile.model';
import { UnicornService } from 'src/app/services/unicorn.service';

@Component({
  selector: 'app-uni-profile',
  templateUrl: './uni-profile.component.html',
  styleUrls: ['./uni-profile.component.scss']
})
export class UniProfileComponent implements OnInit {

  // @Input() PERMET DE FAIRE LE LIEN ENTRE LE COMPOSANT PARENT (qui gère l'affichage des profils) ET CE COMPOSANT ENFANT (les données dynamiques peuvent être ajoutées au TEMPLATE)
  @Input() uniProfile!: UniProfile;
  @Input() index!: any;

  // firstSelected?: boolean = false;
  // secondSelected?: boolean = false;

  wantABaby: boolean = false;
  
  // UTILISATION D'UNE OBSERVABLE AFIN D'INFORMER LE COMPOSANT PARENT D'UN CHANGEMENT D'ÉTAT DANS LE COMPOSANT ENFANT POUR LA VARIABLE "wantABaby"
  constructor(private unicornService: UnicornService){
    this.unicornService.modifyWantABabyStatus(this.wantABaby);
  }
  
  ngOnInit() {}

  // POUR L'AFFICHAGE => ON RECUPERE DANS LE SERVICE LA VALEUR DE matchInProgress (true ou false)
  getMatchStatus() {
    return this.unicornService.matchInProgress;
  }
  
  // SELECTION D'UN PROFIL
  onClickSelectThisOne(uniProfileId: number) {
    this.unicornService.selectThisOne(uniProfileId);
  }
  
  // CONFIRMATION DE MATCH 
  // DÉTERMINE LE GENRE DE CHAQUE PROFIL SELECTIONNÉ POUR LA GESTION DES ENFANTS (true seulement si FEMALE + MALE)
  onClickConfirmMatch() {
    const firstSelectedUniProfile = this.unicornService.uniProfiles.find(
      uniProfile => uniProfile.firstSelected === true
    )
    const secondSelectedUniProfile = this.unicornService.uniProfiles.find(
      uniProfile => uniProfile.secondSelected === true
    )
    if (firstSelectedUniProfile && secondSelectedUniProfile) {
      firstSelectedUniProfile.loverId = secondSelectedUniProfile?.id;
      firstSelectedUniProfile.loverName = secondSelectedUniProfile?.name;
      firstSelectedUniProfile.firstSelected = false;
      secondSelectedUniProfile.loverId = firstSelectedUniProfile?.id;
      secondSelectedUniProfile.loverName = firstSelectedUniProfile?.name;
      secondSelectedUniProfile.secondSelected = false;
    
      let female = false;
      let male = false;
      switch (firstSelectedUniProfile?.gender) {
        case 'Female':
          female = true;
          break;
        case 'Male':
          male = true;
          break;
      }
      switch (secondSelectedUniProfile?.gender) {
        case 'Female':
          female = true;
          break;
        case 'Male':
          male = true;
          break;
      }
      if (female && male) {
        firstSelectedUniProfile.isHeteroRelationship = true;
        secondSelectedUniProfile.isHeteroRelationship = true;
      } else {
        firstSelectedUniProfile.isHeteroRelationship = false;
        secondSelectedUniProfile.isHeteroRelationship = false;
      }
    }

    // ENREGISTREMENT DES MODIFICATIONS DANS LE LOCAL STORAGE
    this.unicornService.updateMyUnicorns();
  }

  // ANNULATION DE LA DEMANDE DE MATCH (uniquement pour le profil sélectionné)
  onClickCancelTheSelection(uniProfileId: number) {
    return this.unicornService.cancelMatch(uniProfileId)
  }
  
  getWantABabyStatus() {
    return this.unicornService.wantABaby;
  }

  // CREATION D'UN ENFANT
  onClickCreateABaby(uniProfileId: number) {
    this.unicornService.createABabyUnicorn(uniProfileId);
  }
  
  // AFFICHAGE DE LA PREMIERE LETTRE DU "GENRE" EN MAJUSCULE (SI LA LICORNE A UN ENFANT)
  transformGenderDisplay(genderValue: string) {
    let firstLetter = genderValue.substring(0, 1).toUpperCase();
    return firstLetter;
  }

  // POUR LE TEMPLATE => On récupère la couleur du parent 1 puis du parent 2 (voir méthode getChildColor2) afin de les mélanger 
  // (opacité gérée depuis le service > création d'un enfant)
  getChildColor1(uniProfileId: number) {
    return this.unicornService.getChildFirstColor(uniProfileId);
  }
  
  getChildColor2(uniProfileId: number) {
    return this.unicornService.getChildSecondColor(uniProfileId);
  }

}
