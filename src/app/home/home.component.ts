import { Component, inject, Renderer2, OnInit, ViewChild  } from '@angular/core';
import { ChartData } from 'chart.js';
import { CollectionReference, Firestore, collection, collectionData, doc, docData, setDoc, DocumentData, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { sp500 } from '../sp';
import { User } from '@angular/fire/auth';
import { MatDialog } from '@angular/material/dialog';
import { StockDialogComponent } from '../dialogs/stock-dialog/stock-dialog.component';
import { Auth, GoogleAuthProvider, signInWithPopup, authState, signOut } from '@angular/fire/auth';
import { Stock } from '../models/models';
import { MatTable } from '@angular/material/table';
import { MathService } from './services/math.service';
import { EditWeightDialogComponent } from '../dialogs/edit-weight-dialog/edit-weight-dialog.component';
import { RemoveStockDialogComponent } from '../dialogs/remove-stock-dialog/remove-stock-dialog.component';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  stockColumns: string[] = ['ticker', 'longName', 'sector', 'risk', 'return','weight', 'button'];
  portfolioColumns: string[] = ['count','risk', 'return','weight'];
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
  portfolioSummary: any[] = [];

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

      //Get stock data
      tempData.subscribe(stocks =>{
        this.portfolioStocks[i] = {
          ...stocks,
          weight: this.portfolioStocks[i].weight, // Assign weight correctly
        };
      });

      // Calculate Stats
      tempData.subscribe(stocks =>{
        this.portfolioStocks[i] = {
          ...stocks,
          risk: this.myMath.std(this.portfolioStocks[i].monthlyReturns),
          return: this.myMath.avg(this.portfolioStocks[i].monthlyReturns),
          weight: this.portfolioStocks[i].weight,
        };
        this.table?.renderRows();
        this.calcPortfolioSummary();
      });
    };
  };

  calcPortfolioSummary(){
    //Init  portfolio weight and count
    let portfolioWeight = 0; //for iteration later
    const portfolioCount = this.portfolioStocks.length;

    //Init weightArray and returnArray
    const weightArray = [];
    const returnArray = [];
    for(let i = 0; i < portfolioCount; i++){
      weightArray[i] = this.portfolioStocks[i].weight;
      returnArray[i] = this.portfolioStocks[i].return;
    };

    //Calc portfolio weight
    for(let i = 0; i < portfolioCount; i++){
      portfolioWeight += this.portfolioStocks[i].weight;
    }

    //Create covariance matrix
    let covarianceMatrix = []
    for(let i = 0; i < portfolioCount; i++){
      const matrixRow = [];
      for(let j = 0; j < portfolioCount; j++){
        const stock1 = this.portfolioStocks[i].monthlyReturns;
        const stock2 = this.portfolioStocks[j].monthlyReturns;  
        const covariance = this.myMath.calculateCovariance(stock1,stock2);
        matrixRow.push(covariance);
      }
      covarianceMatrix.push(matrixRow)
    };

    //Init weight matrix
    const weightMatrix: number[][] = [];
    for(let i = 0; i < weightArray.length; i++){
      weightMatrix[i] = [weightArray[i]]
    };

    //Calculate risk
    const resultMatrix = this.myMath.matrixMultiplication(covarianceMatrix, weightMatrix)
    const resultArray: number[] = [];
    for(let i = 0; i < resultMatrix.length; i++){
      resultArray[i] = resultMatrix[i][0];
    }

    const portfolioRisk = this.myMath.sumProduct(weightArray, resultArray);

    //Calc portfolio return
    const portfolioReturn = this.myMath.sumProduct(weightArray,returnArray);
    
    this.portfolioSummary =[{
      count: portfolioCount,
      risk: portfolioRisk,
      return: portfolioReturn,
      weight: portfolioWeight,
    }];
    const docRef = doc(this.fs, `users/${this.user?.uid}/portfolios/My Portfolio`);
    setDoc(docRef,{
      count: portfolioCount,
      risk: portfolioRisk,
      return: portfolioReturn,
      weight: portfolioWeight,
    });
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

  openEditWeightDialog(stock: any){
    const dialogRef = this.dialog.open(EditWeightDialogComponent, {
      data: {
        stock: stock,
        user: this.user,
      },
    });
  }

  removeStock(stock: any){
    const dialogRef = this.dialog.open(RemoveStockDialogComponent, {
      width: '300px',
      data: {
        stock: stock,
        user: this.user,
      }
    })
  }

  testFunction(input: any){
    console.log(input)
  }



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
