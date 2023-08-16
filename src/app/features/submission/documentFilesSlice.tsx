import { createSlice } from '@reduxjs/toolkit'
import { getFilesStepGuide, getFilesStepData, deleteFile, addFile, getFileTypes, reuseFile } from '@/app/api/files'

interface Value {
  old_files: string,
  new_files: string
  file_type_id: string,
  caption: string
}

interface File {
  id: number,
  fileName: string,
  fileType: string,
  caption: string,
  fileSize: string,
  wordCount: string,
  uploadDate: string,
  uuid: string,
  reuse: boolean
}

export const documentFilesSlice = createSlice({
  name: 'files',
  initialState: {
    isLoading: false,
    captionRequired: false,
    formStatus: {
      isDisabled: true,
      fileTypeId: true,
    },
    stepGuide: {},
    fileTypesList: [],
    oldFilesList: [] as File[],
    newFilesList: [] as File[],
    value: {} as Value
  },
  reducers: {
    handleDropzoneStatus: ( state, action ) => {
      return {
        ...state,
        formStatus: {
          isDisabled: !action.payload,
          fileTypeId: state.value.file_type_id !== undefined && state.value.file_type_id !== ''
        }
      }
    },
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
    }
  },
  extraReducers( builder ) {
    builder
    .addCase(getFilesStepGuide.pending, ( state ) => {
      state.isLoading = true;
    })
    .addCase(getFilesStepGuide.fulfilled, ( state, action ) => {
      state.isLoading = false;
      state.stepGuide = action.payload.data.value;
    })
    .addCase(getFileTypes.pending, ( state ) => {
      state.isLoading = true;
    })
    .addCase(getFileTypes.fulfilled, ( state, action ) => {
      state.isLoading = false;
      state.fileTypesList = action.payload.data;
    })
    .addCase(getFilesStepData.pending, ( state ) => {
      state.isLoading = true;
    })
    .addCase(getFilesStepData.fulfilled, ( state, action ) => {
      state.isLoading = false;
      state.oldFilesList = [];
      state.newFilesList = [];
      const oldFiles = action.payload.data.step_data.old_files;
      const oldKeys = Object.keys( oldFiles );
      if ( oldKeys.length > 0 ) {
        for (let index = 0; index < oldKeys.length; index++) {
          const key: any = oldKeys[index];
          const value: any = oldFiles[key];
          state.oldFilesList.push(
            {
              id: ( index + 1 ),
              fileName: value.name || '', 
              fileType: value.type || value.type || '',
              caption: value.caption || value.caption || '',
              fileSize: value.size || value.size || '',
              wordCount: value.word_count || value.word_count || '',
              uploadDate: value.createdAt || value.createdAt || '',
              uuid: value.uuid || value.uuid || '',
              reuse: value.reuse || value.reuse || ''
            }
          );
        }
      }
      const newFiles = action.payload.data.step_data.new_files;
      const newKeys = Object.keys( newFiles );
      if ( newKeys.length > 0 ) {
        for (let index = 0; index < newKeys.length; index++) {
          const key: any = newKeys[index];
          const value: any = newFiles[key];
          state.newFilesList.push(
            {
              id: ( index + 1 ),
              fileName: value.name || '', 
              fileType: value.type || value.type || '',
              caption: value.caption || value.caption || '',
              fileSize: value.size || value.size || '',
              wordCount: value.word_count || value.word_count || '',
              uploadDate: value.createdAt || value.createdAt || '',
              uuid: value.uuid || value.uuid || '',
              reuse: false
            }
          );
        }
      }
      state.value.old_files = oldFiles;
      state.value.new_files = newFiles;
    }).addCase(deleteFile.pending, ( state ) => {
      state.isLoading = true;
    })
    .addCase(deleteFile.fulfilled, ( state, action ) => {
      state.isLoading = false;
      state.oldFilesList = [];
      state.newFilesList = [];
      const oldFiles = action.payload.data.step_data.old_files;
      const oldKeys = Object.keys( oldFiles );
      if ( oldKeys.length > 0 ) {
        for (let index = 0; index < oldKeys.length; index++) {
          const key: any = oldKeys[index];
          const value: any = oldFiles[key];
          state.oldFilesList.push(
            {
              id: ( index + 1 ),
              fileName: value.name || '', 
              fileType: value.type || value.type || '',
              caption: value.caption || value.caption || '',
              fileSize: value.size || value.size || '',
              wordCount: value.word_count || value.word_count || '',
              uploadDate: value.createdAt || value.createdAt || '',
              uuid: value.uuid || value.uuid || '',
              reuse: value.reuse || value.reuse || ''
            }
          );
        }
      }
      const newFiles = action.payload.data.step_data.new_files;
      const newKeys = Object.keys( newFiles );
      if ( newKeys.length > 0 ) {
        for (let index = 0; index < newKeys.length; index++) {
          const key: any = newKeys[index];
          const value: any = newFiles[key];
          state.newFilesList.push(
            {
              id: ( index + 1 ),
              fileName: value.name || '', 
              fileType: value.type || value.type || '',
              caption: value.caption || value.caption || '',
              fileSize: value.size || value.size || '',
              wordCount: value.word_count || value.word_count || '',
              uploadDate: value.createdAt || value.createdAt || '',
              uuid: value.uuid || value.uuid || '',
              reuse: false
            }
          );
        }
      }
      state.value.old_files = oldFiles;
      state.value.new_files = newFiles;
    }).addCase(addFile.pending, ( state ) => {
      state.isLoading = true;
    })
    .addCase(addFile.fulfilled, ( state, action: any ) => {
      state.isLoading = false;
      state.oldFilesList = [];
      state.newFilesList = [];
      const oldFiles = action.payload.data.step_data.old_files;
      const oldKeys = Object.keys( oldFiles );
      if ( oldKeys.length > 0 ) {
        for (let index = 0; index < oldKeys.length; index++) {
          const key: any = oldKeys[index];
          const value: any = oldFiles[key];
          state.oldFilesList.push(
            {
              id: ( index + 1 ),
              fileName: value.name || '', 
              fileType: value.type || value.type || '',
              caption: value.caption || value.caption || '',
              fileSize: value.size || value.size || '',
              wordCount: value.word_count || value.word_count || '',
              uploadDate: value.createdAt || value.createdAt || '',
              uuid: value.uuid || value.uuid || '',
              reuse: value.reuse || value.reuse || ''
            }
          );
        }
      }
      const newFiles = action.payload.data.step_data.new_files;
      const newKeys = Object.keys( newFiles );
      if ( newKeys.length > 0 ) {
        for (let index = 0; index < newKeys.length; index++) {
          const key: any = newKeys[index];
          const value: any = newFiles[key];
          state.newFilesList.push(
            {
              id: ( index + 1 ),
              fileName: value.name || '', 
              fileType: value.type || value.type || '',
              caption: value.caption || value.caption || '',
              fileSize: value.size || value.size || '',
              wordCount: value.word_count || value.word_count || '',
              uploadDate: value.createdAt || value.createdAt || '',
              uuid: value.uuid || value.uuid || '',
              reuse: false
            }
          );
        }
      }
      state.value.old_files = oldFiles;
      state.value.new_files = newFiles;
    }).addCase(reuseFile.pending, ( state ) => {
      state.isLoading = true;
    })
    .addCase(reuseFile.fulfilled, ( state, action: any ) => {
      state.isLoading = false;
      state.oldFilesList = [];
      state.newFilesList = [];
      const oldFiles = action.payload.data.step_data.old_files;
      const oldKeys = Object.keys( oldFiles );
      if ( oldKeys.length > 0 ) {
        for (let index = 0; index < oldKeys.length; index++) {
          const key: any = oldKeys[index];
          const value: any = oldFiles[key];
          state.oldFilesList.push(
            {
              id: ( index + 1 ),
              fileName: value.name || '', 
              fileType: value.type || value.type || '',
              caption: value.caption || value.caption || '',
              fileSize: value.size || value.size || '',
              wordCount: value.word_count || value.word_count || '',
              uploadDate: value.createdAt || value.createdAt || '',
              uuid: value.uuid || value.uuid || '',
              reuse: value.reuse || value.reuse || ''
            }
          );
        }
      }
      const newFiles = action.payload.data.step_data.new_files;
      const newKeys = Object.keys( newFiles );
      if ( newKeys.length > 0 ) {
        for (let index = 0; index < newKeys.length; index++) {
          const key: any = newKeys[index];
          const value: any = newFiles[key];
          state.newFilesList.push(
            {
              id: ( index + 1 ),
              fileName: value.name || '', 
              fileType: value.type || value.type || '',
              caption: value.caption || value.caption || '',
              fileSize: value.size || value.size || '',
              wordCount: value.word_count || value.word_count || '',
              uploadDate: value.createdAt || value.createdAt || '',
              uuid: value.uuid || value.uuid || '',
              reuse: false
            }
          );
        }
      }
      state.value.old_files = oldFiles;
      state.value.new_files = newFiles;
    });
  },
});

export const { handleFileType, handleInput, handleDropzoneStatus } = documentFilesSlice.actions;

export const stepState = ( state: any ) => state.documentFilesSlice;

export default documentFilesSlice.reducer;
