import { Component, Inject } from '@angular/core';
import { Firestore, doc, deleteDoc } from '@angular/fire/firestore';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-remove-stock-dialog',
  templateUrl: './remove-stock-dialog.component.html',
  styleUrls: ['./remove-stock-dialog.component.css']
})
export class RemoveStockDialogComponent {
  stock: any;
  user: any;
  portfolio: any;

  constructor(
    @Inject(Firestore) private fs: Firestore,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.stock = this.data.stock;
    this.user = this.data.user;
    this.portfolio = this.data.portfolio;
  }

  deleteStock(){
    const docRef = doc(this.fs,`users/${this.user?.uid}/portfolios/${this.portfolio.id}/stocks/${this.stock.ticker}`);
    deleteDoc(docRef);
  }
}
