import { FiltersObject } from './../../../shared/models/filters.model';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Observable } from 'rxjs';

import { Category } from '../../../shared/models/category.model';
import { FormGroup, FormControl } from '@angular/forms';
import { FormData } from '../../../shared/models/form-data.model'; 

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  form: FormGroup;

  @Output() filters: EventEmitter<FiltersObject> = new EventEmitter();
  @Input() categories$: Observable<Category[]>;

  constructor() {
    this.form = new FormGroup({
      from: new FormControl(''),
      to: new FormControl(''),
      category: new FormControl(''),
      stock: new FormControl('')
    });
  }

  onFiltersChange(form: FormData): void {
    this.filters.emit({
      price: {from: form['from'], to: form['to']},
      category: form['category'],
      stock: form['stock']
    });
  }

  clearFilters(): void {
    this.form.reset();
    this.filters.emit({
      price: {from: '', to: ''},
      category: '',
      stock: ''
    });
  }
}
