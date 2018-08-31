import { FiltersObject } from './../models/filters.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { environment } from 'src/environments/environment';

@Injectable()
export class ProductsService {
  bufferQuery: string = '';
  bufferQueryPrice: string = '';
  bufferQueryCategory: string = '';
  bufferQueryStock: string = '';

  constructor(private http: HttpClient) {
  }

  getProducts(filters: FiltersObject = {}): Observable<Product[]> {
    let headers: HttpHeaders = new HttpHeaders({
      "Authorization": `Bearer ${localStorage.getItem('token')}`
    });
    
    return this
      .http
      .get<Product[]>
      (`${environment.api_url}/products${this.setFilters(filters)}`, {headers});
  }

  setFilters(filtersObj: FiltersObject) {
    let mainQuery: string = this.bufferQuery;

    if (filtersObj && filtersObj.price) {
      mainQuery += this.setPriceFilter(filtersObj, mainQuery);
    }

    if (filtersObj && filtersObj.category) {
      mainQuery = this.bufferQuery;
      mainQuery += this.setCategoryFilter(filtersObj, mainQuery);
    }

    if (filtersObj && filtersObj.stock) {
      mainQuery = this.bufferQuery;
      mainQuery += this.setStockFilter(filtersObj, mainQuery);
    }

    mainQuery = this.bufferQuery;
    if (mainQuery === '?') {
      return mainQuery = '';
    }
    return mainQuery;
  }

  setPriceFilter(filtersObj: FiltersObject, mainQuery: string): string {
    debugger;
    (mainQuery === '') ? mainQuery += '?' : mainQuery;

    let queryPrice: string = this.bufferQueryPrice;
    if (!filtersObj.price['from'] && !filtersObj.price['to']) {
      if (!mainQuery.match('price')) {
        return mainQuery;
      } else {
        mainQuery = mainQuery.replace(queryPrice, '');
        queryPrice = '';
      }
    }
    if (filtersObj.price['from'] || filtersObj.price['to']) {
      if (!mainQuery.match('price')) {
        queryPrice = `price=${filtersObj.price['from']} to ${filtersObj.price['to']}`;
        mainQuery += queryPrice;
      } else {
        mainQuery = mainQuery.replace(queryPrice, `price=${filtersObj.price['from']} to ${filtersObj.price['to']}`);
        queryPrice = `price=${filtersObj.price['from']} to ${filtersObj.price['to']}`;
      }
    }

    this.bufferQuery = mainQuery;
    this.bufferQueryPrice = queryPrice;
    return mainQuery;
  }

  setCategoryFilter(filtersObj: FiltersObject, mainQuery: string): string {
    let queryCategory: string = this.bufferQueryCategory;

    // return queryCategory = `&category=${filtersObj.category}`;
    return mainQuery;
  }

  setStockFilter(filtersObj: FiltersObject, mainQuery: string): string {
    let queryStock: string = this.bufferQueryStock
    ;
    // return queryStock = `&stock=${filtersObj.stock}`;
    return mainQuery;
  }
}
