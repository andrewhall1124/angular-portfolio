import { Component, Inject, ViewEncapsulation, inject } from '@angular/core';
import { DocumentReference, Firestore, doc, docData, setDoc } from '@angular/fire/firestore';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-stock-dialog',
  templateUrl: './stock-dialog.component.html',
  styleUrls: ['./stock-dialog.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class StockDialogComponent {
  stockReference: DocumentReference = doc(this.fs, `stock data/${this.data.stock}`);
  stockData: Observable<any>;
  portfolioName: string = 'My Portfolio';

  constructor(
      @Inject(MAT_DIALOG_DATA) public data: any,
      @Inject(Firestore) private fs: Firestore,
    ) {
      this.stockData = docData(this.stockReference);
      console.log(data);
    };

  addToPortfolio(){
    setDoc(doc(this.fs, `users/${this.data.user}/portfolios/${this.portfolioName}/stocks/${this.data.stock}`), {
      ticker: this.data.stock,
      weight: .2,
    });
  };
};
