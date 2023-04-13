import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';


export interface AutocompleteOption {
  value: any;
  displayValue: string;
}

@Component({
  selector: 'app-autocomplete-input-field',
  templateUrl: './autocomplete-input-field.component.html',
  styleUrls: ['./autocomplete-input-field.component.scss']
})
export class AutocompleteInputFieldComponent implements OnInit {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() options: Array<AutocompleteOption> = [];
  filteredOptions: Array<AutocompleteOption> = [];

  selectedOption: AutocompleteOption = {
    value: null,
    displayValue: '',
  };

  @Input() selectedText = '';
  @Input() selected: any;
  @Input() disabled = false;
  @Output() selectedChange: EventEmitter<any> = new EventEmitter<any>();

  ngOnInit() {
    this.selectedOption = {
      value: this.selected,
      displayValue: this.selectedText,
    };
  }

  ngOnChanges() {
    this.selectedOption = {
      value: this.selected,
      displayValue: this.selectedText,
    };
    this.filteredOptions = this.options;
  }
  applyFilterOnInput(event: Event) {
    let inputElement = event.target as HTMLInputElement;
    let filterValue: string;
    if (inputElement.value === null || inputElement.value == '')
      filterValue = '';
    else filterValue = inputElement.value.toLowerCase();
    this.filteredOptions = this.options.filter((option) =>
      option.displayValue.toLowerCase().includes(filterValue)
    );
  }

  updateFilterOnOpened(inputElement: HTMLInputElement) {
    const filterValue = inputElement.value;
    this.filteredOptions = this.options.filter((option) =>
      option.displayValue.toLowerCase().includes(filterValue)
    );
  }

  updateFilterOnLostFocus(inputElement: HTMLInputElement) {
    if (inputElement.value == '')
      this.selectedOption = { value: null, displayValue: '' };
    inputElement.value = this.selectedOption.displayValue;
  }

  optionSelected(event: MatAutocompleteSelectedEvent) {
    this.selectedOption = event.option.value;
    this.selected = this.selectedOption.value;
    this.selectedChange.emit(this.selected);
  }

  displayFn(option: AutocompleteOption) {
    return option.displayValue;
  }
}
