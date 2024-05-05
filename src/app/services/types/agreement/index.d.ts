export type Value = {
    terms: boolean;
}
  
type AgreementTerms = {
    id: string;
    attributes: {
        translated_content: string;
        version: string;
    }
}

export type Agreement = {
    isLoading: boolean;
    agreementTerms: AgreementTerms;
    stepGuide: object | string;
    value: Value;
}