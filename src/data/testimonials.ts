// Client testimonials – add them here (only with the client's permission).
// The testimonials section on the home page, service pages and /testimonials/
// appears automatically as soon as this list is not empty.
//
// Example:
//   { quote: 'The reading put words to something I had felt for years…', name: 'Ana K.', place: 'Zagreb', service: 'natal-chart' },

export interface Testimonial {
  quote: string;
  name: string;
  place?: string;
  /** Service page it belongs to: natal-chart | synastry | location-astrology | gift */
  service?: string;
}

export const TESTIMONIALS: Testimonial[] = [];
