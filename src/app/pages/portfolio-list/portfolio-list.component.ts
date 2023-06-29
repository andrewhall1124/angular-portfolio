import { Component, inject } from '@angular/core';
import { CollectionReference, Firestore, collection, collectionData } from '@angular/fire/firestore';
import { NewPortfolioDialogComponent } from 'src/app/dialogs/new-portfolio-dialog/new-portfolio-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Portfolio } from 'src/app/models/models';
import { RenamePortfolioDialogComponent } from 'src/app/dialogs/rename-portfolio-dialog/rename-portfolio-dialog.component';
import { DeletePortfolioDialogComponent } from 'src/app/dialogs/delete-portfolio-dialog/delete-portfolio-dialog.component';

@Component({
  selector: 'app-portfolio-list',
  templateUrl: './portfolio-list.component.html',
  styleUrls: ['./portfolio-list.component.css']
})
export class PortfolioListComponent {
  fs: Firestore = inject(Firestore);
  portfolioColumns: string[] = ['name','risk', 'return','sharpe', 'button'];
  portfolioCollection: CollectionReference = collection(this.fs, `users/dCT5HCpNGcbdwON1dlAxz1kt3JO2/portfolios`);
  portfolios: any;
  user: any = {
    uid: 'dCT5HCpNGcbdwON1dlAxz1kt3JO2',
  }

  constructor(
    public dialog: MatDialog,
  ){
    this.portfolios = collectionData(this.portfolioCollection);
  }

  createNewPortfolio(){
    const dialogRef = this.dialog.open(NewPortfolioDialogComponent);
  }

  renamePortfolio(portfolio: Portfolio){
    const dialogRef = this.dialog.open(RenamePortfolioDialogComponent, {
      data: {
        portfolio: portfolio,
        user: this.user,
      },
    })
  }

  deletePortfolio(portfolio: Portfolio){
    const dialogRef = this.dialog.open(DeletePortfolioDialogComponent, {
      width: '250px',
      data: {
        portfolio: portfolio,
        user: this.user,
      }
    })
  }
}
