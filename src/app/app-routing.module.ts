import { AdminGuard } from './shared/guards/admin.guard';
import { ApproveEventsComponent } from './admin/approve-events/approve-events.component';
import { AdminLoginComponent } from './admin/login/login.component';
import { EventManageComponent } from './admin/event-manage/event-manage.component';
import { UserListComponent } from './admin/user-list/user-list.component';
import { EventFormComponent } from './event-form/event-form.component';
import { EventComponent } from './event/event.component';
import { EventDetailComponent } from './event-detail/event-detail.component';
import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {EditUserInfoComponent} from './edit-user-info/edit-user-info.component';
import { ParticipantsComponent } from './participants/participants.component';
import {AuthGuard} from './shared/guards/auth.guard';
import {RoleGuard} from './shared/guards/role.guard';
import {ManageEventsComponent} from './manage-events/manage-events.component';
import {AssignWinnersComponent} from './assign-winners/assign-winners.component';
import {WinnersComponent} from './winners/winners.component';
import {LoginGuard} from './shared/guards/login.guard';
import {AboutComponent} from './about/about.component';


const routes: Routes = [
  {path: '', component: EventComponent},
  {path: 'event/:id', component: EventDetailComponent, canActivate: [AuthGuard]},
  {path: 'edit-event', component: EventFormComponent, canActivate: [AuthGuard, RoleGuard]},
  {path: 'winners', component: WinnersComponent, canActivate: [AuthGuard]},
  {path: 'add-event', component: EventFormComponent, canActivate: [AuthGuard, RoleGuard]},
  {path: 'manage-events', component: ManageEventsComponent, canActivate: [AuthGuard]},
  {path: 'assign-winners/:eventId/:participationId', component: AssignWinnersComponent, canActivate: [AuthGuard]},
  {path: 'about', component: AboutComponent},
  {path: 'login', component: LoginComponent, canActivate: [LoginGuard]},
  {path: 'register', component: RegisterComponent},
  {path: 'event-form', component: EventFormComponent, canActivate: [AuthGuard, RoleGuard]},
  {path: 'participants/:id', component: ParticipantsComponent, canActivate: [AuthGuard]},
  {path: 'admin',
    children: [
      {
        path: 'manage-users',
        component: UserListComponent,
        canActivate: [AdminGuard]
      },
      {
        path: 'login',
        component: AdminLoginComponent,
        canActivate: [LoginGuard]
      },
      {
        path: 'edit-event',
        component: EventFormComponent,
        canActivate: [AdminGuard]
      },
      { path: 'event/:id',
        component: EventDetailComponent,
        canActivate: [AdminGuard]
      },
      {
        path: 'approve-events',
        component: ApproveEventsComponent,
        canActivate: [AdminGuard]
      },
      {
        path: '',
        pathMatch: 'full',
        component: EventManageComponent,
        canActivate: [AdminGuard]
      },
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

 }
