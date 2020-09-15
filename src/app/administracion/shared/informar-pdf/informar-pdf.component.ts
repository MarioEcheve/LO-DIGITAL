import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FolioService } from '../../services/folio.service';
import { Email } from '../../TO/email';
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

  formInformar : FormGroup;
  constructor(
    public dialModalRef: MatDialogRef<InformarPdfComponent>,
    public fb : FormBuilder,
    private folioService : FolioService
  ) { }

  ngOnInit(): void {
    this.inicializarForm();
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
}
