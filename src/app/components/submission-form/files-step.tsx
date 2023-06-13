
const FilesStep = ({formStep, setFormStep}) => {
    return (
        <>
            <div id="files" className={`tab${formStep === 'files' ? ' active' : ''}`}>
                <h3 className="mb-4 text-shadow-white">Files</h3>
            </div>
        </>
    );
}

export default FilesStep;