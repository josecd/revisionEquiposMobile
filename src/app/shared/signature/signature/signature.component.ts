import {
  AfterViewInit,
  Component,
  ElementRef,
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
import { UsuarioService } from "src/app/usuarios/usuario.service";
import { AuthenticationService } from "src/app/services/authentication.service";
import { Subject, takeUntil } from "rxjs";

@Component({
  selector: "app-signature",
  templateUrl: "./signature.component.html",
  styleUrls: ["./signature.component.scss"],
})
export class SignatureComponent implements AfterViewInit {
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  @ViewChild(IonModal) modal?: IonModal;
  @ViewChild("canvas1", { static: true }) signaturePadElement?: ElementRef;

  @ViewChild('imageid') myDiv: ElementRef;
  signaturePad: any;
  imgFile: any;
  @Input() data: [];
  @Input() info: [];
  tiposFirma = [
    {
      id: "Gerente de Mantenimiento",
      nombre: "Gerente de Mantenimiento",
    },
    {
      id: "Encargado de Recorrido",
      nombre: "Encargado de Recorrido",
    },
    {
      id: "Corporativo de Cocina",
      nombre: "Corporativo de Cocina",
    },
  ];
  selectTipo: any;
  nombre: any;

  tipoFirma: boolean = true;

  usuario: any;
  constructor(
    private elemeneRef: ElementRef,
    public modalCtrl: ModalController,
    private alertController: AlertController,
    private _usuario: UsuarioService,
    private _auth: AuthenticationService
  ) { }
  ngAfterViewInit(): void {
  }

  ngOnInit() {
    this.init()
    this._auth.user$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((user) => {
        console.log(user);
        this.usuario = user;
        console.log(this.usuario.perfil.url);
      });

      
  }

  init() {
    this.signaturePad = new SignaturePad(
      this.signaturePadElement?.nativeElement,
      {
        penColor: "rgb(0,0,0)",
        backgroundColor: "rgb(255,255,255)",
      }
    );
    this.signaturePad.clear();
  }

  // public ngAfterViewInit() {
  //   this.signaturePad = new SignaturePad(
  //     this.signaturePadElement?.nativeElement,
  //     {
  //       penColor: "rgb(0,0,0)",
  //       backgroundColor: "rgb(255,255,255)",
  //     }
  //   );
  //   this.signaturePad.clear();
  // }

  isCanvasBlack() {
    if (this.selectTipo) {
      return true;
    } else {
      return true;
    }
  }

  async saveSignature() {

    if (this.tipoFirma) {
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
          type: this.selectTipo,
          nombreFirma: this.nombre
        });
        ScreenOrientation.unlock();
  
      }
    }else{
      const dataUrl = this.getBase64Image(document.getElementById("imageid"))
      console.log(dataUrl);
      this.modalCtrl.dismiss({
        img: this.dataURItoBlob(dataUrl),
        type: this.selectTipo,
        nombreFirma: this.nombre
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

  getFirma() {
    // this._usuario.getFirmas(this.usuario.idUsuario).subscribe({
    //   next:(value:any) =>{
    //     console.log(value);

    //     this.firma = value
    //   },
    //   error:(err:any)=>{
    //     console.log(err);
    //   }
    // })
  }

  cambioDeFirma() {
    this.tipoFirma = this.tipoFirma == true ? false : true;
    this.nombre = this.tipoFirma===false?this.usuario.nombre:''

  }

  getBase64Image(img:any) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx:any = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL("image/png");
    return dataURL
  }
}
