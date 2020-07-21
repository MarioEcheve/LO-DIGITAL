import { Component, OnInit, Inject } from '@angular/core';
import { TableData } from 'src/app/md/md-table/md-table.component';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { LibroService } from '../../services/libro.service';
import { Libro } from '../../TO/libro.model';
import { FolioService } from '../../services/folio.service';
import { Folio } from '../../TO/folio.model';
import { UsuarioLibroService } from '../../services/usuario-libro.service';
import { VisorPdfComponent } from '../../shared/visor-pdf/visor-pdf/visor-pdf.component';

@Component({
  selector: 'app-modal-buscar-folio',
  templateUrl: './modal-buscar-folio.component.html',
  styleUrls: ['./modal-buscar-folio.component.css']
})
export class ModalBuscarFolioComponent implements OnInit {
  public tableData1: TableData;
  libros : Libro[] = [];
  folios: Folio[] = [];
  foliosRelacionados = [];
  constructor(
    public dialogRef: MatDialogRef<ModalBuscarFolioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private libroService : LibroService,
    private folioService : FolioService,
    private usuarioLibroService : UsuarioLibroService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    console.log(this.data.idContrato);
    this.libroService
        .buscarlibroPorContrato(this.data.idContrato)
        .subscribe((respuesta) => {
          this.libros = respuesta.body;
          console.log(this.libros);
        });
    this.tableData1 = {
      headerRow: [
        "# Folio",
        "Emisor",
        "Tipo Folio - Asunto",
        "Fecha",
        "Accion"
      ],
      dataRows: [],
    };
  }
  buscaFolios(libro){
    this.folioService.buscarFolioPorLibro(libro.id).subscribe((respuesta) => {
      console.log(respuesta.body);
      let nombreEmisor = "";
      //this.folios = respuesta.body;
      let valor = respuesta.body.filter( folio => folio.idUsuarioFirma !== null);
      
      console.log(valor);
      if(this.data.folios.length > 0){
        for(let i =0; i< this.data.folios.length;i++){
          console.log(this.data.folios[i]);
          this.folios= this.folios.filter(folio => folio !== this.data.folios[i])
        }
      }

      this.folios.forEach((element) => {
        this.usuarioLibroService
          .find(element.idUsuarioFirma)
          .subscribe((respuesta2) => {
            nombreEmisor = respuesta2.body.usuarioDependencia.usuario.firstName + " "+ respuesta2.body.usuarioDependencia.usuario.lastName;
            element.emisor = nombreEmisor;
            console.log(element.emisor);
          });
      });
    }); 
  }
  visorPdf(row){
      let pdf = row.pdfFirmado;
      let contentType = row.pdfFirmadoContentType;
      let url = "data:"+contentType+";base64,"+pdf;
      let promise = new Promise(function (resolve, reject) {
        fetch(url)
        .then(res => {
          return res.blob();
        })
        .then(blob => {
          console.log(blob);
          resolve(URL.createObjectURL(blob));
        });
      });
      promise.then((resultado) => {
        const dialogRef = this.dialog.open(VisorPdfComponent, {
          width: "100%",
          height: "90%",
          data: {
            pdf: resultado,
            folio: null,
            usuario: null,
            pdfArchivoCompleto: null,
            previsualisar : false,
            lectura : false
          },
        });
      });
    }
  agregarFolioReferencia(row){
    this.folios = this.folios.filter(folio => folio !== row);
    this.foliosRelacionados.push(row);
    //this.folioService.changeFoliosReferenciaActuales(row);;
    //this.dialogRef.close(row);
  }

  agregar(){
    this.dialogRef.close(this.foliosRelacionados);
  }
}

