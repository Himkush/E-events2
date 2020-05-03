import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Router} from '@angular/router';
import {UserModel} from '../model/user.model';
import {BehaviorSubject} from 'rxjs';
import {AngularFireStorage} from '@angular/fire/storage';
import {switchMap} from 'rxjs/operators';
import * as firebase from 'firebase';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // private eventAuthError = new BehaviorSubject<string>('');
  // eventAuthError$ = this.eventAuthError.asObservable();
  productsRef: AngularFirestoreCollection<any>;
  currentUser: AngularFirestoreDocument<UserModel>;
  user: any;
  newUser: UserModel;
  constructor(private afAuth: AngularFireAuth,
              private db: AngularFirestore,
              private afs: AngularFirestore,
              private router: Router) {
                this.productsRef = this.db.collection<any>('Users');
               }

  createUser(user: UserModel) {
    this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password)
      .then(userCredential => {
        this.newUser = user;
        // userCredential.user.updateProfile({
        //   displayName: user.firstName + ' ' + user.lastName
        // });
        this.insertUSerData(userCredential)
          .then(() => {
            alert('Registration Successful!!!');
            this.router.navigate(['/event-form']);
          });
      })
      .catch(error => {
        console.log(error);
      });
  }
  insertUSerData(userCredential: firebase.auth.UserCredential) {
    if (this.newUser.imageSrc === undefined) {
      this.newUser.imageSrc = '../../assets/img/avatar2.png';
    }
    const today = new Date();
    const date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
    const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    const dateTime = date + ' ' + time;
    return this.db.doc( `Users/${userCredential.user.uid}`).set({
      signupDate: dateTime, participation: [], postedEvents: [], ...this.newUser, eventForm: []
    });
  }
  login(email: string, password: string, isAdmin?: boolean) {
    this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then(() => {
        if (isAdmin) {
          this.router.navigate(['/admin/events']);
        } else {
          this.getCurrentUserDetails().subscribe(user => {
            if (!user.disabled) {
              alert('You have sucessfully logged in!');
              this.router.navigate(['event-form']);
            } else {
              alert('You are suspended please contact the administrator!');
              this.router.navigate(['/']);
            }
          });
        }
      })
      .catch( (error) => {
        alert(error);
      });
  }
  getUserState() {
    return this.afAuth.authState;
  }
  getCurrentUserUid() {
    return this.afAuth.auth.currentUser.uid;
  }
  getCurrentUserDetails() {
    this.currentUser = this.db.doc<UserModel>(`Users/${this.getCurrentUserUid()}`);
    return this.currentUser.valueChanges();
  }
  updateUser(userDetails: any) {
    const uid = this.getCurrentUserUid();
    this.currentUser = this.db.doc<UserModel>(`Users/${uid}`);
    this.currentUser.update(userDetails)
      .then( () => {alert('Edit Successful');
                    this.router.navigate(['/']);
                  })
      .catch((err) => alert(err));
  }
  updatePostedEvents(idToAdd: string) {
    this.currentUser.update({postedEvents: firebase.firestore.FieldValue.arrayUnion(idToAdd)});
  }
  logout() {
    return this.afAuth.auth.signOut();
  }
  resetPassword(email: string) {
    this.afAuth.auth.sendPasswordResetEmail(email)
      .then( () => {
        alert('Reset Password Email Sent!!');
      })
      .catch( error => alert(error));
  }
  fetchUserDocument(id: string) {
    const item = this.db.doc<UserModel>(`Users/${id}`);
    return item.valueChanges();
  }
  addEventForm(data) {
    this.productsRef.doc(this.afAuth.auth.currentUser.uid).update(
      { participation: firebase.firestore.FieldValue.arrayUnion(data) }
    );
  }
}

