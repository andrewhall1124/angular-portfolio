import { Component, Inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { deleteDoc, doc } from '@firebase/firestore';
import { Portfolio } from 'src/app/models/models';

@Component({
  selector: 'app-delete-portfolio-dialog',
  templateUrl: './delete-portfolio-dialog.component.html',
  styleUrls: ['./delete-portfolio-dialog.component.css']
})
export class DeletePortfolioDialogComponent {
  portfolio: Portfolio = this.data.portfolio;
  user: any = this.data.user;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(Firestore) private fs: Firestore,
  ){}

  deletePortfolio(){
    const docRef = doc(this.fs, `users/${this.user.uid}/portfolios/${this.portfolio.id}`);
    deleteDoc(docRef);    
  }
}
