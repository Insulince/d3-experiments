import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {AppComponent} from "./app.component";
import {AComponent} from "./components/a/a.component";
import {BComponent} from "./components/b/b.component";
import {RoutingModule} from "./routing.module";
import {PortalComponent} from "./components/portal/portal.component";
import {CComponent} from "./components/c/c.component";
import {DComponent} from "./components/d/d.component";
import {EComponent} from "./components/e/e.component";
import {FComponent} from "./components/f/f.component";

@NgModule({
  declarations: [
    AppComponent,
    PortalComponent,
    AComponent,
    BComponent,
    CComponent,
    DComponent,
    EComponent,
    FComponent
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
