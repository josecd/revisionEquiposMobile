import { Directive, EventEmitter, HostListener, OnInit, Output } from '@angular/core';

@Directive({
  selector: '[appPress]'
})
export class PressDirective implements OnInit {

  @Output() press = new EventEmitter();
  pressGesture = {
    name: 'press',
    enabled: false,
    interval: 1000,
  };
  pressTimeout:any = null;
  isPressing: boolean = false;
  lastTap = 0;
  tapCount = 0;
  tapTimeout:any = null;

  constructor() { }

  ngOnInit(): void {
    this.pressGesture.enabled = true;
  }
  
  @HostListener('touchstart', ['$event'])
  @HostListener('touchend', ['$event'])
  onPress(event:any) {
    // console.log(event);
    if (!this.pressGesture.enabled) {
      return;
    } // Press is not enabled, don't do anything.
    this.handlePressing(event.type);
  }

  private handlePressing(type:any) { // touchend or touchstart
    if (type == 'touchstart') {
      this.pressTimeout = setTimeout(() => {
        this.isPressing = true;
        // this.press.emit('start');
      }, this.pressGesture.interval); // Considered a press if it's longer than interval (default: 251).
    } else if (type == 'touchend') {
      clearTimeout(this.pressTimeout);
      if (this.isPressing) {
        this.press.emit('end');
        this.resetTaps(); // Just incase this gets passed as a tap event too.
      }
      // Clicks have a natural delay of 300ms, so we have to account for that, before resetting isPressing.
      // Otherwise a tap event is emitted.
      setTimeout(() => this.isPressing = false, 300);
    }
  }

  private resetTaps() {
    clearTimeout(this.tapTimeout); // clear the old timeout
    this.tapCount = 0;
    this.tapTimeout = null;
    this.lastTap = 0;
  }

}
