import { useContext, useEffect, useState } from "react";
import ProcessHeaderWithNote from "../../../Components/ProcessHeaderWithNote";
import TimerSection from "../../../Components/TimerSection";
import MessageTable from "../Validation/MessegeTable";
import UploadedBatchList from "./UploadedBatchList";
import { styled } from '@mui/material/styles';
import { process } from "../Validation/Validation";
import { Box, Button, FormControl, MenuItem, Modal, Select, TextField, Typography } from "@mui/material";
import { EPDataContext } from "../../../providers/EPDataProvider";
import FormTitle from "../../../Components/FormTitle";
import DriveFolderUploadOutlinedIcon from '@mui/icons-material/DriveFolderUploadOutlined';
import ShowBatchDetails from "./ShowBatchDetails";
import EPIssueResponseTable from "./EPIssueResponseTable";
import ErrorText from "../../../Components/ErrorText";

const style = {
    position: 'absolute',
    top: '50%',
    left: '58%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    p: 4,
    border: 0,
    borderRadius: 2
};

// const VisuallyHiddenInput = styled("input")({
//     clip: "rect(0 0 0 0)",
//     clipPath: "inset(50%)",
//     height: 1,
//     overflow: "hidden",
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     whiteSpace: "nowrap",
//     width: 1,
// });

const formLength = 400;

const EPIssue = () => {
    const {
        isIssuing,
        setIsIssuing,
        issuingId,
        setIssuingId,
        isWithPrefix,
        setIsWithPrefix,
        fileLocation,
        setFileLocation,
        sleepTime,
        setSleepTime,
        isTestMode,
        setIsTestMode,
        PNpath,
        setPNpath,
        EXpath,
        setEXpath,
        SCpath,
        setSCpath,
        UTpath,
        setUTpath,
        CSpath,
        setCSpath,
        OTpath,
        setOTpath,
        INpath,
        setINpath,
        isShowDetails
    } = useContext(EPDataContext);
    const [open, setOpen] = useState(false);
    const [engineStatus, setEngineStatus] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [formError, setFormError] = useState(null);
    const [isGettingData, setIsGettingData] = useState(false);

    const handleSetSleepTime = (value) => {
        const convertedValue = Number(value);
        console.log(value, convertedValue)
        setSleepTime(convertedValue || 0);
    }

    const handleGetFolderPath = async (value) => {
        setIsGettingData(true);
        const filePath = await window.engine.openFile({
            title: "Select Folder",
            accept: ['openDirectory']
        });
        // console.log(filePath, value);
        if (filePath?.success === true) {
            switch (value) {
                case 'file_location':
                    setFileLocation(filePath?.path[0]);
                    return setIsGettingData(false);
                case 'PNpath':
                    setPNpath(filePath?.path[0]);
                    return setIsGettingData(false);
                case 'EXpath':
                    setEXpath(filePath?.path[0]);
                    return setIsGettingData(false);
                case 'SCpath':
                    setSCpath(filePath?.path[0]);
                    return setIsGettingData(false);
                case 'UTpath':
                    setUTpath(filePath?.path[0]);
                    return setIsGettingData(false);
                case 'CSpath':
                    setCSpath(filePath?.path[0]);
                    return setIsGettingData(false);
                case 'OTpath':
                    setOTpath(filePath?.path[0]);
                    return setIsGettingData(false);
                case 'INpath':
                    setINpath(filePath?.path[0]);
                    return setIsGettingData(false);
                default: return;
            }
        }
    }

    const handleOpen = (id) => {
        setIssuingId(id);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setFileLocation('');
        setPNpath('');
        setEXpath('');
        setSCpath('');
        setUTpath('');
        setCSpath('');
        setOTpath('');
        setINpath('');
    }

    const handleStart = async (queries) => {
        setIsIssuing(true);
        const data = {
            ...queries,
            pid: process,
            action: "SUB",
        };
        console.log("data for issuing", data);
        const p = await window.engine.startProcess(data);
        console.log(p);
        if (p.success === true) {
            setEngineStatus('Started');
            setIsLoading(true);
        }
        else {
            setEngineStatus('Start Failed');
        }
    };

    const handleStop = async () => {
        const p = await window.engine.stopProcess();
        if (p.success === true) {
            setEngineStatus('Stopped');
            setIsLoading(false);
            setIsIssuing(false);
            setIssuingId(null);
        }
    }

    const getEngineOffSignal = () => {
        window.engine.onProcessStop(function (message) {
            console.log("message stop2", message);
            setEngineStatus('Stopped');
            setIsLoading(false);
            setIsIssuing(false);
            setIssuingId(null);
        });
    }

    const getEngineOnSignal = () => {
        window.engine.onProcessStart(function (message) {
            console.log("message start2", message);
            setEngineStatus('Started');
            handleClose();
        });
    }



    useEffect(() => {
        getEngineOffSignal();
        getEngineOnSignal();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('yes')
        const queries = {};
        queries.batchId = issuingId;
        queries.isTestMode = isTestMode;
        queries.Sleep = sleepTime;
        if (isWithPrefix === true) {
            queries.withPrefix = true;
            fileLocation ?
                queries.Root = fileLocation :
                setFormError('Must select a file location!');
        }
        else {
            queries.withPrefix = false;
            INpath ?
                queries.INpath = INpath :
                setFormError('Must select a Commercial Invoice location!');
            PNpath ?
                queries.PNpath = PNpath :
                setFormError('Must select a Packing list EXP form File Location!');
            EXpath ?
                queries.EXpath = EXpath :
                setFormError('Must select a EXP form File Path!');
            SCpath ?
                queries.SCpath = SCpath :
                setFormError('Must select a T.T, L/C, SC containing export LC number File Location!');
            if (UTpath) {
                queries.UTpath = UTpath;
            }
            if (CSpath) {
                queries.CSpath = CSpath;
            }
            if (OTpath) {
                queries.OTpath = OTpath;
            }
        }
        // console.log("queries", queries);
        handleStart(queries);
    }

    return (
        <div className="relative mt-5">
            <div className="justify-center flex z-50">
                <ProcessHeaderWithNote
                    title="EP Issuance"
                    note={"No instructions added yet."}
                />
            </div>
            <div className="flex gap-2">
                <TimerSection
                    isDataToRun={true}
                    dataToRunText={'EP to Issue'}
                    isSuccess={true}
                    successText={"Issued"}
                    isFaild={true}
                    engineStatus={engineStatus}
                />
                <MessageTable />
            </div>
            <EPIssueResponseTable />
            <UploadedBatchList
                handleOpen={handleOpen}
                handleStop={handleStop}
            />
            {
                isShowDetails &&
                <ShowBatchDetails />
            }
            <Modal
                open={open}
                onClose={handleClose}
            >
                <Box sx={style}>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-y-2">
                        <div className="flex justify-between items-center gap-1">
                            <FormTitle text={"Prefix"} isCompulsory={false} length={formLength} />
                            <FormControl fullWidth>
                                <Select
                                    sx={{
                                        height: "25px",
                                        fontSize: "14px",
                                        padding: "0px 0px",
                                    }}
                                    size="small"
                                    className="editableInput"
                                    value={isWithPrefix}
                                    onChange={(e) => setIsWithPrefix(e.target.value)}
                                >
                                    <MenuItem
                                        sx={{
                                            fontSize: 14,
                                        }}
                                        value={true}
                                    >
                                        With Prefix
                                    </MenuItem>
                                    <MenuItem
                                        sx={{
                                            fontSize: 14,
                                        }}
                                        value={false}
                                    >
                                        Without Prefix
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        {isWithPrefix &&
                            <div className="flex justify-between items-center gap-1">
                                <FormTitle text={"File location"} isCompulsory={true} length={formLength} />
                                <div className="relative w-full">
                                    <TextField
                                        required
                                        sx={{
                                            "& .MuiInputBase-root": {
                                                paddingY: "1px",
                                                paddingX: "4px",
                                                fontSize: "14px",
                                                height: 25,
                                            },
                                        }}
                                        placeholder="Select folder"
                                        fullWidth
                                        type="text"
                                        size="small"
                                        name="file_location"
                                        className="editableInput"
                                        value={fileLocation}
                                        onChange={(e) => setFileLocation(e.target.value)}
                                    />
                                    <Button
                                        sx={{
                                            position: "absolute",
                                            right: "1px",
                                            height: "94%",
                                            marginTop: "1px",
                                            width: 10,
                                            bgcolor: "white",
                                            color: "#283e8a",
                                            ":hover": {
                                                color: "white",
                                            },
                                        }}
                                        component="label"
                                        variant="contained"
                                        onClick={() => handleGetFolderPath('file_location')}
                                    >
                                        <DriveFolderUploadOutlinedIcon />
                                    </Button>
                                </div>
                            </div>}
                        {isWithPrefix ||
                            <div className="flex justify-between items-center gap-1">
                                <FormTitle
                                    text={"Commercial Invoice"}
                                    isCompulsory={true}
                                    length={formLength}
                                />
                                <div className="relative w-full">
                                    <TextField
                                        required
                                        size="small"
                                        name="PNpath"
                                        variant="outlined"
                                        value={INpath}
                                        sx={{
                                            width: "100%",
                                            bgcolor: "#e8f0fe",
                                            "& .MuiInputBase-root": {
                                                height: 25,
                                                fontSize: 14,
                                            },
                                            overflow: "hidden",
                                        }}
                                        // onChange={(e) => handleFormData("PNpath", e.target.value)}
                                        inputProps={{ readOnly: true }}
                                        placeholder="Select folder"
                                    />
                                    <Button
                                        sx={{
                                            position: "absolute",
                                            right: "1px",
                                            height: "94%",
                                            marginTop: "1px",
                                            width: 10,
                                            bgcolor: "white",
                                            color: "#283e8a",
                                            ":hover": {
                                                color: "white",
                                            },
                                        }}
                                        component="label"
                                        variant="contained"
                                        onClick={() => handleGetFolderPath('INpath')}
                                    >
                                        <DriveFolderUploadOutlinedIcon />
                                    </Button>
                                </div>
                            </div>}
                        {isWithPrefix ||
                            <div className="flex justify-between items-center gap-1">
                                <FormTitle
                                    text={"Packing list EXP form File Location"}
                                    isCompulsory={true}
                                    length={formLength}
                                />
                                <div className="relative w-full">
                                    <TextField
                                        required
                                        size="small"
                                        name="PNpath"
                                        variant="outlined"
                                        value={PNpath}
                                        sx={{
                                            width: "100%",
                                            bgcolor: "#e8f0fe",
                                            "& .MuiInputBase-root": {
                                                height: 25,
                                                fontSize: 14,
                                            },
                                            overflow: "hidden",
                                        }}
                                        // onChange={(e) => handleFormData("PNpath", e.target.value)}
                                        inputProps={{ readOnly: true }}
                                        placeholder="Select folder"
                                    />
                                    <Button
                                        sx={{
                                            position: "absolute",
                                            right: "1px",
                                            height: "94%",
                                            marginTop: "1px",
                                            width: 10,
                                            bgcolor: "white",
                                            color: "#283e8a",
                                            ":hover": {
                                                color: "white",
                                            },
                                        }}
                                        component="label"
                                        variant="contained"
                                        onClick={() => handleGetFolderPath('PNpath')}
                                    >
                                        <DriveFolderUploadOutlinedIcon />
                                    </Button>
                                </div>
                            </div>}
                        {isWithPrefix ||
                            <div className="flex justify-between items-center gap-1">
                                <FormTitle
                                    text={"EXP form File Path"}
                                    isCompulsory={true}
                                    length={formLength}
                                />
                                <div className="relative w-full">
                                    <TextField
                                        required
                                        size="small"
                                        name="EXpath"
                                        variant="outlined"
                                        value={EXpath}
                                        sx={{
                                            width: "100%",
                                            bgcolor: "#e8f0fe",
                                            "& .MuiInputBase-root": {
                                                height: 25,
                                                fontSize: 14,
                                            },
                                            overflow: "hidden",
                                        }}
                                        inputProps={{ readOnly: true }}
                                        placeholder="Select folder"
                                    />
                                    <Button
                                        sx={{
                                            position: "absolute",
                                            right: "1px",
                                            height: "94%",
                                            marginTop: "1px",
                                            width: 10,
                                            bgcolor: "white",
                                            color: "#283e8a",
                                            ":hover": {
                                                color: "white",
                                            },
                                        }}
                                        component="label"
                                        variant="contained"
                                        onClick={() => handleGetFolderPath('EXpath')}
                                    >
                                        <DriveFolderUploadOutlinedIcon />
                                    </Button>
                                </div>
                            </div>}
                        {isWithPrefix ||
                            <div className="flex justify-between items-center gap-1">
                                <FormTitle
                                    text={"T.T , L/C, SC containing export LC number File Location"}
                                    isCompulsory={true}
                                    length={formLength}
                                />
                                <div className="relative w-full">
                                    <TextField
                                        required
                                        size="small"
                                        name="SCpath"
                                        variant="outlined"
                                        value={SCpath}
                                        sx={{
                                            width: "100%",
                                            bgcolor: "#e8f0fe",
                                            "& .MuiInputBase-root": {
                                                height: 25,
                                                fontSize: 14,
                                            },
                                            overflow: "hidden",
                                        }}
                                        inputProps={{ readOnly: true }}
                                        placeholder="Select folder"
                                    />
                                    <Button
                                        sx={{
                                            position: "absolute",
                                            right: "1px",
                                            height: "94%",
                                            marginTop: "1px",
                                            width: 10,
                                            bgcolor: "white",
                                            color: "#283e8a",
                                            ":hover": {
                                                color: "white",
                                            },
                                        }}
                                        component="label"
                                        variant="contained"
                                        onClick={() => handleGetFolderPath('SCpath')}
                                    >
                                        <DriveFolderUploadOutlinedIcon />
                                    </Button>
                                </div>
                            </div>}
                        {isWithPrefix ||
                            <div className="flex justify-between items-center gap-1">
                                <FormTitle
                                    text={"Undertaking duly signed by authorized person File Location"}
                                    isCompulsory={false}
                                    length={formLength}
                                />
                                <div className="relative w-full">
                                    <TextField
                                        size="small"
                                        name="UTpath"
                                        variant="outlined"
                                        value={UTpath}
                                        sx={{
                                            width: "100%",
                                            bgcolor: "#e8f0fe",
                                            "& .MuiInputBase-root": {
                                                height: 25,
                                                fontSize: 14,
                                            },
                                            overflow: "hidden",
                                        }}
                                        inputProps={{ readOnly: true }}
                                        placeholder="Select folder"
                                    />
                                    <Button
                                        sx={{
                                            position: "absolute",
                                            right: "1px",
                                            height: "94%",
                                            marginTop: "1px",
                                            width: 10,
                                            bgcolor: "white",
                                            color: "#283e8a",
                                            ":hover": {
                                                color: "white",
                                            },
                                        }}
                                        component="label"
                                        variant="contained"
                                        onClick={() => handleGetFolderPath('UTpath')}
                                    >
                                        <DriveFolderUploadOutlinedIcon />
                                    </Button>
                                </div>
                            </div>}
                        {isWithPrefix ||
                            <div className="flex justify-between items-center gap-1">
                                <FormTitle
                                    text={"Consumption Statement File Location"}
                                    isCompulsory={false}
                                    length={formLength}
                                />
                                <div className="relative w-full">
                                    <TextField
                                        size="small"
                                        name="CSpath"
                                        variant="outlined"
                                        value={CSpath}
                                        sx={{
                                            width: "100%",
                                            bgcolor: "#e8f0fe",
                                            "& .MuiInputBase-root": {
                                                height: 25,
                                                fontSize: 14,
                                            },
                                            overflow: "hidden",
                                        }}
                                        inputProps={{ readOnly: true }}
                                        placeholder="Select folder"
                                    />
                                    <Button
                                        sx={{
                                            position: "absolute",
                                            right: "1px",
                                            height: "94%",
                                            marginTop: "1px",
                                            width: 10,
                                            bgcolor: "white",
                                            color: "#283e8a",
                                            ":hover": {
                                                color: "white",
                                            },
                                        }}
                                        component="label"
                                        variant="contained"
                                        onClick={() => handleGetFolderPath('CSpath')}
                                    >
                                        <DriveFolderUploadOutlinedIcon />
                                    </Button>
                                </div>
                            </div>}
                        {isWithPrefix ||
                            <div className="flex justify-between items-center gap-1">
                                <FormTitle
                                    text={"Others File Location"}
                                    isCompulsory={false}
                                    length={formLength}
                                />
                                <div className="relative w-full">
                                    <TextField
                                        size="small"
                                        name="OTpath"
                                        variant="outlined"
                                        value={OTpath}
                                        sx={{
                                            width: "100%",
                                            bgcolor: "#e8f0fe",
                                            "& .MuiInputBase-root": {
                                                height: 25,
                                                fontSize: 14,
                                            },
                                            overflow: "hidden",
                                        }}
                                        inputProps={{ readOnly: true }}
                                        placeholder="Select folder"
                                    />
                                    <Button
                                        sx={{
                                            position: "absolute",
                                            right: "1px",
                                            height: "94%",
                                            marginTop: "1px",
                                            width: 10,
                                            bgcolor: "white",
                                            color: "#283e8a",
                                            ":hover": {
                                                color: "white",
                                            },
                                        }}
                                        component="label"
                                        variant="contained"
                                        onClick={() => handleGetFolderPath('OTpath')}
                                    >
                                        <DriveFolderUploadOutlinedIcon />
                                    </Button>
                                </div>
                            </div>}
                        <div className="flex justify-between items-center gap-1">
                            <FormTitle text={"Sleep Time"} isCompulsory={true} length={formLength} />
                            <TextField
                                sx={{
                                    "& .MuiInputBase-root": {
                                        paddingY: "1px",
                                        paddingX: "4px",
                                        fontSize: "14px",
                                        height: 25,
                                    },
                                }}
                                fullWidth
                                type="number"
                                size="small"
                                name="sleep_time"
                                className="editableInput"
                                value={sleepTime}
                                onChange={(e) => handleSetSleepTime(e.target.value)}
                            />
                        </div>
                        <div className="flex justify-between items-center gap-1">
                            <FormTitle text={"Is test mode"} isCompulsory={false} length={formLength} />
                            <FormControl fullWidth>
                                <Select
                                    sx={{
                                        height: "25px",
                                        fontSize: "14px",
                                        padding: "0px 0px",
                                    }}
                                    size="small"
                                    className="editableInput"
                                    value={isTestMode}
                                    onChange={(e) => setIsTestMode(e.target.value)}
                                >
                                    <MenuItem
                                        sx={{
                                            fontSize: 14,
                                        }}
                                        value={true}
                                    >
                                        Yes
                                    </MenuItem>
                                    <MenuItem
                                        sx={{
                                            fontSize: 14,
                                        }}
                                        value={false}
                                    >
                                        No
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        {formError &&
                            <Typography
                                sx={{
                                    fontSize: 10,
                                    fontWeight: 400,
                                    color: 'red',
                                    textAlign: 'center'
                                }}
                            >
                                {formError}
                            </Typography>
                        }
                        <div className="mt-3 flex justify-center gap-2">
                            <Button
                                sx={{
                                    height: 25,
                                }}
                                size="small"
                                color="success"
                                variant="contained"
                                type="submit"
                                // onClick={handleStart}
                                disabled={
                                    isGettingData ||
                                    isIssuing ||
                                    (isWithPrefix && fileLocation === "") ||
                                    (!isWithPrefix && (INpath === "" ||
                                        PNpath === "" ||
                                        SCpath === "" ||
                                        EXpath === ""))
                                }
                            >
                                Submit
                            </Button>
                            <Button
                                sx={{
                                    height: 25,
                                }}
                                size="small"
                                color="error"
                                variant="contained"
                                onClick={handleClose}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </Box>
            </Modal>
        </div >
    )
}

export default EPIssue;