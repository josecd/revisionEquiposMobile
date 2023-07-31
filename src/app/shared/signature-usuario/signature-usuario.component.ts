import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import { AlertController, IonModal, ModalController } from "@ionic/angular";
import SignaturePad from "signature_pad";
import {
  ScreenOrientation,
  OrientationType,
} from "@capawesome/capacitor-screen-orientation";

@Component({
  selector: 'app-signature-usuario',
  templateUrl: './signature-usuario.component.html',
  styleUrls: ['./signature-usuario.component.scss'],
})
export class SignatureUsuarioComponent implements OnInit {

  @ViewChild(IonModal) modal?: IonModal;
  @ViewChild("canvas", { static: true }) signaturePadElement?: ElementRef;
  signaturePad: any;
  imgFile: any;
  @Input() data: [];
  @Input() info: [];

  selectTipo: any;
  nombre: any;
  constructor(
    private elemeneRef: ElementRef,
    public modalCtrl: ModalController,
    private alertController: AlertController
  ) { }

  ngOnInit() {

  }


  init() {
    const canvas: any = this.elemeneRef.nativeElement.querySelector("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 140;
    if (this.signaturePad) {
      this.signaturePad.clear();
    }
  }

  public ngAfterViewInit() {

    this.signaturePad = new SignaturePad(
      this.signaturePadElement?.nativeElement,
      {
        penColor: "rgb(0,0,0)",
        backgroundColor: "rgb(255,255,255)",
      }
    );
    this.signaturePad.clear();
  }

  isCanvasBlack() {
    if (this.selectTipo) {
      return true;
    } else {
      return true;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.init();
  }

  async saveSignature() {


    if (this.signaturePad._isEmpty) {

      const alert = await this.alertController.create({
        header: 'Alerta',
        subHeader: '',
        message: 'Se debe rellenar la firma',
        buttons: ['OK'],
      });
      await alert.present();
    } else {
      const dataUrl = this.signaturePad.toDataURL("image/png");
      const blob = this.convertBase64toBlob(dataUrl);
      var profile = new Image();
      profile.src = dataUrl;

      // this.modalCtrl.dismiss(this.dataURItoBlob(dataUrl), "img");
      this.modalCtrl.dismiss({
        img: this.dataURItoBlob(dataUrl),
      });
      ScreenOrientation.unlock();

    }

  }

  convertBase64toBlob(dataUrl: any): Blob {
    const data = atob(dataUrl.substring("data:image/png;base64,", length)),
      asArray = new Uint8Array(data.length);
    for (var i = 0, len = data.length; i < len; ++i) {
      asArray[i] = data.charCodeAt(i);
    }
    const blob = new Blob([asArray], { type: "image/png" });
    return blob;
  }

  dataURLtoFile(dataurl: any, filename: any) {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  dataURItoBlob(dataURI: any) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(",")[1]);

    // separate out the mime component
    var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    //Old Code
    //write the ArrayBuffer to a blob, and you're done
    //var bb = new BlobBuilder();
    //bb.append(ab);
    //return bb.getBlob(mimeString);

    //New Code
    return new Blob([ab], { type: mimeString });
  }

  clear() {
    this.signaturePad.clear();
  }

  return() {
    this.modalCtrl.dismiss(this.imgFile, "return")
    ScreenOrientation.unlock();
  }

  handleChange(e: any) {
    this.selectTipo = null;
    this.selectTipo = e.detail.value;
  }

  isCanvasBlank() {
    if (this.signaturePad) {
      return this.signaturePad.isEmpty() ? true : false;
    }
  }
}
