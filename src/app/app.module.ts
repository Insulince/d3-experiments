import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {AppComponent} from "./app.component";
import {AComponent} from "./components/a/a.component";
import {BComponent} from "./components/b/b.component";
import {RoutingModule} from "./routing.module";
import {PortalComponent} from "./components/portal/portal.component";
import {CComponent} from "./components/c/c.component";
import {DComponent} from "./components/d/d.component";

@NgModule({
  declarations: [
    AppComponent,
    PortalComponent,
    AComponent,
    BComponent,
    CComponent,
    DComponent
  ],
  imports: [
    BrowserModule,
    RoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
