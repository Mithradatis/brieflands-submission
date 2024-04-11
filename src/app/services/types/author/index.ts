export type InputStatus = {
    email: boolean;
    firstName: boolean;
    middleName: boolean;
    lastName: boolean;
    isCorresponding: boolean;
}

export type Author = {
    "email": string;
    "firstName": string;
    "middleName": string;
    "lastName": string;
    "orcId": string;
    "country": string;
    "phoneType": string;
    "countryPhone": string;
    "phoneNumber": string;
    "affiliations": string[];
    "isCorresponding": string;
    "correspondAffiliation": string;
}