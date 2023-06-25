import { Component, inject } from '@angular/core';
import { Firestore, doc, setDoc, collection, CollectionReference } from '@angular/fire/firestore';
import { Auth, authState, User, signInWithPopup, GoogleAuthProvider, signOut } from '@angular/fire/auth';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-portfolio';
  fs: Firestore = inject(Firestore);
  auth: Auth = inject(Auth);
  user?: User | null;
  userCollection: CollectionReference = collection(this.fs, 'users');

  constructor(
  ){
    authState(this.auth).subscribe(user =>{
      if(user){
        this.user = user;
        setDoc(doc(this.fs, `users/${this.user.uid}`), {
          displayName: user.displayName,
          uid: user.uid,
          email: user.email,
        });
      } else{
        this.user = null;
      };
    });
  };

  logIn(){
    const provider = new GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    signInWithPopup(this.auth, provider);
  }

  logOut(){
    signOut(this.auth);
    this.user = null;
  }
}
