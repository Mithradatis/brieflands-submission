import { submissionApi } from '@/app/services/apiSlice'

const setFile = ( data: any ) => {
  const formData = new FormData();
  formData.append( 'file_type_id', data?.file_type_id );
  data?.caption !== undefined && formData.append('caption', data?.caption);
  formData.append('file', data.file);

  return formData;
}

export const filesApi = submissionApi.injectEndpoints({
  endpoints: ( build: any ) => ({
    getFileTypes: build.query({
      query: ( url: string ) => url,
      transformResponse: ( response: { data: object } ) => response.data
    }),
    addFile: build.mutation({
      query: ( { workflowId, data }: { workflowId: string, data: any } ) => ({
        url: `${ process.env.SUBMISSION_API_URL }/${ workflowId }/files/add`,
        method: 'POST',
        body: setFile( data )
      }),
      transformResponse: async ( response: any ) => response.data,
      invalidatesTags: ['StepData']
    }),
    deleteFile: build.mutation({
      query: ( { url , data } : { url: string, data: object } ) => ({
        url: url,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify( data ),
      }),
      transformResponse: ( response: any ) => response.data
    }),
    reuseFile: build.mutation({
      query: ( { url , data } : { url: string, data: object } ) => ({
        url: url,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify( data ),
      }),
      transformResponse: ( response: any ) => response.data
    })
  })
})

export const { 
  useGetFileTypesQuery, 
  useAddFileMutation,
  useDeleteFileMutation,
  useReuseFileMutation 
} = filesApi

export const createFileTable = ( oldFiles: File[], newFiles: File[] ) => {
  const oldFilesList = [];
  const newFilesList = [];
  const oldKeys = Object.keys( oldFiles );
  if ( oldKeys.length > 0 ) {
    for (let index = 0; index < oldKeys.length; index++) {
      const key: any = oldKeys[index];
      const value: any = oldFiles[key];
      oldFilesList.push(
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
  const newKeys = Object.keys( newFiles );
  if ( newKeys.length > 0 ) {
    for (let index = 0; index < newKeys.length; index++) {
      const key: any = newKeys[index];
      const value: any = newFiles[key];
      newFilesList.push(
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

  return {
    oldFiles: oldFilesList,
    newFiles: newFilesList
  }
}

