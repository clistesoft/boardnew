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
  Renderer2,
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
  @ViewChild('popBox', { static: true }) popBox: ElementRef | undefined;
  // public bordCanvas: any;
  private bordCanvas!: fabric.Canvas;
  public canvasEvent!: string;
  public keyPressed!: KeyboardEvent;
  public mousePointer!: { x: number; y: number };
  public temporaryMode: string = '';

  @Input()
  permanentMode!: string;

  constructor(private cdr: ChangeDetectorRef, private renderer: Renderer2) {
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
        // temporary mode for to selection
        if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
          this.temporaryMode = 'select:start';
        }
        break;
      case 'keyup':
        if (event.code === 'AltLeft' || event.code === 'AltRight') {
          this.temporaryMode = 'draw:stop';
        }
        if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
          this.temporaryMode = 'select:stop';
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
        this.handleSelectionEvents('before:selection:cleared', e);
      },
      'selection:cleared': (e: any) => {
        this.handleSelectionEvents('selection:cleared', e);
      },
      'selection:created': (e: any) => {
        this.handleSelectionEvents('selection:created', e);
      },
      'selection:updated': (e: any) => {
        this.handleSelectionEvents('selection:updated', e);
      },
    });
    // initialize mouse Events
    this.bordCanvas.on({
      /**
        'mouse:up', 'mouse:down', 'mouse:move', 'mouse:up:before', 'mouse:down:before',
        'mouse:move:before','mouse:dblclick', 'mouse:wheel', 'mouse:over', 'mouse:out'
       */
      'mouse:up': (e: any) => {
        this.handleMouseEvents('mouse:up', e);
      },
      'mouse:down': (e: any) => {
        this.handleMouseEvents('mouse:down', e);
      },
      'mouse:move': (e: any) => {
        this.handleMouseEvents('mouse:move', e);
      },
    });
    // initialize Object related Events
    this.bordCanvas.on({
      /**
        'object:modified','object:moving','object:scaling','object:rotating','object:skewing',
        'object:moved','object:scaled','object:rotated','object:skewed'
       */
      'object:modified': (e: any) => {
        this.handleObjectEvents('object:moving', e);
      },
      'object:moving': (e: any) => {
        this.handleObjectEvents('object:moving', e);
      },
      'object:scaling': (e: any) => {
        this.handleObjectEvents('object:moving', e);
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

  togglePopover(show: boolean = false, pos?: any) {
    // console.log(
    //   'togglePopover',
    //   (pos ? pos.x : 0) + 'px',
    //   (pos ? pos.y : 0) + 'px'
    // );
    if (show) {
      this.renderer.removeClass(this.popBox?.nativeElement, 'd-none');
    } else {
      this.renderer.addClass(this.popBox?.nativeElement, 'd-none');
    }
    this.renderer.setStyle(
      this.popBox?.nativeElement,
      'top',
      (pos ? pos.y : 0) + 'px'
    );
    this.renderer.setStyle(
      this.popBox?.nativeElement,
      'left',
      (pos ? pos.x : 0) + 'px'
    );
  }

  movePopover(pos?: any) {
    this.renderer.setStyle(
      this.popBox?.nativeElement,
      'top',
      (pos ? pos.y : 0) + 'px'
    );
    this.renderer.setStyle(
      this.popBox?.nativeElement,
      'left',
      (pos ? pos.x : 0) + 'px'
    );
  }

  handleSelectionEvents(type: string, e: any) {
    // console.log('handleSelectionEvents=>', type, e.target?.type);
    // log events on statusbar
    this.canvasEvent = type + (e.target?.type ? ' = ' + e.target?.type : '');
    // console.log(this, this.canvasEvent);
    this.cdr.detectChanges();

    /**
     * get selected object
     */
    const selObj: fabric.Object = this.bordCanvas.getActiveObject();
    switch (type) {
      case 'selection:updated':
      case 'selection:created':
        this.togglePopover(true, {
          x: selObj?.oCoords?.mb.x,
          y: selObj?.oCoords?.mb.y,
        });
        break;
      case 'before:selection:cleared':
        this.togglePopover(false);
        break;

      default:
        break;
    }
  }

  handleMouseEvents(type: string, e: any): void {
    // console.log('handleSelectionEvents=>', type, e.absolutePointer, e.pointer);
    this.mousePointer = this.bordCanvas.getPointer(e);
    this.cdr.detectChanges();

    /**
    //check temporaryMode DRAW
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

    if (this.temporaryMode === 'draw:stop' && this.bordCanvas.isDrawingMode) {
      this.bordCanvas.isDrawingMode = false;
      this.bordCanvas.freeDrawingBrush.onMouseUp(this.mousePointer, {
        e: e,
        pointer: this.mousePointer,
      });
    }
    */

    // check temporaryMode selection
    if (this.temporaryMode === 'select:start') {
      if (this.bordCanvas.isDrawingMode && this.permanentMode === 'draw' ) {
        this.bordCanvas.isDrawingMode = false;
      }
      if (!this.bordCanvas.selection) {
        this.bordCanvas.selection = true
      }
    }

    if (this.temporaryMode === 'select:stop') {
      if (this.bordCanvas.getActiveObjects().length > 0){
        return;
      }

      if (!this.bordCanvas.isDrawingMode && this.permanentMode === 'draw' ) {
        this.bordCanvas.isDrawingMode = true;
      }
      this.bordCanvas.selection = false;
    }

    this.bordCanvas.renderAll();
  }

  handleObjectEvents(type: string, e: any): void {
    // console.log('handleObjectEvents=>', type, e);
    /**
     * get selected object
     */
    const selObj: fabric.Object = e.target;
    this.movePopover({ x: selObj?.oCoords?.mb.x, y: selObj?.oCoords?.mb.y });

    switch (type) {
      case 'object:moving':
        // this.movePopover({ x: selObj?.oCoords?.mb.x, y: selObj?.oCoords?.mb.y });
        break;

      default:
        break;
    }
  }
}
