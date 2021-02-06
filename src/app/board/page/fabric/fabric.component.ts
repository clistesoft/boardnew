import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import * as fromFabric from 'fabric';
import * as _ from 'lodash';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'bordFabric',
  templateUrl: './fabric.component.html',
  styleUrls: ['./fabric.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FabricComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
