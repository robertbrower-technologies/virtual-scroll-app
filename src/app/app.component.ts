import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
import { TimerObservable } from "rxjs/observable/TimerObservable";
import { ListService } from './list.service';
import { ListItem } from './list-item';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  private timer$: Subscription;

  items: ListItem[];

  index = 0;
  
  constructor(private listService: ListService) { }

  ngOnInit() {
    this.listService.getItems(0, 1000)
    .subscribe(items => {
      items.forEach(item => item.last_updated = (new Date()).getTime());
      this.items = items;
      let timer = TimerObservable.create(1000, 1000);
      this.timer$ = timer.subscribe(t => this.updateItem());
    });
  }

  ngOnDestroy() {
    this.timer$.unsubscribe();
  }

  updateItem() {
    console.log(`this.index=${this.index}`);
    this.items[this.index].last_updated = (new Date()).getTime();
    this.items.sort((a, b) => {
      if (a.last_updated > b.last_updated) {
        return -1;
      }
      if (a.last_updated < b.last_updated) {
        return 1;
      }
      return 0;
    });
    this.items = (new Array<ListItem>()).concat(this.items);
    this.index ++;
    if (this.index === this.items.length) {
      this.index = 0;
    }
  }

}
