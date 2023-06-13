
const classificationsStep = ({formStep, setFormStep}) => {
    return (
        <>
            <div id="classifications" className={`tab${formStep === 'classifications' ? ' active' : ''}`}>
                <h3 className="mb-4 text-shadow-white">Classifications</h3>
            </div>
        </>
    );
}

export default classificationsStep;