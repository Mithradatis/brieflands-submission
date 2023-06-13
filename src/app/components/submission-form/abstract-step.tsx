
const AbstractStep = ({formStep, setFormStep}) => {
    return (
        <>
            <div id="abstract" className={`tab${formStep === 'abstract' ? ' active' : ''}`}>
                <h3 className="mb-4 text-shadow-white">Abstract</h3>
            </div>
        </>
    );
}

export default AbstractStep;