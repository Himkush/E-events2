import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from '@angular/fire/firestore';
import {WinnersModel} from '../model/winners.model';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WinnersService {
  productRef: AngularFirestoreCollection<WinnersModel>;
  itemDoc: AngularFirestoreDocument<WinnersModel>;
  // winnerslist: Observable<WinnersModel[]>;

  constructor(private db: AngularFirestore) {
    this.productRef = this.db.collection<WinnersModel>('winners');
  }

  addWinnerDocument(eventId: string, winners: string[]) {
    // const today = new Date();
    // const date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
    // const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    // const dateTime = date + ' ' + time;
    const declareDate = new Date();
    const data: WinnersModel = {eventId, winners, declareDate};
    this.productRef.doc(eventId).set(data)
      .then(() => console.log('winners added'))
      .catch(err => console.log(err));
  }

  getAllEventsWinners() {
    return this.productRef.valueChanges();
  }

  getWinnerDocument(id: string) {
    this.itemDoc = this.db.doc(`winners/${id}`);
    return this.itemDoc;
  }
}
