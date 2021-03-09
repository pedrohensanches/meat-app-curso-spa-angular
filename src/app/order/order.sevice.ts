import { Injectable } from "@angular/core";
import { ShoppingCartService } from "app/restaurant-detail/shopping-cart/shopping-cart.service";
import { CartItem } from "app/restaurant-detail/shopping-cart/cart-item.model";
import { Order } from "./order.model";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map'
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { MEAT_API } from "app/app.api";
import { LoginService } from "app/security/login/login.service";
import { NotificationService } from "app/shared/messages/notification.service";

@Injectable()
export class OrderService {

    constructor(private CartService: ShoppingCartService,
        private http: HttpClient,
        private loginService: LoginService,
        private notificationService: NotificationService) { }

    cartItems(): CartItem[] {
        return this.CartService.items;
    }

    increaseQty(item: CartItem) {
        this.CartService.increaseQty(item);
    }

    decreaseQty(item: CartItem) {
        this.CartService.decreaseQty(item);
    }

    remove(item: CartItem) {
        this.CartService.removeItem(item);
    }

    total(): number {
        return this.CartService.total();
    }

    checkOrder(order: Order): Observable<string> {
        // let headers = new HttpHeaders()

        // if (this.loginService.isLoggedIn()) {
        //     headers = headers.set('Authorization', `Bearer ${this.loginService.user.accessToken}`)

        //     // return this.http.post<Order>(`${MEAT_API}/orders`, order, { headers: headers })
        //     // .map(response => response.id);
        // }
        // // else this.notificationService.notify("Usuário não logado!")

        return this.http.post<Order>(`${MEAT_API}/orders`, order/*, { headers: headers }*/)
            .map(response => response.id);
    }

    clear() {
        this.CartService.clear();
    }
}