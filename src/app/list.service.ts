import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import { ListItem } from './list-item';
import { MockData } from './mock-data';

@Injectable()
export class ListService {

  constructor() { }

  public getItems(skip: number, take: number): Observable<Array<ListItem>> {
    console.log(`ListService getItems index=${skip} take=${take}`)
    return Observable.of(MockData.slice(skip, skip+take)).delay(0);
  }

}
