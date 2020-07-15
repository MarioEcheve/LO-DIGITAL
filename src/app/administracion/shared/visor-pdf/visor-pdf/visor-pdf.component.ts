import { Component, OnInit, Inject, AfterViewInit } from "@angular/core";
import { NgxExtendedPdfViewerModule } from "ngx-extended-pdf-viewer";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from "@angular/material/dialog";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { element } from "protractor";
import { url } from "inspector";
import { ModalFirmaFolioComponent } from "src/app/administracion/folio/modal-firma-folio/modal-firma-folio.component";
import { Folio } from "src/app/administracion/TO/folio.model";
import { FolioService } from "src/app/administracion/services/folio.service";
import { Router } from "@angular/router";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as moment from "moment";
import { LibroService } from "src/app/administracion/services/libro.service";
declare var $: any;
@Component({
  selector: "app-visor-pdf",
  templateUrl: "./visor-pdf.component.html",
  styleUrls: ["./visor-pdf.component.css"],
})
export class VisorPdfComponent implements OnInit, AfterViewInit {
  folio = new Folio();
  usuario;
  constructor(
    public dialogRef: MatDialogRef<VisorPdfComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private folioService: FolioService,
    private router: Router,
    private libroService: LibroService
  ) {}

  ngOnInit(): void {}
  ngAfterViewInit() {
    if(this.data.previsualisar === true){
      this.folio = this.data.folio;
      this.usuario = this.data.usuario;
      this.data.pdfArchivoCompleto.getBlob((blob) => {
        blobToBase64(blob).then((res: string) => {
          var documento = res.split(",");
          var aux = documento[0].split("data:");
          var tipoDocumento = aux[1].split(";");
          this.folio.pdfFirmado = documento[1];
          this.folio.pdfFirmadoContentType = tipoDocumento[0];
        });
      });
    }else{
      
    }
    
  }
  modalFirmarFolio() {
    const dialogRef = this.dialog.open(ModalFirmaFolioComponent, {
      width: "40%",
      height: "35%",
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === null || result === "" || result === undefined) {
      } else {
        this.folioService
          .correlativoFolio(this.folio.libro.id)
          .subscribe((respuesta) => {
            this.folio.estadoFolio = true;
            this.folio.numeroFolio = respuesta.body[0].numero_folio;
            this.folio.fechaFirma = moment(Date.now());
            this.folio.idUsuarioFirma = this.usuario.id;
            this.folio.libro.fechaCreacion = moment(
              this.folio.libro.fechaCreacion
            );
            this.folio.libro.fechaApertura = moment(Date.now());
            this.folioService.update(this.folio).subscribe((respuesta) => {
              if (
                this.folio.tipoFolio.nombre.toLowerCase() === "apertura libro"
              ) {
                this.folio.libro.estadoLibro = {
                  id:  1402,
                  nombre: "Abierto",
                  libros: null,
                };
                this.libroService.update(this.folio.libro).subscribe();
              }
              this.dialogRef.close();
              this.dialogRef.beforeClosed().subscribe((respuesta) => {
                this.showNotificationSuccess("top", "right");
                this.router.navigate([
                  "/folio/folio/",
                  this.folio.libro.contrato.id,
                  this.folio.libro.id,
                ]);
              });
            });
          });
      }
    });
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
        message: "Folio Firmado Correctamente ",
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
const blobToBase64 = (blob) => {
  const reader = new FileReader();
  reader.readAsDataURL(blob);
  return new Promise((resolve) => {
    reader.onloadend = () => {
      resolve(reader.result);
    };
  });
};
