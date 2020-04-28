import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {UserModel} from '../models/user.model';
import {AngularFireStorage, AngularFireStorageReference} from '@angular/fire/storage';

@Injectable()
export class RegisterService {
  usersCollection: AngularFirestoreCollection<UserModel>;
  users: Observable<UserModel[]>;
  fileRef: AngularFireStorageReference;
  constructor(public afs: AngularFirestore,
              private storage: AngularFireStorage) {
    // this.users = this.afs.collection('users').valueChanges();
    this.usersCollection = this.afs.collection('users');
    // this.users = this.usersCollection.snapshotChanges().pipe(map(changes => {
    //   return changes.map(a => {
    //     const data = a.payload.doc.data();
    //     data.id = a.payload.doc.id;
    //     return data;
    //   });
    // }));
  }
  uploadUserImage(filePath: string, image: any) {
    this.fileRef = this.storage.ref(filePath);
    return this.storage.upload(filePath, image);
  }
  deleteUserImage(url) {
    return this.storage.storage.refFromURL(url).delete();
  }
}
