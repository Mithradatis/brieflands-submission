import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'

const KeywordsStep = ({formStep}) => {
    const Keywords = [
        { id: 1, title: 'The Shawshank Redemption', year: 1994 },
        { id: 2, title: 'The Godfather', year: 1972 },
        { id: 3, title: 'The Godfather: Part II', year: 1974 },
        { id: 4, title: 'The Dark Knight', year: 2008 },
        { id: 5, title: '12 Angry Men', year: 1957 },
        { id: 6, title: "Schindler's List", year: 1993 },
        { id: 7, title: 'Pulp Fiction', year: 1994 }
    ];

    return (
        <>
            <div id="keywords" className={`tab${formStep === 'keywords' ? ' active' : ''}`}>
                <h3 className="mb-4 text-shadow-white">Keywords</h3>
                <Autocomplete
                    multiple
                    id="keywords"
                    options={Keywords}
                    getOptionLabel={(option) => option.title}
                    defaultValue={[Keywords[2]]}
                    filterSelectedOptions
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Selected Keywords"
                            placeholder="Add another keyword"
                        />
                    )}
                />
            </div>
        </>
    );
}

export default KeywordsStep;