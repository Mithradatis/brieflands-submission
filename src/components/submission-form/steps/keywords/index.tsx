import StepPlaceholder from '@components/partials/placeholders/step-placeholder'
import ReactHtmlParser from 'react-html-parser'
import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/store'
import { Alert } from '@mui/material'
import { formValidator, handleIsVerified } from '@features/wizard/wizardSlice'
import { 
    Autocomplete,
    FormControl, 
    FormLabel, 
    FormHelperText, 
    createFilterOptions, 
    CircularProgress 
} from '@mui/joy'
import { 
    useGetStepDataQuery, 
    useGetStepGuideQuery, 
    useUpdateStepDataMutation 
} from '@/app/services/apiSlice'
import {
    useLazyFindKeywordsQuery,
    useLazyGetKeywordsQuery,
    useGetKeywordsListQuery,
    useAddNewKeywordMutation
} from '@/app/services/steps/keywords'
const KeywordsStep = forwardRef(
    ( 
        props: { 
            apiUrls: { 
                stepDataApiUrl: string, 
                stepGuideApiUrl: string 
            },
            details: string,
            workflowId: string
        }, 
        ref 
    ) => {
    const dispatch = useAppDispatch();
    const isVerified = useAppSelector( ( state: any ) => state.wizard.isVerified );
    const [ isSearching, setIsSearching ] = useState<boolean>( false );
    const [ keywordsBuffer, setKeywordsBuffer ] = useState<object[]>([]);
    const [ keywordsList, setKeywordsList ] = useState<object[]>([]);
    const [ formData, setFormData ] = useState<any>({
        ids: [],
    });
    const getAllKeywordsFromApi = 'journal/keyword';
    const { data: allKeywords, isLoading: allKeywordsIsLoading } = useGetKeywordsListQuery( getAllKeywordsFromApi );
    const { data: stepGuide, isLoading: stepGuideIsLoading } = useGetStepGuideQuery( props.apiUrls.stepGuideApiUrl );
    const { data: stepData, isLoading: stepDataIsLoading } = useGetStepDataQuery( props.apiUrls.stepDataApiUrl );
    const isLoading: boolean = ( allKeywordsIsLoading && stepGuideIsLoading && stepDataIsLoading && typeof stepGuide !== 'string' );
    const [ getKeywordsTrigger ] = useLazyGetKeywordsQuery();
    const [ findKeywordsTrigger ] = useLazyFindKeywordsQuery();
    const [ addNewKeywordTrigger ] = useAddNewKeywordMutation();
    const [ updateStepDataTrigger ] = useUpdateStepDataMutation();
    const filter = createFilterOptions();
    useEffect(() => {
        if ( stepData ) {
            setFormData( ( prevState: any ) => ({ ...prevState, ids: [...prevState.ids, stepData ] }) );
            stepData.map( ( item: any ) => {
                const findKeywordInApi = `${ getAllKeywordsFromApi }/${ item }`;
                getKeywordsTrigger( findKeywordInApi ).then( ( response: any ) => {
                    setKeywordsList( prevState => [ ...prevState, response.data ] );
                });
            });
        }
    }, [stepData]);
    useEffect(() => {
        const formIsValid = Object.values( formData ).every( ( value: any ) => value.length > 0 );
        dispatch( formValidator( formIsValid ) );
    }, [formData]);
    useImperativeHandle(ref, () => ({
        async submitForm () { 
          let isAllowed = false;   
          try {
            await updateStepDataTrigger({
                url: props.apiUrls.stepDataApiUrl,
                data: formData 
            });
            isAllowed = true;
          } catch ( error ) {
            console.error( "Error while submitting form:", error );
          }  
          
          return isAllowed;
        }
    }));

    return (
        isLoading
            ? <StepPlaceholder/>
            :
                <div id="keywords" className="tab">
                    <h3 className="mb-4 text-shadow-white">Keywords</h3>
                    {
                        ( 
                            props.details !== undefined && 
                            props.details !== '' 
                        ) &&
                            <Alert severity="error" className="mb-4">
                                { ReactHtmlParser( props.details ) }
                            </Alert>
                    }
                    {
                        ( 
                            typeof stepGuide === 'string' && 
                            stepGuide.trim() !== '' 
                        ) && (
                            <Alert severity="info" className="mb-4">
                                { ReactHtmlParser( stepGuide ) }
                            </Alert>
                        )
                    }
                    <FormControl 
                        className="mb-3" 
                        error={ 
                            isVerified && 
                            formData?.ids?.length > 0
                        }>
                        <FormLabel className="fw-bold mb-2">
                            Please Choose
                        </FormLabel>
                        <Autocomplete
                            multiple
                            required
                            freeSolo
                            color="neutral"
                            size="md"
                            variant="soft"
                            placeholder="Choose one…"
                            disabled={false}
                            name="documentKeywords"
                            id="documentKeywords"
                            loading={ isSearching }
                            endDecorator={
                                isSearching ? (
                                    <CircularProgress 
                                        size="sm" 
                                        sx={{ bgcolor: 'background.surface' }} 
                                    />
                                ) : null
                            }
                            options={ keywordsBuffer?.length > 0 
                                ? keywordsBuffer.map( ( item: any ) => item.attributes?.title )
                                : []
                            }
                            value={ keywordsList?.length > 0 
                                ? keywordsList.map( ( item: any ) => item?.attributes?.title )
                                : [] 
                            }
                            onInputChange={ async ( event, value ) =>  {
                                if ( value.length > 0 ) {
                                    const findKeywordInApi = 
                                        `${ getAllKeywordsFromApi }?filter[title]=${ value }`;
                                    setIsSearching( true );
                                    const foundedKeywords = await findKeywordsTrigger( findKeywordInApi );
                                    await setKeywordsBuffer( foundedKeywords.data );
                                    setIsSearching( false );
                                } else {
                                    setKeywordsBuffer([]);
                                }
                            }}
                            onChange={ ( event, value, reason ) => {
                                !isVerified && dispatch(handleIsVerified());
                                const selectedIds: any = [];
                                const handleKeywordSelection = async ( keyword: any ) => {
                                    if ( value.length > 0 ) {
                                        const findKeywordInApi = 
                                            `${getAllKeywordsFromApi}?filter[title]=${ keyword }`;
                                        setIsSearching( true );    
                                        const foundedKeywords = await findKeywordsTrigger( findKeywordInApi );
                                        await setKeywordsBuffer( foundedKeywords.data );
                                        setIsSearching( false );    
                                        let isNewKeyword = true;
                                        isNewKeyword = !keywordsBuffer.some( 
                                            ( item: any ) => item.attributes.title === keyword 
                                        );
                                        if ( isNewKeyword ) {
                                            const newKeyword = {
                                                "title": keyword,
                                                "show_in_cloud": true
                                            }                                        
                                            const newAddedKeyword = await addNewKeywordTrigger(
                                                { 
                                                    url: getAllKeywordsFromApi, 
                                                    data: newKeyword 
                                                } 
                                            );
                                            setFormData((prevState: { ids: object[] }) => ({
                                                ...prevState,
                                                ids: [...prevState.ids, newAddedKeyword.id],
                                            }));
                                        } else {
                                            const selectedOptions: any = [];
                                            const selectedOption: any = keywordsBuffer.find( 
                                                ( item: any ) => item.attributes.title.trim() === keyword
                                            );
                                            const isDuplicate = keywordsList.some(
                                                ( item: any ) => ( 
                                                    selectedOption && item.id === selectedOption.id 
                                                ) 
                                            );
                                            if ( !isDuplicate ) {
                                                selectedOptions.push( selectedOption?.id );
                                                keywordsList.push( selectedOption );
                                                setFormData((prevState: { ids: object[] }) => ({
                                                    ...prevState,
                                                    ids: [...prevState.ids, selectedOption.id],
                                                }));
                                            }
                                        }
                                    }  
                                };
                                if ( reason === 'selectOption' ) {
                                    handleKeywordSelection( value[value.length - 1 ] );
                                }
                                if ( reason === 'removeOption' ) {
                                    setKeywordsList([]);
                                    value.forEach( ( title: string ) => {
                                        const selectedOption: any = keywordsList.find( 
                                            ( item: any ) => item.attributes?.title.trim() === title
                                        );
                                        if ( selectedOption ) {
                                            setKeywordsList( prevState => [...prevState, selectedOption] );
                                            selectedIds.push( selectedOption?.id );
                                        }
                                    });
                                    setFormData( { ids: selectedIds } );
                                }
                                setKeywordsBuffer([]);
                            }}
                            filterOptions={ ( options, params ) => {
                                if ( isSearching ) {
                                    return ['Please wait...'];
                                }
                                const filtered = filter(options, params);
                                const { inputValue } = params;
                                const isExisting = options.some((option) =>
                                    inputValue === option
                                );
                                if ( inputValue !== '' && !isExisting ) {
                                    filtered.push( inputValue );
                                }
                            
                                return filtered;
                            }}
                            getOptionDisabled={ ( option: any ) =>
                                option === 'Please wait...'
                            }
                        />
                        {
                            ( 
                                isVerified && 
                                formData?.ids?.length === 0
                            ) 
                            && <FormHelperText className="fs-7 text-danger mt-1">
                                    You should enter at least one keyword
                               </FormHelperText> 
                        }
                    </FormControl>
                </div>
    );
});

KeywordsStep.displayName = 'KeywordsStep';

export default KeywordsStep;