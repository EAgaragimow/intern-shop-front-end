import { FiltersObject } from './../models/filters.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { environment } from 'src/environments/environment';
import * as fromFiltersMethods from '../utils/filters-methods';

@Injectable()
export class ProductsService {
  bufferQuery: string = '';

  constructor(private http: HttpClient) {
  }

  getProducts(filters: FiltersObject = {}): Observable<Product[]> {
    let url = `${environment.api_url}/products${fromFiltersMethods.setFilters(filters)}`;
    
    return this.http.get<Product[]>(url);
  }
}
