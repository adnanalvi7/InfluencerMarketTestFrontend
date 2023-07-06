import { Component, OnDestroy } from '@angular/core';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { InstagramService } from 'src/app/services/instagram.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
})
export class PostsComponent implements OnDestroy {
  // used to display loader
  isLoading: boolean = false;
  isGettinNextPage:boolean=false; // to disable the button of next page until the got the resp
  posts: Posts; // save the data of user's posts
  profile: any; // save the data of user's profile
  contactList: any; // save the data of user's contacts links
  private _unsubscribeAll: Subject<any> = new Subject<any>();  // cancel all the requests after closing the component
  constructor(private service: InstagramService) {}

  proxyUrl='https://influencer-app-backend-e2890b2a50d3.herokuapp.com/';
  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  // selected profile from search and getting the selected user details
  selectedProfile(profile) {
    console.log("profile");
    
    if(profile){
      this.getUserProfileInfo(profile?.user_id);
      this.getContacts(profile?.user_id);
      this.getUserPosts(profile)
    }
  }

  // encode URL for proxy server
  getEncodedUrl(url: string): string {
    return encodeURIComponent(url);
  }

  // remove the http protocol for better view 
  extractDomain(url):string {
    let protocolRemoved = url.replace(/^https?:\/\//, '');
    return protocolRemoved;
  }

  // it opens the post image in new tab
   openpost(post){
    console.log("what is in the post : ",post);
    
    if(post.media_type==2){
      window.open(post?.video_url, '_blank');
    }else window.open(post?.display_url, '_blank');
  }


  //#region api calls
  // get user complete detail
  private getUserProfileInfo(userId) {
    this.service
      .getUserInfo(userId)
      .pipe(debounceTime(300), takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (resp: any) => {
          console.log('userInfl  : ', resp);
          this.profile = resp.user;
        },
        error: (err) => {
          this.profile = undefined;
        },
      });
  }

  // get contact links for user
  private  getContacts(userId) {
    this.service
      .getUserContacts(userId)
      .pipe(debounceTime(300), takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (resp: any) => {
          this.contactList = resp?.user_profile?.contacts;
        },
        error: (err) => {
          this.contactList = [];
        },
      });
  }

  // getting top 12 user's post 
  private getUserPosts(profile){
    this.isLoading = true;
    this.service
      .getUserPosts(profile.user_id)
      .pipe(debounceTime(300), takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (resp: Posts) => {
          this.posts = resp;
          this.isLoading = false;
        },
        error: (err) => {
          this.posts = {
            end_cursor: '',
            items: [],
            more_available: false,
            status: '',
          };
          this.isLoading = false;
        },
      });
  }

  // getting next page posts
  getNextPagePosts(cursurEnd) {
    this.isLoading = true;
    // taking page to the top where posts starts
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    this.isGettinNextPage=true;
    this.service
      .getUserPosts(this.profile?.pk, cursurEnd)
      .pipe(debounceTime(300), takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (resp: any) => {
          this.posts = resp;
          this.isGettinNextPage=false;
          this.isLoading = false;
        },
        error: (err) => {
          this.isGettinNextPage=false
          this.isLoading = false;
        },
      });
  }
  //#endregion
}

interface Posts {
  end_cursor: string;
  items: any[];
  more_available: boolean;
  status: string;
}
