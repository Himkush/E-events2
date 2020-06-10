import {EventBusService} from './event-bus.service';
import {Injectable, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Router, ActivatedRoute} from '@angular/router';
import {UserModel} from '../model/user.model';
import {BehaviorSubject} from 'rxjs';
import {AngularFireStorage} from '@angular/fire/storage';
import {switchMap, first} from 'rxjs/operators';
import * as firebase from 'firebase';
import {LoaderService} from './loader.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // private eventAuthError = new BehaviorSubject<string>('');
  // eventAuthError$ = this.eventAuthError.asObservable();
  productsRef: AngularFirestoreCollection<any>;
  currentUser: AngularFirestoreDocument<UserModel>;
  user: any;
  role: string;
  newUser: UserModel;

  constructor(private afAuth: AngularFireAuth,
              private db: AngularFirestore,
              private afs: AngularFirestore,
              private eventBus: EventBusService,
              private r: ActivatedRoute,
              private router: Router,
              private loaderService: LoaderService) {
    this.productsRef = this.db.collection<any>('Users');
    this.afAuth.auth.onAuthStateChanged(user => {
      if (user) {
        this.getCurrentUserDetails().pipe().subscribe(tempUser => {
          try {
            this.user = {uid: this.getCurrentUserUid(), ...tempUser};
            this.eventBus.announce('Auto_Login');
          } catch {
          }
        });
      } else {
        this.user = null;
        eventBus.announce('Logout');
      }
    });
  }

  sendVerificationMail() {
    return this.afAuth.auth.currentUser.sendEmailVerification()
      .then(() => {
        // this.router.navigate(['<!-- enter your route name here -->']);
        // alert('Email verification mail has been sent! \n Please Verify to Continue!');
        alert('Please validate your email address. Kindly check your inbox.');
      });
  }

  createUser(user: UserModel) {
    this.loaderService.show();
    this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password)
      .then(userCredential => {
        this.newUser = user;
        userCredential.user.updateProfile({
          displayName: user.firstName + ' ' + user.lastName
        });
        this.insertUSerData(userCredential)
          .then(() => {
            this.logout();
            // alert('Registration Successful!!!');
            this.router.navigate(['/login']);
            // alert('Please Login to Continue!!');
          });
        this.sendVerificationMail();
        this.loaderService.hide();
      })
      .catch(error => {
        console.log(error);
        alert(error);
        this.loaderService.hide();
      });
  }

  insertUSerData(userCredential: firebase.auth.UserCredential) {
    if (this.newUser.imageSrc === undefined) {
      this.newUser.imageSrc = '../../assets/img/avatar2.jpg';
    }
    const today = new Date();
    const date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
    const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    const dateTime = date + ' ' + time;
    return this.db.doc(`Users/${userCredential.user.uid}`).set({
      signupDate: dateTime,
      participation: [],
      postedEvents: [],
      disabled: false,
      activate: false,
      ...this.newUser,
      password: null,
      cpassword: null, eventForm: []
    });
  }

  login(email: string, password: string, isAdmin?: boolean) {
    this.loaderService.show();
    this.logout();
    this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then((res) => {
        if (res.user.emailVerified !== true) {
          this.sendVerificationMail();
          // isAdmin ? this.router.navigate(['/admin/login']) : this.router.navigate(['/login']);
          throw 'Email Not Verified!';
        } else if (isAdmin) {
          this.getCurrentUserDetails().subscribe(user => {
            if (user.role === 'admin') {
              alert('You have sucessfully logged in!');
              this.router.navigate(['./admin'], {relativeTo: this.r});
              this.user = user;
            } else {
              alert('You are not a admin!');
              // this.getCurrentUserDetails();
              this.logout();
            }
          });
        } else {
          this.getCurrentUserDetails().pipe(first()).subscribe(user => {
            if (!user.disabled) {
              // alert('You have sucessfully logged in!');
              console.log('hi');
              this.router.navigate(['/']);
            } else {
              alert('You are SUSPENDED, please contact the administrator!');
              this.router.navigate(['/']);
            }
            this.user = user;
          });
        }
        this.loaderService.hide();
      })
      .catch((error) => {
        alert(error);
        if (!isAdmin) {
          this.router.navigate(['./login']);
        } else {
          this.router.navigate(['./admin/login']);
        }
        this.logout();
        this.loaderService.hide();
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
      .then(() => {
        alert('Edit Successful');
        this.router.navigate(['/']);
      })
      .catch((err) => alert(err));
  }

  updatePostedEvents(idToAdd: string) {
    this.productsRef.doc(this.afAuth.auth.currentUser.uid)
      .update({postedEvents: firebase.firestore.FieldValue.arrayUnion(idToAdd)});
  }

  logout() {
    this.user = null;
    return this.afAuth.auth.signOut();
  }

  resetPassword(email: string) {
    this.afAuth.auth.sendPasswordResetEmail(email)
      .then(() => {
        alert('Reset Password Email Sent!!');
      })
      .catch(error => alert(error));
  }

  fetchUserDocument(id: string) {
    const item = this.db.doc<UserModel>(`Users/${id}`);
    return item.valueChanges();
  }

  addEventForm(data) {
    this.productsRef.doc(this.afAuth.auth.currentUser.uid).update(
      {participation: firebase.firestore.FieldValue.arrayUnion(data)}
    );
  }
}

