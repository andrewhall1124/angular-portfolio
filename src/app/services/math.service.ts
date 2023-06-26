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

  sumProduct(arr1: number[], arr2: number[]){
    let sumProduct = 0;
    for (let i = 0; i < arr1.length; i++) {
      sumProduct += arr1[i] * arr2[i];
    };
    return sumProduct;
  }

  matrixMultiplication(matrix1: number[][], matrix2: number[][]): number[][]{
    const rowsA = matrix1.length;
    const colsA = matrix1[0].length;
    const rowsB = matrix2.length;
    const colsB = matrix2[0].length;
  
    if (colsA !== rowsB) {
      throw new Error("Cannot multiply matrices. Invalid dimensions.");
    }
  
    const result: number[][] = [];
  
    for (let i = 0; i < rowsA; i++) {
      result[i] = [];
      for (let j = 0; j < colsB; j++) {
        let sum = 0;
        for (let k = 0; k < colsA; k++) {
          sum += matrix1[i][k] * matrix2[k][j];
        }
        result[i][j] = sum;
      }
    }
  
    return result;
  }

  calculateCovariance(arr1: number[], arr2: number[]): number {
    const n = arr1.length;
    const mean1 = arr1.reduce((acc, val) => acc + val, 0) / n;
    const mean2 = arr2.reduce((acc, val) => acc + val, 0) / n;

    let covariance = 0;

    for (let i = 0; i < n; i++) {
      covariance += (arr1[i] - mean1) * (arr2[i] - mean2);
    }

    covariance /= n;

    return covariance;
  }
}
