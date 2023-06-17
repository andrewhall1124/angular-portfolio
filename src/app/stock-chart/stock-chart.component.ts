import { Component, Inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DocumentReference } from '@angular/fire/firestore';
import { ChartData } from 'chart.js';
import { Firestore, doc, docData } from '@angular/fire/firestore';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-stock-chart',
  templateUrl: './stock-chart.component.html',
  styleUrls: ['./stock-chart.component.css']
})
export class StockChartComponent implements OnChanges{
  @Input() data: any;
  stockReference: DocumentReference;
  stockData: Observable<any>;
  
  constructor(      
    @Inject(Firestore) private fs: Firestore,
  ){
    this.stockReference = doc(this.fs, `stock data/${this.data}`);
    this.stockData = docData(this.stockReference);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.hasOwnProperty('data') && this.data) {
      this.initializeStockData();
    }
  }

  initializeStockData() {
    this.stockReference = doc(this.fs, `stock data/${this.data}`);
    this.stockData = docData(this.stockReference);
    this.stockData.subscribe(data => {
      this.updateLineChartData(data.close, data.date);
    });
  }

  updateLineChartData(closeData: number[], dateData: string[]) {
    const chartData: { key: string, value: number }[] = [];
    for (let i = 0; i < closeData.length; i++) {
      chartData.push({ key: dateData[i], value: closeData[i] });
    }
    this.lineChartData.datasets[0].data = chartData;
  }

  lineChartData: ChartData <'line', {key: string, value: number} []> = {
    datasets: [{
      data: [],
      pointRadius: 0,
      pointHoverRadius: 0,
      backgroundColor: 'green',
      borderColor: 'lightgreen',
      parsing: {
        xAxisKey: 'key',
        yAxisKey: 'value'
      },
      label: 'Stock Close',
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
      responsive: true,
      legend: {
        labels:{
          color: 'white',
        }
      },
      tooltip: {
        enabled: false,
      },
    }
  }
}
