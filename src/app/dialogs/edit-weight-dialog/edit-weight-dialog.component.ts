import { Component, Inject } from '@angular/core';
import { Firestore, updateDoc, doc } from '@angular/fire/firestore';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-edit-weight-dialog',
  templateUrl: './edit-weight-dialog.component.html',
  styleUrls: ['./edit-weight-dialog.component.css']
})
export class EditWeightDialogComponent {
  weight: number = this.data.weight;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(Firestore) private fs: Firestore,
  ) {}

  updateWeight(){
    console.log(this.data.ticker)
    const docRef = doc(this.fs,`users/dCT5HCpNGcbdwON1dlAxz1kt3JO2/portfolios/My Portfolio/stocks/${this.data.ticker}`);
    updateDoc(docRef, {
      ...this.data,
      weight: this.weight,
    })
  }
}
