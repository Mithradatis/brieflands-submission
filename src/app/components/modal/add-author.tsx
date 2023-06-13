import FormControl from '@mui/material/FormControl'
import Autocomplete from '@mui/material/Autocomplete'
import { TextField } from '@mui/material';

const AddAuthrrModal = () => {
    const countries = [
        { label: 'Iran', id: 1 },
        { label: 'Afghanistan', id: 2 },
        { label: 'Tajikistan', id: 3 },
    ];

    return (
        <>
            <FormControl className="mb-4" fullWidth>
                <TextField id="author-email" label="Email" variant="outlined"/>
            </FormControl>
            <FormControl className="mb-4" fullWidth>
                <TextField id="author-firstname" label="First Name" variant="outlined"/>
            </FormControl>
            <FormControl className="mb-4" fullWidth>
                <TextField id="author-middle-name" label="Middle Name" variant="outlined"/>
            </FormControl>
            <FormControl className="mb-4" fullWidth>
                <TextField id="author-lastname" label="Last Name" variant="outlined"/>
            </FormControl>
            <FormControl className="mb-4" fullWidth>
                <TextField id="author-orcid" label="orcid" variant="outlined"/>
            </FormControl>
            <FormControl fullWidth className="mb-4">
                <Autocomplete
                    disablePortal
                    id="author-country"
                    options={countries}
                    renderInput={(params) => <TextField {...params} label="Country" />}
                />
            </FormControl>
            <fieldset className="fieldset mb-4">
                <legend>Phones</legend>
                <div className="d-flex align-items-center">
                    <FormControl className="pe-3" fullWidth>
                        <TextField id="author-phone-type" label="Type" variant="outlined"/>
                    </FormControl>
                    <FormControl className="pe-3" fullWidth>
                        <TextField id="author-phone-country" label="Country" variant="outlined"/>
                    </FormControl>
                    <FormControl fullWidth>
                        <TextField id="author-phone-number" label="Number" variant="outlined"/>
                    </FormControl>
                </div>
            </fieldset>
            <fieldset className="fieldset mb-4">
                <legend>Affiliations</legend>
                <FormControl fullWidth>
                    <TextField id="author-affiliations" label="Affiliations" variant="outlined"/>
                </FormControl>
            </fieldset>
        </>
    );
}

export default AddAuthrrModal;