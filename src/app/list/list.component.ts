import { Component, Input, OnInit, OnDestroy, AfterViewInit, ViewChildren, QueryList, NgZone } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ListItem } from '../list-item';
import { ListItemComponent } from './list-item/list-item.component';
import { ListService } from '../list.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit, AfterViewInit, OnDestroy {
  public topListItems: Array<ListItem> = new Array<ListItem>();
  public middleListItems: Array<ListItem> = new Array<ListItem>();
  public bottomListItems: Array<ListItem> = new Array<ListItem>();
 
  @ViewChildren('top') topViewChildren: QueryList<ListItemComponent>;
  @ViewChildren('middle') middleViewChildren: QueryList<ListItemComponent>;
  @ViewChildren('bottom') bottomViewChildren: QueryList<ListItemComponent>;
 
  private topViewChildrenChangesSubscription: Subscription;
  private middleViewChildrenChangesSubscription: Subscription;
  private bottomViewChildrenChangesSubscription: Subscription;
 
  topIntersectionObserver: any;
  middleIntersectionObserver: any;
  bottomIntersectionObserver: any;

  topObservedIndex: number;
  topObservedElement: any;
    
  bottomObservedIndex: number;
  bottomObservedElement: any;
     
  private appendStartIndex: number = 0;
  private prependStartIndex: number = 0;
  @Input() take: number;
  private getListItemsSubscription: Subscription;

  numVisibleMiddleElements: number = 0;
  firstTime: boolean = true;
  startOfList: boolean = true;
  endOfList: boolean = false;
 
  constructor(private listService: ListService, private ngZone: NgZone) { }
 
  ngOnInit() {
    if (this.take % 2) {
      throw new Error('take must be an even number.');
    }

    this.topIntersectionObserver = new IntersectionObserver(
      (entries: any) => {
        if (entries[0].isIntersecting) {
          console.log(`top ${entries[0].target.innerText} in viewport`);
          this.prependListItems(); // <--
        }
      },
      {/* Empty options... */}
    );

    this.middleIntersectionObserver = new IntersectionObserver(
      (entries: any) => {
        this.numVisibleMiddleElements = 0;
        entries.forEach((entry: any) => {
          if (entry.isIntersecting) {
            this.numVisibleMiddleElements ++; // <--
          }
        });
        console.log(`numVisibleMiddleElements=${this.numVisibleMiddleElements}`);
      },
      {/* Empty options... */}
    );

    this.bottomIntersectionObserver = new IntersectionObserver(
      (entries: any) => {
        if (entries[0].isIntersecting) {
          console.log(`bottom ${entries[0].target.innerText} in viewport`);
          this.appendListItems(this.take / 2); // <--
        }
      },
      {/* Empty options... */}
    );
    
    this.appendListItems(this.take * 2); // <--
  }
 
  ngAfterViewInit() {
    this.middleViewChildrenChangesSubscription = this.middleViewChildren.changes
      .subscribe((changes: QueryList<ListItemComponent> ) => {
        this.middleIntersectionObserver.disconnect();
        changes.forEach((listItemComponent: ListItemComponent) => {
          this.middleIntersectionObserver.observe(listItemComponent.elementRef.nativeElement);
        });
    });
 
    this.topViewChildrenChangesSubscription = this.topViewChildren.changes
      .subscribe((changes: QueryList<ListItemComponent> ) => {
        if (this.topObservedElement) {
          console.log(`top unobserve ${this.topObservedElement.innerText}`);
          this.topIntersectionObserver.unobserve(this.topObservedElement);
          this.topIntersectionObserver.disconnect();
          this.topObservedElement = null;
        }
        if (changes.length) {
          this.topObservedIndex = Math.floor(changes.length / 2) - 1;
          this.topObservedElement = this.topViewChildren.toArray()[this.topObservedIndex].elementRef.nativeElement;
          console.log(`top observe ${this.topObservedElement.innerText}`);
          this.topIntersectionObserver.observe(this.topObservedElement);
          
        }
      });
    
    this.bottomViewChildrenChangesSubscription = this.bottomViewChildren.changes
      .subscribe((changes: QueryList<ListItemComponent> ) => {
        if (this.bottomObservedElement) {
          console.log(`bottom unobserve ${this.bottomObservedElement.innerText}`);
          this.bottomIntersectionObserver.unobserve(this.bottomObservedElement);
          this.bottomIntersectionObserver.disconnect();
          this.bottomObservedElement = null;
        }
        if (changes.length) {
          this.bottomObservedIndex = Math.floor(changes.length / 2) - 1;
          this.bottomObservedElement = this.bottomViewChildren.toArray()[this.bottomObservedIndex].elementRef.nativeElement;
          console.log(`bottom observe ${this.bottomObservedElement.innerText}`);
          this.bottomIntersectionObserver.observe(this.bottomObservedElement);
        }
      });
  }
  ngOnDestroy() {
    if (!this.topViewChildrenChangesSubscription.closed) {
      this.topViewChildrenChangesSubscription.unsubscribe();
      this.topViewChildrenChangesSubscription = null;
    }

    if (!this.middleViewChildrenChangesSubscription.closed) {
      this.middleViewChildrenChangesSubscription.unsubscribe();
      this.middleViewChildrenChangesSubscription = null;
    }

    if (!this.bottomViewChildrenChangesSubscription.closed) {
      this.bottomViewChildrenChangesSubscription.unsubscribe();
      this.bottomViewChildrenChangesSubscription = null;
    }
  }
 
  private appendListItems(take: number) {
    this.getListItemsSubscription = this.listService.getListItems(this.appendStartIndex, take)
    .subscribe((listItems: Array<ListItem>) => {
      this.getListItemsSubscription.unsubscribe();
      this.endOfList = listItems.length < take;
      this.appendStartIndex += listItems.length;
      this.prependStartIndex = this.appendStartIndex - this.bottomListItems.length - this.middleListItems.length - this.topListItems.length - this.take / 2
      this.ngZone.run(() => {
        let numToMoveToMiddle = Math.floor(listItems.length / 2); 
        if (this.firstTime) {
          this.middleListItems = listItems.splice(0, numToMoveToMiddle);
          this.bottomListItems = listItems;
          this.firstTime = false;
        } else {
          this.bottomListItems = this.bottomListItems.concat(listItems);
          this.middleListItems = this.middleListItems.concat(this.bottomListItems.splice(0, listItems.length));
          this.topListItems.splice(0, listItems.length);
          this.topListItems = this.topListItems.concat(this.middleListItems.splice(0, listItems.length));
        }
      });
    });
  }
 
  private prependListItems() {
    if (this.prependStartIndex >= 0) {
      this.getListItemsSubscription = this.listService.getListItems(this.prependStartIndex, this.take / 2)
      .subscribe((listItems: Array<ListItem>) => {
        this.getListItemsSubscription.unsubscribe();
        this.ngZone.run(() => {
          if (this.topListItems.length < this.take) {
            this.topListItems = listItems.concat(this.topListItems);
          } else {
            this.bottomListItems.splice(this.take / 2, this.take / 2);
            this.bottomListItems = this.middleListItems.splice(this.take / 2, this.take / 2).concat(this.bottomListItems);
            this.middleListItems = this.topListItems.splice(this.take / 2, this.take / 2).concat(this.middleListItems);
            this.topListItems = listItems.concat(this.topListItems);
          }
          this.prependStartIndex = this.prependStartIndex - this.take / 2;
          this.appendStartIndex = this.prependStartIndex + this.bottomListItems.length + this.middleListItems.length + this.topListItems.length;
        });
      });
    }
  }
}