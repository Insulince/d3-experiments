import {RouterModule, Routes} from "@angular/router";
import {PortalComponent} from "./components/portal/portal.component";
import {AComponent} from "./components/a/a.component";
import {BComponent} from "./components/b/b.component";
import {NgModule} from "@angular/core";
import {CComponent} from "./components/c/c.component";
import {DComponent} from "./components/d/d.component";

const routes: Routes = [
  {path: "", redirectTo: "/portal", pathMatch: "full"},
  {path: "portal", component: PortalComponent},
  {path: "a", component: AComponent},
  {path: "b", component: BComponent},
  {path: "c", component: CComponent},
  {path: "d", component: DComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class RoutingModule {
}
