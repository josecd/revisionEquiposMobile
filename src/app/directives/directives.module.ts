import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PressDirective } from './press/press.directive';
import { GestureDirective } from './gesture/gesture.directive';


@NgModule({
  declarations: [
    // TapDirective,
    PressDirective,
    // SwipeDirective,
    GestureDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    // TapDirective,
    PressDirective,
    // SwipeDirective,
    GestureDirective
  ]
})
export class DirectivesModule { }
