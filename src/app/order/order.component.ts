import { Component, OnInit } from '@angular/core';
import { RadioOption } from 'app/shared/radio/radio-option.model';
import { OrderService } from './order.sevice';
import { CartItem } from 'app/restaurant-detail/shopping-cart/cart-item.model';
import { Order, OrderItem } from './order.model';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl } from '@angular/forms';
import { NotificationService } from 'app/shared/messages/notification.service';

@Component({
  selector: 'mt-order',
  templateUrl: './order.component.html'
})
export class OrderComponent implements OnInit {

  numberPattern = /^[0-9]*$/

  orderForm: FormGroup

  delivery: number = 8

  orderId: number

  paymentOptions: RadioOption[] = [
    { label: 'Dinheiro', value: 'MON' },
    { label: 'Cartão de Débito', value: 'DEB' },
    { label: 'Cartão Refeição', value: 'REF' }
  ]

  constructor(private orderService: OrderService,
    private router: Router,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService) { }

  ngOnInit() {
    this.orderForm = new FormGroup({
      name: new FormControl('', {
        validators: [Validators.required, Validators.minLength(5)],
        // updateOn: 'blur'
      }),
      email: this.formBuilder.control('', [Validators.required, Validators.email]),
      emailConfirmation: this.formBuilder.control('', [Validators.required, Validators.email]),
      address: this.formBuilder.control('', [Validators.required, Validators.minLength(5)]),
      number: this.formBuilder.control('', [Validators.required, Validators.pattern(this.numberPattern)]),
      optionalAddress: this.formBuilder.control(''),
      paymentOption: this.formBuilder.control('', [Validators.required])
    }, { validators: [OrderComponent.equalsTo], updateOn: 'blur' })
  }

  static equalsTo(group: AbstractControl): { [key: string]: boolean } {
    const email = group.get('email')
    const emailConfirmation = group.get('emailConfirmation')
    if (!email || !emailConfirmation) {
      return undefined
    }
    if (email.value !== emailConfirmation.value) {
      return { emailsNotMatch: true }
    }
    return undefined
  }

  cartItems(): CartItem[] {
    return this.orderService.cartItems();
  }

  increaseQty(cartItem: CartItem) {
    this.orderService.increaseQty(cartItem);
  }

  decreaseQty(cartItem: CartItem) {
    this.orderService.decreaseQty(cartItem);
  }

  remove(cartItem: CartItem) {
    this.orderService.remove(cartItem);
  }

  total(): number {
    return this.orderService.total();
  }

  checkOrder(order: Order) {
    order.orderItems = this.cartItems().map((item: CartItem) => new OrderItem(item.quantity, item.menuItem.id));
    this.orderService.checkOrder(order).subscribe((orderId: string) => {
      this.router.navigate(['order-summary'])
      this.orderService.clear();
    }//,
      //response => //HttpErrorResponse
      //this.notificationService.notify(response.error.message)
    );
  }

  isOrderCompleted(): boolean {
    return this.orderId !== undefined
  }
}