export type Journal = {
    attributes: {
      title: string;
    };
}

export type User = {
  attributes: {
    avatar: string;
    full_name: string;
  }
}

export type Wizard = {
  isFormValid: boolean;
  isVerified: boolean;
  formStep: string;
  formSteps: FormStep[];
  hasType: boolean;
}

export type Workflow = {
  id: string;
  document_id: string;
  journal: {
    attributes: {
      services: {
        goftino: boolean;
      };
    };
  }; 
  attributes: {
      journal_id: string;
      storage: {
        base_doc_id: string;
        revision: string;
        types: {
          doc_type: string,
          manuscript_title: string;
        }
      };
  };
}

type subStep = {
  slug: string;
  required: boolean;
}

export type FormStep = {
  id: string | null;
  attributes: {
    title: string;
    slug: string;
    subSteps: subStep[]
  }
}

export type Type = {
  id: string;
  attributes: {
    slug: string;
    title: string;
  };
}