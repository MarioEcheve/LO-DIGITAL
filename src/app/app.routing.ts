import { Routes } from "@angular/router";

import { AdminLayoutComponent } from "./layouts/admin/admin-layout.component";
import { AuthLayoutComponent } from "./layouts/auth/auth-layout.component";
import { AuthGuard } from "./auth-guard.service";
import { UserRouteAccessService } from "./core/auth/user-route-access-service";

export const AppRoutes: Routes = [
  {
    path: "",
    redirectTo: "pages/login",
    pathMatch: "full",
  },
  {
    path: "",
    component: AdminLayoutComponent,
    data: {
      authorities: ["ROLE_USER"],
    },
    canActivate: [UserRouteAccessService],
    children: [
      {
        path: "",
        loadChildren: "./dashboard/dashboard.module#DashboardModule",
      },
      {
        path: "components",
        loadChildren: "./components/components.module#ComponentsModule",
      },
      {
        path: "forms",
        loadChildren: "./forms/forms.module#Forms",
      },
      {
        path: "tables",
        loadChildren: "./tables/tables.module#TablesModule",
      },
      {
        path: "maps",
        loadChildren: "./maps/maps.module#MapsModule",
      },
      {
        path: "widgets",
        loadChildren: "./widgets/widgets.module#WidgetsModule",
      },
      {
        path: "charts",
        loadChildren: "./charts/charts.module#ChartsModule",
      },
      {
        path: "calendar",
        loadChildren: "./calendar/calendar.module#CalendarModule",
      },
      {
        path: "entidad",
        loadChildren: "./administracion/entidad/entidad.module#EntidadModule",
      },
      {
        path: "usuario",
        loadChildren: "./administracion/usuario/usuario.module#UsuarioModule",
      },
      {
        path: "contrato",
        loadChildren:
          "./administracion/contrato/contrato.module#ContratoModule",
      },
      {
        path: "libro",
        loadChildren: "./administracion/libro/libro.module#LibroModule",
      },
      {
        path: "folio",
        loadChildren: "./administracion/folio/folio.module#FolioModule",
      },
      {
        path: "",
        loadChildren: "./userpage/user.module#UserModule",
      },
      {
        path: "",
        loadChildren: "./timeline/timeline.module#TimelineModule",
      },
    ],
  },
  {
    path: "",
    component: AuthLayoutComponent,
    children: [
      {
        path: "pages",
        loadChildren: "./pages/pages.module#PagesModule",
      },
    ],
  },
];
