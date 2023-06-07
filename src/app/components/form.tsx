'use client'

import { SetStateAction, useState } from 'react';
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Input from '@mui/material/Input'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormHelperText from '@mui/material/FormHelperText'
import Divider from '@mui/material/Divider'

export default function SubmissionForm(name, id) {
    const [ formStep, setFormStep ] = useState('agreement');
    const [formData, setFormData] = useState({});
    const loadStep = (step: SetStateAction<string>) => {
        setFormStep( step );
    };
    const handleChange = () => {

    }
    
    return (
        <>
            <div className="wizard">
                <div className="wizard-navigation position-relative mb-5">
                    <ol className="fw-bold d-flex align-items-center justify-content-center text-shadow">
                        <li className="pe-5"><a href="#agreement" className={formStep === 'agreement' ? 'active' : ''} onClick={() => loadStep('agreement')}>Agreement</a></li>
                        <li className="pe-5"><a href="#types" className={formStep === 'types' ? 'active' : ''} onClick={() => loadStep('types')}>Types</a></li>
                        <li className="pe-5"><a href="#section" className={formStep === 'section' ? 'active' : ''} onClick={() => loadStep('section')}>Section</a></li>
                        <li className="pe-5"><a href="#authors" className={formStep === 'authors' ? 'active' : ''} onClick={() => loadStep('authors')}>Authors</a></li>
                        <li className="pe-5"><a href="#keywords" className={formStep === 'keywords' ? 'active' : ''} onClick={() => loadStep('keywords')}>Keywords</a></li>
                        <li className="pe-5"><a href="#classifications" className={formStep === 'classifications' ? 'active' : ''} onClick={ () => loadStep('classifications')}>Classifications</a></li>
                        <li className="pe-5"><a href="#abstract" className={formStep === 'abstract' ? 'active' : ''} onClick={ () => loadStep('abstract')}>Abstract</a></li>
                    </ol>
                </div>
                <div className="d-flex align-items-start">
                    <div className="wizard-navigation position-relative pe-4 py-4 text-shadow">
                        <ol className="fs-7">
                            <li><a href="#agreement" onClick={() => loadStep('agreement')}>Agreement</a></li>
                            <li><a href="#types" onClick={ () => loadStep('types')}>Types</a></li>
                            <li><a href="#section" onClick={() => loadStep('section')}>Section</a></li>
                            <li><a href="#authors" onClick={() => loadStep('authors')}>Authors</a></li>
                            <li><a href="#keywords" onClick={() => loadStep('keywords')}>Keywords</a></li>
                            <li><a href="#classifications" onClick={() => loadStep('classifications')}>Classifications</a></li>
                            <li><a href="#abstract" onClick={() => loadStep('abstract')}>Abstract</a></li>
                        </ol>
                    </div>
                    <div className="wizard-steps tab-container p-5 rounded-double bg-white flex-fill">
                        <div id="agreement" className={`tab ${formStep === 'agreement' ? 'active' : ''}`}>
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
                        </div>
                        <div id="types" className={`tab ${formStep === 'types' ? 'active' : ''}`}>
                            <h3 className="mb-4 text-shadow-white">Types</h3>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Age</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value="Ten"
                                    label="Age"
                                    onChange={handleChange}
                                >
                                    <MenuItem value={10}>Ten</MenuItem>
                                    <MenuItem value={20}>Twenty</MenuItem>
                                    <MenuItem value={30}>Thirty</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl className="container-fluid">
                                <InputLabel htmlFor="my-input">Title</InputLabel>
                                <Input id="my-input" aria-describedby="my-helper-text" />
                                <FormHelperText id="my-helper-text">
                                    Enter your full manuscript title.
                                </FormHelperText>    
                            </FormControl>
                        </div>
                        <div id="section" className={`tab ${formStep === 'section' ? 'active' : ''}`}>
                            <h3 className="mb-4 text-shadow-white">Section</h3>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Please Choose</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value="General"
                                    label="Please Choose a Section"
                                    onChange={handleChange}
                                >
                                    <MenuItem value={10}>General</MenuItem>
                                    <MenuItem value={20}>Special Issue</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        <div id="authors" className={`tab ${formStep === 'authors' ? 'active' : ''}`}>
                            <h3 className="mb-4 text-shadow-white">Authors</h3>
                        </div>
                        <div id="keywords" className={`tab ${formStep === 'keywords' ? 'active' : ''}`}>
                            <h3 className="mb-4 text-shadow-white">Keywords</h3>
                        </div>
                        <div id="classifications" className={`tab ${formStep === 'classifications' ? 'active' : ''}`}>
                            <h3 className="mb-4 text-shadow-white">Classifications</h3>
                        </div>
                        <div id="abstract" className={`tab ${formStep === 'abstract' ? 'active' : ''}`}>
                            <h3 className="mb-4 text-shadow-white">Abstract</h3>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}