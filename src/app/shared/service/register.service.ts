import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {AuthService} from './auth.service';
import {UserModel} from '../model/user.model';
import {AngularFireStorage, AngularFireStorageReference} from '@angular/fire/storage';

@Injectable()
export class RegisterService {
  usersCollection: AngularFirestoreCollection<UserModel>;
  users: Observable<UserModel[]>;
  fileRef: AngularFireStorageReference;

  constructor(public db: AngularFirestore,
              private storage: AngularFireStorage,
              private auth: AuthService) {
    // this.users = this.afs.collection('users').valueChanges();
    this.usersCollection = this.db.collection('users');
    // this.users = this.usersCollection.snapshotChanges().pipe(map(changes => {
    //   return changes.map(a => {
    //     const data = a.payload.doc.data();
    //     data.id = a.payload.doc.id;
    //     return data;
    //   });
    // }));
  }
  uploadUserImage(filePath: string, image: any, callback) {
    console.log('inside uploadUserImage');
    this.fileRef = this.storage.ref(filePath);
    this.storage.upload(filePath, image)
      .then(result => {
        this.fileRef.getDownloadURL().subscribe(url => {
          callback(url);
        });
      })
      .catch(error => {
        alert('Error occured while uploading Image');
      });
  }
  deleteUserImage(url) {
    return this.storage.storage.refFromURL(url).delete();
  }
}
