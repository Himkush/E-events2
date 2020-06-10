import { AuthService } from './auth.service';
import { ParticipantService } from './participants.service';
import { ParticipantsList } from './../model/participants-list.model';
import { Injectable } from '@angular/core';

import { AngularFirestoreCollection,
         AngularFirestoreDocument,
         AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class ParticipationListService {
  productsRef: AngularFirestoreCollection<any>;
  paricipationList: Observable<ParticipantsList[]>;
  itemDoc: AngularFirestoreDocument<ParticipantsList>;
  participantsList = new Subject<any[]>();
  constructor(private db: AngularFirestore, private participantService: ParticipantService, private userService: AuthService) {
    this.productsRef = this.db.collection<ParticipantsList>('participantsList');
  }

  createParticipantsDocument() {
    const data = {
      participantsList: [],
      total: 0
    };
    return this.productsRef.add({...data});
  }
  fetchParticipantList(id: string) {
    const item = this.db.doc<ParticipantsList>(`participantsList/${id}`);
    const subject = new Subject<any>();
    item.valueChanges().pipe(take(1)).subscribe(data => {
      if (!data || !data.participants || data.participants.length === 0) {
        subject.next(null);
      } else {
        const temp = data.participants.map((i, index) => {
          this.participantService.fetchParticipant(i).pipe(take(1)).subscribe(res => {
            this.userService.fetchUserDocument(res.userId).pipe(take(1)).subscribe(result => {
              subject.next({
                name: result.firstName + ' ' + result.lastName,
                email: result.email,
                payment: res.payment,
                attended: res.attended,
                id: i,
                index: index + 1
              });
            });
          });
        });
      }
    });
    return subject.asObservable();
  }
  addNewParticipant(id: string, data: string) {
    return this.productsRef.doc(id).update({ participants: firebase.firestore.FieldValue.arrayUnion(data)});
  }
}
