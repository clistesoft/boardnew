import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';


@Component({
  selector: 'toolbox',
  templateUrl: './toolbox.component.html',
  styleUrls: ['./toolbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolboxComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
