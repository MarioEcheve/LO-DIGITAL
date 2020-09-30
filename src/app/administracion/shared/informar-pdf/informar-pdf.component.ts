import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FolioService } from '../../services/folio.service';
import { Email } from '../../TO/email';
import { Folio } from '../../TO/folio.model';
declare var $: any;
export class RegularExpressionConstant {
  static EMAIL: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
}

@Component({
  selector: 'app-informar-pdf',
  templateUrl: './informar-pdf.component.html',
  styleUrls: ['./informar-pdf.component.css']
})
export class InformarPdfComponent implements OnInit {
  archivoEmail: any = [];
  formInformar : FormGroup;
  constructor(
    public dialModalRef: MatDialogRef<InformarPdfComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public fb : FormBuilder,
    private folioService : FolioService
  ) { }

  ngOnInit(): void {
    this.inicializarForm();
    this.obtenerArchivoEmail(this.data.folio);
  }
  cerrar(){
    this.dialModalRef.close();
  }
  inicializarForm(){
    this.formInformar = this.fb.group({
      destinatarios : ['', [Validators.required,Validators.pattern(RegularExpressionConstant.EMAIL)]],
      asunto : ['',Validators.required],
      mensaje : ['']
    });
  }
  sendEmail(){
    let email = new Email();
    email.to = this.formInformar.controls['destinatarios'].value;
    email.subject = this.formInformar.controls['asunto'].value;
    email.content = this.formInformar.controls['mensaje'].value;
    email.isHtml = false;
    email.isMultipart = false;
    email.attachments = this.archivoEmail;
    this.folioService.informarEmailFolioFirmado(email).subscribe(
      respuesta=>{
        console.log(respuesta.body);
        this.dialModalRef.close(respuesta);
        this.showNotificationSuccess("top", "right");
      }
    );
  }
  showNotificationSuccess(from: any, align: any) {
    const type = [
      "",
      "info",
      "success",
      "warning",
      "danger",
      "rose",
      "primary",
    ];

    const color = 2;

    $.notify(
      {
        icon: "notifications",
        message: "Correo enviado Correctamente ",
      },
      {
        type: type[color],
        timer: 3000,
        placement: {
          from: from,
          align: align,
        },
        template:
          '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0} alert-with-icon" role="alert">' +
          '<button mat-raised-button type="button" aria-hidden="true" class="close" data-notify="dismiss">  <i class="material-icons">close</i></button>' +
          '<i class="material-icons" data-notify="icon">notifications</i> ' +
          '<span data-notify="title">{1}</span> ' +
          '<span data-notify="message">{2}</span>' +
          '<div class="progress" data-notify="progressbar">' +
          '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
          "</div>" +
          '<a href="{3}" target="{4}" data-notify="url"></a>' +
          "</div>",
      }
    );
  }
  obtenerArchivoEmail(folio : Folio){
   
    const blob = b64toBlob(folio.pdfFirmado, folio.pdfFirmadoContentType);
    console.log(folio.pdfFirmadoContentType);
    console.log(folio.pdfFirmado);
    let path = {
      path : `data:${folio.pdfFirmadoContentType};base64,${folio.pdfFirmado}`
    }


    this.archivoEmail = [...this.archivoEmail, path];
  }
}
const b64toBlob = (b64Data, contentType='', sliceSize=512) => {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, {type: contentType});
  return blob;
}