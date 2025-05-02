import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction } from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = 'http://localhost:5028/api/transactions';

  constructor(private http: HttpClient) {}

  processTransaction(transaction: Transaction): Observable<string> {
    return this.http.post<string>(this.apiUrl, transaction);
  }
}