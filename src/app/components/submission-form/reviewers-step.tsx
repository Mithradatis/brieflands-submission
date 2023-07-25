import { useState, useEffect, useMemo, forwardRef, useImperativeHandle } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Alert } from '@mui/material'
import { Input } from '@mui/joy'
import { Scrollbars } from 'react-custom-scrollbars'
import { handleOpen } from '@/app/features/modal/modalSlice'
import { wizardState } from '@/app/features/wizard/wizardSlice'
import { stepState, handleInput } from '@/app/features/submission/reviewersSlice'
import { getReviewersStepGuide, getReviewers, getReviewersStepData, updateReviewersStepData } from '@/app/api/reviewers'
import { addReviewerModalState } from '@/app/features/modal/addReviewerModalSlice'
import DataTable, { TableColumn } from 'react-data-table-component'
import ReactHtmlParser from 'react-html-parser'

const FilterComponent = ({ filterText, onFilter, onClear }: { filterText: string, onFilter: (event: React.ChangeEvent<HTMLInputElement>) => void, onClear: () => void }) => (
    <>
        <Input
            variant="soft"
            size="sm"
            id="search"
            type="text"
            placeholder="Filter By Name"
            aria-label="Search Input"
            autoComplete="off"
            onChange={onFilter}
            endDecorator={<i className="fa-duotone fa-remove" onClick={onClear}></i>}
        />
    </>
);

const ReviewersStep = forwardRef( ( prop, ref) => {
    const formState = useSelector( stepState );
    const wizard = useSelector( wizardState );
    const addReviewerModalData = useSelector( addReviewerModalState );
    const dispatch = useDispatch();
    const getStepDataFromApi = `http://apcabbr.brieflands.com.test/api/v1/submission/workflow/365/${ wizard.formStep }`;
    const getDictionaryFromApi = `http://apcabbr.brieflands.com.test/api/v1/dictionary/get/journal.submission.step.${wizard.formStep}`;
    useEffect(() => {
        if ( wizard.formStep === 'reviewers' ) {
            dispatch( getReviewersStepData( getStepDataFromApi ) );
            dispatch( getReviewersStepGuide( getDictionaryFromApi ) );
        }
    }, [wizard.formStep]);
    useImperativeHandle(ref, () => ({
        submitForm () {
          dispatch( updateReviewersStepData( getStepDataFromApi ) );
        }
    }));
    const columns: TableColumn<{ name: string; email: string; }>[] = [
        {
          name: 'name',
          selector: row => row.name,
          sortable: true,
        },
        {
          name: 'email',
          selector: row => row.email,
          sortable: true,
        },
    ];
    const [filterText, setFilterText] = useState('');
	const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
    const filteredItems = addReviewerModalData.datatableRows.filter((item: { [key: string]: string }) => {
        const rowValues = Object.values(item);
        return rowValues.some(value => {
            if (typeof value === 'string') {
                const formattedValue = value.replace(/\s/g, '').toLowerCase();
                const formattedFilterText = filterText.replace(/\s/g, '').toLowerCase().trim();
                return formattedValue.includes(formattedFilterText);
            }
            return false;
        });
    });
    const subHeaderComponentMemo = useMemo(() => {
		const handleClear = () => {
			if (filterText) {
				setResetPaginationToggle(!resetPaginationToggle);
				setFilterText('');
			}
		};

		return (
			<FilterComponent   
                filterText={filterText}
                onFilter={ event => setFilterText(event.target.value)}
                onClear={ handleClear }
            />
		);
	}, [filterText, resetPaginationToggle]);

    return (
        <>
            <div id="reviewers" className={`tab${wizard.formStep === 'reviewers' ? ' active' : ''}`}>
                <h3 className="mb-4 text-shadow-white">Reviewers</h3>
                {   formState.stepGuide !== undefined &&     
                    <Scrollbars
                        className="mb-4"
                        style={{ width: 500, height: 200 }}
                        universal={true}
                        autoHide
                        autoHideTimeout={500}
                        autoHideDuration={200}>
                        {   formState.stepGuide !== undefined &&     
                            <Alert severity="info" className="mb-4">
                                { ReactHtmlParser( formState.stepGuide ) }
                            </Alert>
                        }
                    </Scrollbars>
                }
                <Button className="btn btn-primary btn-lg mb-4" onClick={() =>dispatch( handleOpen( { title: 'Add an Author', parent: wizard.formStep} ) )}>
                    Add Reviewer
                </Button>
                { 
                    addReviewerModalData.datatableRows.length > 0 &&
                    <DataTable
                        title={<h4 className="fs-6 mb-0">Reviewers List</h4>}
                        subHeader
                        subHeaderComponent={subHeaderComponentMemo}
                        persistTableHead
                        pagination
                        columns={columns}
                        data={filteredItems}
                    />
                }
            </div>
        </>
    );
});

export default ReviewersStep;