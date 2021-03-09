import { state, trigger, style, animate, transition } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Restaurant } from './restaurant/restaurant.model';
import { RestaurantsService } from './restaurants.service';

import 'rxjs/add/operator/switchMap'
import 'rxjs/add/operator/do'
import 'rxjs/add/operator/debounceTime'
import 'rxjs/add/operator/distinctUntilChanged'
import 'rxjs/add/operator/catch'
import 'rxjs/add/observable/from'
import { Observable } from 'rxjs/Observable'

@Component({
  selector: 'mt-restaurants',
  templateUrl: './restaurants.component.html',
  animations: [
    trigger('toogleSearch', [
      state('hidden', style({
        opacity: 0,
        "max-height": "0px"
      })),
      state('visible', style({
        opacity: 1,
        "max-height": "70px",
        "margin-top": "20px",
      })),
      transition('* => *', animate('250ms 0s ease-in-out'))
    ])
  ]
})
export class RestaurantsComponent implements OnInit {

  constructor(private restaurantServive: RestaurantsService,
    private fb: FormBuilder) { }

  restaurants: Restaurant[]

  searchBarState = 'hidden'
  searchForm: FormGroup
  searchControl: FormControl

  ngOnInit() {
    this.searchControl = this.fb.control('')

    this.searchForm = this.fb.group({
      searchControl: this.searchControl
    })

    this.searchControl.valueChanges
      .debounceTime(500)
      .distinctUntilChanged()
      .switchMap(termo => this.restaurantServive.restaurants(termo)
        .catch(error => Observable.from([])))
      .subscribe(restaurants => this.restaurants = restaurants)

    this.restaurantServive.restaurants()
      .subscribe(restaurants => this.restaurants = restaurants)
  }

  toogleSearch() {
    this.searchBarState = this.searchBarState === 'hidden' ? 'visible' : 'hidden'
  }

}
