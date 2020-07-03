import { Component, OnInit, Inject } from "@angular/core";
import { NgxExtendedPdfViewerModule } from "ngx-extended-pdf-viewer";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
@Component({
  selector: "app-visor-pdf",
  templateUrl: "./visor-pdf.component.html",
  styleUrls: ["./visor-pdf.component.css"],
})
export class VisorPdfComponent implements OnInit {
  ruta;
  pdfArchivo;

  constructor(
    public dialogRef: MatDialogRef<VisorPdfComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    let pdfCreadoBase64 = btoa(JSON.stringify(this.data.pdf));
    const byteArray = new Uint8Array(
      atob(pdfCreadoBase64)
        .split("")
        .map((char) => char.charCodeAt(0))
    );
    this.pdfArchivo = new Blob([byteArray], { type: "application/pdf" });
    this.ruta = window.URL.createObjectURL(this.pdfArchivo);
    console.log(this.ruta);
  }
}
