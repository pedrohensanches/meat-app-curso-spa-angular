import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, RouterStateSnapshot } from "@angular/router";
import { LoginService } from "./login/login.service";

@Injectable()
export class LoggedInGuard implements CanLoad, CanActivate {

    constructor(private loginService: LoginService) { }

    checkAuthentication(path: string): boolean {
        const loggedIn = this.loginService.isLoggedIn()
        if (loggedIn)
            return true
        else
            this.loginService.handleLogin(`/${path}`)
    }

    canLoad(route: Route): boolean {
        return this.checkAuthentication(route.path)
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.checkAuthentication(route.routeConfig.path) //routeConfig is Route type
    }
}