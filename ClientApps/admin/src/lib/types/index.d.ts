type Customer = {
  id?: string;
  custNum: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  stateId: number;
  zip: string;
  contactMethod: number;
  bestTime: number;
  statusId: number;
  creationDate: string;
  fullName: string;
  openRequests: ServiceRequest[];
  openRequestsCount: number;
  estAppts: number[];
  estApptDates: string[];
  estApptsCount: number;
  quotes: Quote[];
  quotesCount: number;
};

type ServiceRequest = {
  id?: string
  reqNum: number
  customerId: string
  userId: string
  mainServiceTypeId: number
  subServiceTypeId: number
  serviceDesc: string
  serviceAddress: string
  serviceCity: string
  serviceStateId: number
  serviceZip: string
  budgetRangeId: number
  desiredStartDate: string
  statusId: number
  creationDate: string
  custFullName: string
  staffFullName: string
  mainServiceTypeDesc: string
  subServiceTypeDesc: string
  estApptStatus: string
  quoteNum: number
};

type EstimateAppt = {
  id: string
  estApptNum: number
  serviceRequestId: string
  statusId: number
  scheduledDate: string | null
  scheduledTime: string | null
  notes: string
  creationDate: string
  requestNumber: number
  custFullName: string
  staffFullName: string
}

type Quote = {
  id: string
  quoteNum: number
  serviceRequestId: string
  statusId: number
  materialDetails: string
  materialCostEstimate: number
  laborDetails: string
  laborCostEstimate: number
  totalCostEstimate: number
  creationDate: string
  requestNumber: number
  serviceMainTypeDesc: string
  serviceSubTypeDesc: string
}

type State = {
  id: number;
  shortName: string;
  longName: string;
};

type User = {
  id: string;
  fullName: string;
  firstName: string;
  userTypeId: number;
};

type CustomerServiceRequestsAndApptsDTO = {
  serviceRequestCount: number;
  estimateApptCount: number;
  totalCount: number;
}

