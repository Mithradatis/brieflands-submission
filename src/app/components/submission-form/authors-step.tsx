import ReactHtmlParser from 'react-html-parser'
import DataTable, { TableColumn } from 'react-data-table-component'
import { Button, Alert } from '@mui/material'
import { Input } from '@mui/joy'
import { Scrollbars } from 'react-custom-scrollbars'
import { useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { stepState, stepGuide } from '@/app/features/submission/submissionSlice'
import { handleOpen } from '@/app/features/modal/modalSlice'
import { addAuthorModalState } from '@/app/features/modal/addAuthorModalSlice'
import { wizardState } from '@/app/features/wizard/wizardSlice'

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

const AuthorsStep = () => {
    const formState = useSelector( stepState );
    const wizard = useSelector( wizardState );
    const stepInstruction = useSelector( stepGuide );
    const addAuthorModalData = useSelector( addAuthorModalState );
    const dispatch = useDispatch();
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
    const filteredItems = addAuthorModalData.datatableRows.filter((item: { [key: string]: string }) => {
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
            <div id="authors" className={`tab${wizard.formStep === 'authors' ? ' active' : ''}`}>
                <h3 className="mb-4 text-shadow-white">Authors</h3>
                <Scrollbars
                    className="mb-4"
                    style={{ width: 500, height: 200 }}
                    universal={true}
                    autoHide
                    autoHideTimeout={500}
                    autoHideDuration={200}>
                    {   stepInstruction.guide !== undefined &&     
                        <Alert severity="info" className="mb-4">
                            { ReactHtmlParser( stepInstruction.guide ) }
                        </Alert>
                    }
                </Scrollbars>
                <Button className="btn btn-primary btn-lg mb-4" onClick={() =>dispatch( handleOpen( { title: 'Add an Author', parent: wizard.formStep} ) )}>
                    Add Author
                </Button>
                { 
                    filteredItems.length > 0 &&
                    <div className="datatable-container">
                        <DataTable
                            title={<h4 className="fs-6 mb-0">Authors List</h4>}
                            subHeader
                            subHeaderComponent={subHeaderComponentMemo}
                            persistTableHead
                            pagination
                            columns={columns}
                            data={filteredItems}
                        />
                    </div> 
                }
            </div>
        </>
    );
}

export default AuthorsStep;