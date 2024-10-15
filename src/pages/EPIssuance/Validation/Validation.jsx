import { useContext, useEffect, useState } from "react";
import {
    TextField,
    Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ExcelJS from 'exceljs';
import FormTitle from "../../../Components/FormTitle";
import ProcessHeader from "../../../Components/ProcessHeader";
import ProcessHeaderWithNote from "../../../Components/ProcessHeaderWithNote";
import TimerSection from "../../../Components/TimerSection";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import { LoadingButton } from "@mui/lab";
import MessageTable from "./MessegeTable";
import ExtractedDataTableForEPIssuanceValidation from "./ExtractedDataTableForEPIssuanceValidation";
import UploadedFileListOfEPIssuance from "./UploadedFileListOfEPIssuance";
import UploadedFileDataOfEPIssuance from "./UploadedFileDataOfEPIssuance";
import { EPDataContext } from "../../../providers/EPDataProvider";

const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
});

export const process = '65abb3734e635ea816139716';

const Validation = () => {
    const {
        fileName,
        setFileName,
        remarks,
        setRemarks,
        prefix,
        setPrefix
    } = useContext(EPDataContext);
    const [reload, setReload] = useState(false);
    // const [isUploadButtonVisible, setIsUploadButtonVisible] = useState(false);
    const [isStartVisible, setIsStartVisible] = useState(false);
    const [uploadedFilesSelectedData, setUploadedFilesSelectedData] = useState({});
    const [uploadedExcelData, setUploadedExcelData] = useState([]);
    const [fileError, setFileError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [engineStatus, setEngineStatus] = useState(null);

    const setValues = (key, value) => {
        if (key === 'prefix') {
            setPrefix(value)
        }
        else {
            setRemarks(value)
        }
    }

    useEffect(() => {
        if (prefix != null && remarks != null && uploadedExcelData?.length !== 0) {
            setIsStartVisible(true)
        }
    }, [prefix, remarks])

    const handleStart = async (e) => {
        e.preventDefault();
        const udtPrefix = e.target.udtPrefix.value;
        const remarks = e.target.remarks.value;

        // console.log(udtPrefix, remarks);
        const data = {
            pid: process,
            payload: uploadedExcelData,
            action: "VER",
            udtPrefix,
            remarks
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
        }
    }

    const findIndexes = (row) => {
        if (row)
            return {
                expNo: row.indexOf('EXP NO'),
                netWeight: row.indexOf("Net Weight")
            }
    }

    const makeFileReadyForValidation = (rows) => {
        const [keys, ...values] = rows;
        const { expNo, netWeight } = findIndexes(keys);
        // console.log(keys)
        if (expNo === -1) {
            setIsLoading(false);
            return setFileError("'EXP NO' field not found");
        }
        if (netWeight === -1) {
            setIsLoading(false);
            return setFileError("'Net Weight' field not found");
        }
        if (values?.length === 0) {
            setIsLoading(false);
            return setFileError("File is Empty!");
        }
        const extractedFile = values?.map((row, index) => {
            return {
                'SL': index + 1,
                'EN': row?.[expNo],
                "NW": row?.[netWeight]
            }
        })
        setUploadedExcelData(extractedFile);
        setIsLoading(false);
    }

    const handleFileUpload = async (event) => {
        setIsLoading(true)
        const file = event.target.files[0];
        setFileName(file?.name);
        // console.log("file", file);
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
                    // console.log(row.values)
                    const rowValues = row.values.slice(1); // Skip the first element (index 0 is null)
                    rows.push(rowValues);
                });

                // const filteredData = dataFromSheet.filter((row) => {
                //     return Object.values(row).some((value) => value !== "");
                // });

                // Set the parsed data into state
                // setExcelData(rows);
                // console.log("rows", rows);
                makeFileReadyForValidation(rows)
            };
            event.target.value = null;
            reader.readAsArrayBuffer(file);
        }
    };

    const getEngineOnSignal = () => {
        window.engine.onProcessStart(function (message) {
            console.log("message stop", message);
        });
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
                {/* <ProcessHeader /> */}
                <ProcessHeaderWithNote
                    title="EP Validation"
                    note={"No instructions added yet."}
                />
            </div>
            <div className="flex justify-center">
                <form
                    onSubmit={handleStart}
                    className="flex flex-col items-center gap-3 justify-center bg-white p-4 rounded-md"
                >
                    <div className="flex justify-start items-center gap-2">
                        <FormTitle text={"File path"} isCompulsory={true} length={200} />
                        <div className="w-[30vw] mx-auto relative">
                            <TextField
                                size="small"
                                name="folderPath"
                                variant="outlined"
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
                                value={fileName}
                            />
                            <Button
                                accept=".xlsx"
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
                            >
                                <DriveFolderUploadIcon />
                                <VisuallyHiddenInput
                                    type="file"
                                    size="small"
                                    onChange={handleFileUpload}
                                />
                            </Button>
                        </div>
                    </div>
                    <div className="flex justify-start items-center gap-1">
                        <FormTitle
                            text={"Undertaking Number prefix"}
                            isCompulsory={true}
                            length={200}
                        />
                        <div className="w-[30vw] flex-grow mx-auto relative">
                            <TextField
                                size="small"
                                name="udtPrefix"
                                variant="outlined"
                                value={prefix}
                                sx={{
                                    width: "100%",
                                    bgcolor: "#e8f0fe",
                                    "& .MuiInputBase-root": {
                                        height: 25,
                                        fontSize: 14,
                                    },
                                    overflow: "hidden",
                                }}
                                placeholder="Enter under taking number prefix"
                                onChange={e => setValues('prefix', e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex justify-start items-center gap-1">
                        <FormTitle
                            text={"Remarks"}
                            isCompulsory={true}
                            length={200}
                        />
                        <div className="w-[30vw] flex-grow mx-auto relative">
                            <TextField
                                size="small"
                                name="remarks"
                                variant="outlined"
                                value={remarks}
                                sx={{
                                    width: "100%",
                                    bgcolor: "#e8f0fe",
                                    overflow: "hidden",
                                    "& .MuiInputBase-root": {
                                        height: 25,
                                        fontSize: 14,
                                    },
                                }}
                                placeholder="Enter remarks"
                                onChange={(e) => setValues("remarks", e.target.value)}
                            />
                        </div>
                    </div>
                    {fileError && <p className="text-xs text-red">{fileError}</p>}
                    <div className="flex gap-2">
                        <LoadingButton
                            size="small"
                            sx={{
                                height: 25,
                            }}
                            type="submit"
                            disabled={!isStartVisible}
                            loading={isLoading}
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
            <div className="flex gap-2">
                <TimerSection
                    isDataToRun={true}
                    dataToRunText={'Total'}
                    isSuccess={true}
                    successText={"Succeed"}
                    isFaild={true}
                    engineStatus={engineStatus}
                />
                <MessageTable />
            </div>
            <ExtractedDataTableForEPIssuanceValidation
                setReload={setReload}
                isReadyToUpload={isLoading}
                uploadedExcelData={uploadedExcelData}
            />
            {/* <UploadedFileListOfEPIssuance
                reload={reload}
                setReload={setReload}
                setUploadedFilesSelectedData={setUploadedFilesSelectedData}
            />
            {uploadedFilesSelectedData && (
                <UploadedFileDataOfEPIssuance
                    uploadedFilesSelectedData={uploadedFilesSelectedData}
                    setUploadedFilesSelectedData={setUploadedFilesSelectedData}
                />
            )} */}
        </div>
    )
}

export default Validation;