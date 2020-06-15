import { NgModule, LOCALE_ID } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule, DatePipe } from "@angular/common";
import { MaterialModule } from "../app.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PagesRoutes } from "./pages.routing";
import { RegisterComponent } from "./register/register.component";
import { PricingComponent } from "./pricing/pricing.component";
import { LockComponent } from "./lock/lock.component";
import { LoginComponent } from "./login/login.component";
import { Title } from "@angular/platform-browser";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { AuthInterceptor } from "../administracion/configs/auth.interceptor";
import { NgxWebstorageModule } from "ngx-webstorage";
import { HttpModule } from "@angular/http";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(PagesRoutes),
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxWebstorageModule.forRoot(),
    HttpModule,
  ],
  declarations: [
    LoginComponent,
    RegisterComponent,
    PricingComponent,
    LockComponent,
  ],
  providers: [],
})
export class PagesModule {}
