import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ListItem } from '../list-item';

import { VirtualScrollComponent, ChangeEvent } from 'angular2-virtual-scroll';

@Component({
  selector: 'list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnChanges {
  
  @Input()
  items: ListItem[];
  scrollItems: ListItem[];
  indices: any;

  filteredList: ListItem[];

  @ViewChild(VirtualScrollComponent)
  private virtualScroll: VirtualScrollComponent;

  reduceListToEmpty() {
    this.filteredList = [];
  }

  reduceList() {
    this.filteredList = (this.items || []).slice(0, 100);
  }

  sortByName() {
    this.filteredList = [].concat(this.filteredList || []).sort((a, b) => -(a.name < b.name) || +(a.name !== b.name));
  }

  sortByIndex() {
    this.filteredList = [].concat(this.filteredList || []).sort((a, b) => -(a.index < b.index) || +(a.index !== b.index));
  }

  setToFullList() {
    this.filteredList = (this.items || []).slice();
  }

  scrollTo() {
    this.virtualScroll.scrollInto(this.items[50]);
  }

  ngOnChanges() {
    this.setToFullList();
  }

}