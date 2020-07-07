import { Component, OnInit, Inject, AfterViewInit } from "@angular/core";
import { NgxExtendedPdfViewerModule } from "ngx-extended-pdf-viewer";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { element } from "protractor";
import { url } from "inspector";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: "app-visor-pdf",
  templateUrl: "./visor-pdf.component.html",
  styleUrls: ["./visor-pdf.component.css"],
})
export class VisorPdfComponent implements OnInit, AfterViewInit {
  ruta;
  pdfArchivo;
  base64data;

  constructor(
    public dialogRef: MatDialogRef<VisorPdfComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}
  ngAfterViewInit() {
    console.log(this.data.pdf);
  }
}
