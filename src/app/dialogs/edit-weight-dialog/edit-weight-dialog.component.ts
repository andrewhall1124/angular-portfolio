import { Component, Inject } from '@angular/core';
import { Firestore, updateDoc, doc } from '@angular/fire/firestore';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-edit-weight-dialog',
  templateUrl: './edit-weight-dialog.component.html',
  styleUrls: ['./edit-weight-dialog.component.css']
})
export class EditWeightDialogComponent {
  stock: any = this.data.stock;
  user: any = this.data.user;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(Firestore) private fs: Firestore,
  ) {}

  updateWeight(){
    const docRef = doc(this.fs,`users/${this.user.uid}/portfolios/My Portfolio/stocks/${this.stock.ticker}`);
    updateDoc(docRef, {
      ...this.stock,
      weight: Number(this.stock.weight),
    })
  }
}
