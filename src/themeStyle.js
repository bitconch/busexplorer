import {
    createMuiTheme,
} from '@material-ui/core/styles';

export const styles = theme => ({
    root: {
        width: '100%',
    },
    headBackGround: {
        backgroundImage: "url('/images/guide.jpg')"
    },
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
    title: {
        display: 'block',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing.unit,
        top: theme.spacing.unit,
        color: theme.palette.grey[500],
    },
    link: {
        color: theme.palette.primary.light,
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: '#fff',
        marginRight: theme.spacing.unit * 2,
        marginLeft: 10,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing.unit * 3,
            width: 'auto',
        },
    },
    searchIcon: {
        width: '35px',
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
        width: '100%',
    },
    inputInput: {
        paddingTop: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
        paddingLeft: '32px',
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: 300,
        },
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },
    sectionMobile: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
    dataStyle: {
        position: "relative",
        margin: "auto",
        width: "100%",
        height: "100%",
        backgroundColor: '#f4f5f9',
    },
    dataTitle: {
        color: '#647273',
        paddingLeft: '10px',
    },
    dataTableCellTitle: {
        color: '#647273',
        fontSize: '0.95rem',
        padding: '4px 24px 4px 24px',
    },
    dataTableCell: {
        paddingTop: '5px',
        color: '#647273',
    },
    gridBackColor: {
        backgroundColor: '#2976c0',
    },
    dataContent: {
        float: "left",
        width: "49%",
    },
    dataContentMarginLeft: {
        marginLeft:"22px",
    },
    sideBySideHeader: {
        width: "100%",
        flex: "0 0 50%",
        padding: '20px 0 20px 0',
        [theme.breakpoints.up('md')]: {
            color: '#fff',
            flex: 'auto',
            margin: '0 5px 0 5px',
        }
    },
    headerTypography: {
        color:"#fff",
    },
    statsGridIcon: {
        width: "40px",
        height: "40px",
    },
    dataListItemTitles: {
        color: '#647273',
        paddingLeft: '10px',
        display: "flex",
        textAlign: "left",
        paddingTop: "10px",
    },
    dataListItemTitle: {
        marginLeft: "10px",
        lineHeight: "30px",
    },
    dataListItemIcon: {
        width: "30px",
        height: "30px",
    },
    sideBySideHeaderSecond: {
        display: "flex",
        flexWrap: "wrap",
        width: "calc(100% + 16px)",
        margin: "-8px",
        [theme.breakpoints.up('md')]: {
            flexWrap: "unset",
            flexDirection: "row",
            justifyContent: "center",
            borderRadius: "4px",
            boxShadow: "0px 1px 3px 0px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 2px 1px -1px rgba(0,0,0,0.12)",
        },
        backgroundColor: '#0091C8',
    },
    dataListContainer: {
        backgroundColor: '#f4f5f9',
        width: "100%",
        paddingLeft: "15px",
        paddingRight: "15px",
        boxShadow: "none",
    },
    dataListGrid: {
        width: "100%",
        backgroundColor: '#fff',
        borderRadius: '4px',
        color: '#647273',
        [theme.breakpoints.up('md')]: {
            width: "100%",
            backgroundColor: '#fff',
            borderRadius: '4px',
            color: '#647273',
        }
    },
    dataListItemGrid: {
        width: "100%",
        backgroundColor: '#fff',
        borderRadius: '4px',
        color: '#647273',
        marginBottom: "10px",
        boxShadow: "0px 1px 3px 0px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 2px 1px -1px rgba(0,0,0,0.12)",
        [theme.breakpoints.up('md')]: {
            width: "100%",
            backgroundColor: '#fff',
            borderRadius: '4px',
            color: '#647273',
            marginBottom: "0px",
            flex: '0 0 50%',
        }
    },
    dataListItem: {
        wordBreak: 'break-word',
        border: '1px solid #DFD7CA',
        borderTop: '0',
        borderLeft: '0',
        borderRight: '0',
        borderColor: '##EEEEEE',
        padding: '10px 10px 0 10px',
    },
    dataListItemText: {
        padding: '0',
    },
    transChart: {
        width: "calc(100% + 16px)",
        margin: "-8px",
    },
    dialog: {
        margin: "20px",
    },
    dialogTh: {
        width: "20%",
        padding: "4px 5px 4px 20px",
    },
    dialogTd: {
        width: "80%",
        padding: "4px 5px 4px 20px",
    },
});

export const theme = createMuiTheme({
    palette: {
        type: 'light',
        primary: {
            main: '#f4f5f9',
        },
        secondary: {
            main: '#2BFEBC',
        },
    },
    typography: {useNextVariants: true},
});