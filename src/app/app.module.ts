import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ListComponent } from './list/list.component';
import { ListItemComponent } from './list/list-item/list-item.component';
import { ListService } from './list.service';
import { VirtualScrollModule } from 'angular2-virtual-scroll';

@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    ListItemComponent
  ],
  imports: [
    BrowserModule,
    VirtualScrollModule
  ],
  providers: [ListService],
  bootstrap: [AppComponent]
})
export class AppModule { }
