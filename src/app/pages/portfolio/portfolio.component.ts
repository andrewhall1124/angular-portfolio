import { ActivatedRoute } from '@angular/router';
import { Component, inject, Renderer2, ViewChild  } from '@angular/core';
import { ChartData } from 'chart.js';
import { CollectionReference, Firestore, collection, collectionData, doc, docData, setDoc, DocumentData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { sp500 } from 'src/app/sp';
import { User } from '@angular/fire/auth';
import { MatDialog } from '@angular/material/dialog';
import { StockDialogComponent } from 'src/app/dialogs/stock-dialog/stock-dialog.component';
import { Auth, GoogleAuthProvider, signInWithPopup, authState, signOut } from '@angular/fire/auth';
import { MatTable } from '@angular/material/table';
import { MathService } from 'src/app/services/math.service';
import { EditWeightDialogComponent } from 'src/app/dialogs/edit-weight-dialog/edit-weight-dialog.component';
import { RemoveStockDialogComponent } from 'src/app/dialogs/remove-stock-dialog/remove-stock-dialog.component';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent {
  RISK_FREE: number = 0;
  route: ActivatedRoute = inject(ActivatedRoute);
  stockColumns: string[] = ['ticker', 'longName', 'sector', 'risk', 'return','weight', 'button'];
  portfolioColumns: string[] = ['count','risk', 'return','weight', 'sharpe'];
  fs: Firestore = inject(Firestore);
  auth: Auth = inject(Auth);
  stockData: Observable<DocumentData>;
  stockDataCollection: CollectionReference = collection(this.fs, 'stock data');
  myControl = new FormControl('');
  options: string[] = sp500;
  filteredOptions: Observable<string[]>;
  user?: User | null;
  userCollection: CollectionReference = collection(this.fs, 'users');
  portfolioObservable?: Observable<any>;
  portfolioReference?: any;
  portfolioStocks: any[] = [];
  @ViewChild(MatTable) table?: MatTable<any>;
  portfolioSummary: any[] = [];
  portfolioId: string;
  portfolioData: any;

  constructor(
    public dialog: MatDialog,
    private renderer: Renderer2,
    private myMath: MathService,
  ){
    this.portfolioId = this.route.snapshot.params['id'];
    authState(this.auth).subscribe(user =>{
      if(user){
        this.user = user;
        setDoc(doc(this.fs, `users/${this.user.uid}`), {
          displayName: user.displayName,
          uid: user.uid,
          email: user.email,
        });
        //Portfolio data
        this.portfolioReference = doc(this.fs, `users/${this.user.uid}/portfolios/${this.portfolioId}`);
        this.portfolioObservable = docData(this.portfolioReference);
        this.portfolioObservable.subscribe((data) =>{
          this.portfolioData = {...data};
        })
        // Portfolio stocks
        const tempPortfolioStocksRef = collection(this.fs, `users/${this.user.uid}/portfolios/${this.portfolioId}/stocks`);
        const tempPortfolioData = collectionData(tempPortfolioStocksRef)
        tempPortfolioData.subscribe((stocks: any) => {
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

    const portfolioRisk = Math.sqrt(this.myMath.sumProduct(weightArray, resultArray));

    //Calc portfolio return
    const portfolioReturn = this.myMath.sumProduct(weightArray,returnArray);

    //Calc portfolio sharpe ratio
    let portfolioSharpe = 0;
    portfolioSharpe = (portfolioReturn - this.RISK_FREE) / portfolioRisk;
    
    this.portfolioSummary =[{
      count: portfolioCount,
      risk: portfolioRisk,
      return: portfolioReturn,
      weight: portfolioWeight,
      sharpe: portfolioSharpe,
    }];

    setDoc(this.portfolioReference,{
      name: this.portfolioData.name,
      created: this.portfolioData.created,
      id: this.portfolioData.id,
      count: portfolioCount,
      risk: portfolioRisk,
      return: portfolioReturn,
      weight: portfolioWeight,
      sharpe: portfolioSharpe,
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
            userId: this.user?.uid,
            portfolioId: this.portfolioId,
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
        portfolio: this.portfolioData,
      },
    });
  }

  removeStock(stock: any){
    const dialogRef = this.dialog.open(RemoveStockDialogComponent, {
      width: '250px',
      data: {
        stock: stock,
        user: this.user,
        portfolio: this.portfolioData,
      }
    })
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
