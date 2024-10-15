import {
    Tab,
    Tabs,
    Typography,
} from '@mui/material';
import Box from "@mui/material/Box"
import {
    useNavigate,
    useLocation,
    useParams,
} from 'react-router-dom';
import React, { lazy, Suspense } from 'react';
import LoaderPage from '../../Components/LoaderPage';
import Validation from './Validation/Validation';
import EPIssue from './EPIssue/EPIssue';
import { EPDataProvider } from '../../providers/EPDataProvider';
import DataPreparation from './DataPreparation/DataPreparation';

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ py: 1 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const EPIssuance = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [value, setValue] = React.useState(0);

    React.useEffect(() => {
        const tab = parseInt(location.search.split('=')[1]);

        if (tab >= 0 && tab < 3) {
            setValue(tab);
        } else {
            setValue(0);
        }
    }, [location.search]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
        const path = location.pathname;
        navigate(path + '?Tab=' + newValue);
    };

    return (
        <EPDataProvider>
            <Box
                sx={{ width: '100%' }}
            >
                <Box
                    sx={{
                        borderBottom: 1,
                        borderColor: 'divider'
                    }}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        aria-label="Tabs of EP Issuance"
                    >
                        <Tab
                            label="Validation"
                            {...a11yProps(0)}
                        />
                        <Tab
                            label="Data Preparation"
                            {...a11yProps(1)}
                        />
                        <Tab
                            label="EP Issue"
                            {...a11yProps(2)}
                        />
                    </Tabs>
                </Box>
                <CustomTabPanel
                    value={value}
                    index={0}
                >
                    <Suspense fallback={<LoaderPage />}><Validation /></Suspense>
                </CustomTabPanel>
                <CustomTabPanel
                    value={value}
                    index={1}
                >
                    <Suspense fallback={<LoaderPage />}><DataPreparation /></Suspense>
                </CustomTabPanel>
                <CustomTabPanel
                    value={value}
                    index={2}
                >
                    <Suspense fallback={<LoaderPage />}><EPIssue /></Suspense>
                </CustomTabPanel>
            </Box>
        </EPDataProvider>
    )
}

export default EPIssuance;