import { Component, OnInit, Inject } from '@angular/core';
import { TableData } from 'src/app/md/md-table/md-table.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LibroService } from '../../services/libro.service';
import { Libro } from '../../TO/libro.model';
import { FolioService } from '../../services/folio.service';
import { Folio } from '../../TO/folio.model';
import { UsuarioLibroService } from '../../services/usuario-libro.service';

@Component({
  selector: 'app-modal-buscar-folio',
  templateUrl: './modal-buscar-folio.component.html',
  styleUrls: ['./modal-buscar-folio.component.css']
})
export class ModalBuscarFolioComponent implements OnInit {
  public tableData1: TableData;
  libros : Libro[] = [];
  folios: Folio[] = [];
  constructor(
    public dialogRef: MatDialogRef<ModalBuscarFolioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private libroService : LibroService,
    private folioService : FolioService,
    private usuarioLibroService : UsuarioLibroService
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
      this.folios = valor;

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
}
