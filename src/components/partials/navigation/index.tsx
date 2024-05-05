import { useEffect, useState, useRef } from 'react'
import { FormStep } from '@/app/services/types'
import { loadStep } from '@/app/features/wizard/wizardSlice'
import { useAppDispatch, useAppSelector } from '@/store/store'
import {
    Box,
    Link,
    List,
    ListItem,
    styled,
    Typography,
    useTheme
} from '@mui/material'

const WizardNavigation = (
    props: {
        hasTypeDetermined: boolean
    }
) => {
    const theme: any = useTheme();
    const NavigationContainer = styled(Box)({
        position: 'relative',
        overflow: 'hidden',
        zIndex: 2,
        paddingTop: '2rem'
    });
    const Navigation = styled(Box)({
        position: 'relative',
        '&::before': {
            content: '""',
            position: 'absolute',
            zIndex: -1,
            top: '-5px',
            left: 0,
            width: '100%',
            height: '5px',
            borderTop: `1px solid ${theme.palette.primary[400]}30`,
            backgroundImage: `linear-gradient(to left, transparent 0, ${theme.palette.primary[600]
                } 30%, ${theme.palette.primary[600]
                } 50%, ${theme.palette.primary[600]
                } 70%, transparent 100%)`,
        },
        '& .start-gradient, & .end-gradient': {
            pointerEvents: 'none',
            position: 'absolute',
            zIndex: 3,
            top: 0,
            width: '8rem',
            height: '100%',
        },
        '& .start-gradient': {
            left: 0,
            backgroundImage: `linear-gradient(to right, ${theme.palette.primary[500]
                } 0, ${theme.palette.primary[500]
                } 20%, ${theme.palette.primary[500]
                }40 50%, transparent 100%)`,
        },
        '& .end-gradient': {
            right: 0,
            backgroundImage: `linear-gradient(to left, ${theme.palette.primary[500]
                } 0, ${theme.palette.primary[500]
                } 20%, ${theme.palette.primary[500]
                }40 50%, transparent 100%)`,
        },
    });
    const NavigationList = styled(List)({
        listStyle: 'none',
        positions: 'relative',
        display: 'flex',
        alignItems: 'center',
        transition: 'transform .5s ease-in',
    });
    const NavigationListItem = styled(ListItem)({
        transition: 'transform .5s ease-in',
        '& a': {
            transition: 'all ease-in .5s',
            fontSize: '.8rem',
            opacity: '.75',
            '.index': {
                borderRadius: '50%',
            },
            '&.disabled': {
                pointerEvents: 'none',
                opacity: '.5'
            },
        },
        '&.active': {
            '& a': {
                opacity: '1',
                minWidth: '10rem',
                fontWeight: '700',
                fontSize: '1rem',
                transform: 'scale(1.1, 1.1)',
                transition: 'transform .5s ease-in',
                '.index': {
                    position: 'relative',
                    transition: 'all ease-in .2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    top: '-2rem',
                    marginBottom: '.5rem',
                    fontSize: '1rem',
                    color: 'var(--neutral)',
                    textShadow: '1px 1px 0 lighten(#f7c370, 10%)',
                    width: '2.5rem',
                    height: '2.5rem',
                    backgroundImage: 'linear-gradient(45deg, #ecc07b, #f7c370)',
                    boxShadow: '0 0 10px rgba(black, .1)',
                    '&::before': {
                        content: '""',
                        width: '3.5rem',
                        height: '3.5rem',
                        position: 'absolute',
                        top: '-.5rem',
                        left: '-.5rem',
                        backgroundColor: theme.palette.primary[600],
                        borderRadius: '50%',
                        zIndex: '-2',
                        boxShadow: 'inset 0 0 6px rgba(black, .1)',
                    },
                    '&::after': {
                        content: '""',
                        width: '3rem',
                        height: '3rem',
                        position: 'absolute',
                        top: '-.25rem',
                        left: '-.25rem',
                        backgroundColor: theme.palette.primary[500],
                        borderRadius: '50%',
                        zIndex: '-2',
                    },
                    '.number': {
                        zIndex: '3',
                    },
                    '.waves': {
                        overflow: 'hidden',
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        '.wave': {
                            opacity: .4,
                            position: 'absolute',
                            top: '-50%',
                            left: '-25%',
                            background: 'rgb(233, 207, 135)',
                            width: '150%',
                            height: '150%',
                            marginTop: '-10px',
                            transformOrigin: '50% 48%',
                            borderRadius: '43%',
                            animation: 'drift 5s infinite linear',
                        },
                        '.wave.-two': {
                            animation: 'drift 9s infinite linear',
                            opacity: '.1',
                            background: 'yellow',
                        },
                        '.wave.-three': {
                            animation: 'drift 7s infinite linear',
                        }
                    }
                },
                '.index-title': {
                    color: theme.palette.primary[300],
                    position: 'relative',
                    top: '-1rem',
                    textShadow: `1px 1px 0 ${theme.palette.primary[700]}75`,
                }
            }
        }
    });
    const dispatch = useAppDispatch();
    const formSteps: FormStep[] = useAppSelector((state: any) => state.wizard.formSteps);
    const formStep = useAppSelector((state: any) => state.wizard.currentStep);
    const [leftOffset, setLeftOffset] = useState<number>(0);
    const navigationListRef = useRef<HTMLUListElement>(null);
    useEffect(() => {
        if (navigationListRef.current) {
            const stepsList = navigationListRef.current;
            const activeStep = stepsList.querySelector('li.active');
            if (stepsList.parentNode instanceof HTMLElement && activeStep !== null) {
                const parentWidth = stepsList.parentNode.clientWidth;
                const activeStepRect = activeStep.getBoundingClientRect();
                const stepsListRect = stepsList.getBoundingClientRect();
                const leftOffset = activeStepRect.left - stepsListRect.left + (activeStepRect.width / 2) - (parentWidth / 2);
                setLeftOffset(-leftOffset);
            }
        }
    }, [formStep]);

    return (
        <NavigationContainer
            sx={{ float: 'inline-end', width: { xs: '100%', sm: '100%', md: '725px' } }}>
            <Navigation className="relative" id="submission-form-wizard">
                <Box className="start-gradient bg-texture"></Box>
                <Box component="span" className="end-gradient bg-texture"></Box>
                <NavigationList
                    ref={navigationListRef}
                    sx={{ transform: `translateX(${leftOffset}px)` }}
                >
                    {
                        formSteps?.map((item: any, index: number) => {
                            const formStepTitle = item.attributes?.slug;

                            return (
                                <NavigationListItem
                                    className={`${formStep === formStepTitle ? 'active' : ''}`} key={formStepTitle}>
                                    <Link
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        flexDirection="column"
                                        href={`#${formStepTitle}`}
                                        className={
                                            `${(
                                                !props.hasTypeDetermined &&
                                                (
                                                    formStepTitle !== 'agreement' &&
                                                    formStepTitle !== 'types'
                                                )
                                            )
                                                ? ' disabled'
                                                : ''
                                            }`
                                        }
                                        onClick={() => dispatch(loadStep(formStepTitle))}>
                                        <Typography fontWeight={700} className="index flex items-center justify-center">
                                            <Typography fontWeight={700} className="number" sx={{ color: '#3a6c6c' }}>
                                                {index + 1}
                                            </Typography>
                                            <Typography className="waves">
                                                <Typography className="wave"></Typography>
                                                <Typography className="wave -two"></Typography>
                                                <Typography className="wave -three"></Typography>
                                            </Typography>
                                        </Typography>
                                        <Typography
                                            fontSize={14}
                                            fontWeight="bold"
                                            textTransform="capitalize"
                                            className="index-title"
                                        >
                                            {
                                                formStepTitle?.replace(/_/g, ' ')
                                            }
                                        </Typography>
                                    </Link>
                                </NavigationListItem>
                            )
                        })
                    }
                </NavigationList>
            </Navigation>
        </NavigationContainer>
    );
};

export default WizardNavigation;