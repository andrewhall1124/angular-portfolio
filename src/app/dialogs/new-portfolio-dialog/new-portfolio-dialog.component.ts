import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Firestore, collection, addDoc, DocumentReference, DocumentData } from '@angular/fire/firestore';
@Component({
  selector: 'app-new-portfolio-dialog',
  templateUrl: './new-portfolio-dialog.component.html',
  styleUrls: ['./new-portfolio-dialog.component.css']
})
export class NewPortfolioDialogComponent {
  fs: Firestore = inject(Firestore);
  portfolioName: string = "";
  
  constructor(
    private route: ActivatedRoute,
    private router: Router
  ){}

  createPortfolio(){
    const collectionRef = collection(this.fs, `users/dCT5HCpNGcbdwON1dlAxz1kt3JO2/portfolios`)
    addDoc(collectionRef, {
      name: this.portfolioName,
    });
    this.router.navigate([''])
  };
}
