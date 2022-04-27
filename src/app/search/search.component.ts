import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  searchForm: FormGroup = new FormGroup({
    'query': new FormControl('', [])
  });
  defaultLang: any;

  get query() {
    return this.searchForm.get('query');
  }
   
  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
  ) { }

  ngOnInit(): void {

    this._route.firstChild!.paramMap.subscribe(async params => {
      const query = params.get('query')! ? `${params.get('query')!}`.trim() : '';
      if (query) {
        this.searchForm.get('query')!.setValue(query)
      }
      
    });

  }

  onSubmitSearch() {
    //const query = encodeURI(this.query!.value);
    const query = this.query!.value ? `${this.query!.value}`.trim() : '';

    if (query) {
      this._router.navigate([`${query}`], {relativeTo: this._route});
    } else {
      this._router.navigate(['.'], {relativeTo: this._route});
    }
  }

}
