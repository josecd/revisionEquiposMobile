import { Component, OnInit, ViewChild, Input, ElementRef } from '@angular/core';
import { ModalController, IonicSlides } from '@ionic/angular';
import Swiper from 'swiper';

@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.page.html',
  styleUrls: ['./image-modal.page.scss'],
})
export class ImageModalPage implements OnInit {
  @Input('img')img: any;
  @ViewChild('swipper')
  swiperRef: ElementRef | undefined;
  swiper?: Swiper


  constructor(
    private modalController: ModalController,
    public modalCtrl: ModalController,
    ) { }

  ngOnInit() {
    console.log(this.img);
    
   }

   return() {
    this.modalCtrl.dismiss()
  }
}
