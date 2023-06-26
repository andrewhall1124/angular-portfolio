import { Component, inject } from '@angular/core';
import { CollectionReference, Firestore, collection, collectionData } from '@angular/fire/firestore';
import { NewPortfolioDialogComponent } from 'src/app/dialogs/new-portfolio-dialog/new-portfolio-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-portfolio-list',
  templateUrl: './portfolio-list.component.html',
  styleUrls: ['./portfolio-list.component.css']
})
export class PortfolioListComponent {
  fs: Firestore = inject(Firestore);
  portfolioColumns: string[] = ['name','risk', 'return','sharpe'];
  portfolioCollection: CollectionReference = collection(this.fs, `users/dCT5HCpNGcbdwON1dlAxz1kt3JO2/portfolios`);
  portfolios: any;

  constructor(
    public dialog: MatDialog,
  ){
    this.portfolios = collectionData(this.portfolioCollection);
  }

  createNewPortfolio(){
    const dialogRef = this.dialog.open(NewPortfolioDialogComponent);
  }
}
