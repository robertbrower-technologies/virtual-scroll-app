import { Component, Input, OnInit, ElementRef } from '@angular/core';
import { ListItem } from '../../list-item';

@Component({
  selector: 'list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.css']
})
export class ListItemComponent implements OnInit {

  @Input('item') item: ListItem;

  constructor(public elementRef: ElementRef) { }

  ngOnInit() {
  }

}
