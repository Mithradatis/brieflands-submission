import { useEffect, useState } from 'react'
import { FormStep } from '@/app/services/types'
import { loadStep } from '@/app/features/wizard/wizardSlice'
import { useAppDispatch, useAppSelector } from '@/store/store'
import { Box, Link, List, ListItem, styled, Typography, useTheme } from '@mui/material'

const WizardOutline = (
    props: {
        hasTypeDetermined: boolean
    }
) => {
    const theme: any = useTheme();
    const WizardOutlineContainer = styled(Box)({
        maxWidth: '15rem',
        '& ol': {
            '& li': {
                transition: 'all ease-in-out .2s',
                opacity: 1,
                '& a': {
                    textShadow: `1px 1px 0 ${theme.palette.primary[300]}30`,
                    '&.disabled': {
                        pointerEvents: 'none',
                        opacity: .5
                    }
                },
                '&.active': {
                    fontSize: '1rem',
                    fontWeight: 700,
                    '& a': {
                        'span:nth-of-type(2)': {
                            color: theme.palette.primary[300],
                            textShadow: '1px 1px 0 rgba(61, 106, 110, .75)'
                        }
                    }
                }
            }
        }
    });
    const dispatch = useAppDispatch();
    const formSteps: FormStep[] = useAppSelector((state: any) => state.wizard.formSteps);
    const formStep = useAppSelector((state: any) => state.wizard.currentStep);
    useEffect(() => {
        const animationDuration = .5;
        const animationDelay = .05;
        const items = document.querySelectorAll('.animated-items > .item');
        items.forEach((item: any, index: number) => {
            item.style.opacity = '1';
            item.style.animation = `fadeInRight ${animationDuration}s ease ${index * animationDelay}s both`;
        });
    }, [formSteps]);

    return (
        <WizardOutlineContainer
            py={4}
            pr={3}
            position="relative"
            sx={{ display: { xs: 'none', sm: 'block' } }}
        >
            <List
                component="ol"
                className="animated-items"
            >
                {
                    formSteps?.map((item: any, index: number) => {
                        const formStepTitle = item.attributes?.slug;

                        return (
                            <ListItem
                                sx={{ py: 0 }}
                                className={`${formStep === formStepTitle
                                    ? 'active '
                                    : ''}item`
                                }
                                key={formStepTitle}
                            >
                                <Link href={`#${formStepTitle}`}
                                    className={(
                                        !props.hasTypeDetermined &&
                                        (
                                            formStepTitle !== 'agreement' &&
                                            formStepTitle !== 'types'
                                        )
                                    ) ? 'disabled' : ''}
                                    sx={{ fontSize: 14 }}
                                    onClick={() => dispatch(loadStep(formStepTitle))}
                                >
                                    <Typography
                                        component="span"
                                        fontSize={14}
                                        fontWeight={700}
                                        pr={1}
                                        sx={{ display: 'inline', color: '#3a6c6c' }}
                                    >
                                        {index + 1}.
                                    </Typography>
                                    <Typography fontSize={12} fontWeight={700} sx={{ display: 'inline', textTransform: 'capitalize' }} component="span">
                                        {formStepTitle?.replace(/_/g, ' ')}
                                    </Typography>
                                    {
                                        item.attributes?.required &&
                                        <Typography
                                            component="span"
                                            variant="body-sm"
                                            
                                            pl={1}
                                            sx={{ display: 'inline' }}
                                        >*</Typography>
                                    }
                                </Link>
                            </ListItem>
                        )
                    })
                }
            </List>
        </WizardOutlineContainer>
    );
};

export default WizardOutline;