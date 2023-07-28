import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ModalController, IonicSlides } from '@ionic/angular';

@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.page.html',
  styleUrls: ['./image-modal.page.scss'],
})
export class ImageModalPage implements OnInit {
  @ViewChild(IonicSlides) slides: any;
  @Input('img')img: any;

  sliderOpts = {
    zoom: true
  };

  constructor(private modalController: ModalController) { }

  ngOnInit() { }

  ionViewDidEnter(){
    this.slides.update();
  }

  async zoom(zoomIn: boolean) {
    const slider = await this.slides.getSwiper();
    const zoom = slider.zoom;
    zoomIn ? zoom.in() : zoom.out();
  }

  close() {
    this.modalController.dismiss();
  }
}
