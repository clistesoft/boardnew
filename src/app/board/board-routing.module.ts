import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoardComponent } from './board.component';
import { PageComponent } from './page/page.component';

const routes: Routes = [
  {
    path: '',
    component: BoardComponent,
    children: [{ path: 'page', component: PageComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BoardRoutingModule {}
