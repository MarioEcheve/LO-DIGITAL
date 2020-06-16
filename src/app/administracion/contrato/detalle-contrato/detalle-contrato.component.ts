import {
  Component,
  OnInit,
  OnChanges,
  AfterViewInit,
  SimpleChanges,
} from "@angular/core";
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormGroup,
} from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";
import { FormBuilder } from "@angular/forms";

declare const $: any;
interface FileReaderEventTarget extends EventTarget {
  result: string;
}

interface FileReaderEvent extends Event {
  target: EventTarget;
  getMessage(): string;
}

declare interface TableData {
  headerRow: string[];
  dataRows: string[][];
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

@Component({
  selector: "app-detalle-contrato",
  templateUrl: "./detalle-contrato.component.html",
  styleUrls: ["./detalle-contrato.component.css"],
})
export class DetalleContratoComponent
  implements OnInit, OnChanges, AfterViewInit {
  public tableData1: TableData;
  cities = [
    { value: "paris-0", viewValue: "Paris" },
    { value: "miami-1", viewValue: "Miami" },
    { value: "bucharest-2", viewValue: "Bucharest" },
    { value: "new-york-3", viewValue: "New York" },
    { value: "london-4", viewValue: "London" },
    { value: "barcelona-5", viewValue: "Barcelona" },
    { value: "moscow-6", viewValue: "Moscow" },
  ];
  emailFormControl = new FormControl("", [
    Validators.required,
    Validators.email,
  ]);

  matcher = new MyErrorStateMatcher();

  type: FormGroup;
  constructor(private formBuilder: FormBuilder) {}

  isFieldValid(form: FormGroup, field: string) {
    return !form.get(field).valid && form.get(field).touched;
  }

  displayFieldCss(form: FormGroup, field: string) {
    return {
      "has-error": this.isFieldValid(form, field),
      "has-feedback": this.isFieldValid(form, field),
    };
  }
  ngOnInit() {
    this.tableData1 = {
      headerRow: [
        "Código",
        "Nombre",
        "Tipo Libro",
        "Tipo Firma",
        "Estado",
        "Acción",
      ],
      dataRows: [
        [
          "LM01",
          "Libro Principal",
          "Maestro",
          "Digital Avanzada",
          "En creación",
          "btn-link",
        ],
        [
          "LC01",
          "Libro de Comuniaciones",
          "Auxiliar",
          "Digital Simple",
          "Abierto",
          "btn-link",
        ],
        [
          "LA01",
          "Libro Prevención de Riesgos",
          "Auxiliar",
          "Por Sistema",
          "Abierto",
          "btn-link",
        ],
        ["LA02", "Libro PAC", "Auxiliar", "Por Sistema", "Abierto", "btn-link"],
        [
          "LA03",
          "Libro Administrativo",
          "Auxiliar",
          "Por Sistema",
          "Cerrado",
          "btn-link",
        ],
      ],
    };
  }

  ngOnChanges(changes: SimpleChanges) {
    const input = $(this);

    if (input[0].files && input[0].files[0]) {
      const reader: any = new FileReader();

      reader.onload = function (e: any) {
        $("#wizardPicturePreview").attr("src", e.target.result).fadeIn("slow");
      };
      reader.readAsDataURL(input[0].files[0]);
    }
  }
  ngAfterViewInit() {
    $(window).resize(() => {
      $(".card-wizard").each(function () {
        setTimeout(() => {
          const $wizard = $(this);
          const index = $wizard.bootstrapWizard("currentIndex");
          let $total = $wizard.find(".nav li").length;
          let $li_width = 100 / $total;

          let total_steps = $wizard.find(".nav li").length;
          let move_distance = $wizard.width() / total_steps;
          let index_temp = index;
          let vertical_level = 0;

          let mobile_device = $(document).width() < 600 && $total > 3;
          if (mobile_device) {
            move_distance = $wizard.width() / 2;
            index_temp = index % 2;
            $li_width = 50;
          }

          $wizard.find(".nav li").css("width", $li_width + "%");

          let step_width = move_distance;
          move_distance = move_distance * index_temp;

          let $current = index + 1;

          if ($current == 1 || (mobile_device == true && index % 2 == 0)) {
            move_distance -= 8;
          } else if (
            $current == total_steps ||
            (mobile_device == true && index % 2 == 1)
          ) {
            move_distance += 8;
          }

          if (mobile_device) {
            let x: any = index / 2;
            vertical_level = parseInt(x);
            vertical_level = vertical_level * 38;
          }

          $wizard.find(".moving-tab").css("width", step_width);
          $(".moving-tab").css({
            transform:
              "translate3d(" +
              move_distance +
              "px, " +
              vertical_level +
              "px, 0)",
            transition: "all 0.5s cubic-bezier(0.29, 1.42, 0.79, 1)",
          });

          $(".moving-tab").css({
            transition: "transform 0s",
          });
        }, 500);
      });
    });
  }
}
