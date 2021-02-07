import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { fabric } from 'fabric';
import * as _ from 'lodash';

@Component({
  selector: 'bordFabric',
  templateUrl: './fabric.component.html',
  styleUrls: ['./fabric.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FabricComponent implements OnInit {
  bordCanvas: fabric.Canvas;
  canvasEvent: string;

  constructor() {
    this.bordCanvas = new fabric.Canvas('canvasBord', {
      renderOnAddRemove: false,
      selection: false, // this.mode === 'selection',
      isDrawingMode: false, // this.mode === 'drawing',
    });

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
    this.canvasEvent = 'Events';
  }

  ngOnInit(): void {
    this.bordCanvas = new fabric.Canvas('canvasBord', {
      renderOnAddRemove: false,
      selection: false,
      isDrawingMode: false,
    });

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

    this.bordCanvas.add(rect);
    this.bordCanvas.requestRenderAll();

    // initialize Events
    this.initializeCanvasEvents();
  }

  initializeCanvasEvents() {
    // selection related events
    this.bordCanvas.on('before:selection:cleared', (e) => {
      this.handleSelection('before:selection:cleared', e);
    });
    this.bordCanvas.on('selection:cleared', (e) => {
      this.handleSelection('selection:cleared', e);
    });
    this.bordCanvas.on('selection:created', (e) => {
      this.handleSelection('selection:created', e);
    });
    this.bordCanvas.on('selection:updated', (e) => {
      this.handleSelection('selection:updated', e);
    });
    // object related events
  }

  handleSelection(type: string, e: any) {
    // handle Selections
    console.log('handleSelection=>', type, e.target?.type);
    // log events on statusbar
    this.canvasEvent = type + '=' + e.target?.type;
    console.log(this.canvasEvent);
  }

}