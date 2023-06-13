

const WizardOutline = ({formStep, setFormStep, loadStep, steps}) => {
    return (
        <>
            <div className="wizard-outline position-relative pe-4 py-4 text-shadow">
                <ol className="fs-7">
                    {
                        steps.map( item => (
                            <li className={formStep === item.title ? 'active' : ''} key={item.title}>
                                <a href={`#${item.title}`} onClick={() => loadStep(item.title)}>
                                    {item.title}
                                </a>
                            </li>
                        ))
                    }
                </ol>
            </div>
        </>
    );
}

export default WizardOutline;