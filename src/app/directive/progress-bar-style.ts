import { Directive, Input, OnChanges, SimpleChanges, ElementRef } from '@angular/core';

@Directive({
  selector: '[ProgressBarStyle]'
})
export class ProgressBarStyle implements OnChanges{
  static counter = 0;

  @Input() ProgressBarStyle:any;
  styleEl:HTMLStyleElement = document.createElement('style');
  
  //generate unique attribule which we will use to minimise the scope of our dynamic style 
  uniqueAttr = `app-progress-bar-color-${ProgressBarStyle.counter++}`;

  constructor(private el: ElementRef) { 
    const nativeEl: HTMLElement = this.el.nativeElement;
    nativeEl.setAttribute(this.uniqueAttr,'');
    nativeEl.appendChild(this.styleEl);
  }

  ngOnChanges(changes: SimpleChanges): void{
    this.updateColor();
  }

  updateColor(): void{
    // update dynamic style with the uniqueAttr
    this.styleEl.innerText = `
      [${this.uniqueAttr}] .mat-progress-bar-fill::after {
        background-color: ${this.ProgressBarStyle};
      }
    `;
  }

}