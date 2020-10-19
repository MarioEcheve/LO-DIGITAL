import { NgModule, LOCALE_ID, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { APP_BASE_HREF, DatePipe, registerLocaleData } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

import { MatNativeDateModule } from "@angular/material/core";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatSliderModule } from "@angular/material/slider";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatMenuModule } from "@angular/material/menu";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatListModule } from "@angular/material/list";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatStepperModule } from "@angular/material/stepper";
import { MatTabsModule } from "@angular/material/tabs";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatChipsModule } from "@angular/material/chips";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatDialogModule } from "@angular/material/dialog";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatTableModule } from "@angular/material/table";
import { MatSortModule } from "@angular/material/sort";
import { MatPaginatorModule } from "@angular/material/paginator";

import { AppComponent } from "./app.component";

import { SidebarModule } from "./sidebar/sidebar.module";
import { FooterModule } from "./shared/footer/footer.module";
import { NavbarModule } from "./shared/navbar/navbar.module";
import { FixedpluginModule } from "./shared/fixedplugin/fixedplugin.module";
import { AdminLayoutComponent } from "./layouts/admin/admin-layout.component";
import { AuthLayoutComponent } from "./layouts/auth/auth-layout.component";
import { AppRoutes } from "./app.routing";
import { NgxWebstorageModule } from "ngx-webstorage";
import { Title } from "@angular/platform-browser";
import { AuthInterceptor } from "./administracion/configs/auth.interceptor";
import { AuthGuard } from "./auth-guard.service";
import { CrearUsuarioComponent } from "./administracion/componentes/crear-usuario/crear-usuario.component";
import { VisorPdfComponent } from "./administracion/shared/visor-pdf/visor-pdf/visor-pdf.component";
import { NgxExtendedPdfViewerModule } from "ngx-extended-pdf-viewer";

 // importar locales
 import localePy from '@angular/common/locales/es-PY';
 import localePt from '@angular/common/locales/pt';
 import localeEn from '@angular/common/locales/en';
 import localeEsAr from '@angular/common/locales/es-AR';
import { FiltroFolioPersonalizadoComponent } from './administracion/shared/filtro-folio-personalizado/filtro-folio-personalizado.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import { CambioAdministradorComponent } from './administracion/shared/cambio-administrador/cambio-administrador.component';
import { InformarPdfComponent } from './administracion/shared/informar-pdf/informar-pdf.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { NgxSummernoteModule } from 'ngx-summernote';

registerLocaleData(localePy, 'es');
registerLocaleData(localePt, 'pt');
registerLocaleData(localeEn, 'en');
registerLocaleData(localeEsAr, 'es-Ar');

@NgModule({
  exports: [
    MatAutocompleteModule,
    MatButtonToggleModule,
    MatCardModule,
    MatChipsModule,
    MatCheckboxModule,
    MatStepperModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatNativeDateModule,
    NgxExtendedPdfViewerModule,
    NgxSpinnerModule,
    NgxSummernoteModule
    
  ],
  declarations: [],
})
export class MaterialModule {}

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    FormsModule,
    RouterModule.forRoot(AppRoutes, {
      useHash: true,
    }),
    HttpClientModule,
    NgxWebstorageModule.forRoot(),
    NgxPermissionsModule.forRoot(),
    MaterialModule,
    SidebarModule,
    NavbarModule,
    FooterModule,
    FixedpluginModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    

    
  ],
  declarations: [AppComponent, AdminLayoutComponent, AuthLayoutComponent,FiltroFolioPersonalizadoComponent,VisorPdfComponent,CambioAdministradorComponent, InformarPdfComponent],
  providers: [
    MatNativeDateModule,
    Title,
    {
      provide: LOCALE_ID,
      useValue: "es-cl",
    },
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
