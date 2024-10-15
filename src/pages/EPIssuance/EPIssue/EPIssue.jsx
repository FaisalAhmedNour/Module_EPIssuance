import { useContext, useEffect, useState } from "react";
import ProcessHeaderWithNote from "../../../Components/ProcessHeaderWithNote";
import TimerSection from "../../../Components/TimerSection";
import MessageTable from "../Validation/MessegeTable";
import UploadedBatchList from "./UploadedBatchList";
import { styled } from '@mui/material/styles';
import { process } from "../Validation/Validation";
import { Box, Button, FormControl, MenuItem, Modal, Select, TextField } from "@mui/material";
import { EPDataContext } from "../../../providers/EPDataProvider";
import FormTitle from "../../../Components/FormTitle";
import DriveFolderUploadOutlinedIcon from '@mui/icons-material/DriveFolderUploadOutlined';
import ShowBatchDetails from "./ShowBatchDetails";

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
        isShowDetails
    } = useContext(EPDataContext);
    const [open, setOpen] = useState(false);
    const [engineStatus, setEngineStatus] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isGettingData, setIsGettingData] = useState(false);


    const handleSetSleepTime = (value) => {
        const convertedValue = Number(value);
        console.log(value, convertedValue)
        setSleepTime(convertedValue || 0);
    }

    const handleGetFolderPath = async (value) => {
        setIsGettingData(true);
        const filePath = await window.engine.openFile({ title: "Select Folder of PN/PL PDFs", accept: ['openDirectory'] });
        // console.log(filePath, value)
        if (filePath?.success === true) {
            switch (value) {
                case 'file_location':
                    return setFileLocation(filePath?.path[0]);
                case 'PNpath':
                    return setPNpath(filePath?.path[0]);
                case 'EXpath':
                    return setEXpath(filePath?.path[0]);
                case 'SCpath':
                    return setSCpath(filePath?.path[0]);
                case 'UTpath':
                    return setUTpath(filePath?.path[0]);
                case 'CSpath':
                    return setCSpath(filePath?.path[0]);
                case 'OTpath':
                    return setOTpath(filePath?.path[0]);
                default: return;
            }
        }
        setIsGettingData(false);
    }

    const handleOpen = (id) => {
        console.log(id);
        setIssuingId(id);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    }

    const handleStart = async (e) => {
        e.preventDefault();
        setIsIssuing(true);
        const data = {
            pid: process,
            // payload: uploadedExcelData,
            action: "SUB",
            id: issuingId,
        };
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
            console.log("message start", message);
            setIsLoading(false);
        });
    }

    useEffect(() => {
        getEngineOffSignal()
    }, []);

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
                    <form className="flex flex-col gap-y-2">
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
                        <div className="flex justify-between items-center gap-1">
                            <FormTitle text={"File location"} isCompulsory={true} length={formLength} />
                            <div className="relative w-full">
                                <TextField
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
                        </div>
                        {isWithPrefix ||
                            <div className="flex justify-between items-center gap-1">
                                <FormTitle
                                    text={"Packing list EXP form File Location"}
                                    isCompulsory={true}
                                    length={formLength}
                                />
                                <div className="relative w-full">
                                    <TextField
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
                                    isCompulsory={true}
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
                                    isCompulsory={true}
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
                                    isCompulsory={true}
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
                        <div className="mt-3 flex justify-center gap-2">
                            <Button
                                sx={{
                                    height: 25,
                                }}
                                size="small"
                                color="success"
                                variant="contained"
                                onClick={handleStart}
                                disabled={
                                    isGettingData ||
                                    isIssuing ||
                                    (isWithPrefix
                                        ? fileLocation === ""
                                        : (fileLocation === "" ||
                                            PNpath === "" ||
                                            OTpath === "" ||
                                            CSpath === "" ||
                                            UTpath === "" ||
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
        </div>
    )
}

export default EPIssue;