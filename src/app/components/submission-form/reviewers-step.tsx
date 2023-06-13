
const ReviewersStep = ({formStep, setFormStep}) => {
    return (
        <>
            <div id="reviewers" className={`tab${formStep === 'reviewers' ? ' active' : ''}`}>
                <h3 className="mb-4 text-shadow-white">Reviewers</h3>
            </div>
        </>
    );
}

export default ReviewersStep;