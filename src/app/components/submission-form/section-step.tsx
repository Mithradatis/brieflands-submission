import FormControl from '@mui/material/FormControl'
import Autocomplete from '@mui/material/Autocomplete'
import { TextField } from '@mui/material'

const SectionStep = ({formStep, setFormStep}) => {
    const documentTypes = [
        { label: 'Section 1', id: 1 },
        { label: 'Section 2', id: 2 },
        { label: 'Section 3', id: 3 },
    ];
    return (
        <>
            <div id="section" className={`tab${formStep === 'section' ? ' active' : ''}`}>
                <h3 className="mb-4 text-shadow-white">Section</h3>
                <FormControl fullWidth>
                    <Autocomplete
                        disablePortal
                        id="document-type"
                        options={documentTypes}
                        renderInput={(params) => <TextField {...params} label="Section" />}
                    />
                </FormControl>
            </div>
        </>
    );
}

export default SectionStep;