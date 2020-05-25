import {Pipe, PipeTransform} from '@angular/core';
import {FormsModel} from '../model/event-form.model';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(events: FormsModel[], field: string, value: any) {
    if (!events) {
      return [];
    }
    if (!field || !value) {
      return events;
    }
    if (field === 'approved') {
      return events.filter(e =>
        e[field].toString() === value
      );
    }
    return events.filter(e =>
      e[field].toLowerCase().includes(value.toLowerCase())
    );
  }
}
