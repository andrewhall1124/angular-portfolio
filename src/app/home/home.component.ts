import { Component, inject, Renderer2, OnInit  } from '@angular/core';
import { ChartData } from 'chart.js';
import { CollectionReference, Firestore, collection, collectionData, doc, setDoc, DocumentData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { sp500 } from '../sp';
import { User } from '@angular/fire/auth';
import { MatDialog } from '@angular/material/dialog';
import { StockDialogComponent } from '../stock-dialog/stock-dialog.component';
import { Auth, GoogleAuthProvider, signInWithPopup, authState, signOut } from '@angular/fire/auth';
import { Stock } from '../models/models';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  displayedColumns: string[] = ['ticker','weight', 'company name', 'sector', 'industry'];
  fs: Firestore = inject(Firestore);
  auth: Auth = inject(Auth);
  stockData: Observable<DocumentData>;
  stockDataCollection: CollectionReference = collection(this.fs, 'stock data');
  myControl = new FormControl('');
  options: string[] = sp500;
  filteredOptions: Observable<string[]>;
  user?: User | null;
  userCollection: CollectionReference = collection(this.fs, 'users');
  userPortfolio: any;
  userPortfolioReference?: CollectionReference;
  portfolioStocks: any[] = [];

  constructor(
    public dialog: MatDialog,
    private renderer: Renderer2,
  ){
    authState(this.auth).subscribe(user =>{
      if(user){
        this.user = user;
        setDoc(doc(this.fs, `users/${this.user.uid}`), {
          displayName: user.displayName,
          uid: user.uid,
          email: user.email,
        });
        this.userPortfolioReference = collection(this.fs, `users/${this.user.uid}/portfolios/My Portfolio/stocks`);
        this.userPortfolio = collectionData(this.userPortfolioReference);
        this.userPortfolio.subscribe((stocks: any) => {
        this.portfolioStocks = [...stocks];
        this.fetchStockData();
        })
      } else{
        this.user = null;
      };
    });

    this.stockData = collectionData(this.stockDataCollection);
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  };

  ngOnInit(){

  }

  fetchStockData(){
    console.log(this.portfolioStocks)
    for(let i = 0; i < this.portfolioStocks.length; i++) {
    }
  }

  logIn(){
    const provider = new GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    signInWithPopup(this.auth, provider);
  }

  logOut(){
    signOut(this.auth);
    this.user = null;
  }

  openStockDialog(){
    const input = this.myControl.value;
    if(input) {
      const ticker: string = input.toUpperCase();
      if(sp500.includes(ticker)){
        const dialogRef = this.dialog.open(StockDialogComponent,{
          height: '85vh',
          width: 'auto',
          data: {
            ticker: ticker,
            user: this.user?.uid,
          },
      });
      dialogRef.afterOpened().subscribe(() => {
        this.renderer.addClass(document.body, 'no-scroll');
      });
      };
    }
  };

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  lineChartData: ChartData <'line', {key: string, value: number} []> = {
    datasets: [{
      data: [
      ],
      parsing: {
        xAxisKey: 'key',
        yAxisKey: 'value'
      }
    }],
  };

  lineChartOptions = {
  }
}
