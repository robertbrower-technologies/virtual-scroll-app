import { Component, Input, OnInit, ElementRef } from '@angular/core';
import { ListItem } from '../../list-item';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.css']
})
export class ListItemComponent implements OnInit {

  @Input('list-item') listItem: ListItem;

  constructor(public elementRef: ElementRef) { }

  ngOnInit() {
  }

}
