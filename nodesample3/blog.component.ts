import { Component, OnInit, OnDestroy } from '@angular/core';

import { ScrollService } from '../common-service/scroll.service';

import { RestService } from '../common-service/rest.service';
import { MatSnackBar } from '@angular/material';
import { ISubscription } from 'rxjs/Subscription';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit, OnDestroy {
  public blogs = {
    list: [],
    paging: {}
  };

  private blogSubscription: ISubscription;
  private routeSubscription: ISubscription;

  constructor(
    private scrollService: ScrollService,
    private restService: RestService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {
    scrollService.scrollTo();
  }

  /**
   * Fetch all latest blog posts from server
   */
  fetchBlogPosts(page = 0) {
    this.blogSubscription = this.restService
      .get(`v1/blogs?page=${page}`)
      .subscribe(
        result => {
          this.blogs = result['data'];
        },
        error => {
          this.snackBar.open(error.message, null, { duration: 5000 });
        }
      );
  }

  /**
   * this function will used by ngFor
   * to track the index for performance
   * @param {Number} index [index of every item in loop]
   * @param {Object} item  [current item ]
   */
  trackByFn(index, item) {
    return index; // or item.id
  }

  /**
   * Component lifecycle hooks
   * executes on component initializations
   * so we're fetching blog posts as the component
   * initilaze
   */
  ngOnInit() {
    this.showURLSelectedPage();
  }

  /**
   * Component lifecycle hooks
   * cleanup hooks, so clear any
   * sessions storages and unsubscribe the subscriptions
   */
  ngOnDestroy() {
    this.blogSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
  }

  /**
   * Function will executes every time
   * MAT pagination will changes
   * @param {Object} event
   */
  onPageChange(event) {
    const { pageIndex } = event;
    this.router.navigate([], { queryParams: { page: pageIndex + 1 } });
    window.scroll(0, 0);
  }

  /**
   * following function will retrieve
   * page from the URL and the fetch the posts
   * related to that page
   */
  showURLSelectedPage() {
    this.routeSubscription = this.route.queryParams.subscribe(params => {
      const { page } = params;
      let pageIndex = 0;
      if (page && !isNaN(page)) {
        pageIndex = page - 1;
      }
      this.fetchBlogPosts(pageIndex);
    });
  }
}
