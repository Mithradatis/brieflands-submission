import DataTable from 'react-data-table-component'
import { Button, Alert, AlertTitle, TextField } from '@mui/material'
import { Scrollbars } from 'react-custom-scrollbars'
import { useState, useMemo } from 'react'

const FilterComponent = ({ filterText, onFilter, onClear }) => (
    <>
        <TextField
            id="search"
            type="text"
            placeholder="Filter By Name"
            aria-label="Search Input"
            value={filterText}
            onChange={onFilter}
        />
        <Button type="button" onClick={onClear}>
            X
        </Button>
    </>
);

const AuthorsStep = ({formStep, handleModal, modalCalledFormData}) => {
    const columns = [
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
    const filteredItems = modalCalledFormData.filter(item => {
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
                onClear={handleClear}
            />
		);
	}, [filterText, resetPaginationToggle]);

    return (
        <>
            <div id="authors" className={`tab${formStep === 'authors' ? ' active' : ''}`}>
                <h3 className="mb-4 text-shadow-white">Authors</h3>
                <Scrollbars
                    className="mb-4"
                    style={{ width: 500, height: 200 }}
                    universal={true}
                    autoHide
                    autoHideTimeout={500}
                    autoHideDuration={200}>
                    <Alert severity="info" className="mb-4">
                        <AlertTitle>Important Note</AlertTitle>
                        <h5>How to Add a new Author?</h5>
                        <ul>
                            <li>
                                First, type the author's email (in the Email field) and click "Search." 
                            </li>
                            <li>
                                If the author is already registered with the publisher, add the author to the list of authors.
                            </li>
                            <li>
                                If the author is not registered yet in our publisher, complete the author information and proceed.
                            </li>
                            <li>
                                To edit authors' affiliations, press the Edit button.
                            </li>
                        </ul>
                        <h5>Notes:</h5>
                        <ul>
                            <li>
                                Define the Authors' affiliation and order of authors in this step.
                            </li>
                            <li>
                                Author's affiliation: [department], [university], [city], [country]
                            </li>
                            <li>
                                After submission, only the "Corresponding Author" can re-submit and follow the submission steps (e.g., submit a revision, pay the acceptance fee, upload final galley proof, and other official publishing actions). Read more
                            </li>
                            <li>
                                In this step, the site will create an account for each email registered then the manuscript will be accessible only for that account.
                            </li>
                            <li>
                                Read more about ORCID.
                            </li>
                        </ul>    
                    </Alert>
                </Scrollbars>
                <Button className="btn btn-primary btn-lg mb-4" onClick={handleModal}>Add Author</Button>
                <DataTable
                    title="Authors"
                    subHeader
                    subHeaderComponent={subHeaderComponentMemo}
                    persistTableHead
                    pagination
                    columns={columns}
                    data={filteredItems}
                />
            </div>
        </>
    );
}

export default AuthorsStep;