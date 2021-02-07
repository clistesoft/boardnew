import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit {
  public keyPressed: any;
  public permanentMode: any;

  constructor() {
    // default permanentMode is selection
    this.permanentMode = 'selection';
  }

  // @HostListener('window:keydown', ['$event'])
  // @HostListener('window:keyup', ['$event'])
  // handleKeyboardEvent(event: KeyboardEvent) {
  //   this.keyPressed = event.code;

  //   event.preventDefault();
  //   event.stopPropagation();
  //   return false;
  // }

  setMode(value:any){
    this.permanentMode = value;
  }

  ngOnInit(): void {
  }

}
