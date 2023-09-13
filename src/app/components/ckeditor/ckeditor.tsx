import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

const CKEditorComponent = () => {
  return (
      <CKEditor
        editor={ClassicEditor}
        data=""
        onReady={(editor) => {
          
        }}
      />
  );
};

export default CKEditorComponent;