import { AdminGuard } from './shared/guards/admin.guard';
import { EventBusService } from './shared/service/event-bus.service';
import { EventFormService } from './shared/service/event-form.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {AngularFireModule} from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { TimepickerModule, BsDatepickerModule, TabsModule, ModalModule } from 'ngx-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { JumbotronComponent } from './jumbotron/jumbotron.component';
import { FooterComponent } from './footer/footer.component';
import { EventFormComponent } from './event-form/event-form.component';

import { environment } from './../environments/environment';
import { EventCardComponent } from './event/event-card/event-card.component';
import { EventComponent } from './event/event.component';
import { EventsComponent } from './events/events.component';
import { EventDetailComponent } from './event-detail/event-detail.component';
import { ParticipationListService } from './shared/service/participation.service';
import { LoginComponent } from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {RegisterService} from './shared/service/register.service';
import { EditUserInfoComponent } from './edit-user-info/edit-user-info.component';
import { ParticipantsComponent } from './participants/participants.component';
import { ParticipantService } from './shared/service/participants.service';
import { AuthService } from './shared/service/auth.service';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { UserListComponent } from './admin/user-list/user-list.component';
import { CoordinatorPageComponent } from './admin/coordinator-page/coordinator-page.component';
import { EventManageComponent } from './admin/event-manage/event-manage.component';
import { AdminLoginComponent} from './admin/login/login.component';
import {AuthGuard} from './shared/guards/auth.guard';
import { ManageEventsComponent } from './manage-events/manage-events.component';
import { LoaderComponent } from './loader/loader.component';
import { AssignWinnersComponent } from './assign-winners/assign-winners.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { WinnersComponent } from './winners/winners.component';
import { ApproveEventsComponent } from './admin/approve-events/approve-events.component';
import {FilterPipe} from './shared/pipes/filter.pipe';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material';


// import {AuthGuard} from './shared/guards/auth.guard';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    JumbotronComponent,
    FooterComponent,
    EventFormComponent,
    EventCardComponent,
    EventComponent,
    EventsComponent,
    EventDetailComponent,
    ParticipantsComponent,
    LoginComponent,
    RegisterComponent,
    EditUserInfoComponent,
    UserListComponent,
    CoordinatorPageComponent,
    EventManageComponent,
    AdminLoginComponent,
    ManageEventsComponent,
    LoaderComponent,
    AssignWinnersComponent,
    WinnersComponent,
    ApproveEventsComponent,
    FilterPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    ReactiveFormsModule,
    FormsModule,
    DragDropModule,
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot(),
    TabsModule.forRoot(),
    ModalModule.forRoot(),
    MatFormFieldModule,
    MatSortModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule
  ],
  providers: [EventFormService, AngularFirestore, AuthService,
              ParticipantService, ParticipationListService, EventBusService,
              AuthService, RegisterService, AuthGuard, AdminGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
