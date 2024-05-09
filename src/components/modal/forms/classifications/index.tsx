import ModalContent from '@components/modal'
import { forwardRef, useState, useImperativeHandle } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight, faRemove } from '@fortawesome/pro-duotone-svg-icons'
import { 
    Box, 
    Button,
    List,
    ListItem,
    ListItemText, 
    Stack, 
    Typography 
} from '@mui/material'

const ClassificationsManagement = forwardRef(
    (
        props: {
            isOpen: boolean,
            handleClose: () => void
        },
        ref
    ) => {
    const [classifications, setClassifications]: any = useState([]);
    const [selectedClassifications, setSelectedClassifications] = useState<{ classification: string }[]>([]);
    const [disabledClassifications, setDisabledClassifications] = useState<{ [key: string]: boolean }>({});
    const selectClassification = (classification: any) => {
        setSelectedClassifications((prevClassifications) => [...prevClassifications, classification]);
        setDisabledClassifications((prevDisabledClassifications) => ({
            ...prevDisabledClassifications,
            [classification]: true,
        }));
    };
    const removeClassification = (index: any, classification: any) => {
        setSelectedClassifications((prevClassifications) => {
            const updatedClassifications = [...prevClassifications];
            updatedClassifications.splice(index, 1);
            return updatedClassifications;
        });
        setDisabledClassifications((prevDisabledClassifications) => ({
            ...prevDisabledClassifications,
            [classification]: false,
        }));
    };
    useImperativeHandle(ref, () => ({
        setSelectedClassifications(value: any) {

        }
    }));

    return (
        <ModalContent
            isOpen={props.isOpen}
            modalTitle="Classifications"
            onClose={props.handleClose}
            modalActions={
                <Button className="button btn_primary"
                    onClick={() => {
                        // dispatch(handleClassifications(selectedClassifications));
                        props.handleClose();
                    }
                    }>
                    Add
                </Button>
            }>
            <Stack direction="row" alignItems="center">
                <Box pr={3}>
                    <Typography
                        variant="h5"
                        color="muted"
                    >
                        Available Classifications
                    </Typography>
                    <List>
                        {
                            classifications?.map((item: any, index: number) => {
                                return (
                                    <ListItem
                                        className="mb-2 bg-light rounded"
                                        key={index}
                                    >
                                        <ListItemText>
                                            {item.attributes.title}
                                        </ListItemText>
                                        <Button
                                            size="small"
                                            onClick={() => {
                                                const selectedIds: any = [];
                                                selectedIds.push(item.id);
                                                selectClassification(item.attributes.title);
                                                setClassifications(
                                                    (prevState: any) => (
                                                        [
                                                            ...prevState,
                                                            selectedIds
                                                        ]
                                                    )
                                                )
                                            }}
                                            disabled={
                                                disabledClassifications[item.attributes.title]
                                            }
                                        >
                                            <FontAwesomeIcon icon={faAngleRight} />
                                        </Button>
                                    </ListItem>
                                );
                            })
                        }
                    </List>
                </Box>
                <Box className="flex-fill ps-4">
                    <Typography
                        variant="h5"
                        className="fs-7 fw-bold text-muted"
                    >
                        Selected Classifications
                    </Typography>
                    <List id="selected-classifications">
                        {selectedClassifications.map((item: any, index: any) => (
                            <ListItem className="mb-2 bg-light rounded" key={index}>
                                <ListItemText>
                                    {item}
                                </ListItemText>
                                <Button
                                    color="error"
                                    size="small"
                                    onClick={() => removeClassification(index, item)}
                                >
                                    <FontAwesomeIcon icon={faRemove} />
                                </Button>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Stack>
        </ModalContent>
    )
});

ClassificationsManagement.displayName = 'ClassificationsManagement';

export default ClassificationsManagement;