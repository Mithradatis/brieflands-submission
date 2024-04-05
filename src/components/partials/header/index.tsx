import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useAppSelector } from '@/app/store'
import Logo from '@/assets/images/brieflands-logo.png'
import { useLazyGetUserQuery } from '@/app/services/apiSlice'
import { Journal, User } from '@/app/services/types'

const Header = () => {
    const journal: Journal = useAppSelector( ( state: any ) => state.wizard.journal );
    const [ user, setUser ] = useState<User>();
    const [getUserTrigger]= useLazyGetUserQuery();
    useEffect(() => {
        const user = getUserTrigger( 'journal/profile' ).then( 
            ( response: any ) => { 
                setUser( response.data ); 
            } 
        );
    }, []);

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
                    <h1 className="fw-bold ms-3 mb-0 fs-3">
                        Brieflands
                    </h1>
                    {
                        ( 
                            journal !== undefined && 
                            Object.keys( journal ).length > 0 
                        ) &&
                            <span className="ms-2 d-none d-md-block fw-bold text-shadow-light">
                                { 
                                    journal?.attributes?.title 
                                        ? `| ${ journal?.attributes?.title }` 
                                        : '' 
                                }
                            </span>
                    }
                </div>
            </div>
            {
                ( 
                    user !== undefined && 
                    Object.keys( user ).length > 0 
                ) &&
                    <div className="logo px-3 d-flex align-items-center">
                        <span 
                            className="me-2 d-none d-md-block text-nowrap fs-7 fw-bold text-blue-light text-shadow-dark">
                            { user.attributes?.full_name }
                        </span>
                        <img 
                            className="img-circle img-tiny box-shadow" 
                            src={ user?.attributes?.avatar } 
                            alt={ user?.attributes?.full_name } 
                            title={ user?.attributes?.full_name } 
                        />
                    </div>
            }  
        </div>
    )
}

export default Header
