import { Component, OnInit, Input ,ChangeDetectionStrategy, Inject, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { TableData } from 'src/app/md/md-table/md-table.component';
import { Folio } from 'src/app/administracion/TO/folio.model';
import { FolioService } from 'src/app/administracion/services/folio.service';
import { MatDialog } from '@angular/material/dialog';
import { VisorPdfComponent } from 'src/app/administracion/shared/visor-pdf/visor-pdf/visor-pdf.component';
import { element } from 'protractor';




@Component({
  selector: 'app-tabla-buscar-folios',
  templateUrl: './tabla-buscar-folios.component.html',
  styleUrls: ['./tabla-buscar-folios.component.css'],
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class TablaBuscarFoliosComponent implements OnInit,AfterViewInit {
  public tableData1: TableData;
  @Input() folios;
  ListaFolios = [];
  @Output() onAddFolioRelacionado: EventEmitter<any> = new EventEmitter();
  constructor(
    private folioService : FolioService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
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
  ngAfterViewInit(){
    setTimeout(() => {
      if(this.folios !== undefined){
        this.folios.forEach(element => {
          element.existTableSearchFolio = false;
        });
        this.ListaFolios = this.folios;
        this.folioService.getListaFolioRelacionadoSubject().subscribe(
          folios => {
           if(folios.length > 0){
              console.log('imprimiendo lista de folio relacionados agregados');
              console.log(folios);
              this.ListaFolios.forEach(element =>{
                folios.forEach(element2=>{
                  if(element.id === element2.id){
                    element.existTableSearchFolio=true;
                  }
                });
              });
           }
          }
        );
      }
    }, 2000);
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
  deleteFolioReferencia(row){
    this.folioService.removeFolioReferencia(row);
    let index = this.ListaFolios.indexOf(row);
    this.ListaFolios[index].existTableSearchFolio = false;
  }
  agregarFolioReferencia(row){
    //this.folios = this.folios.filter(folio => folio !== row);
    this.folioService.createNewListaColeccionFolioReferencia(row);
  }
}
