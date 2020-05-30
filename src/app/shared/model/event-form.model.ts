export interface FormsModel {
  eventName: string;
  eventCaption: string;
  eventImageUrl?: string;
  authUID?: string;
  eventType: string;
  eventDate: any;
  eventTime: any;
  eventDescription: string;
  registrationDeadline: any;
  registrationFees: number;
  venue: string;
  department: string;
  id?: string;
  participation?: string;
  eventCordinator?: any;
  isAdmin?:any;
  approved?: boolean;
  winners?: string[];
  cancelled?: boolean;
}
export interface Coordinator {
  name: string;
  contact?: string;
}

