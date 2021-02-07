import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { BoardRoutingModule } from './board-routing.module';
import { BoardComponent } from './board.component';
import { PageComponent } from './page/page.component';
import { FabricComponent } from './page/fabric/fabric.component';
import { ToolboxComponent } from './page/toolbox/toolbox.component';


@NgModule({
  declarations: [BoardComponent, PageComponent, FabricComponent, ToolboxComponent],
  imports: [
    CommonModule,
    BoardRoutingModule,
    FontAwesomeModule
  ]
})
export class BoardModule { }
