import { Component, inject } from '@angular/core';
import { ChartData } from 'chart.js';
import { CollectionReference, Firestore, collection, collectionData } from '@angular/fire/firestore';

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

  constructor(){
    this.stockData = collectionData(this.stockDataCollection);
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
