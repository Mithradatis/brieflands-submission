const Footer = () => {
    return (
        <footer className="position-absolute w-100">
            <div className="d-flex flex-wrap align-items-center justify-content-between">
              <div className="fs-7 py-2 px-4 text-blue-light">
                  Copyright © { new Date().getFullYear() }, <a href="https://brieflands.com" target="_blank" rel="noopener noreferrer" className="light">Brieflands.</a> <span className="opacity-25">|</span> All Rights Reserved. <span className="opacity-25">|</span> <a href="http://creativecommons.org/licenses/by-nc/4.0/" target="_blank" rel="noopener noreferrer" className="light">CC BY-NC 4.0</a>
              </div>
              <div className="fs-7 py-2 px-4 text-blue-light">    
                  Powered by <a href="https://www.neoscriber.com" target="_blank" rel="noopener noreferrer" className="light">NeoScriber ®</a> <span className="opacity-25">|</span> <a href="https://brieflands.com/brieflands/forms/support.html" target="_blank" rel="noopener noreferrer" className="light"> Feedback </a>
              </div>
            </div>
          </footer>
    )    
}

export default Footer