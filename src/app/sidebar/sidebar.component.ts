import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import PerfectScrollbar from "perfect-scrollbar";

declare const $: any;

//Metadata
export interface RouteInfo {
  path: string;
  title: string;
  type: string;
  icontype: string;
  collapse?: string;
  children?: ChildrenItems[];
}

export interface ChildrenItems {
  path: string;
  title: string;
  ab: string;
  type?: string;
}

//Menu Items
export const ROUTES: RouteInfo[] = [
  {
    path: "/dashboard",
    title: "Dashboard",
    type: "link",
    icontype: "dashboard",
  },
  {
    path: "/entidad/entidad",
    title: "Mis Entidades",
    type: "link",
    icontype: "business",
  },
  {
    path: "/contrato",
    title: "Contrato",
    type: "sub",
    icontype: "engineering",
    collapse: "contrato",
    children: [
      //{ path: "contrato", title: "Nuevo Contrato", ab: "B" },
      { path: "lista-contrato", title: "Lista Contrato", ab: "B" },
      //{ path: "detalle-contrato", title: "Detalle Contrato", ab: "B" },
    ],
  },
  {
    path: "/libro/lista-libro",
    title: "Mis libros",
    type: "link",
    icontype: "book",
  },
];
@Component({
  selector: "app-sidebar-cmp",
  templateUrl: "sidebar.component.html",
})
export class SidebarComponent implements OnInit {
  public menuItems: any[];
  ps: any;
  constructor(private router : Router){}
  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  }

  ngOnInit() {
    this.menuItems = ROUTES.filter((menuItem) => menuItem);
    if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
      const elemSidebar = <HTMLElement>(
        document.querySelector(".sidebar .sidebar-wrapper")
      );
      this.ps = new PerfectScrollbar(elemSidebar);
    }
  }
  updatePS(): void {
    if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
      this.ps.update();
    }
  }
  isMac(): boolean {
    let bool = false;
    if (
      navigator.platform.toUpperCase().indexOf("MAC") >= 0 ||
      navigator.platform.toUpperCase().indexOf("IPAD") >= 0
    ) {
      bool = true;
    }
    return bool;
  }
  routeUsuario(){
    this.router.navigate(['usuario/usuario']);
  }
}
