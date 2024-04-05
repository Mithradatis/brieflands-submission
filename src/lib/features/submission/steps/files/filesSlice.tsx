import { createSlice } from '@reduxjs/toolkit'
import { addFile, deleteFile, reuseFile } from '@api/steps/files'

interface Value {
  old_files: string,
  new_files: string
  file_type_id: string,
  caption: string
}

export type File = {
  id: number;
  fileName: string;
  fileType: string;
  caption: string;
  fileSize: string;
  wordCount: string;
  uploadDate: string;
  uuid: string;
  reuse: boolean;
  downloadLink: string;
  actions: any;
}

export type Files = {
  isLoading: boolean;
  captionRequired: boolean,
  formStatus: {
    isDisabled: boolean,
    fileTypeId: boolean,
  },
  stepGuide: object | string,
  fileTypesList: FileTypesListItem[],
  oldFilesList: File[],
  newFilesList: File[],
  value: Value
}

type FileTypesListItem = {
  id: number | string;
  type: string;
  attributes: {
    add_line_number: boolean;
    calculate_word_count: boolean;
    check_plagiarism: boolean;
    data: {
      allowed_extentions: string[];
    };
    description: string;
    included_in_fee: boolean;
    maximum_requirement: number;
    minimum_requirement: number;
    order_in_pdf: number;
    require_caption: boolean;
    reusable: boolean;
    slug: string;
    title: string;
    use_in: number;
    visible_to_reviewers: boolean;
  }
}

const initialState: Files = {
  isLoading: false,
  captionRequired: false,
  formStatus: {
    isDisabled: true,
    fileTypeId: true,
  },
  stepGuide: {},
  fileTypesList: [] as FileTypesListItem[],
  oldFilesList: [] as File[],
  newFilesList: [] as File[],
  value: {} as Value
}

export const filesSlice = createSlice({
  name: 'files',
  initialState: initialState,
  reducers: {
    handleFileType: ( state, action ) => {
      return {
        ...state,
        captionRequired: action.payload.captionRequired,
        value: {
          ...state.value,
          [ action.payload.name ]: action.payload.value,
        },
        formStatus: {
          isDisabled: false,
          fileTypeId: true
        }
      };
    },
    handleInput: ( state, action ) => {
      return {
        ...state,
        value: {
          ...state.value,
          [ action.payload.name ]: action.payload.value,
        },
      };
    },
    handleLoading: ( state, action ) => {
      state.isLoading = action.payload;
    },
    setFileTypes: ( state, action ) => {
      state.fileTypesList = action.payload.data;
    },
    setLoading: ( state, action ) => {
      state.isLoading = action.payload;
    }
  },
  extraReducers( builder ) {
    builder
    .addCase(deleteFile.pending, ( state ) => {
      state.isLoading = true;
    })
    .addCase(deleteFile.fulfilled, ( state, action ) => {
      state.isLoading = false;
      const oldFiles = action.payload.data.step_data.old_files;
      const newFiles = action.payload.data.step_data.new_files;
      createFileTable( state, oldFiles, newFiles );
    }).addCase(addFile.pending, ( state ) => {
      state.isLoading = true;
    })
    .addCase(reuseFile.pending, ( state ) => {
      state.isLoading = true;
    })
    .addCase(reuseFile.fulfilled, ( state, action ) => {
      state.isLoading = false;
      const oldFiles = action.payload.data.step_data.old_files;
      const newFiles = action.payload.data.step_data.new_files;
      createFileTable( state, oldFiles, newFiles );
    });
  },
});

export const { 
  handleFileType, 
  handleInput,  
  handleLoading,
  setFileTypes,
  setLoading
} = filesSlice.actions;

export default filesSlice.reducer;
