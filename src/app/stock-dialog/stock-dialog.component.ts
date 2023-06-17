import { Component, Inject, ViewEncapsulation, inject } from '@angular/core';
import { DocumentReference, Firestore, doc, docData } from '@angular/fire/firestore';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { StockChartComponent } from '../stock-chart/stock-chart.component';
@Component({
  selector: 'app-stock-dialog',
  templateUrl: './stock-dialog.component.html',
  styleUrls: ['./stock-dialog.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class StockDialogComponent {
  stockReference: DocumentReference = doc(this.fs, `stock data/${this.data.stock}`);
  stockData: Observable<any>;


  constructor(
      @Inject(MAT_DIALOG_DATA) public data: any,
      @Inject(Firestore) private fs: Firestore,
    ) {
      this.stockData = docData(this.stockReference);
    }
}
