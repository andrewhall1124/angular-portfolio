import { Component, inject, OnInit, Renderer2  } from '@angular/core';
import { ChartData } from 'chart.js';
import { CollectionReference, Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { sp500 } from './sp';
import {MatDialog, MatDialogRef, MatDialogModule} from '@angular/material/dialog';
import { StockDialogComponent } from '../stock-dialog/stock-dialog.component';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  displayedColumns: string[] = ['ticker', 'company name', 'sector', 'industry', 'average return', 'standard deviation'];
  fs: Firestore = inject(Firestore);
  stockData: any; //consider making this Stock[]
  stockDataCollection: CollectionReference = collection(this.fs, 'stock data');
  myControl = new FormControl('');
  options: string[] = sp500;
  filteredOptions: Observable<string[]>;

  constructor(
    public dialog: MatDialog,
    private renderer: Renderer2,
    ){
    this.stockData = collectionData(this.stockDataCollection);

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  openStockDialog(){
    const dialogRef = this.dialog.open(StockDialogComponent,{
      height: '95vh',
      width: '100vw',
    });

    dialogRef.afterOpened().subscribe(() => {
      this.renderer.addClass(document.body, 'no-scroll');
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  lineChartData: ChartData <'bar', {key: string, value: number} []> = {
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
