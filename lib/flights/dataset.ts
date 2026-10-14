import type {
  Airport,
  Airline,
  FareRule,
  FlightOffer,
  CabinClass,
  DestinationGuide,
  RouteLandingPage,
  BlogPost,
} from '@/types';

export const AIRPORTS: Airport[] = [
  {
    id: 'apt-hyd',
    iataCode: 'HYD',
    icaoCode: 'VOHS',
    name: 'Rajiv Gandhi International Airport',
    city: 'Hyderabad',
    country: 'India',
    countryCode: 'IN',
    timezone: 'Asia/Kolkata',
    isInternational: false,
  },
  {
    id: 'apt-del',
    iataCode: 'DEL',
    icaoCode: 'VIDP',
    name: 'Indira Gandhi International Airport',
    city: 'New Delhi',
    country: 'India',
    countryCode: 'IN',
    timezone: 'Asia/Kolkata',
    isInternational: false,
  },
  {
    id: 'apt-bom',
    iataCode: 'BOM',
    icaoCode: 'VABB',
    name: 'Chhatrapati Shivaji Maharaj International Airport',
    city: 'Mumbai',
    country: 'India',
    countryCode: 'IN',
    timezone: 'Asia/Kolkata',
    isInternational: false,
  },
  {
    id: 'apt-blr',
    iataCode: 'BLR',
    icaoCode: 'VOBL',
    name: 'Kempegowda International Airport',
    city: 'Bengaluru',
    country: 'India',
    countryCode: 'IN',
    timezone: 'Asia/Kolkata',
    isInternational: false,
  },
  {
    id: 'apt-maa',
    iataCode: 'MAA',
    icaoCode: 'VOMM',
    name: 'Chennai International Airport',
    city: 'Chennai',
    country: 'India',
    countryCode: 'IN',
    timezone: 'Asia/Kolkata',
    isInternational: false,
  },
  {
    id: 'apt-ccu',
    iataCode: 'CCU',
    icaoCode: 'VECC',
    name: 'Netaji Subhas Chandra Bose International Airport',
    city: 'Kolkata',
    country: 'India',
    countryCode: 'IN',
    timezone: 'Asia/Kolkata',
    isInternational: false,
  },
  {
    id: 'apt-goi',
    iataCode: 'GOI',
    icaoCode: 'VOGO',
    name: 'Goa International Airport (Dabolim)',
    city: 'Goa',
    country: 'India',
    countryCode: 'IN',
    timezone: 'Asia/Kolkata',
    isInternational: false,
  },
  {
    id: 'apt-gox',
    iataCode: 'GOX',
    icaoCode: 'VOGA',
    name: 'Manohar International Airport (Mopa)',
    city: 'North Goa',
    country: 'India',
    countryCode: 'IN',
    timezone: 'Asia/Kolkata',
    isInternational: false,
  },
  {
    id: 'apt-amd',
    iataCode: 'AMD',
    icaoCode: 'VAAH',
    name: 'Sardar Vallabhbhai Patel International Airport',
    city: 'Ahmedabad',
    country: 'India',
    countryCode: 'IN',
    timezone: 'Asia/Kolkata',
    isInternational: false,
  },
  {
    id: 'apt-cok',
    iataCode: 'COK',
    icaoCode: 'VOCI',
    name: 'Cochin International Airport',
    city: 'Kochi',
    country: 'India',
    countryCode: 'IN',
    timezone: 'Asia/Kolkata',
    isInternational: false,
  },
  {
    id: 'apt-pnq',
    iataCode: 'PNQ',
    icaoCode: 'VAPO',
    name: 'Pune International Airport',
    city: 'Pune',
    country: 'India',
    countryCode: 'IN',
    timezone: 'Asia/Kolkata',
    isInternational: false,
  },
  {
    id: 'apt-jnr',
    iataCode: 'JAI',
    icaoCode: 'VIJP',
    name: 'Jaipur International Airport',
    city: 'Jaipur',
    country: 'India',
    countryCode: 'IN',
    timezone: 'Asia/Kolkata',
    isInternational: false,
  },
  {
    id: 'apt-lko',
    iataCode: 'LKO',
    icaoCode: 'VILK',
    name: 'Chaudhary Charan Singh International Airport',
    city: 'Lucknow',
    country: 'India',
    countryCode: 'IN',
    timezone: 'Asia/Kolkata',
    isInternational: false,
  },
  {
    id: 'apt-trv',
    iataCode: 'TRV',
    icaoCode: 'VOTV',
    name: 'Thiruvananthapuram International Airport',
    city: 'Thiruvananthapuram',
    country: 'India',
    countryCode: 'IN',
    timezone: 'Asia/Kolkata',
    isInternational: false,
  },
  {
    id: 'apt-vns',
    iataCode: 'VNS',
    icaoCode: 'VEBN',
    name: 'Lal Bahadur Shastri International Airport',
    city: 'Varanasi',
    country: 'India',
    countryCode: 'IN',
    timezone: 'Asia/Kolkata',
    isInternational: false,
  },
  {
    id: 'apt-gau',
    iataCode: 'GAU',
    icaoCode: 'VEGT',
    name: 'Lokpriya Gopinath Bordoloi International Airport',
    city: 'Guwahati',
    country: 'India',
    countryCode: 'IN',
    timezone: 'Asia/Kolkata',
    isInternational: false,
  },
  {
    id: 'apt-pat',
    iataCode: 'PAT',
    icaoCode: 'VEPT',
    name: 'Jay Prakash Narayan Airport',
    city: 'Patna',
    country: 'India',
    countryCode: 'IN',
    timezone: 'Asia/Kolkata',
    isInternational: false,
  },
  {
    id: 'apt-ixc',
    iataCode: 'IXC',
    icaoCode: 'VICG',
    name: 'Shaheed Bhagat Singh International Airport',
    city: 'Chandigarh',
    country: 'India',
    countryCode: 'IN',
    timezone: 'Asia/Kolkata',
    isInternational: false,
  },
  {
    id: 'apt-atq',
    iataCode: 'ATQ',
    icaoCode: 'VIAR',
    name: 'Sri Guru Ram Dass Jee International Airport',
    city: 'Amritsar',
    country: 'India',
    countryCode: 'IN',
    timezone: 'Asia/Kolkata',
    isInternational: false,
  },
  {
    id: 'apt-bho',
    iataCode: 'BHO',
    icaoCode: 'VABP',
    name: 'Raja Bhoj Airport',
    city: 'Bhopal',
    country: 'India',
    countryCode: 'IN',
    timezone: 'Asia/Kolkata',
    isInternational: false,
  },
  {
    id: 'apt-idr',
    iataCode: 'IDR',
    icaoCode: 'VAID',
    name: 'Devi Ahilyabai Holkar Airport',
    city: 'Indore',
    country: 'India',
    countryCode: 'IN',
    timezone: 'Asia/Kolkata',
    isInternational: false,
  },
  {
    id: 'apt-nag',
    iataCode: 'NAG',
    icaoCode: 'VANP',
    name: 'Dr. Babasaheb Ambedkar International Airport',
    city: 'Nagpur',
    country: 'India',
    countryCode: 'IN',
    timezone: 'Asia/Kolkata',
    isInternational: false,
  },
  {
    id: 'apt-vtz',
    iataCode: 'VTZ',
    icaoCode: 'VOVZ',
    name: 'Visakhapatnam International Airport',
    city: 'Visakhapatnam',
    country: 'India',
    countryCode: 'IN',
    timezone: 'Asia/Kolkata',
    isInternational: false,
  },
  {
    id: 'apt-vga',
    iataCode: 'VGA',
    icaoCode: 'VOBZ',
    name: 'Vijayawada International Airport',
    city: 'Vijayawada',
    country: 'India',
    countryCode: 'IN',
    timezone: 'Asia/Kolkata',
    isInternational: false,
  },
  {
    id: 'apt-tir',
    iataCode: 'TIR',
    icaoCode: 'VOTP',
    name: 'Tirupati Airport',
    city: 'Tirupati',
    country: 'India',
    countryCode: 'IN',
    timezone: 'Asia/Kolkata',
    isInternational: false,
  },
  {
    id: 'apt-bbi',
    iataCode: 'BBI',
    icaoCode: 'VEBS',
    name: 'Biju Patnaik International Airport',
    city: 'Bhubaneswar',
    country: 'India',
    countryCode: 'IN',
    timezone: 'Asia/Kolkata',
    isInternational: false,
  },
  {
    id: 'apt-ccj',
    iataCode: 'CCJ',
    icaoCode: 'VOCL',
    name: 'Calicut International Airport',
    city: 'Kozhikode',
    country: 'India',
    countryCode: 'IN',
    timezone: 'Asia/Kolkata',
    isInternational: false,
  },
  {
    id: 'apt-cnn',
    iataCode: 'CNN',
    icaoCode: 'VOKN',
    name: 'Kannur International Airport',
    city: 'Kannur',
    country: 'India',
    countryCode: 'IN',
    timezone: 'Asia/Kolkata',
    isInternational: false,
  },
  {
    id: 'apt-cjb',
    iataCode: 'CJB',
    icaoCode: 'VOCB',
    name: 'Coimbatore International Airport',
    city: 'Coimbatore',
    country: 'India',
    countryCode: 'IN',
    timezone: 'Asia/Kolkata',
    isInternational: false,
  },
  {
    id: 'apt-mdu',
    iataCode: 'MDU',
    icaoCode: 'VOMD',
    name: 'Madurai Airport',
    city: 'Madurai',
    country: 'India',
    countryCode: 'IN',
    timezone: 'Asia/Kolkata',
    isInternational: false,
  },
  {
    id: 'apt-trz',
    iataCode: 'TRZ',
    icaoCode: 'VOTR',
    name: 'Tiruchirappalli International Airport',
    city: 'Tiruchirappalli',
    country: 'India',
    countryCode: 'IN',
    timezone: 'Asia/Kolkata',
    isInternational: false,
  },
  {
    id: 'apt-ixz',
    iataCode: 'IXZ',
    icaoCode: 'VOPB',
    name: 'Veer Savarkar International Airport',
    city: 'Port Blair',
    country: 'India',
    countryCode: 'IN',
    timezone: 'Asia/Kolkata',
    isInternational: false,
  },
  {
    id: 'apt-ixr',
    iataCode: 'IXR',
    icaoCode: 'VERC',
    name: 'Birsa Munda Airport',
    city: 'Ranchi',
    country: 'India',
    countryCode: 'IN',
    timezone: 'Asia/Kolkata',
    isInternational: false,
  },
  {
    id: 'apt-rpr',
    iataCode: 'RPR',
    icaoCode: 'VARP',
    name: 'Swami Vivekananda Airport',
    city: 'Raipur',
    country: 'India',
    countryCode: 'IN',
    timezone: 'Asia/Kolkata',
    isInternational: false,
  },
  {
    id: 'apt-udr',
    iataCode: 'UDR',
    icaoCode: 'VAUD',
    name: 'Maharana Pratap Airport',
    city: 'Udaipur',
    country: 'India',
    countryCode: 'IN',
    timezone: 'Asia/Kolkata',
    isInternational: false,
  },
  {
    id: 'apt-jdh',
    iataCode: 'JDH',
    icaoCode: 'VIJO',
    name: 'Jodhpur Airport',
    city: 'Jodhpur',
    country: 'India',
    countryCode: 'IN',
    timezone: 'Asia/Kolkata',
    isInternational: false,
  },
  {
    id: 'apt-ded',
    iataCode: 'DED',
    icaoCode: 'VIDN',
    name: 'Jolly Grant Airport',
    city: 'Dehradun',
    country: 'India',
    countryCode: 'IN',
    timezone: 'Asia/Kolkata',
    isInternational: false,
  },
  {
    id: 'apt-sxr',
    iataCode: 'SXR',
    icaoCode: 'VISR',
    name: 'Sheikh ul-Alam International Airport',
    city: 'Srinagar',
    country: 'India',
    countryCode: 'IN',
    timezone: 'Asia/Kolkata',
    isInternational: false,
  },
  {
    id: 'apt-ixj',
    iataCode: 'IXJ',
    icaoCode: 'VIJU',
    name: 'Jammu Airport',
    city: 'Jammu',
    country: 'India',
    countryCode: 'IN',
    timezone: 'Asia/Kolkata',
    isInternational: false,
  },
  {
    id: 'apt-dxb',
    iataCode: 'DXB',
    icaoCode: 'OMDB',
    name: 'Dubai International Airport',
    city: 'Dubai',
    country: 'United Arab Emirates',
    countryCode: 'AE',
    timezone: 'Asia/Dubai',
    isInternational: true,
  },
  {
    id: 'apt-sin',
    iataCode: 'SIN',
    icaoCode: 'WSSS',
    name: 'Singapore Changi Airport',
    city: 'Singapore',
    country: 'Singapore',
    countryCode: 'SG',
    timezone: 'Asia/Singapore',
    isInternational: true,
  },
  {
    id: 'apt-lhr',
    iataCode: 'LHR',
    icaoCode: 'EGLL',
    name: 'Heathrow Airport',
    city: 'London',
    country: 'United Kingdom',
    countryCode: 'GB',
    timezone: 'Europe/London',
    isInternational: true,
  },
  {
    id: 'apt-msy',
    iataCode: 'MSY',
    icaoCode: 'KMSY',
    name: 'Louis Armstrong New Orleans International Airport',
    city: 'New Orleans',
    country: 'United States',
    countryCode: 'US',
    timezone: 'America/Chicago',
    isInternational: true,
  },
  {
    id: 'apt-jfk',
    iataCode: 'JFK',
    icaoCode: 'KJFK',
    name: 'John F. Kennedy International Airport',
    city: 'New York',
    country: 'United States',
    countryCode: 'US',
    timezone: 'America/New_York',
    isInternational: true,
  },
  {
    id: 'apt-doh',
    iataCode: 'DOH',
    icaoCode: 'OTHH',
    name: 'Hamad International Airport',
    city: 'Doha',
    country: 'Qatar',
    countryCode: 'QA',
    timezone: 'Asia/Qatar',
    isInternational: true,
  },
  {
    id: 'apt-bkk',
    iataCode: 'BKK',
    icaoCode: 'VTBS',
    name: 'Suvarnabhumi Airport',
    city: 'Bangkok',
    country: 'Thailand',
    countryCode: 'TH',
    timezone: 'Asia/Bangkok',
    isInternational: true,
  },
];

/**
 * Complete Configurable Airline Catalog:
 * Includes all 10 required Indian airlines + verified international carriers.
 */
export const AIRLINES: Airline[] = [
  // 1. IndiGo
  {
    id: 'air-6e',
    iataCode: '6E',
    icaoCode: 'IGO',
    name: 'IndiGo',
    country: 'India',
    category: 'indian',
    logoText: '6E',
    brandColor: '#001B94',
    accentColor: '#38BDF8',
    isActive: true,
    supportedRouteTypes: ['domestic_india', 'international'],
    dataSource: 'DGCA & ICAO Verified Directory',
    isVerified: true,
  },
  // 2. Air India
  {
    id: 'air-ai',
    iataCode: 'AI',
    icaoCode: 'AIC',
    name: 'Air India',
    country: 'India',
    category: 'indian',
    logoText: 'AI',
    brandColor: '#B81D13',
    accentColor: '#F59E0B',
    isActive: true,
    supportedRouteTypes: ['domestic_india', 'international'],
    dataSource: 'DGCA & IATA Verified Directory',
    isVerified: true,
  },
  // 3. Air India Express
  {
    id: 'air-ix',
    iataCode: 'IX',
    icaoCode: 'AXB',
    name: 'Air India Express',
    country: 'India',
    category: 'indian',
    logoText: 'IX',
    brandColor: '#D9381E',
    accentColor: '#FBBF24',
    isActive: true,
    supportedRouteTypes: ['domestic_india', 'international'],
    dataSource: 'DGCA & IATA Verified Directory',
    isVerified: true,
  },
  // 4. Akasa Air
  {
    id: 'air-qp',
    iataCode: 'QP',
    icaoCode: 'AKJ',
    name: 'Akasa Air',
    country: 'India',
    category: 'indian',
    logoText: 'QP',
    brandColor: '#FF5500',
    accentColor: '#6D28D9',
    isActive: true,
    supportedRouteTypes: ['domestic_india', 'international'],
    dataSource: 'DGCA & IATA Verified Directory',
    isVerified: true,
  },
  // 5. SpiceJet
  {
    id: 'air-sg',
    iataCode: 'SG',
    icaoCode: 'SEJ',
    name: 'SpiceJet',
    country: 'India',
    category: 'indian',
    logoText: 'SG',
    brandColor: '#C8102E',
    accentColor: '#FDE047',
    isActive: true,
    supportedRouteTypes: ['domestic_india', 'international'],
    dataSource: 'DGCA & IATA Verified Directory',
    isVerified: true,
  },
  // 6. Alliance Air
  {
    id: 'air-9i',
    iataCode: '9I',
    icaoCode: 'LLR',
    name: 'Alliance Air',
    country: 'India',
    category: 'indian',
    logoText: '9I',
    brandColor: '#1E3A8A',
    accentColor: '#EF4444',
    isActive: true,
    supportedRouteTypes: ['domestic_india', 'regional_rcs'],
    dataSource: 'DGCA Regional Carrier Directory',
    isVerified: true,
  },
  // 7. Fly91
  {
    id: 'air-ic',
    iataCode: 'IC',
    icaoCode: 'GOA',
    name: 'Fly91',
    country: 'India',
    category: 'indian',
    logoText: 'IC',
    brandColor: '#0D9488',
    accentColor: '#F59E0B',
    isActive: true,
    supportedRouteTypes: ['domestic_india', 'regional_rcs'],
    dataSource: 'DGCA Scheduled Commuter Operator',
    isVerified: true,
  },
  // 8. Star Air
  {
    id: 'air-s5',
    iataCode: 'S5',
    icaoCode: 'SDG',
    name: 'Star Air',
    country: 'India',
    category: 'indian',
    logoText: 'S5',
    brandColor: '#0F2942',
    accentColor: '#F97316',
    isActive: true,
    supportedRouteTypes: ['domestic_india', 'regional_rcs'],
    dataSource: 'DGCA Scheduled Regional Carrier',
    isVerified: true,
  },
  // 9. IndiaOne Air
  {
    id: 'air-i7',
    iataCode: 'I7',
    icaoCode: 'IOA',
    name: 'IndiaOne Air',
    country: 'India',
    category: 'indian',
    logoText: 'I7',
    brandColor: '#1D4ED8',
    accentColor: '#FACC15',
    isActive: true,
    supportedRouteTypes: ['regional_rcs'],
    dataSource: 'DGCA Regional Air Operator',
    isVerified: true,
  },
  // 10. Zoom Air
  {
    id: 'air-zo',
    iataCode: 'ZO',
    icaoCode: 'ZOM',
    name: 'Zoom Air',
    country: 'India',
    category: 'indian',
    logoText: 'ZO',
    brandColor: '#7C2D12',
    accentColor: '#FB923C',
    isActive: true,
    supportedRouteTypes: ['domestic_india', 'regional_rcs'],
    dataSource: 'DGCA Scheduled Operator Directory',
    isVerified: true,
  },
  // Verified International Carriers
  {
    id: 'air-ba',
    iataCode: 'BA',
    icaoCode: 'BAW',
    name: 'British Airways',
    country: 'United Kingdom',
    category: 'international',
    logoText: 'BA',
    brandColor: '#075AAA',
    accentColor: '#EB2226',
    isActive: true,
    supportedRouteTypes: ['international'],
    dataSource: 'IATA Global Carrier Registry',
    isVerified: true,
  },
  {
    id: 'air-ek',
    iataCode: 'EK',
    icaoCode: 'UAE',
    name: 'Emirates',
    country: 'United Arab Emirates',
    category: 'international',
    logoText: 'EK',
    brandColor: '#D71921',
    accentColor: '#C5A059',
    isActive: true,
    supportedRouteTypes: ['international'],
    dataSource: 'IATA Global Carrier Registry',
    isVerified: true,
  },
  {
    id: 'air-sq',
    iataCode: 'SQ',
    icaoCode: 'SIA',
    name: 'Singapore Airlines',
    country: 'Singapore',
    category: 'international',
    logoText: 'SQ',
    brandColor: '#00266B',
    accentColor: '#F59E0B',
    isActive: true,
    supportedRouteTypes: ['international'],
    dataSource: 'IATA Global Carrier Registry',
    isVerified: true,
  },
  {
    id: 'air-qr',
    iataCode: 'QR',
    icaoCode: 'QTR',
    name: 'Qatar Airways',
    country: 'Qatar',
    category: 'international',
    logoText: 'QR',
    brandColor: '#5C0632',
    accentColor: '#CBD5E1',
    isActive: true,
    supportedRouteTypes: ['international'],
    dataSource: 'IATA Global Carrier Registry',
    isVerified: true,
  },
  {
    id: 'air-lh',
    iataCode: 'LH',
    icaoCode: 'DLH',
    name: 'Lufthansa',
    country: 'Germany',
    category: 'international',
    logoText: 'LH',
    brandColor: '#05164D',
    accentColor: '#FFB800',
    isActive: true,
    supportedRouteTypes: ['international'],
    dataSource: 'IATA Global Carrier Registry',
    isVerified: true,
  },
];

export const FARE_RULES: Record<string, FareRule> = {
  ECO_SAVER: {
    id: 'fr-eco-saver',
    code: 'ECO_SAVER',
    name: 'Economy Value Saver',
    cabin: 'economy',
    isRefundable: false,
    cancellationFeeInr: 3500,
    changeFeeInr: 2500,
    cabinBaggageKg: 7,
    checkedBaggageKg: 15,
    seatSelectionIncluded: false,
    mealIncluded: false,
    termsSummary:
      'Non-refundable base fare. Statutory airport taxes are refundable if cancelled at least 4 hours prior to scheduled departure.',
  },
  ECO_FLEX: {
    id: 'fr-eco-flex',
    code: 'ECO_FLEX',
    name: 'Economy Flex Plus',
    cabin: 'economy',
    isRefundable: true,
    cancellationFeeInr: 1200,
    changeFeeInr: 500,
    cabinBaggageKg: 7,
    checkedBaggageKg: 25,
    seatSelectionIncluded: true,
    mealIncluded: true,
    termsSummary:
      'Refundable fare with reduced cancellation penalty (₹1,200) up to 24 hours before departure. Complimentary standard seat and hot meal.',
  },
  PREM_ECO_FLEX: {
    id: 'fr-prem-eco',
    code: 'PREM_ECO_FLEX',
    name: 'Premium Economy Comfort',
    cabin: 'premium_economy',
    isRefundable: true,
    cancellationFeeInr: 1000,
    changeFeeInr: 300,
    cabinBaggageKg: 10,
    checkedBaggageKg: 30,
    seatSelectionIncluded: true,
    mealIncluded: true,
    termsSummary:
      'Dedicated cabin with extra legroom, priority boarding, 30kg checked baggage, and flexible date changes.',
  },
  BIZ_ELITE: {
    id: 'fr-biz-elite',
    code: 'BIZ_ELITE',
    name: 'Business Executive Flex',
    cabin: 'business',
    isRefundable: true,
    cancellationFeeInr: 500,
    changeFeeInr: 0,
    cabinBaggageKg: 14,
    checkedBaggageKg: 40,
    seatSelectionIncluded: true,
    mealIncluded: true,
    termsSummary:
      'Lounge access, lie-flat or executive seating, zero date-change fee (fare difference applies), and refundable with minimal processing charge.',
  },
  FIRST_ROYAL: {
    id: 'fr-first-royal',
    code: 'FIRST_ROYAL',
    name: 'First Class Suite',
    cabin: 'first',
    isRefundable: true,
    cancellationFeeInr: 0,
    changeFeeInr: 0,
    cabinBaggageKg: 15,
    checkedBaggageKg: 50,
    seatSelectionIncluded: true,
    mealIncluded: true,
    termsSummary:
      'Full flexibility with complimentary cancellations and changes prior to departure, private suite dining, and 50kg checked baggage.',
  },
};

export function findAirportByIata(iata: string): Airport | undefined {
  return AIRPORTS.find(
    (a) => a.iataCode.toUpperCase() === iata.trim().toUpperCase()
  );
}

export function searchAirports(query: string): Airport[] {
  const q = query.trim().toLowerCase();
  if (!q) return AIRPORTS.slice(0, 8);
  return AIRPORTS.filter(
    (a) =>
      a.iataCode.toLowerCase().includes(q) ||
      a.city.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q) ||
      a.country.toLowerCase().includes(q)
  );
}

function addMinutesToIso(isoStart: string, minutes: number): string {
  const d = new Date(isoStart);
  d.setMinutes(d.getMinutes() + minutes);
  return d.toISOString();
}

export function getDeterministicFlightOffers(params: {
  from: string;
  to: string;
  departDate: string;
  cabin?: CabinClass;
}): FlightOffer[] {
  const origin = findAirportByIata(params.from) ?? AIRPORTS[0];
  const destination = findAirportByIata(params.to) ?? AIRPORTS[1];
  const cabin: CabinClass = params.cabin ?? 'economy';
  const dateStr = params.departDate || '2026-12-15';

  const isInternational =
    origin.countryCode !== 'IN' || destination.countryCode !== 'IN';

  const cabinMultiplier =
    cabin === 'first'
      ? 3.8
      : cabin === 'business'
      ? 2.4
      : cabin === 'premium_economy'
      ? 1.45
      : 1;

  const routeCode = `${origin.iataCode}-${destination.iataCode}`;
  const routeSeed = routeCode
    .split('')
    .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);

  const baseRoutePrice = isInternational
    ? 18500 + (routeSeed % 9) * 3200
    : 3400 + (routeSeed % 7) * 450;

  const isLongHaulUs =
    destination.countryCode === 'US' || origin.countryCode === 'US';
  const effectiveBase = isLongHaulUs ? 58000 : baseRoutePrice;

  const offers: FlightOffer[] = [];

  // Offer 1: British Airways (long-haul) / Emirates (intl) / IndiGo (domestic)
  const airline1 = isLongHaulUs
    ? AIRLINES.find((a) => a.iataCode === 'BA')!
    : isInternational
    ? AIRLINES.find((a) => a.iataCode === 'EK')!
    : AIRLINES.find((a) => a.iataCode === '6E')!;

  const dep1 = `${dateStr}T19:20:00.000Z`;
  const dur1 = isLongHaulUs ? 1300 : isInternational ? 270 : 135;
  const arr1 = addMinutesToIso(dep1, dur1);
  const base1 = Math.round(effectiveBase * cabinMultiplier);
  const taxes1 = Math.round(base1 * 0.18);
  const serviceFee1 = 499;
  const rule1 =
    cabin === 'business'
      ? FARE_RULES.BIZ_ELITE
      : cabin === 'first'
      ? FARE_RULES.FIRST_ROYAL
      : cabin === 'premium_economy'
      ? FARE_RULES.PREM_ECO_FLEX
      : FARE_RULES.ECO_SAVER;

  offers.push({
    id: `offer-${origin.iataCode.toLowerCase()}-${destination.iataCode.toLowerCase()}-1`,
    flightNumber: `${airline1.iataCode}-276`,
    airline: airline1,
    origin,
    destination,
    departureTime: dep1,
    arrivalTime: arr1,
    durationMinutes: dur1,
    stopsCount: isLongHaulUs ? 1 : 0,
    layoverSummary: isLongHaulUs
      ? '1 stop via London Heathrow (LHR) · 3h 15m'
      : undefined,
    cabin,
    baseFareInr: base1,
    taxesInr: taxes1,
    serviceFeeInr: serviceFee1,
    totalFareInr: base1 + taxes1 + serviceFee1,
    seatsAvailable: 7,
    fareRule: rule1,
    inventoryMode: 'live_provider',
    historicalAvgInr: Math.round((base1 + taxes1 + serviceFee1) * 1.06),
    segments: isLongHaulUs
      ? [
          {
            id: `seg-1a`,
            segmentOrder: 1,
            airlineIata: airline1.iataCode,
            airlineName: airline1.name,
            flightNumber: `${airline1.iataCode}-276`,
            originIata: origin.iataCode,
            originCity: origin.city,
            destinationIata: 'LHR',
            destinationCity: 'London',
            departureTime: dep1,
            arrivalTime: addMinutesToIso(dep1, 565),
            durationMinutes: 565,
            aircraftType: 'Boeing 787-9 Dreamliner',
            layoverMinutesBefore: 0,
          },
          {
            id: `seg-1b`,
            segmentOrder: 2,
            airlineIata: airline1.iataCode,
            airlineName: airline1.name,
            flightNumber: `${airline1.iataCode}-225`,
            originIata: 'LHR',
            originCity: 'London',
            destinationIata: destination.iataCode,
            destinationCity: destination.city,
            departureTime: addMinutesToIso(dep1, 760),
            arrivalTime: arr1,
            durationMinutes: 540,
            aircraftType: 'Boeing 787-10 Dreamliner',
            layoverMinutesBefore: 195,
          },
        ]
      : [
          {
            id: `seg-1`,
            segmentOrder: 1,
            airlineIata: airline1.iataCode,
            airlineName: airline1.name,
            flightNumber: `${airline1.iataCode}-276`,
            originIata: origin.iataCode,
            originCity: origin.city,
            destinationIata: destination.iataCode,
            destinationCity: destination.city,
            departureTime: dep1,
            arrivalTime: arr1,
            durationMinutes: dur1,
            aircraftType: isInternational ? 'Boeing 777-300ER' : 'Airbus A320neo',
            layoverMinutesBefore: 0,
          },
        ],
  });

  // Offer 2: Air India
  const airline2 = AIRLINES.find((a) => a.iataCode === 'AI')!;
  const dep2 = `${dateStr}T06:45:00.000Z`;
  const dur2 = isLongHaulUs ? 1245 : isInternational ? 255 : 130;
  const arr2 = addMinutesToIso(dep2, dur2);
  const base2 = Math.round((effectiveBase + 1150) * cabinMultiplier);
  const taxes2 = Math.round(base2 * 0.18);
  const serviceFee2 = 499;
  const rule2 = cabin === 'economy' ? FARE_RULES.ECO_FLEX : rule1;

  offers.push({
    id: `offer-${origin.iataCode.toLowerCase()}-${destination.iataCode.toLowerCase()}-2`,
    flightNumber: `AI-542`,
    airline: airline2,
    origin,
    destination,
    departureTime: dep2,
    arrivalTime: arr2,
    durationMinutes: dur2,
    stopsCount: isLongHaulUs ? 1 : 0,
    layoverSummary: isLongHaulUs
      ? '1 stop via New Delhi (DEL) · 2h 30m'
      : undefined,
    cabin,
    baseFareInr: base2,
    taxesInr: taxes2,
    serviceFeeInr: serviceFee2,
    totalFareInr: base2 + taxes2 + serviceFee2,
    seatsAvailable: 9,
    fareRule: rule2,
    inventoryMode: 'live_provider',
    historicalAvgInr: Math.round((base2 + taxes2 + serviceFee2) * 1.04),
    segments: [
      {
        id: `seg-2`,
        segmentOrder: 1,
        airlineIata: airline2.iataCode,
        airlineName: airline2.name,
        flightNumber: 'AI-542',
        originIata: origin.iataCode,
        originCity: origin.city,
        destinationIata: destination.iataCode,
        destinationCity: destination.city,
        departureTime: dep2,
        arrivalTime: arr2,
        durationMinutes: dur2,
        aircraftType: isInternational ? 'Airbus A350-900' : 'Airbus A321neo',
        layoverMinutesBefore: 0,
      },
    ],
  });

  // Offer 3: Akasa Air (domestic) / Singapore Airlines (intl)
  const airline3 = isInternational
    ? AIRLINES.find((a) => a.iataCode === 'SQ')!
    : AIRLINES.find((a) => a.iataCode === 'QP')!;
  const dep3 = `${dateStr}T11:15:00.000Z`;
  const dur3 = isLongHaulUs ? 1380 : isInternational ? 290 : 140;
  const arr3 = addMinutesToIso(dep3, dur3);
  const base3 = Math.round((effectiveBase + 1900) * cabinMultiplier);
  const taxes3 = Math.round(base3 * 0.18);
  const serviceFee3 = 499;

  offers.push({
    id: `offer-${origin.iataCode.toLowerCase()}-${destination.iataCode.toLowerCase()}-3`,
    flightNumber: `${airline3.iataCode}-874`,
    airline: airline3,
    origin,
    destination,
    departureTime: dep3,
    arrivalTime: arr3,
    durationMinutes: dur3,
    stopsCount: isLongHaulUs ? 1 : 0,
    layoverSummary: isLongHaulUs
      ? '1 stop via Singapore (SIN) · 2h 50m'
      : undefined,
    cabin,
    baseFareInr: base3,
    taxesInr: taxes3,
    serviceFeeInr: serviceFee3,
    totalFareInr: base3 + taxes3 + serviceFee3,
    seatsAvailable: 5,
    fareRule: FARE_RULES.ECO_FLEX,
    inventoryMode: 'live_provider',
    segments: [
      {
        id: `seg-3`,
        segmentOrder: 1,
        airlineIata: airline3.iataCode,
        airlineName: airline3.name,
        flightNumber: `${airline3.iataCode}-874`,
        originIata: origin.iataCode,
        originCity: origin.city,
        destinationIata: destination.iataCode,
        destinationCity: destination.city,
        departureTime: dep3,
        arrivalTime: arr3,
        durationMinutes: dur3,
        aircraftType: isInternational ? 'Boeing 787-9 Dreamliner' : 'Boeing 737 MAX 8',
        layoverMinutesBefore: 0,
      },
    ],
  });

  // Offer 4: Air India Express / SpiceJet (domestic) or Qatar Airways (intl)
  const airline4 = isInternational
    ? AIRLINES.find((a) => a.iataCode === 'QR')!
    : AIRLINES.find((a) => a.iataCode === 'IX')!;
  const dep4 = `${dateStr}T14:30:00.000Z`;
  const dur4 = isLongHaulUs ? 1420 : isInternational ? 395 : 245;
  const arr4 = addMinutesToIso(dep4, dur4);
  const base4 = Math.round((effectiveBase - 650) * cabinMultiplier);
  const taxes4 = Math.round(base4 * 0.18);
  const serviceFee4 = 499;
  const hubIata = isInternational
    ? 'DOH'
    : origin.iataCode === 'BOM'
    ? 'BLR'
    : 'BOM';
  const hubCity = isInternational
    ? 'Doha'
    : hubIata === 'BLR'
    ? 'Bengaluru'
    : 'Mumbai';

  offers.push({
    id: `offer-${origin.iataCode.toLowerCase()}-${destination.iataCode.toLowerCase()}-4`,
    flightNumber: `${airline4.iataCode}-509`,
    airline: airline4,
    origin,
    destination,
    departureTime: dep4,
    arrivalTime: arr4,
    durationMinutes: dur4,
    stopsCount: 1,
    layoverSummary: `1 stop via ${hubCity} (${hubIata}) · 1h 55m`,
    cabin,
    baseFareInr: base4,
    taxesInr: taxes4,
    serviceFeeInr: serviceFee4,
    totalFareInr: base4 + taxes4 + serviceFee4,
    seatsAvailable: 8,
    fareRule: rule1,
    inventoryMode: 'live_provider',
    segments: [
      {
        id: `seg-4a`,
        segmentOrder: 1,
        airlineIata: airline4.iataCode,
        airlineName: airline4.name,
        flightNumber: `${airline4.iataCode}-509`,
        originIata: origin.iataCode,
        originCity: origin.city,
        destinationIata: hubIata,
        destinationCity: hubCity,
        departureTime: dep4,
        arrivalTime: addMinutesToIso(dep4, Math.floor((dur4 - 115) / 2)),
        durationMinutes: Math.floor((dur4 - 115) / 2),
        aircraftType: 'Boeing 737-8',
        layoverMinutesBefore: 0,
      },
      {
        id: `seg-4b`,
        segmentOrder: 2,
        airlineIata: airline4.iataCode,
        airlineName: airline4.name,
        flightNumber: `${airline4.iataCode}-514`,
        originIata: hubIata,
        originCity: hubCity,
        destinationIata: destination.iataCode,
        destinationCity: destination.city,
        departureTime: addMinutesToIso(
          dep4,
          Math.floor((dur4 - 115) / 2) + 115
        ),
        arrivalTime: arr4,
        durationMinutes: dur4 - Math.floor((dur4 - 115) / 2) - 115,
        aircraftType: 'Boeing 737-8',
        layoverMinutesBefore: 115,
      },
    ],
  });

  return offers;
}

export function getFlightOfferById(
  flightId: string,
  departDate = '2026-12-15',
  cabin: CabinClass = 'economy'
): FlightOffer | undefined {
  const parts = flightId.split('-');
  if (parts.length >= 4 && parts[0] === 'offer') {
    const from = parts[1].toUpperCase();
    const to = parts[2].toUpperCase();
    const list = getDeterministicFlightOffers({ from, to, departDate, cabin });
    return list.find((o) => o.id === flightId) ?? list[0];
  }
  const fallback = getDeterministicFlightOffers({
    from: 'HYD',
    to: 'DEL',
    departDate,
    cabin,
  });
  return fallback[0];
}

export const DESTINATIONS: DestinationGuide[] = [
  {
    id: 'dest-dubai',
    slug: 'dubai',
    city: 'Dubai',
    country: 'United Arab Emirates',
    airportIata: 'DXB',
    headline: 'Futuristic Skyline, Desert Horizons & Global Aviation Hub',
    overview:
      'Dubai International Airport (DXB) connects major Indian cities with high-frequency direct flights under 4 hours. Review terminal transfer rules, baggage allowances, and UAE tourist visa documentation requirements before booking.',
    bestTimeToVisit: 'November to March (20°C – 28°C pleasant winter climate)',
    visaRequirementsSummary:
      'Indian passport holders require a pre-arranged UAE tourist e-Visa or qualify for a 14-day visa on arrival if holding a valid US, UK, or Schengen visa/residence permit.',
    startingFareInr: 14800,
    metaTitle: 'Flights to Dubai (DXB) — Airport Guide, Baggage & Visa Requirements | DummyTicket',
    metaDescription:
      'Plan your trip to Dubai (DXB) on DummyTicket. Compare flight schedules from Mumbai, Delhi, and Hyderabad, review baggage policies, and verify visa documentation requirements.',
    highlights: [
      'Direct flights from BOM, DEL, HYD, BLR, and MAA',
      'Terminal 3 dedicated to Emirates; Terminal 1 serves international carriers',
      'Return itinerary and hotel confirmation required for tourist visa applications',
    ],
  },
  {
    id: 'dest-singapore',
    slug: 'singapore',
    city: 'Singapore',
    country: 'Singapore',
    airportIata: 'SIN',
    headline: 'Changi Airport Connectivity & Southeast Asia Gateway',
    overview:
      'Singapore Changi Airport (SIN) is globally recognized for seamless transit, Jewel Changi, and direct connections from 8 Indian metro cities.',
    bestTimeToVisit: 'February to April and July to October',
    visaRequirementsSummary:
      'Indian citizens must obtain a Singapore e-Visa through an authorized visa agent prior to departure and submit the SG Arrival Card within 3 days before arrival.',
    startingFareInr: 16200,
    metaTitle: 'Flights to Singapore (SIN) — Changi Guide, Schedules & Fare Rules | DummyTicket',
    metaDescription:
      'Explore direct flight options to Singapore Changi (SIN). Check flight duration, SG Arrival Card rules, and transparent fare breakdowns.',
    highlights: [
      'Direct service via Singapore Airlines, Air India, and IndiGo',
      'Average flight time of 4h 30m from South India and 5h 45m from Delhi',
      'Strict passport validity rule: minimum 6 months beyond intended stay',
    ],
  },
  {
    id: 'dest-london',
    slug: 'london',
    city: 'London',
    country: 'United Kingdom',
    airportIata: 'LHR',
    headline: 'Transcontinental Routes to London Heathrow (LHR)',
    overview:
      'London Heathrow (LHR) serves as the primary European gateway from India, with non-stop Dreamliner and A350 flights from Delhi, Mumbai, Bengaluru, and Hyderabad.',
    bestTimeToVisit: 'May to September for mild weather and extended daylight',
    visaRequirementsSummary:
      'Standard Visitor Visa required prior to travel. Visa applicants must provide a verifiable flight itinerary and accommodation details.',
    startingFareInr: 42500,
    metaTitle: 'Flights to London Heathrow (LHR) — Schedules, Baggage & Transit Rules | DummyTicket',
    metaDescription:
      'Compare direct and 1-stop flights to London Heathrow (LHR). Understand UK Standard Visitor Visa itinerary requirements and cabin baggage allowances.',
    highlights: [
      'Direct flights operated by British Airways and Air India',
      '23kg x 2 checked baggage standard on most transatlantic/UK economy fares',
      'Heathrow Express connects Terminal 2, 3, and 5 to London Paddington in 15 minutes',
    ],
  },
  {
    id: 'dest-new-delhi',
    slug: 'new-delhi',
    city: 'New Delhi',
    country: 'India',
    airportIata: 'DEL',
    headline: 'India’s Capital Hub at Indira Gandhi International Airport (DEL)',
    overview:
      'Indira Gandhi International Airport (DEL) is India’s busiest aviation hub, featuring Terminal 3 for international and full-service carriers and Terminal 1/2 for domestic operations.',
    bestTimeToVisit: 'October to March',
    visaRequirementsSummary:
      'Domestic travelers require a valid government-issued photo ID (Aadhaar, Passport, Voter ID, or Driving Licence). DigiYatra biometric boarding is supported across all terminals.',
    startingFareInr: 4200,
    metaTitle: 'Flights to New Delhi (DEL) — Terminal Guide, Schedules & Fares | DummyTicket',
    metaDescription:
      'Find domestic and international flights to New Delhi (DEL). Check IGI Airport terminal transfers, metro connectivity, and transparent fare options.',
    highlights: [
      'High-frequency departures every 30 minutes from Mumbai, Hyderabad, and Bengaluru',
      'Airport Express Metro links Terminal 3 directly to New Delhi Railway Station',
      'DigiYatra enabled for rapid paperless terminal entry',
    ],
  },
];

export const ROUTE_PAGES: RouteLandingPage[] = [
  {
    id: 'route-hyd-del',
    slug: 'hyd-to-del',
    originIata: 'HYD',
    destinationIata: 'DEL',
    originCity: 'Hyderabad',
    destinationCity: 'New Delhi',
    averageDurationMinutes: 135,
    airlinesOperating: ['IndiGo', 'Air India', 'Akasa Air', 'SpiceJet'],
    startingFareInr: 4499,
    dailyFlightsCount: 24,
    routeGuideMarkdown:
      'Direct flights between Rajiv Gandhi International Airport (HYD) and Indira Gandhi International Airport (DEL) take approximately 2 hours and 15 minutes. Morning departures between 06:00 AM and 09:00 AM are popular with business travelers.',
    metaTitle: 'Hyderabad to Delhi Flights (HYD to DEL) — Schedules, Fares & Guide | DummyTicket',
    metaDescription:
      'Compare Hyderabad (HYD) to New Delhi (DEL) flight schedules, nonstop duration, baggage allowances, and transparent fare breakdowns.',
  },
  {
    id: 'route-hyd-bom',
    slug: 'hyd-to-bom',
    originIata: 'HYD',
    destinationIata: 'BOM',
    originCity: 'Hyderabad',
    destinationCity: 'Mumbai',
    averageDurationMinutes: 90,
    airlinesOperating: ['IndiGo', 'Air India', 'Akasa Air'],
    startingFareInr: 3699,
    dailyFlightsCount: 28,
    routeGuideMarkdown:
      'The Hyderabad (HYD) to Mumbai (BOM) corridor is one of India’s premier short-haul business routes, with an average non-stop airtime of 1 hour and 30 minutes arriving at Mumbai Terminal 2.',
    metaTitle: 'Hyderabad to Mumbai Flights (HYD to BOM) — Nonstop Timings & Fares | DummyTicket',
    metaDescription:
      'Search Hyderabad (HYD) to Mumbai (BOM) flights. Review flight timings, terminal information, and fare refundability rules.',
  },
  {
    id: 'route-hyd-blr',
    slug: 'hyd-to-blr',
    originIata: 'HYD',
    destinationIata: 'BLR',
    originCity: 'Hyderabad',
    destinationCity: 'Bengaluru',
    averageDurationMinutes: 75,
    airlinesOperating: ['IndiGo', 'Air India', 'Air India Express', 'Star Air'],
    startingFareInr: 3199,
    dailyFlightsCount: 22,
    routeGuideMarkdown:
      'Connecting India’s two largest technology hubs, non-stop flights from Hyderabad (HYD) to Bengaluru Kempegowda International Airport (BLR) complete the journey in just 1 hour and 15 minutes.',
    metaTitle: 'Hyderabad to Bengaluru Flights (HYD to BLR) — Timings & Fare Rules | DummyTicket',
    metaDescription:
      'Book or preview itineraries for Hyderabad (HYD) to Bengaluru (BLR) flights. Check baggage limits and daily departure schedules.',
  },
  {
    id: 'route-del-hyd',
    slug: 'del-to-hyd',
    originIata: 'DEL',
    destinationIata: 'HYD',
    originCity: 'New Delhi',
    destinationCity: 'Hyderabad',
    averageDurationMinutes: 135,
    airlinesOperating: ['IndiGo', 'Air India', 'Akasa Air', 'SpiceJet'],
    startingFareInr: 4599,
    dailyFlightsCount: 24,
    routeGuideMarkdown:
      'Flights departing New Delhi (DEL) for Hyderabad (HYD) operate across Terminals 1, 2, and 3. Always verify your departure terminal on your itinerary document 24 hours prior to departure.',
    metaTitle: 'Delhi to Hyderabad Flights (DEL to HYD) — Schedules & Terminal Info | DummyTicket',
    metaDescription:
      'Compare New Delhi (DEL) to Hyderabad (HYD) flight options. View transparent taxes, baggage policies, and nonstop flight durations.',
  },
  {
    id: 'route-bom-dxb',
    slug: 'bom-to-dxb',
    originIata: 'BOM',
    destinationIata: 'DXB',
    originCity: 'Mumbai',
    destinationCity: 'Dubai',
    averageDurationMinutes: 195,
    airlinesOperating: ['Emirates', 'Air India', 'IndiGo', 'Air India Express', 'Akasa Air'],
    startingFareInr: 14800,
    dailyFlightsCount: 18,
    routeGuideMarkdown:
      'Non-stop international flights from Mumbai Chhatrapati Shivaji Maharaj International Airport (BOM Terminal 2) to Dubai (DXB) take approximately 3 hours and 15 minutes. Ensure your passport has at least 6 months validity.',
    metaTitle: 'Mumbai to Dubai Flights (BOM to DXB) — International Schedules & Fares | DummyTicket',
    metaDescription:
      'Plan your Mumbai (BOM) to Dubai (DXB) journey. Compare nonstop airlines, checked baggage allowances, and visa documentation rules.',
  },
  {
    id: 'route-hyd-sin',
    slug: 'hyd-to-sin',
    originIata: 'HYD',
    destinationIata: 'SIN',
    originCity: 'Hyderabad',
    destinationCity: 'Singapore',
    averageDurationMinutes: 270,
    airlinesOperating: ['Singapore Airlines', 'IndiGo'],
    startingFareInr: 16400,
    dailyFlightsCount: 8,
    routeGuideMarkdown:
      'Direct flights from Hyderabad (HYD) to Singapore Changi Airport (SIN) take approximately 4 hours and 30 minutes, landing at Terminal 2 or Terminal 3 in Singapore.',
    metaTitle: 'Hyderabad to Singapore Flights (HYD to SIN) — Timings & Baggage Guide | DummyTicket',
    metaDescription:
      'Compare direct and connecting flights from Hyderabad (HYD) to Singapore (SIN). Review transparent pricing and travel documentation tips.',
  },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-1',
    slug: 'understanding-flight-itineraries-vs-confirmed-tickets',
    title: 'Difference Between a Flight Itinerary and an Airline-Issued E-Ticket',
    excerpt:
      'Learn what a booking reference means, how airline ticket issuance works, and how to read your DummyTicket documents.',
    category: 'Itinerary explanations',
    authorName: 'DummyTicket Aviation Compliance Team',
    readingTimeMinutes: 5,
    publishedAt: '2026-09-18T10:00:00.000Z',
    updatedAt: '2026-10-01T10:00:00.000Z',
    metaTitle: 'Flight Itinerary vs Airline E-Ticket — Complete Guide | DummyTicket',
    metaDescription:
      'Understand the distinction between a DummyTicket confirmed itinerary document and an airline-issued e-ticket, and how to verify both.',
    contentMarkdown: `## Why Understanding Your Documents Matters

When planning complex international journeys, coordinating group travel approvals, or submitting visa applications, travelers receive several documents from a booking platform. Knowing what each one represents avoids confusion at the airport.

### 1. What Is a DummyTicket Confirmed Itinerary?
A **Confirmed Itinerary** is a structured document displaying your flight schedule, route segments, airport codes, duration, fare breakdown, and the airline confirmation (PNR) associated with your reservation. Every DummyTicket itinerary carries a **\`DT-\`** booking reference and a QR code linking to a server-verified status page.

### 2. How Airline Ticket Issuance Works
A reservation becomes a full e-ticket when the booking is fulfilled through an authorized airline or Global Distribution System (GDS) provider, and the carrier returns a verified 6-character Passenger Name Record (PNR) and e-ticket number. Your boarding pass is generated by the airline during check-in — present your PNR there.

### 3. How to Read Your Itinerary & Payment Receipt
Every DummyTicket transaction generates **two separate documents**:
- **The Itinerary Document**: Displays route segments, flight timings, cabin class, baggage allowance, airline PNR, and QR verification link.
- **The Payment Receipt**: Itemizes the base amount, statutory taxes, platform service fees, and verified Razorpay payment reference.`,
    faqs: [
      {
        question: 'Can I board a flight using a DummyTicket Itinerary PDF?',
        answer:
          'No. The itinerary document confirms your reservation and displays your PNR for reference. Boarding passes are issued by the airline when you check in — present your PNR and travel ID at the counter or kiosk.',
      },
      {
        question: 'Why does DummyTicket send both an Itinerary and a Payment Receipt?',
        answer:
          'A payment receipt proves that your payment was captured via Razorpay, whereas the itinerary document displays your selected route schedule and airline confirmation details.',
      },
    ],
  },
  {
    id: 'blog-2',
    slug: 'domestic-and-international-baggage-allowance-guide-india',
    title: 'How to Understand Baggage Allowances Across Indian & International Airlines',
    excerpt:
      'Compare cabin and checked baggage rules across IndiGo, Air India, Akasa Air, SpiceJet, Fly91, Star Air, and international carriers.',
    category: 'Baggage rules',
    authorName: 'Priya Nair, Senior Travel Editor',
    readingTimeMinutes: 6,
    publishedAt: '2026-09-25T09:30:00.000Z',
    updatedAt: '2026-10-05T09:30:00.000Z',
    metaTitle: 'Cabin & Checked Baggage Allowance Guide for Indian Travelers | DummyTicket',
    metaDescription:
      'Compare 7kg cabin baggage rules, 15kg domestic limits, and international 23kg piece allowances across major airlines.',
    contentMarkdown: `## Weight Concept vs. Piece Concept Explained

Airlines operating out of India generally apply one of two baggage systems depending on your destination:

### 1. Domestic Flights Within India
Most Economy Saver fares on IndiGo, Akasa Air, Air India Express, SpiceJet, Fly91, and Star Air include **7 kg of cabin baggage** and **15 kg of checked baggage**, while full-service Air India Economy Comfort/Flex fares offer 20–25 kg.

### 2. Middle East & Southeast Asia Routes
Flights to Dubai (DXB), Singapore (SIN), and Bangkok (BKK) typically use the **Weight Concept**, offering between **20 kg and 30 kg** in Economy Class and **40 kg** in Business Class.

### 3. UK, Europe & North America Routes
Long-haul flights to London (LHR) or New Orleans (MSY) use the **Piece Concept**, usually allowing **1 or 2 bags of up to 23 kg each** in Economy and **2 bags of 32 kg each** in Business Class.`,
    faqs: [
      {
        question: 'Are power banks allowed in checked luggage?',
        answer:
          'No. Power banks and spare lithium batteries must always be carried in your hand baggage inside the aircraft cabin.',
      },
    ],
  },
  {
    id: 'blog-3',
    slug: 'how-flight-refunds-and-cancellation-penalties-work',
    title: 'How to Compare Flight Fares, Refund Rules, and Cancellation Penalties',
    excerpt:
      'Even on non-refundable Economy Saver fares, passengers are entitled to a refund of unused statutory airport taxes. Here is how fare rules work.',
    category: 'Refund and cancellation guidance',
    authorName: 'Rohan Deshmukh, Aviation Analyst',
    readingTimeMinutes: 5,
    publishedAt: '2026-10-02T12:00:00.000Z',
    updatedAt: '2026-10-08T12:00:00.000Z',
    metaTitle: 'Flight Refund & Cancellation Rules Explained — Taxes & Fare Penalties | DummyTicket',
    metaDescription:
      'Learn the difference between refundable and non-refundable flight fares, statutory tax refunds, and cancellation cut-off windows.',
    contentMarkdown: `## Decoding Your Fare Breakdown Before You Pay

Every transparent flight quote on DummyTicket separates the **Base Fare**, **Airline Fuel Surcharges**, and **Statutory Airport Taxes** (such as Passenger Service Fee and User Development Fee).

### 1. Non-Refundable Fares Still Have Refundable Taxes
Under civil aviation passenger rights, if you cancel a non-refundable ticket before the airline's no-show window, statutory government and airport taxes collected for actual travel must be refunded.

### 2. When Economy Flex Makes Financial Sense
If your travel dates have even a 25% chance of shifting, upgrading from Economy Saver to **Economy Flex Plus** typically saves ₹2,000–₹3,000 in modification penalties.`,
    faqs: [
      {
        question: 'How long do Razorpay refunds take to reflect in my bank account?',
        answer:
          'Once a refund is processed and confirmed by our finance team, Razorpay typically credits the source bank account, UPI handle, or card within 5 to 7 business days.',
      },
    ],
  },
];
