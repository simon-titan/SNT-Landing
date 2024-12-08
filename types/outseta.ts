export type OutsetaAddress = {
  AddressLine1: string | null;
  AddressLine2: string | null;
  AddressLine3: string | null;
  City: string;
  State: string;
  PostalCode: string;
  Country: string | null;
  Uid: string;
  Created: string;
  Updated: string;
};

export type OutsetaSubscriptionAddOn = {
  AddOn: {
    Name: string;
    Uid: string;
  };
  Quantity: number | null;
  StartDate: string;
  EndDate: string | null;
  ExpirationDate: string | null;
  RenewalDate: string;
  Rate: number;
  Uid: string;
};

export type OutsetaSubscription = {
  Plan: {
    Name: string;
    Uid: string;
  };
  StartDate: string;
  EndDate: string | null;
  ExpirationDate: string | null;
  RenewalDate: string;
  Rate: number;
  SubscriptionAddOns: OutsetaSubscriptionAddOn[];
  Uid: string;
};

export type OutsetaAccount = {
  Name: string;
  AccountStage: number;
  AccountStageLabel: string;
  CurrentSubscription: OutsetaSubscription | null;
  PrimaryContact: {
    Email: string;
    FirstName: string;
    LastName: string;
    FullName: string;
    Uid: string;
  };
  Uid: string;
  Created: string;
  Updated: string;
};

export type OutsetaUser = {
  Email: string;
  FirstName: string;
  LastName: string;
  FullName: string;
  ProfileImageS3Url: string | null;
  MailingAddress: OutsetaAddress | null;
  PhoneMobile: string;
  PhoneWork: string;
  Language: string;
  LastLoginDateTime: string;
  Account: OutsetaAccount;
  Uid: string;
  Created: string;
  Updated: string;
};
