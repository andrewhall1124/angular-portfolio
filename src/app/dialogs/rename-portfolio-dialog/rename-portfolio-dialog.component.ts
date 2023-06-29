import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Portfolio } from 'src/app/models/models';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-rename-portfolio-dialog',
  templateUrl: './rename-portfolio-dialog.component.html',
  styleUrls: ['./rename-portfolio-dialog.component.css']
})
export class RenamePortfolioDialogComponent {
  portfolio: Portfolio = this.data.portfolio;
  user: any = this.data.user;
  

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(Firestore) private fs: Firestore,
  ){}

  rename(){
    const docRef = doc(this.fs,`users/${this.user.uid}/portfolios/${this.portfolio.id}`);
    setDoc(docRef, {
      ...this.portfolio,
      name: this.portfolio.name,
    })
  }
}
