import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root',
})
export class InstagramService {
  apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getUsersBySearch(seachString: string) {
    let url = `${this.apiUrl}dict/users/?q=${seachString}&limit=10&type=lookalike&platform=instagram`;
    return this.http.get(url);
  }

  getUserInfo(querryUrl){
    let url=`${this.apiUrl}raw/ig/user/info/?url=${querryUrl}`
    return this.http.get(url);
  }

  getUserPosts(queryUrl, after?) { //querry url can be user_id, UserName and after is end_cursur for getting new page 
    let url: string = '';
    if (after)
      url = `${this.apiUrl}raw/ig/user/feed/?url=${queryUrl}&after=${after}`;
    else url = `${this.apiUrl}raw/ig/user/feed/?url=${queryUrl}`;
    return this.http.get(url);
  }

  getUserContacts(queryUrl){
    let url:string=`${this.apiUrl}exports/contacts/?url=${queryUrl}&platform=instagram`
    return this.http.get(url)
  }
  
}
