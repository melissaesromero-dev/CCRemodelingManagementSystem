type QuoteRequest = {
  //Customer Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string | null;
  city: string;
  stateId: number;
  zip?: string | null;
  contactMethod: number;
  bestTime: number;

  //Service Request Info
  mainTypeId: number;
  serviceDesc?: string | null;
  serviceAddress?: string | null;
  serviceCity?: string | null;
  serviceStateId: number;
  serviceZip?: string | null;
  budgetRangeId: number;  
  desiredStart: string | null;
};

