import { Component, OnInit } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from "@angular/material/dialog";
@Component({
  selector: 'app-filtro-folio-personalizado',
  templateUrl: './filtro-folio-personalizado.component.html',
  styleUrls: ['./filtro-folio-personalizado.component.css']
})
export class FiltroFolioPersonalizadoComponent implements OnInit {

  constructor(public dialModalRef: MatDialogRef<any>) { }

  ngOnInit(): void {
    this.dialModalRef.updatePosition({ top: '260px', left: '320px' });
  }

}
