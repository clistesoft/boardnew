import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BoardRoutingModule } from './board-routing.module';
import { BoardComponent } from './board.component';
import { PageComponent } from './page/page.component';
import { FabricComponent } from './page/fabric/fabric.component';


@NgModule({
  declarations: [BoardComponent, PageComponent, FabricComponent],
  imports: [
    CommonModule,
    BoardRoutingModule
  ]
})
export class BoardModule { }
