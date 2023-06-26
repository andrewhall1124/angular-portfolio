import { Component, Inject, ViewEncapsulation, inject } from '@angular/core';
import { DocumentData, DocumentReference, Firestore, doc, docData, setDoc } from '@angular/fire/firestore';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-stock-dialog',
  templateUrl: './stock-dialog.component.html',
  styleUrls: ['./stock-dialog.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class StockDialogComponent {
  stockReference: DocumentReference = doc(this.fs, `stock data/${this.data.ticker}`);
  stockData: Observable<any>;

  constructor(
      @Inject(MAT_DIALOG_DATA) public data: any,
      @Inject(Firestore) private fs: Firestore,
    ) {
      this.stockData = docData(this.stockReference);
    };

  addToPortfolio(){
    setDoc(doc(this.fs, `users/${this.data.userId}/portfolios/${this.data.portfolioId}/stocks/${this.data.ticker}`), {
      ticker: this.data.ticker,
      weight: .2,
    });
  };
};
