import { Injectable } from '@angular/core';

import {
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  AngularFirestore
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ParticipantService {
  productsRef: AngularFirestoreCollection<any>;
  paricipationList: Observable<any[]>;
  itemDoc: AngularFirestoreDocument<any>;
  participant: any;
  constructor(private db: AngularFirestore) {
    this.productsRef = this.db.collection<any>('participants');
  }
  fetchParticipant(id: string) {
    const item = this.db.doc<any>(`participants/${id}`);
    return item.valueChanges();
  }
  setPayment(id: string, other) {
    const item = this.db.doc<any>(`participants/${id}`).update(other);
    return item;
  }
  createNewParticipant(uid) {
    return this.productsRef.add({userId: uid, payment: false, attended: false});
  }

}
