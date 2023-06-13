import Divider from '@mui/material/Divider'
import {FormControlLabel, FormGroup } from '@mui/material'
import { Checkbox } from '@mui/material'
// import { Scrollbars } from 'react-custom-scrollbars'

const AgreementStep = ({formStep, setFormStep}) => {

    return (
        <>
            <div id="agreement" className={`tab${formStep === 'agreement' ? ' active' : ''}`}>
                <h3 className="mb-4 text-shadow-white">Agreement</h3>
                {/* <Scrollbars style={{ width: 500, height: 100 }} className="mb-4"> */}
                    <h4 className="fs-6">1. Download a Manuscript Template</h4>
                    <h4 className="fs-6">2. Write Your Manuscript using a checklist</h4>
                    <Divider className="mb-3 mt-2" />
                    <h4 className="fs-6">Author Disclusure</h4>
                    <ul className="text-muted fs-7">
                        <li>I accept to pay  Article Processing Charges after accepting our manuscript.</li>
                        <li>I assign all rights to the journal and I will not withdraw my article by the final decision by the journal. Otherwise, I accept to pay the  withdrawal penalty fee.</li>
                        <li>I accept all "Ethical Considerations in Instruction for Authors."</li>
                    </ul>
                {/* </Scrollbars> */}
                <Divider />
                <FormGroup>
                    <FormControlLabel 
                        control={<Checkbox />} 
                        label="I've read and agree to all terms that are mentioned above" 
                    />
                </FormGroup>
            </div>
        </>
    );
}

export default AgreementStep;