import { Routes } from "@angular/router";
import { LoginComponent } from "./components/login/login.component";
import { RegisterComponent } from "./components/register/register.component";
import { AdminComponent } from "./components/admin/admin.component";
import { AuthGuard } from "./route-guard/route-authorization.guard";

export const routes: Routes = [
	{ path: "login", component: LoginComponent },
	{ path: "register", component: RegisterComponent },
	{ path: "admin", component: AdminComponent, canActivate: [AuthGuard] },
	{ path: "", redirectTo: "login", pathMatch: "full" },
	{ path: "**", redirectTo: "login" }
];
