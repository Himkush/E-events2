import { UserModel } from '../model/user.model';
import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class UserList{
  users: any;
  productsRef: AngularFirestoreCollection<any>;
  paricipationList: Observable<any[]>;
  itemDoc: AngularFirestoreDocument<any>;
  participant: any;
  constructor(private db: AngularFirestore) {
    this.productsRef = this.db.collection<any>('Users');
  }
  fetchUsers() {
    this.productsRef = this.db.collection<UserModel>('Users');
    this.users = this.productsRef.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
    return this.users;
  }
  updateUserData(id, data){
    this.itemDoc = this.db.doc<any>(`Users/${id}`);
    return this.itemDoc.update(data);
  }
}
