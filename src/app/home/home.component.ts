import { Component } from '@angular/core';
import { ChartData } from 'chart.js';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;

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
