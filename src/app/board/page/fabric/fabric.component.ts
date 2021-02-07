import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  SimpleChanges,
  AfterViewInit,
  OnChanges,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { fabric } from 'fabric';
import * as _ from 'lodash';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'bordFabric',
  templateUrl: './fabric.component.html',
  styleUrls: ['./fabric.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FabricComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('htmlCanvas', { static: true }) htmlCanvas: ElementRef | undefined;
  // public bordCanvas: any;
  private bordCanvas: fabric.Canvas | undefined;
  public canvasEvent!: string;

  @Input()
  permanentMode!: string;

  constructor() {
    // default props
    fabric.Object.prototype.set({
      fill: '',
      strokeWidth: 2,
      stroke: '#000000',
      strokeUniform: true,
      originX: 'center',
      originY: 'center',
      noScaleCache: false,
    });
  }

  ngAfterViewInit(): void {
    // setup front side canvas
    this.bordCanvas = new fabric.Canvas(this.htmlCanvas?.nativeElement, {
      selection: this.permanentMode === 'selection' ? true : false,
      isDrawingMode: this.permanentMode === 'draw' ? true : false,
    });

    // initialize selection Events
    this.bordCanvas.on({
      'before:selection:cleared':(e: any) => { this.handleSelection('before:selection:cleared', e)},
      'selection:cleared':(e: any) => { this.handleSelection('selection:cleared', e)},
      'selection:created':(e: any) => { this.handleSelection('selection:created', e)},
      'selection:updated':(e: any) => { this.handleSelection('selection:updated', e)}
    })

    // temp rect added
    const rect = new fabric.Rect({
      left: 100,
      top: 50,
      width: 50,
      height: 50,
      rx: 5,
      ry: 5,
      // selectable: false,
    });

    rect.set({objID: uuid()});
    this.bordCanvas.add(rect);
    this.bordCanvas.requestRenderAll();
  }

  ngOnInit(): void {

  }

  ngOnChanges(_changes: SimpleChanges): void {
    // Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    // Add '${implements OnChanges}' to the class.
    console.log('changed', _changes);
  }

  handleSelection(type: string, e: any) {
    // handle Selections
    console.log('handleSelection=>', type, e.target?.type);
    // log events on statusbar
    this.canvasEvent = type + ' = ' + e.target?.type + ' / ' + e.target?.objID;
    console.log(this, this.canvasEvent);
  }

  buttonPress() {
    this.canvasEvent = 'done';
    alert('done');
  }
}
