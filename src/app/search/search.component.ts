import { Component, OnInit } from '@angular/core';
import { Slide } from '../models/slide';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'bk-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  public slides: Slide[] = [];
  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getSlides().subscribe((slides) => {
      this.slides = slides;
    });
  }
}
