import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from "rxjs";
import { TimerObservable } from "rxjs/observable/TimerObservable";
import { ListService } from './list.service';
import { ListItem } from './list-item';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  private tick: number;

  private timer$: Subscription;

  items: ListItem[];

  constructor(private listService: ListService) { }

  ngOnInit() {
    let timer = TimerObservable.create(1000, 1000);
    this.timer$ = timer.subscribe(t => {
      this.listService.getItems(0, t).subscribe(items => {
        this.items = items;
      });
    });
  }

  ngOnDestroy() {
    this.timer$.unsubscribe();
  }

}
