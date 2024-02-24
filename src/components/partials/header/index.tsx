import Image from 'next/image'
import { useSelector } from 'react-redux'
import Logo from '@/assets/images/brieflands-logo.png'

const Header = () => {
    const wizard = useSelector( ( state: any ) => state.wizardSlice );

    return (
        <div id="logo" className="d-flex align-items-center justify-content-between">
            <div className="logo w-100 w-md-auto">
                <div className="d-flex align-items-center">
                    <div className="image ms-4">
                        <Image
                            src={ Logo }
                            alt="Brieflands"
                            width={40}
                            height={25}
                        />
                    </div>
                    <h1 className="fw-bold ms-3 mb-0 fs-3">Brieflands</h1>
                    {
                        ( wizard.journal !== undefined && Object.keys( wizard.journal ).length > 0 ) &&
                            <span className="ms-2 d-none d-md-block fw-bold text-shadow-light">
                                { `| ${ wizard.journal?.attributes?.title }` }
                            </span>
                    }
                </div>
            </div>
            {
                ( wizard.user !== undefined && Object.keys( wizard.user ).length > 0 ) &&
                    <div className="logo px-3 d-flex align-items-center">
                        <span className="me-2 d-none d-md-block text-nowrap fs-7 fw-bold text-blue-light text-shadow-dark">
                            { wizard.user.attributes?.full_name }
                        </span>
                        <img 
                            className="img-circle img-tiny box-shadow" 
                            src={ wizard.user?.attributes?.avatar } 
                            alt={ wizard.user?.attributes?.full_name } 
                            title={ wizard.user?.attributes?.full_name } 
                        />
                    </div>
            }
            
        </div>
    )
}

export default Header
