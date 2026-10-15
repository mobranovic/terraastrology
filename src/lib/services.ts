// Consultation packages – edit prices and contents here.
export const SERVICES = [
  {
    id: 'standard-30',
    name: 'Natal chart — essentials',
    duration: '30 min',
    price: 40,
    items: ['Most important character traits', 'Main evolutionary goals of your life', 'Overview of important present and near-future events'],
  },
  {
    id: 'standard-60',
    name: 'Natal chart — in depth',
    duration: '1 h',
    price: 55,
    items: [
      'In-depth character profile',
      'Main evolutionary goals of your life',
      'Personal chronology of crucial life events, from childhood to the near future',
      'Detailed analysis of specific topics of interest',
    ],
  },
  {
    id: 'synastry',
    name: 'Natal chart with synastry',
    duration: '1 h 15 min',
    price: 80,
    needsPartner: true,
    items: [
      'In-depth character profile',
      'Main evolutionary goals of your life',
      'Personal chronology of crucial life periods',
      'Detailed analysis of specific topics of interest',
      'Relationship analysis',
    ],
  },
  {
    id: 'extended',
    name: 'Extended natal chart analysis',
    duration: '1 h 30 min',
    price: 100,
    needsPartner: true,
    items: [
      'Everything in the synastry session',
      "Overview of children's or parents' natal charts",
      'Location astrology analysis',
    ],
  },
];

export const PLATFORMS = ['Zoom', 'WhatsApp', 'Skype'];
export const serviceById = (id: string) => SERVICES.find((s) => s.id === id);
export const PAYMENT = 'All fees are payable via PayPal, Revolut or bank transfer.';
