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
  ChangeDetectorRef,
  HostListener,
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
  private bordCanvas!: fabric.Canvas;
  public canvasEvent!: string;
  public keyPressed!: KeyboardEvent;
  public mousePointer!: { x: number; y: number };
  public temporaryMode: string = '';

  @Input()
  permanentMode!: string;

  constructor(private cdr: ChangeDetectorRef) {
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

  @HostListener('window:keydown', ['$event'])
  @HostListener('window:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.keyPressed = event;
    this.temporaryMode = '';
    // console.log(event);
    switch (event.type) {
      case 'keydown':
        // temporary mode for to draw
        if (event.code === 'AltLeft' || event.code === 'AltRight') {
          this.temporaryMode = 'draw:start';
        }
        break;
      case 'keyup':
        if (event.code === 'AltLeft' || event.code === 'AltRight') {
          this.temporaryMode = 'draw:stop';
        }
        break;
      default:
        this.temporaryMode = '';
        break;
    }
    event.preventDefault();
    event.stopPropagation();
    return false;
  }

  ngAfterViewInit(): void {
    // setup front side canvas
    this.bordCanvas = new fabric.Canvas(this.htmlCanvas?.nativeElement, {
      selection: this.permanentMode === 'selection' ? true : false,
      isDrawingMode: this.permanentMode === 'draw' ? true : false,
      // freeDrawingCursor:
    });
    this.bordCanvas.freeDrawingBrush.width = 4;


    // initialize selection Events
    this.bordCanvas.on({
      'before:selection:cleared': (e: any) => {
        this.handleSelection('before:selection:cleared', e);
      },
      'selection:cleared': (e: any) => {
        this.handleSelection('selection:cleared', e);
      },
      'selection:created': (e: any) => {
        this.handleSelection('selection:created', e);
      },
      'selection:updated': (e: any) => {
        this.handleSelection('selection:updated', e);
      },
    });
    // // initialize mouse Events
    this.bordCanvas.on({
      /**
        'mouse:up', 'mouse:down', 'mouse:move', 'mouse:up:before', 'mouse:down:before', 'mouse:move:before'
        'mouse:dblclick', 'mouse:wheel', 'mouse:over', 'mouse:out'
       */
      'mouse:up': (e: any) => {
        this.handleMouse('mouse:up', e);
      },
      'mouse:down': (e: any) => {
        this.handleMouse('mouse:down', e);
      },
      'mouse:move': (e: any) => {
        this.handleMouse('mouse:move', e);
      },
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

    rect.set({ objID: uuid() });
    this.bordCanvas.add(rect);
    this.bordCanvas.requestRenderAll();
  }

  ngOnInit(): void {}

  ngOnChanges(_changes: SimpleChanges): void {
    // Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    // Add '${implements OnChanges}' to the class.
    // console.log('changed', _changes);
    if (this.permanentMode && this.bordCanvas) {
      this.bordCanvas.selection =
        this.permanentMode === 'selection' ? true : false;
      this.bordCanvas.isDrawingMode =
        this.permanentMode === 'draw' ? true : false;
    }
  }

  handleSelection(type: string, e: any) {
    // console.log('handleSelection=>', type, e.target?.type);
    // log events on statusbar
    this.canvasEvent = type + (e.target?.type ? ' = ' + e.target?.type : '');
    // console.log(this, this.canvasEvent);
    this.cdr.detectChanges();
  }

  handleMouse(type: string, e: any): void {
    const _this = this;
    // console.log('handleSelection=>', type, e.absolutePointer, e.pointer);
    this.mousePointer = this.bordCanvas.getPointer(e);
    this.cdr.detectChanges();
    //check temporaryMode
    // this.bordCanvas.isDrawingMode =
    //   this.temporaryMode === 'draw:start' ? true : false;
    // // pointer = this.getPointer(e);
    if (this.temporaryMode === 'draw:start') {
      if (!this.bordCanvas.isDrawingMode) {
        this.bordCanvas.isDrawingMode = true;
        this.bordCanvas.freeDrawingBrush.onMouseDown(e, this.mousePointer);
      }
      this.bordCanvas.freeDrawingBrush.onMouseMove(this.mousePointer, {
        e: e,
        pointer: this.mousePointer,
      });
    }
    if (this.temporaryMode === 'draw:stop' && this.bordCanvas.isDrawingMode ) {
      this.bordCanvas.isDrawingMode = false;
      this.bordCanvas.freeDrawingBrush.onMouseUp(this.mousePointer, {
        e: e,
        pointer: this.mousePointer,
      });
    }
    // let obj = { pointer: this.mousePointer, e: e };
    // if (this.bordCanvas._isCurrentlyDrawing) {
    //   var pointer = this.getPointer(e);
    //
    // }
    // if (!this.bordCanvas.isDrawing) {
    //   this.bordCanvas.isDrawing = true;
    //   this.bordCanvas.freeDrawingBrush.onMouseDown(pointer, obj);
    // }
    // }

    // this.freeDrawingBrush.onMouseMove(pointer, obj);
    // this._handleEvent(e, 'move');
    this.bordCanvas.renderAll();
  }
}
