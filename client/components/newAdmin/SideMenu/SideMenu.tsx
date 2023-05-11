import React, { Dispatch, SetStateAction } from 'react';
import { styled, Theme, CSSObject } from '@mui/material/styles';
import { useRouter } from 'next/router';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import Typography from '@mui/material/Typography';
import HomeIcon from '@mui/icons-material/Home';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const Accordion = styled((props: AccordionProps) => <MuiAccordion disableGutters elevation={0} square {...props} />)(
    () => ({
        border: `1px solid var(--white)`,
        '&:not(:last-child)': {
            borderBottom: 0,
        },
        '&:before': {
            display: 'none',
        },
    })
);

const AccordionSummary = styled((props: AccordionSummaryProps) => (
    <MuiAccordionSummary
        expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem', color: 'var(--white)' }} />}
        {...props}
    />
))(() => ({
    backgroundColor: 'var(--middlegrey)',
    color: 'var(--white)',
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: '10px',
    },
}));

const AccordionDetails = styled(MuiAccordionDetails)(() => ({
    padding: '0px',
    borderTop: '1px solid rgba(0, 0, 0, .125)',
    '& > p': {
        padding: '10px 0px 10px 15px',
    },
    '& > p:hover': {
        cursor: 'pointer',
        backgroundColor: 'var(--lightgrey)',
        color: 'var(--white)',
    },
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme),
    }),
}));

interface IProps {
    open: boolean;
    page: string;
    setOpen: Dispatch<SetStateAction<boolean>>;
    setPage: Dispatch<SetStateAction<string>>;
}

const SideMenu = ({ open, setOpen, setPage, page }: IProps) => {
    const router = useRouter();

    const handleDrawerToggle = () => {
        setOpen(!open);
    };
    const handleRoute = (_route: string) => {
        router.push(_route);
    };

    const [expanded, setExpanded] = React.useState<string | false>('panel1');
    const [txOpen, setTxOpen] = React.useState<boolean>(false);

    const handleChange = (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
        setExpanded(newExpanded ? panel : false);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Drawer variant="permanent" open={open}>
                <DrawerHeader>
                    <IconButton onClick={handleDrawerToggle}>
                        {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />

                <List>
                    {['Overview', 'Currency'].map((text, index) => (
                        <ListItem key={text} disablePadding sx={{ display: 'block' }}>
                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                }}
                                onClick={() => {
                                    setPage(text);
                                }}
                                selected={page == text}
                            >
                                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                <Divider />
                <List>
                    <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                            {open && <Typography>CRUD</Typography>}
                        </AccordionSummary>
                        <AccordionDetails>
                            {open && (
                                <>
                                    <ListItem disablePadding sx={{ display: 'block' }}>
                                        <ListItemButton
                                            sx={{
                                                minHeight: 48,
                                                justifyContent: open ? 'initial' : 'center',
                                                px: 2.5,
                                            }}
                                            onClick={() => {
                                                setPage('Stake');
                                            }}
                                            selected={page == 'Stake'}
                                        >
                                            <ListItemText primary={'Stake'} sx={{ opacity: open ? 1 : 0 }} />
                                        </ListItemButton>
                                    </ListItem>
                                    <ListItem disablePadding sx={{ display: 'block' }}>
                                        <ListItemButton
                                            sx={{
                                                minHeight: 48,
                                                justifyContent: open ? 'initial' : 'center',
                                                px: 2.5,
                                            }}
                                            onClick={() => {
                                                setPage('ICO');
                                            }}
                                            selected={page == 'ICO'}
                                        >
                                            <ListItemText primary={'ICO'} sx={{ opacity: open ? 1 : 0 }} />
                                        </ListItemButton>
                                    </ListItem>
                                    <ListItemButton
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'left',
                                            textAlign: 'left',
                                            padding: '0',
                                        }}
                                    >
                                        <ListItem
                                            onClick={() => {
                                                setTxOpen(!txOpen);
                                            }}
                                            sx={{
                                                position: 'relative',
                                                backgroundColor: 'var(--blue)',
                                                color: 'var(--white)',
                                                width: '100%',
                                                padding: '10px 0 10px 20px',
                                            }}
                                        >
                                            <ListItemIcon
                                                sx={{
                                                    minWidth: 0,
                                                    mr: open ? 3 : 'auto',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <ChevronRightIcon
                                                    sx={{
                                                        transform: !txOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                                                        transition: 'all 0.1s linear',
                                                    }}
                                                />
                                                <ListItemText
                                                    primary={'Transactions'}
                                                    sx={{
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        color: 'var(--white)',
                                                        paddingLeft: '10px',
                                                    }}
                                                />
                                            </ListItemIcon>
                                        </ListItem>
                                        {!txOpen && (
                                            <>
                                                <ListItem disablePadding sx={{ display: 'block', paddingLeft: '20px' }}>
                                                    <ListItemButton
                                                        sx={{
                                                            minHeight: 48,
                                                            justifyContent: open ? 'initial' : 'center',
                                                            px: 2.5,
                                                        }}
                                                        onClick={() => {
                                                            setPage('Admin');
                                                        }}
                                                        selected={page == 'Admin'}
                                                    >
                                                        <ListItemText
                                                            primary={'Admin'}
                                                            sx={{ opacity: open ? 1 : 0 }}
                                                        />
                                                    </ListItemButton>
                                                </ListItem>
                                                <ListItem disablePadding sx={{ display: 'block', paddingLeft: '20px' }}>
                                                    <ListItemButton
                                                        sx={{
                                                            minHeight: 48,
                                                            justifyContent: open ? 'initial' : 'center',
                                                            px: 2.5,
                                                        }}
                                                        onClick={() => {
                                                            setPage('User');
                                                        }}
                                                        selected={page == 'User'}
                                                    >
                                                        <ListItemText primary={'User'} sx={{ opacity: open ? 1 : 0 }} />
                                                    </ListItemButton>
                                                </ListItem>
                                            </>
                                        )}
                                    </ListItemButton>
                                </>
                            )}
                        </AccordionDetails>
                    </Accordion>
                </List>
                {open && (
                    <HomeIcon
                        onClick={() => {
                            handleRoute('/');
                        }}
                        fontSize="large"
                        sx={{
                            position: 'absolute',
                            left: '10px',
                            top: '0',
                            zIndex: '100',
                            height: '64px',
                            cursor: 'pointer',
                            '&:hover': {
                                color: 'var(--blue)',
                            },
                        }}
                    />
                )}
            </Drawer>
        </Box>
    );
};

export default SideMenu;
