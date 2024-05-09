import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  posts: any[]=[];
  constructor(private http: HttpClient) {
    this.loadPosts();
  }

  loadPosts() {
    this.http.get('http://127.0.0.1:8000/posts').subscribe((res:any) => {
      this.posts = res.data;
    })
  }
}