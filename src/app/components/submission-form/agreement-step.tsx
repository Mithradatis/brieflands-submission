import Divider from '@mui/material/Divider'
import {render} from 'react-dom'
import { CheckboxWithLabel } from 'formik-mui';
import { Formik, Form, Field, ErrorMessage } from 'formik'

const AgreementStep = ({formStep, setIsValid, setFormStep}) => {
    const handleSubmit = (values, { setSubmitting }) => {
        alert(JSON.stringify(values, null, 2));
        setSubmitting(false);
      };
    const initialValues = {
        agree: false,
    };   

    return (
        <>
            <div id="agreement" className={`tab${formStep === 'agreement' ? ' active' : ''}`}>
                <h3 className="mb-4 text-shadow-white">Agreement</h3>
                    <h4 className="fs-6">1. Download a Manuscript Template</h4>
                    <h4 className="fs-6">2. Write Your Manuscript using a checklist</h4>
                    <Divider className="mb-3 mt-2" />
                    <h4 className="fs-6">Author Disclusure</h4>
                    <ul className="text-muted fs-7">
                        <li>I accept to pay  Article Processing Charges after accepting our manuscript.</li>
                        <li>I assign all rights to the journal and I will not withdraw my article by the final decision by the journal. Otherwise, I accept to pay the  withdrawal penalty fee.</li>
                        <li>I accept all "Ethical Considerations in Instruction for Authors."</li>
                    </ul>
                <Divider />
                <Formik
                    initialValues={initialValues}
                    validate={(values) => {
                        const errors: Partial<Values> = {};
                        if ( !values.agree ) {
                            errors.agree = 'Please Check me!';
                        }

                        return errors;
                    }}
                    onSubmit={(values, { setSubmitting }) => {
                        setTimeout(() => {
                        setSubmitting(false);
                        alert(JSON.stringify(values, null, 2));
                        }, 500);
                    }}
                >
                        {({ submitForm, isSubmitting, isValid }) => (
                            <Form>
                                <Field
                                    Required
                                    component={CheckboxWithLabel}
                                    name="agree"
                                    id="agree"
                                    type="checkbox"
                                    Label={{ label: "I've read and agree to all terms that are mentioned above" }}
                                />
                                <ErrorMessage name="agree" component="div" className="error" />+
                                <button
                                    type="button"
                                    onClick={() => handleSubmit()}
                                    disabled={ isSubmitting || !isValid }
                                    >
                                    Submit with Click Event
                                </button>
                            </Form>
                        )}
                </Formik>
            </div>
        </>
    );
}

export default AgreementStep;