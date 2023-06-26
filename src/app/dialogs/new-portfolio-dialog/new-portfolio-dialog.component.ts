import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Firestore, collection, setDoc, DocumentReference, DocumentData, doc, serverTimestamp } from '@angular/fire/firestore';
@Component({
  selector: 'app-new-portfolio-dialog',
  templateUrl: './new-portfolio-dialog.component.html',
  styleUrls: ['./new-portfolio-dialog.component.css']
})
export class NewPortfolioDialogComponent {
  fs: Firestore = inject(Firestore);
  portfolioName: string = "";
  
  constructor(
    private router: Router
  ){}

  createPortfolio(){
    const collectionref = collection(this.fs, `users/dCT5HCpNGcbdwON1dlAxz1kt3JO2/portfolios`);
    const docId = (doc(collectionref)).path.slice(-20);
    const docRef = doc(this.fs, `users/dCT5HCpNGcbdwON1dlAxz1kt3JO2/portfolios/${docId}`);//temp user id
    setDoc(docRef, {
      name: this.portfolioName,
      id: docId,
      created: serverTimestamp(),
    });
    this.router.navigate(['/portfolios', docId]);
  };
}
