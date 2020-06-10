import { FormsModel } from 'src/app/shared/model/event-form.model';
import { AuthService } from './auth.service';
import { ParticipationListService } from './participation.service';
import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EventFormService {
  productsRef: AngularFirestoreCollection<FormsModel>;
  events: Observable<FormsModel[]>;
  itemDoc: AngularFirestoreDocument<FormsModel>;
  eventToEdit: FormsModel;
  constructor(private db: AngularFirestore,
              private storage: AngularFireStorage,
              private auth: AuthService,
              private participationListService: ParticipationListService) {
    this.productsRef = this.db.collection<FormsModel>('eventForm');
  }
  addEvent(data: FormsModel) {

    this.participationListService.createParticipantsDocument().then(result => {
        const otherData = {
          participation: result.id,
          approved: false,
          authUID: this.auth.getCurrentUserUid(),
          winners: []
        };
        this.productsRef.add({...otherData, ...data}).then(res => {
          this.auth.updatePostedEvents(res.id);
        });
      });
  }
  updateEvent(data, id: string) {
    this.itemDoc = this.db.doc<FormsModel>(`eventForm/${id}`);
    this.itemDoc.update(data).
        then(() => {}).
        catch(err => {console.log(err); }
        );
  }
  updateEventWinners(winnerList, id: string) {
    this.itemDoc = this.db.doc<FormsModel>(`eventForm/${id}`);
    this.itemDoc.update({winners: winnerList})
      .then(() => alert('Winners Uploaded'))
      .catch(err => console.log(err));
  }
  uploadEventImage(filePath: string, image: any, callback) {
    const fileRef = this.storage.ref(filePath);
    this.storage.upload(filePath, image).then(result => {
          fileRef.getDownloadURL().subscribe((url) => {
            callback(url);
          });
      }).catch(err => {
        console.log('Image uploading error');
      });
  }
  deleteEventImage(url) {
    return this.storage.storage.refFromURL(url).delete();
  }

  getEvents(page?: string) {
    if (page === 'main') {
      this.productsRef = this.db.collection<FormsModel>('eventForm', ref => ref.where('approved', '==', true));
    } else {
      this.productsRef = this.db.collection<FormsModel>('eventForm');
    }

    this.events = this.productsRef.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as FormsModel;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    console.log(this.events);
    return this.events;
  }
  getEventDetail(id?: string) {
    this.itemDoc = this.db.doc<FormsModel>(`eventForm/${id}`);
    return this.itemDoc.valueChanges();
  }

  raiseCancelRequest(id: string) {
    this.db.doc<FormsModel>(`eventForm/${id}`).update({cancelRequest: true}).then(() => {
      alert('Cancellation Request Raised\n Admin will Review this Request');
    });
  }
}
