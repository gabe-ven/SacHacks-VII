export interface PantryData {
  lastUpdated: string;
  hours: {
    weekday: string;
    weekend: string;
  };
  notes: string[];
  categories: {
    produce: string[];
    milk: string[];
    snacks: string[];
    canned: string[];
    necessities: string[];
  };
  externalLinks: {
    ramadanMenu: string;
    mon: string;
    tues: string;
    wed: string;
    thurs: string;
    fri: string;
  };
}
