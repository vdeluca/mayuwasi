import { MatDateFormats } from '@angular/material/core';

export const DATE_FORMATS_ES: MatDateFormats = {
  parse: {
    dateInput: { day: 'numeric', month: 'long', year: 'numeric' },
  },
  display: {
    dateInput: { weekday: 'long', day: 'numeric', month: 'long' },
    monthYearLabel: { month: 'long', year: 'numeric' },
    dateA11yLabel: { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' },
    monthYearA11yLabel: { month: 'long', year: 'numeric' },
  },
};
