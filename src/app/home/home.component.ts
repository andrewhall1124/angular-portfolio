import { Component, inject, Renderer2, OnInit, ViewChild  } from '@angular/core';
import { ChartData } from 'chart.js';
import { CollectionReference, Firestore, collection, collectionData, doc, docData, setDoc, DocumentData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { sp500 } from '../sp';
import { User } from '@angular/fire/auth';
import { MatDialog } from '@angular/material/dialog';
import { StockDialogComponent } from '../stock-dialog/stock-dialog.component';
import { Auth, GoogleAuthProvider, signInWithPopup, authState, signOut } from '@angular/fire/auth';
import { Stock } from '../models/models';
import { MatTable } from '@angular/material/table';
import { MathService } from './services/math.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  displayedColumns: string[] = ['ticker', 'company name', 'sector', 'industry', 'risk', 'return','weight'];
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
  @ViewChild(MatTable) table?: MatTable<any>;

  constructor(
    public dialog: MatDialog,
    private renderer: Renderer2,
    private myMath: MathService,
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
    for(let i = 0; i < this.portfolioStocks.length; i++) {
      const tempRef = doc(this.fs, `stock data/${this.portfolioStocks[i].ticker}`);
      const tempData = docData(tempRef);
      tempData.subscribe(stocks =>{
        this.portfolioStocks[i] = {
          ...stocks,
          weight: this.portfolioStocks[i].weight,
        };
      });
      tempData.subscribe(stocks =>{
        this.portfolioStocks[i] = {
          ...stocks,
          risk: this.myMath.std(this.portfolioStocks[i].monthlyReturns),
          return: this.myMath.avg(this.portfolioStocks[i].monthlyReturns),
        };
        this.table?.renderRows();
      });
    };
  };

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
