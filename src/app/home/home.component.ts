import { Component, inject, OnInit, Renderer2  } from '@angular/core';
import { ChartData } from 'chart.js';
import { CollectionReference, Firestore, collection, collectionData, docData, doc, DocumentReference, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { sp500 } from './sp';
import { MatDialog } from '@angular/material/dialog';
import { StockDialogComponent } from '../stock-dialog/stock-dialog.component';
import { Auth, GoogleAuthProvider, signInWithPopup, authState, signOut } from '@angular/fire/auth';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  displayedColumns: string[] = ['ticker','weight'];
  fs: Firestore = inject(Firestore);
  auth: Auth = inject(Auth);
  stockData: any; //consider making this Stock[]
  stockDataCollection: CollectionReference = collection(this.fs, 'stock data');
  myControl = new FormControl('');
  options: string[] = sp500;
  filteredOptions: Observable<string[]>;
  user: any;
  userCollection: CollectionReference = collection(this.fs, 'users');
  userPortfolio: any;
  userPortfolioReference?: CollectionReference;

  constructor(
    public dialog: MatDialog,
    private renderer: Renderer2,
  ){
    authState(this.auth).subscribe(user =>{
      if(user){
        this.user = user;
        setDoc(doc(this.fs, `users/${this.user.uid}`), {
          displayName: user.displayName!,
          uid: user.uid,
          email: user.email,
        });
        this.userPortfolioReference = collection(this.fs, `users/${this.user.uid}/portfolios/My Portfolio/stocks`);
        this.userPortfolio = collectionData(this.userPortfolioReference);
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
      const stock: string = input.toUpperCase();
      if(sp500.includes(stock)){
        const dialogRef = this.dialog.open(StockDialogComponent,{
          height: '85vh',
          width: 'auto',
          data: {
            stock: stock,
            user: this.user.uid,
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
        {key: 'Jan', value: 20}, 
        {key: 'Feb', value: 10},
        {key: 'Mar', value: 40}, 
        {key: 'Apr', value: 50},
        {key: 'May', value: 70}, 
        {key: 'Jun', value: 60},
      ],
      parsing: {
        xAxisKey: 'key',
        yAxisKey: 'value'
      }
    }],
  };

  lineChartOptions = {
    scales: {
      x: {
        ticks:{
          color: 'white',
        },
      },
      y: {
        ticks: {
          color: 'white',
        },
      },
    },
    plugins: {
      legend: {
        labels:{
          color: 'white',
        }
      }
    }
  }
}
