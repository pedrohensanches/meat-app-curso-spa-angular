import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { MEAT_API } from "app/app.api";
import { Observable } from "rxjs/Observable";
import { User } from "./user.model";
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';


@Injectable()
export class LoginService {
    user: User

    lastUrl: string

    constructor(private http: HttpClient, private router: Router) {
        this.router.events.filter(e => e instanceof NavigationEnd)
            .subscribe((e: NavigationEnd) => this.lastUrl = e.url)
    }

    login(email: string, password: string): Observable<User> {
        return this.http.post<User>(`${MEAT_API}/login`,
            { email: email, password: password })
            .do(user => this.user = user)
    }

    isLoggedIn(): boolean {
        return this.user !== undefined
    }

    logout() {
        this.user = undefined
        if (this.lastUrl === '/order')
            this.router.navigate(['/'])
    }

    handleLogin(path: string = this.lastUrl) {
        this.router.navigate(['/login', btoa(path)])
    }
}