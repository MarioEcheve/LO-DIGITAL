import { Component, OnInit, ElementRef, OnDestroy } from "@angular/core";
import { LoginService } from "../../core/login/login.service";
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AccountService } from "src/app/core/auth/account.service";
import { UsuarioService } from "src/app/core/user/usuario.service";
import { UsuarioDependenciaService } from '../../administracion/services/usuario-dependencia.service';
import { User } from "src/app/core/user/user.model";
 declare var $: any;

@Component({
  selector: "app-login-cmp",
  templateUrl: "./login.component.html",
})
export class LoginComponent implements OnInit, OnDestroy {
  authenticationError = false;
  noValidos = false;
  loginForm = this.fb.group({
    username: ["", Validators.required],
    password: ["", Validators.required],
    rememberMe: [false],
  });
  test: Date = new Date();
  private toggleButton: any;
  private sidebarVisible: boolean;
  private nativeElement: Node;

  constructor(
    private element: ElementRef,
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private accountService: AccountService,
    private usuarioService: UsuarioService,
    private usuarioDependenciaService : UsuarioDependenciaService
  ) {
    this.nativeElement = element.nativeElement;
    this.sidebarVisible = false;
    if (this.accountService.isAuthenticated()) {
      this.router.navigate(["dashboard"]);
    } else {
      this.nativeElement = element.nativeElement;
      this.sidebarVisible = false;
    }
  }

  ngOnInit() {
    var navbar: HTMLElement = this.element.nativeElement;
    this.toggleButton = navbar.getElementsByClassName("navbar-toggle")[0];
    const body = document.getElementsByTagName("body")[0];
    body.classList.add("login-page");
    body.classList.add("off-canvas-sidebar");
    const card = document.getElementsByClassName("card")[0];
    setTimeout(function () {
      // after 1000 ms we add the class animated to the login/register card
      card.classList.remove("card-hidden");
    }, 700);
  }
  sidebarToggle() {
    var toggleButton = this.toggleButton;
    var body = document.getElementsByTagName("body")[0];
    var sidebar = document.getElementsByClassName("navbar-collapse")[0];
    if (this.sidebarVisible == false) {
      setTimeout(function () {
        toggleButton.classList.add("toggled");
      }, 500);
      body.classList.add("nav-open");
      this.sidebarVisible = true;
    } else {
      this.toggleButton.classList.remove("toggled");
      this.sidebarVisible = false;
      body.classList.remove("nav-open");
    }
  }

  ngOnDestroy() {
    const body = document.getElementsByTagName("body")[0];
    body.classList.remove("login-page");
    body.classList.remove("off-canvas-sidebar");
  }

  login() {
    this.router.navigate(["dashboard"]);
    
    this.loginService
      .login({
        username: this.loginForm.get("username")!.value,
        password: this.loginForm.get("password")!.value,
        rememberMe: false,
      })
      .subscribe(
        (res) => {
          this.showNotificationSuccess("top", "right", res);
          let usuario = new User;
          usuario = res;
          this.usuarioDependenciaService.findUserByUsuarioDependencia(usuario.id).subscribe(
            usuarioDependencia=>{
              usuario.authorities = [...usuario.authorities, usuarioDependencia.body[0].perfilUsuarioDependencia.nombre.toUpperCase()]
              localStorage.setItem("user", JSON.stringify(usuario));
              this.router.navigate(["dashboard"]);
            }
          );
          
          
          //console.log(JSON.parse(localStorage.getItem("user")));
        },
        (error) => {
          this.noValidos = true;
          this.showNotificationDanger("top", "right");
        },
        () => (this.authenticationError = true)
      );
    //console.log(this.loginForm.value);
    
  }
  showNotificationSuccess(from: any, align: any, res: any) {
    const type = [
      "",
      "info",
      "success",
      "warning",
      "danger",
      "rose",
      "primary",
    ];

    const color = 2;

    $.notify(
      {
        icon: "notifications",
        message:
          "Bienvenido " +
          res.firstName +
          " " +
          res.lastName +
          " a <b>Libro de Obra digital</b> ",
      },
      {
        type: type[color],
        timer: 3000,
        placement: {
          from: from,
          align: align,
        },
        template:
          '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0} alert-with-icon" role="alert">' +
          '<button mat-raised-button type="button" aria-hidden="true" class="close" data-notify="dismiss">  <i class="material-icons">close</i></button>' +
          '<i class="material-icons" data-notify="icon">notifications</i> ' +
          '<span data-notify="title">{1}</span> ' +
          '<span data-notify="message">{2}</span>' +
          '<div class="progress" data-notify="progressbar">' +
          '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
          "</div>" +
          '<a href="{3}" target="{4}" data-notify="url"></a>' +
          "</div>",
      }
    );
  }
  showNotificationDanger(from: any, align: any) {
    const type = [
      "",
      "info",
      "success",
      "warning",
      "danger",
      "rose",
      "primary",
    ];

    const color = 4;

    $.notify(
      {
        icon: "notifications",
        message: "Usuario o Contraseña invalidos",
      },
      {
        type: type[color],
        timer: 3000,
        placement: {
          from: from,
          align: align,
        },
        template:
          '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0} alert-with-icon" role="alert">' +
          '<button mat-raised-button type="button" aria-hidden="true" class="close" data-notify="dismiss">  <i class="material-icons">close</i></button>' +
          '<i class="material-icons" data-notify="icon">notifications</i> ' +
          '<span data-notify="title">{1}</span> ' +
          '<span data-notify="message">{2}</span>' +
          '<div class="progress" data-notify="progressbar">' +
          '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
          "</div>" +
          '<a href="{3}" target="{4}" data-notify="url"></a>' +
          "</div>",
      }
    );
  }
}
