import { MatDateFormats } from '@angular/material/core';

export const DATE_FORMATS_ES: MatDateFormats = {
  parse: {
    dateInput: 'dddd D [de] MMMM',
  },
  display: {
    dateInput: 'dddd D [de] MMMM',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'dddd D [de] MMMM YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
