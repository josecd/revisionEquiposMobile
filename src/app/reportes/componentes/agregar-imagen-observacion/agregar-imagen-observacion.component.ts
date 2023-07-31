import { Component, ElementRef, ViewChild, OnInit, Input } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AlertController, LoadingController, ModalController, Platform } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ReportesService } from '../../services/reportes.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-agregar-imagen-observacion',
  templateUrl: './agregar-imagen-observacion.component.html',
  styleUrls: ['./agregar-imagen-observacion.component.scss'],
})
export class AgregarImagenObservacionComponent  implements OnInit {
  @Input() idObservacion:any;
  @ViewChild('filePicker', { static: false }) filePickerRef: ElementRef<HTMLInputElement>;
  photo: SafeResourceUrl;
  isDesktop: boolean;

  photos:any=[];
  files:any=[];
  userId :any;
  constructor(
    private platform: Platform,
    private sanitizer: DomSanitizer,
    public modalCtrl: ModalController,
    private _reporte:ReportesService,
    private alertController: AlertController,
    private loadingCtrl: LoadingController,
    private storage: Storage

    ) { }

    async ngOnInit() {
      if ((this.platform.is('mobile') && this.platform.is('hybrid')) || this.platform.is('desktop')) {
        this.isDesktop = true;
      }
      const iduser=  await this.storage.get('user').then(res=>{
        this.userId = res['idUsuario']
       })
    }

  async getPicture() {
    // if (!Capacitor.isPluginAvailable('Camera') || (this.isDesktop && type === 'gallery')) {
    if (!Capacitor.isPluginAvailable('Camera')) {
      this.filePickerRef.nativeElement.click();
      return;
    }
    
    const image:any = await Camera.getPhoto({
      quality: 100,
      width: 400,
      saveToGallery:true,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt
    });

    this.photo = this.sanitizer.bypassSecurityTrustResourceUrl(image && (image.dataUrl));
    this.photos.push(image.dataUrl)
    this.files.push( this.dataURItoBlob(image.dataUrl))
  }

  async saveImage(){
    const loading = await this.loadingCtrl.create({
      message: 'Subiendo imagenes...',
    });
    loading.present();

    let formData = new FormData();
    formData.append('observacionId',this.idObservacion);
    
    formData.append('userId',this.userId);

    this.files.forEach((file:any) =>{
      formData.append('files[]', file)
    });
    this._reporte.agregarFotosObservacion(formData).subscribe({
      next: (data:any) => {
        loading.dismiss();
        this.modalCtrl.dismiss(true, "msg");
      },
      error: async (err)=>{
        loading.dismiss();

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


  
  onFileChoose(event: any) {
    
    const file = event.target.files[0];
    const pattern = /image-*/;
    const reader:any = new FileReader();

    if (!file.type.match(pattern)) {
      return;
    }

    reader.onload = () => {
      this.photo = reader.result.toString()
      this.photos.push(reader.result.toString())
      this.files.push( this.dataURItoBlob(reader.result.toString()))
    };
    reader.readAsDataURL(file);
    
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

  return() {
    // this.modalCtrl.dismiss(this.imgFile, "return");
    this.modalCtrl.dismiss();
  }
}
