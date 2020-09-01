import { Component, OnInit, Inject } from "@angular/core";
import { TipoFirmaService } from "../../services/tipo-firma.service";
import { FormGroup, FormBuilder } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import Swal from "sweetalert2/dist/sweetalert2.js";
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
    if(this.data.lectura === true){
      this.dialogRef.close(tipoFirma);
    }else{
      if(this.data.folio.fechaRequerida !== undefined || this.data.folio.fechaRequerida !== null){
        if(this.data.folio.fechaRequerida.toDate() < new Date()){
         this.notificacionError();
        }else{
          this.dialogRef.close(tipoFirma);
        }
      }else{
        this.dialogRef.close(tipoFirma);
      }
    }
    
   
  }
  obtenerTipoFirma() {
    this.tipoFirmaService.query().subscribe((respuesta) => {
      //this.tipoFirma = respuesta.body;
      let firmas = [
        {
          id : 1 ,
          nombre : 'Digital Avanzada MOP'
        },
        {
          id : 2 ,
          nombre : 'Digital Avanzada e-certchile'
        },
        {
          id : 3 ,
          nombre : 'Digital Avanzada e-sign'
        },
        {
          id : 4 ,
          nombre : 'Digital Avanzada firma.cl'
        }
      ]
      this.tipoFirma = firmas;
    });
   
  }
  notificacionError(){
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'La fecha requerida no puede ser menor a la fecha actual',
      footer: '<a href>Why do I have this issue?</a>'
    })
  }
}
