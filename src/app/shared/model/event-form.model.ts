export interface FormsModel {
  eventName: string;
  eventCaption: string;
  eventImageUrl?: string;
  authUid?: string;
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
  winners?: string[];
}
export interface Coordinator {
  name: string;
  contact?: string;
}

