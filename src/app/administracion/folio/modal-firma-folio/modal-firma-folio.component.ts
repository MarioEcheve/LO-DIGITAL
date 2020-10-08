import { Component, OnInit, Inject } from "@angular/core";
import { TipoFirmaService } from "../../services/tipo-firma.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { UsuarioDependenciaService } from "../../services/usuario-dependencia.service";
import { UsuarioService } from "src/app/core/user/usuario.service";
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
    @Inject(MAT_DIALOG_DATA) public data: any,
    private UsuarioDependenciaService : UsuarioDependenciaService,
    private usuarioService : UsuarioService
  ) {}

  ngOnInit(): void {
    this.firmaFormGroup = this.fb.group({
      tipoFirma: ['',[Validators.required]],
      clave : ['' , [Validators.required]]
    });
    this.obtenerTipoFirma();
    this.obtenerUsuarioDependencia();
  }
  firmar() {
    let usuarioActual = JSON.parse(localStorage.getItem("user"));
    let clave = this.firmaFormGroup.controls['clave'].value;
    this.UsuarioDependenciaService.validateClave(clave,usuarioActual.id).subscribe(
      respuesta => {
        console.log(respuesta.body);
        if(respuesta.body === "Error"){
          Swal.fire("Error!", "Clave Incorrecta.", "warning");
        }else{
              
              let tipoFirma = this.firmaFormGroup.controls["tipoFirma"].value;
              if(this.data.lectura === true){
                this.dialogRef.close(tipoFirma);
              }else{
                console.log(this.data);
                if(this.data.folio.fechaRequerida !== undefined ){
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
      }
    );
    
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
  obtenerUsuarioDependencia(){
    let usuarioActual = JSON.parse(localStorage.getItem("user"));
    this.UsuarioDependenciaService.findUserByUsuarioDependencia(usuarioActual.id).subscribe(
      respuesta => {
        console.log(respuesta.body[0].usuario.password);
      }
    );
  }
}
