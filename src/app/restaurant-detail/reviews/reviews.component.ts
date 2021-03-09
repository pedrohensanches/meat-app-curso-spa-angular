import { Component, OnInit } from '@angular/core';
import { RestaurantsService } from 'app/restaurants/restaurants.service';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'mt-reviews',
  templateUrl: './reviews.component.html'
})
export class ReviewsComponent implements OnInit {

  reviews: Observable<any>

  constructor(private restaurantService: RestaurantsService,
              private route : ActivatedRoute) { }

  ngOnInit() {
    var id: string = this.route.parent.snapshot.params['id'];
    this.reviews = this.restaurantService.reviewsOfRestaurant(id);
  }

}