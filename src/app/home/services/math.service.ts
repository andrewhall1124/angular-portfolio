import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MathService {
  std(arr: number[]){
    const mean = arr.reduce((acc: number, val: number) => acc + val, 0) / arr.length;
    const squaredDifferences = arr.map((num) => Math.pow(num - mean, 2));
    const meanSquaredDifference = squaredDifferences.reduce((acc, val) => acc + val, 0) / arr.length;
    const standardDeviation = Math.sqrt(meanSquaredDifference);
    return standardDeviation;
  }

  avg(arr: number[]){
    const sum = arr.reduce((acc, num) => acc + num, 0);
    const average = sum / arr.length;
    return average;
  }
}
