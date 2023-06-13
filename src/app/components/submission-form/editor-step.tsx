
const EditorStep = ({formStep, setFormStep}) => {
    return (
        <>
            <div id="editor" className={`tab${formStep === 'editor' ? ' active' : ''}`}>
                <h3 className="mb-4 text-shadow-white">Editor</h3>
            </div>
        </>
    );
}

export default EditorStep;