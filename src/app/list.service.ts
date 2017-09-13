import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import { ListItem } from './list-item';
import { MockData } from './mock-data';

@Injectable()
export class ListService {

  constructor() { }

  public getListItems(startIndex: number, take: number): Observable<ListItem> {
    return Observable.of(MockData.slice(startIndex, startIndex+take)).delay(1000);
  }

}
