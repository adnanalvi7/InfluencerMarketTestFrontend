import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, filter, map, Subject, takeUntil } from 'rxjs';
import { InstagramService } from 'src/app/services/instagram.service';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  @Input() debounce: number = 300; //wait time to get the next change
  @Input() minLength: number = 1; // validation for minimum length of search
  @Output() selectedProfile: EventEmitter<any> = new EventEmitter<any>();  

  opened: boolean = false;
  resultSets: any;
  searchControl: FormControl = new FormControl();
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private service: InstagramService) {}

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(this.debounce),
        takeUntil(this._unsubscribeAll),
        map((value) => {
          if (!value || value.length < this.minLength) {
            this.resultSets = null;
          }
          return value;
        }),

        filter((value) => value && value.length >= this.minLength)
      )
      .subscribe((value) => {
        this.getDataForSearch(value);
      });
  }

  // get data for search 
  getDataForSearch(value?: string) {
    if (value) {
      this.service
        .getUsersBySearch(value)
        .pipe(debounceTime(this.debounce), takeUntil(this._unsubscribeAll))
        .subscribe({
          next: (resp:any) => {
            this.resultSets = resp.data;
          },
          error: (err) => {
            console.log('err: ', err);
          },
        });
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  // handle keyboard functions
  onKeydown(event: KeyboardEvent): void {
    if (event.code === 'Escape') {
      this.close();
    }else if (event.code === 'Enter') {
      event.preventDefault(); // Prevent form submission
      this.close();
    }
  }

  // close the auto complete
  close(): void {
    if (!this.opened) {
      return;
    }
    // Close the search
    this.opened = false;
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  // emit the selected user
  selectProfile(selectedHash: string) {
    this.selectedProfile.emit(selectedHash);
    this.close();
  }
}
