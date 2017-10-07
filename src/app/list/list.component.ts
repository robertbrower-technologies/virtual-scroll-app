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
  
  _items: ListItem[];
  
  @Input()
  set items(value: ListItem[]) {
    this._items = value;
  }

  get items(): ListItem[] {
    return this._items;
  }

  scrollItems: ListItem[];

  indices: any;

  public id: number;

  @ViewChild(VirtualScrollComponent)
  private virtualScroll: VirtualScrollComponent;
  
  scrollTo() {
    let index = this.items.findIndex(item => item.id === this.id);
    this.virtualScroll.scrollInto(this.items[index]);
  }

  ngOnChanges() {
    
  }

}