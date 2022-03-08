import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { UniListComponent } from './uni-list/uni-list.component';
import { UniProfileComponent } from './uni-list/uni-profile/uni-profile.component';
import { UniFormComponent } from './uni-form/uni-form.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UnicornService } from './services/unicorn.service';

const routes: Routes = [
  { path: 'create_unicorn', component: UniFormComponent },
  { path: '', component: UniListComponent },
  { path: 'not-found', component: UniListComponent },
  { path: '**', redirectTo: 'not-found' },
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    UniListComponent,
    UniProfileComponent,
    UniFormComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    UnicornService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
