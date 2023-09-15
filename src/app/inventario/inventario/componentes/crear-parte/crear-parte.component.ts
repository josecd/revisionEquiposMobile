import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { ReportesService } from 'src/app/reportes/services/reportes.service';
import { Storage } from '@ionic/storage';
import { InventarioService } from 'src/app/inventario/services/inventario.service';

import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-crear-parte',
  templateUrl: './crear-parte.component.html',
  styleUrls: ['./crear-parte.component.scss'],
})
export class CrearParteComponent implements OnInit {
  @Input("idInventario") idInventario: any;
  @ViewChild('filePicker', { static: false }) filePickerRef: ElementRef<HTMLInputElement>;
  photo: SafeResourceUrl;
  isDesktop: boolean;

  photos: any = [];
  files: any = [];
  userId: any;


  ionicForm: FormGroup;
  hoteles: any;
  hotelSelect: any;
  constructor(
    public modalCtrl: ModalController,
    public formBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    private alertController: AlertController,
    private _reporte: ReportesService,
    private storage: Storage,
    private _inventario: InventarioService,
    private sanitizer: DomSanitizer,

  ) {


  }

  async ngOnInit() {
    this.ionicForm = this.formBuilder.group({
      descripcion: ['', [Validators.required,]],
      noParte: ['', [Validators.required]],
      cantidad: ['', [Validators.required]],

      inventarioId: [this.idInventario],
      userId: ['',],
    });

    const iduser = await this.storage.get('user').then(res => {
      this.userId = res['idUsuario']
      this.ionicForm.get('userId')?.setValue(res['idUsuario'])
    })



  }


  async submitForm() {
    const loading = await this.loadingCtrl.create({
      message: 'Subiendo información...',
    });
    loading.present();


    this._inventario.crearParte(this.ionicForm.value).subscribe({
      next: (data: any) => {
        console.log(data);

        loading.dismiss();
        this.saveImage(data.idParte);
        // this.modalCtrl.dismiss(true, "msg");
      },
      error: async (err) => {
        const alert = await this.alertController.create({
          header: 'Alerta',
          subHeader: 'Intente más tarde',
          message: 'Ha ocurrido un error',
          buttons: ['OK'],
        });
        await alert.present();
      },
    });
  }


  handleChange(ev: any) {
    this.ionicForm.value['hotelId'] = ev.target.value;
    this.hotelSelect = ev.target.value;
  }

  return() {
    // this.modalCtrl.dismiss(this.imgFile, "return");
    this.modalCtrl.dismiss();
  }

  //// imagens 
  async getPicture() {
    // if (!Capacitor.isPluginAvailable('Camera') || (this.isDesktop && type === 'gallery')) {
    if (!Capacitor.isPluginAvailable('Camera')) {
      this.filePickerRef.nativeElement.click();
      return;
    }

    const image: any = await Camera.getPhoto({
      // quality: 100,
      // width: 400,
      saveToGallery: true,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt
    });

    this.photo = this.sanitizer.bypassSecurityTrustResourceUrl(image && (image.dataUrl));
    this.photos.push(image.dataUrl)
    this.files.push(this.dataURItoBlob(image.dataUrl))
  }
  dataURItoBlob(dataURI: any) {
    var byteString = atob(dataURI.split(",")[1]);
    var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }

  async saveImage(parteID: any) {
    const loading = await this.loadingCtrl.create({
      message: 'Subiendo imagenes...',
    });
    loading.present();

    let formData = new FormData();
    formData.append('parteId', parteID);

    formData.append('userId', this.userId);

    this.files.forEach((file: any) => {
      formData.append('files[]', file)
    });
    this._inventario.agregarImg(formData).subscribe({
      next: (data: any) => {
        loading.dismiss();
        this.modalCtrl.dismiss(true, "msg");
      },
      error: async (err) => {
        loading.dismiss();
        console.log(err);

        const alert = await this.alertController.create({
          header: 'Alerta',
          subHeader: 'Intente más tarde',
          message: 'Ha ocurrido un error',
          buttons: ['OK'],
        });
        await alert.present();
      },
    });
  }

}
