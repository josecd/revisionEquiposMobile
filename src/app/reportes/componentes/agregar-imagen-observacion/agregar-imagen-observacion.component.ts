import { Component, ElementRef, ViewChild, OnInit, Input } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AlertController, ModalController, Platform } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ReportesService } from '../../services/reportes.service';

@Component({
  selector: 'app-agregar-imagen-observacion',
  templateUrl: './agregar-imagen-observacion.component.html',
  styleUrls: ['./agregar-imagen-observacion.component.scss'],
})
export class AgregarImagenObservacionComponent  implements OnInit {
  @Input() idReporte:any;
  @ViewChild('filePicker', { static: false }) filePickerRef: ElementRef<HTMLInputElement>;
  photo: SafeResourceUrl;
  isDesktop: boolean;

  photos:any=[];
  files:any=[];
  constructor(
    private platform: Platform,
    private sanitizer: DomSanitizer,
    public modalCtrl: ModalController,
    private _reporte:ReportesService,
    private alertController: AlertController
    ) { }

    ngOnInit() {
    console.log(this.idReporte);

    
      if ((this.platform.is('mobile') && this.platform.is('hybrid')) || this.platform.is('desktop')) {
        console.log('entro');
        
        this.isDesktop = true;
      }
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
    let formData = new FormData();
    formData.append('observacionId',this.idReporte);
    this.files.forEach((file:any) =>{
      formData.append('files[]', file)
    });
    this._reporte.agregarFotosObservacion(formData).subscribe({
      next: (data:any) => {
        console.log(data);
        this.modalCtrl.dismiss();
      },
      error: async (err)=>{
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
      console.log('File format not supported');
      return;
    }

    reader.onload = () => {
      this.photo = reader.result.toString();
    };
    reader.readAsDataURL(file);

  }


  return() {
    // this.modalCtrl.dismiss(this.imgFile, "return");
    this.modalCtrl.dismiss();
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


}
