import { Component, OnInit } from "@angular/core";
import { DropzoneConfigInterface } from "ngx-dropzone-wrapper";

const defaultConfig: DropzoneConfigInterface = {
  clickable: true,
  addRemoveLinks: true,
};
@Component({
  selector: "app-folio",
  templateUrl: "./folio.component.html",
  styleUrls: ["./folio.component.css"],
})
export class FolioComponent implements OnInit {
  cities = [
    { value: "paris-0", viewValue: "Paris" },
    { value: "miami-1", viewValue: "Miami" },
    { value: "bucharest-2", viewValue: "Bucharest" },
    { value: "new-york-3", viewValue: "New York" },
    { value: "london-4", viewValue: "London" },
    { value: "barcelona-5", viewValue: "Barcelona" },
    { value: "moscow-6", viewValue: "Moscow" },
  ];
  constructor() {}

  ngOnInit(): void {}

  onUploadInit(args: any): void {
    // onUploadInit
  }

  onUploadError(args: any): void {
    // onUploadError
  }

  onUploadSuccess(args: any): void {
    // onUploadSuccess
  }
}
