import { useEffect, useState } from "react";
import {
    TextField,
    Button,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import ProcessHeader from "../../Components/ProcessHeader";
import ProcessHeaderWithNote from "../../Components/ProcessHeaderWithNote";
import TimerSection from "../../Components/TimerSection";
import FormTitle from "../../Components/FormTitle";
// import ExtractedDataTableOfPNPL from "./ExtractedDataTableForPNPL";
// import PNPLUploadedFileList from "./PNPLUploadedFileList";
// import MessageTable from "../EPIssuance/EPIssue/MessegeTable";

const process = '6570b1f8bf66fc48333c882a';

const PNPLExtraction = () => {
    const [reload, setReload] = useState(false);
    const [isUploadButtonVisible,setIsUploadButtonVisible] = useState(false);
    const [folderPath, setFolderPath] = useState('');
    const [isStartVisible, setIsStartVisible] = useState(false);
    const [successCount, setSuccessCount] = useState(0);
    const [dataToExtract, setDataToExtract] = useState(0);
    const [failedCount, setFailedCount] = useState(0);
    const [remainingTime, setRemainingTime] = useState(0);
    const [title, setTitle] = useState('');

    function calculateRemainingTime(total, complete, failed, speed) {
        const toDo = total - (complete + failed)
        return new Date(toDo * speed * 1000).toISOString().substring(14, 19)
    }

    const handleSetFolderPath = async () => {
        const filePath = await window.engine.openFile(
            { title: "Select Folder of PN/PL PDFs", accept: ['openDirectory'] }
        );
        if (filePath?.success === true) {
            setFolderPath(filePath?.path?.[0]);
            setIsStartVisible(true);
        }
    };

    const handleStart = async (e) => {
        e.preventDefault();

        const data = { pid: process, dir: folderPath };
        // if (userInfo?.Cradit?.total > 0) {
        const p = await window.engine.startProcess(data);
        console.log(p);
        // }
        // else {
        //     Swal.fire({
        //         icon: "error",
        //         showConfirmButton: true,
        //         confirmButtonText: "Recharge Now",
        //         confirmButtonColor: "green",
        //         showCancelButton: true,
        //         cancelButtonColor: "red",
        //         title: "Sufficient balance!",
        //         text: "Please recharge your account first.",
        //     }).then((result) => {
        //         if (result.isConfirmed) {
        //             navigate("/account-recharge/online");
        //         }
        //     });
        // }
    };

    const handleStop = async () => {
        const p = await window.engine.stopProcess();
        console.log(p);
    }

    const fetchStatus = () => {
        window.engine.onStatus(function (status) {
            // console.log("status", status);
            let { channel, total, complete, failed, speed, title, details } = status

            if (typeof title === 'string') setTitle(title)
            if (typeof total === 'number') setDataToExtract(total)
            if (typeof complete === 'number') setSuccessCount(complete);
            if (typeof failed === 'number') setFailedCount(failed)
            // if(typeof details==='string') Details.innerText=details
            if (typeof total === 'number' && typeof complete === 'number' && typeof failed === 'number')
                setRemainingTime(calculateRemainingTime(total, complete, failed, speed))
        })
    }

    const getEngineOnSignal = () => {
        window.engine.onProcessStop(function (message) {
            console.log(message);
        });
    }

    const getEngineOffSignal = () => {
        window.engine.onProcessStart(function (message) {
            console.log(message);
        });
    }

    useEffect(() => {
        fetchStatus();
        getEngineOffSignal();
        getEngineOnSignal();
        return undefined;
    }, []);

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
    
        if (file) {
          const reader = new FileReader();
    
          reader.onload = async (e) => {
            const arrayBuffer = e.target.result;
    
            // Load the workbook
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(arrayBuffer);
    
            // Get the first worksheet
            const worksheet = workbook.worksheets[0];
    
            // Iterate over rows in the worksheet and collect data
            const rows = [];
            worksheet.eachRow((row, rowNumber) => {
              const rowValues = row.values.slice(1); // Skip the first element (index 0 is null)
              rows.push(rowValues);
            });
    
            // Set the parsed data into state
            // setExcelData(rows);
            console.log(rows)
          };
    
          reader.readAsArrayBuffer(file);
        }
      };

    return (
        <div className="relative">
            <div className="justify-center flex z-50">
                <ProcessHeader />
                <ProcessHeaderWithNote
                    title="PN/PL EXTRACTION"
                    note={"No instructions added yet."}
                />
                <div className="absolute right-0 h-full ms-auto">
                    <div className="sticky top-28 z-50">
                        <TimerSection
                            isDataToRun={true}
                            dataToRunText={'Data To Extract'}
                            dataToRun={dataToExtract}
                            isSuccess={true}
                            successText={"Extracted"}
                            successData={successCount}
                            isFaild={true}
                            faildData={failedCount}
                            seconds={remainingTime}
                            // engineStatus={title}
                            runningMessage={title}
                        />
                    </div>
                </div>
            </div>
            {/* <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} /> */}
            <div className="flex justify-center">
                <form
                    onSubmit={handleStart}
                    className="flex flex-col items-center gap-3 justify-center bg-white p-4 rounded-md"
                >
                    <div className="flex justify-start items-center gap-2">
                        <FormTitle text={"File path"} isCompulsory={true} length={70} />
                        <div className="w-[30vw] mx-auto relative">
                            <TextField
                                size="small"
                                name="folderPath"
                                variant="outlined"
                                value={folderPath}
                                placeholder="Select file path"
                                sx={{
                                    width: "100%",
                                    overflow: "hidden",
                                    "& .MuiInputBase-root": {
                                        height: 25,
                                        fontSize: 14,
                                    },
                                }}
                                inputProps={{ readOnly: true }}
                                className="editableInput"
                            />
                            <Button
                                sx={{
                                    position: "absolute",
                                    right: "1px",
                                    height: "94%",
                                    width: "6px",
                                    marginTop: "1px",
                                    bgcolor: "white",
                                    color: "#283e8a",
                                    ":hover": {
                                        color: "white",
                                    },
                                }}
                                component="label"
                                variant="contained"
                                onClick={handleSetFolderPath}
                            >
                                <DriveFolderUploadIcon />
                            </Button>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <LoadingButton
                            size="small"
                            sx={{
                                height: 25,
                            }}
                            type="submit"
                            disabled={!isStartVisible}
                            // loading={isProcessing}
                            variant="contained"
                            loadingIndicator="Processing…"
                        >
                            <span>Start Extracting</span>
                        </LoadingButton>
                        <Button
                            onClick={handleStop}
                            variant="contained"
                            size="small"
                            sx={{
                                height: 25,
                            }}
                            color="error"
                        >
                            Stop
                        </Button>
                    </div>
                </form>
            </div>
            {/* <MessageTable /> */}
            {/* <ExtractedDataTableOfPNPL 
            reload={reload}
            setReload={setReload}
            isUploadButtonVisible={isUploadButtonVisible}
            setIsUploadButtonVisible={setIsUploadButtonVisible}
            />
            <PNPLUploadedFileList /> */}
            <>
                {/* {(uploadedFilesSelectedData &&
                    uploadedFilesSelectedData.length === 0) || (
                        <UploadedFileDataOfPOPN
                            uploadedFilesSelectedData={uploadedFilesSelectedData}
                            reload={reload}
                            setReload={setReload}
                            process={process}
                        />
                    )} */}
            </>
        </div>
    )
}

export default PNPLExtraction;