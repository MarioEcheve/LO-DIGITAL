import { Component, OnInit, Inject } from "@angular/core";
import { TipoFirmaService } from "../../services/tipo-firma.service";
import { FormGroup, FormBuilder } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-modal-firma-folio",
  templateUrl: "./modal-firma-folio.component.html",
  styleUrls: ["./modal-firma-folio.component.css"],
})
export class ModalFirmaFolioComponent implements OnInit {
  tipoFirma = [];
  firmaFormGroup: FormGroup;
  constructor(
    private tipoFirmaService: TipoFirmaService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ModalFirmaFolioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.firmaFormGroup = this.fb.group({
      tipoFirma: [],
    });
    this.obtenerTipoFirma();
  }
  firmar() {
    let tipoFirma = this.firmaFormGroup.controls["tipoFirma"].value;
    this.dialogRef.close(tipoFirma);
  }
  obtenerTipoFirma() {
    this.tipoFirmaService.query().subscribe((respuesta) => {
      this.tipoFirma = respuesta.body;
    });
  }
}
