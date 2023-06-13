import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Autocomplete from '@mui/material/Autocomplete'
import { TextField } from '@mui/material'
import Input from '@mui/material/Input'
import FormHelperText from '@mui/material/FormHelperText'

const TypesStep = ({formStep, setFormStep}) => {
    const documentTypes = [
        { label: 'Research Article', id: 1 },
        { label: 'Review Article', id: 2 },
        { label: 'Case Report', id: 3 },
    ];
    return (
        <>
            <div id="types" className={`tab${formStep === 'types' ? ' active' : ''}`}>
                <h3 className="mb-4 text-shadow-white">Types</h3>
                <FormControl fullWidth>
                    <Autocomplete
                        disablePortal
                        id="document-type"
                        options={documentTypes}
                        renderInput={(params) => <TextField {...params} label="Document Types" />}
                    />
                </FormControl>
            </div>
        </>
    );
}

export default TypesStep;