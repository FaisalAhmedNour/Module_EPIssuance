import {
    Table,
    Paper,
    Button,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
    TableContainer,
    TablePagination,
    Typography,
    Modal,
} from "@mui/material";
import { styled } from '@mui/material/styles';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { FullToHalf, HalfToFull } from "../../../Functions/ConvertHeaders";
import Loader from "../../../Components/Loader";
import ExportExcelButton from "../../../Components/ExportExcelButton";
import convertDateFormate from "../../../Functions/ConvertToDate";
import ExtractedDataTableRowForEPIssuanceValidation from "./ExtractedDataTableRowForEPIssuanceValidation";
import { process } from "./Validation";
import { EPDataContext } from "../../../providers/EPDataProvider";
import Box from '@mui/material/Box';

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: theme.palette.grey[200],
        ...theme.applyStyles('dark', {
            backgroundColor: theme.palette.grey[800],
        }),
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,
        backgroundColor: '#1a90ff',
        ...theme.applyStyles('dark', {
            backgroundColor: '#308fe8',
        }),
    },
}));

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

export const headers = [
    "SL NO",
    "EXP NO",
    "Net Weight",
    "Undertaking No",
    "Undertaking Date",
    "Invoice/Vendor Reference No",
    "Invoice/Vendor Reference Date",
    "Type of Carrier From Reg.",
    "Invoice Value (FOB/CIF/CFR/C&F) (Select currency)",
    "Place of Loading",
    "Port of Destination",
    "Destination Country",
    "Consignee Name",
    "Consignee Address",
    "EXP Date",
    "REMARKS",
    "Type of Products",
    "Product Description",
    "FOB/CNF/CIR/CRF/X-Factor/DDU/ Replacement/Free of cost Value",
    "Select HS Code",
    "Quantity",
    "Unit of Quantity",
    "LC No",
    "LC Value",
    "Issue Date",
    "Issuing Bank",
    "Type",
    "Expire Date",
    "STATUS",
    "MESSAGE",
];

const ExtractedDataTableForEPIssuanceValidation = ({
    setReload,
    isReadyToUpload,
    uploadedExcelData
}) => {
    const {
        finalData,
        setFinalData,
        fileToUpload,
        setFileToUpload
    } = useContext(EPDataContext);
    const [page, setPage] = useState(0);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [isUploadButtonVisible, setIsUploadButtonVisible] = useState(false);
    const [dataToUpload, setDataToUpload] = useState([]);
    const [open, setOpen] = useState(false);
    const [uploadStatus, setUploadStatus] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleOpen = () => {
        setOpen(true)
    };

    const handleClose = () => {
        setUploadStatus('');
        setOpen(false)
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    useEffect(() => {
        if (uploadedExcelData.length > 0) {
            const convertedData = uploadedExcelData.map(row => HalfToFull(row));
            setFinalData(convertedData);
        }
    }, [uploadedExcelData])

    useEffect(() => {
        if (fileToUpload?.length != 0) {
            setIsUploadButtonVisible(true);
        }
    }, [fileToUpload])

    const getEngineOnSignal = () => {
        window.engine.onProcessStart(function (message) {
            console.log("message stop", message);
            setFinalData([]);
        });
    }

    useEffect(() => {
        getEngineOnSignal()

        let isMounted = true;
        const handleTableData = (dt) => {
            if (isMounted) {
                setFileToUpload((prev) => [...prev, dt?.data]);
                const convertedRow = HalfToFull(dt?.data);
                console.log(convertedRow)
                setFinalData(prev => {
                    const array = [...prev];
                    if (typeof (convertedRow?.['SL NO']) === 'number')
                        array[convertedRow?.['SL NO'] - 1] = convertedRow;
                    return array;
                })
            }
        };

        window.engine.onTableData(handleTableData);

        return () => {
            isMounted = false;
        };
    }, []);

    const handleUploadByPart = async (file) => {
        const uploadedFIleData = {
            data: file
        };
        // console.log('api call', file, finalData);
        try {
            const result = await window.engine.Proxy("/process/EP/data", 'post', uploadedFIleData);
            console.log(result);
            if (result?.data?.success === true) {
                setFileToUpload([]);
                setFinalData([]);
            } else {
                setError("Failed to upload. Please try again.");
            }
        } catch (error) {
            console.error(error);
            setError("Failed to upload. Please try again.");
        }
    }

    const handleUpload = async () => {
        setError("");
        setIsLoading(true);
        setUploadStatus('Uploading...');
        setUploadProgress(0);
        const length = dataToUpload?.length;
        let n = length % 100 === 0 ? parseInt(length / 100) : parseInt(length / 100) + 1
        // console.log("length", length, n);
        for (let i = 0; i < n; i++) {
            if ((i * 100) + 100 < length) {
                await handleUploadByPart(dataToUpload.slice(i * 100, length - 1));
            }
            else {
                await handleUploadByPart(dataToUpload.slice(i * 100, i * 100 + 100));
            }
            console.log('uploading...')
            setUploadProgress(((i * 100 + 100) / length) * 100)
        }
        setUploadStatus('Uploaded');
        setIsUploadButtonVisible(false);
        setReload(prev => !prev);
        setIsLoading(false);
    };

    const handleUploadShow = async () => {
        const filteredData = [];
        // console.log(finalData)
        finalData.forEach(data => {
            const revertedData = FullToHalf(data);
            console.log(revertedData)
            if (revertedData.ST === 'w' || revertedData.ST === 'n') {
                revertedData.ST = undefined
                revertedData.MS = undefined
                revertedData.VP = true
                revertedData.UD = new Date(revertedData.UD + " GMT+6");
                revertedData.ID = new Date(revertedData.ID + " GMT+6");
                revertedData.ED = new Date(revertedData.ED + " GMT+6");
                revertedData.PD = new Date(revertedData.PD + " GMT+6");
                revertedData.ISD = new Date(revertedData.ISD + " GMT+6");
                revertedData.DE = new Date(revertedData.DE + " GMT+6");
                revertedData.FB = Number(revertedData.FB);
                revertedData.LV = Number(revertedData.LV);
                filteredData.push(revertedData);
            }
        });
        console.log(filteredData, finalData);
        setDataToUpload(filteredData);
        handleOpen();
    };

    const handleChange = (rowIndex, key, value) => {
        const temp = [...finalData];
        const row = temp[rowIndex];
        row[key] = value;
        setFinalData(temp);
        // setFileToUpload(temp)
    };

    const handleDelete = (rowIndex) => {
        const temp = [...finalData];
        temp.splice(rowIndex, 1);
        setFinalData(temp);
        // setFileToUpload(temp)
        Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
        });
    };

    if (error) {
        return (
            <Typography
                fontSize={14}
                sx={{
                    textAlign: "center",
                }}
            >
                Error: {error}
            </Typography>
        );
    }

    return (
        <div className="relative rounded-md overflow-hidden border-b-2 mt-2">
            <h3 className="text-center text-lg mt-3 font-semibold text-[#2e2d2d] absolute w-full whitespace-nowrap ms-2">
                Uploaded Data List
            </h3>
            <div className="absolute mt-3 ms-2 z-10">
                <ExportExcelButton
                    data={finalData}
                    headers={headers}
                    includeTable={true}
                    filename={`EP Validation`}
                />
            </div>
            <TablePagination
                sx={{ backgroundColor: "#e4e4e4" }}
                rowsPerPageOptions={[5, 10, 25, 100]}
                component="div"
                count={finalData?.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <TableContainer
                component={Paper}
                sx={{
                    position: "relative",
                    // overflow: 'hidden'
                }}
            >
                <Table
                    sx={{
                        borderTopLeftRadius: 5,
                        // overflow: "hidden",
                    }}
                    stickyHeader
                    aria-label="sticky table"
                    size="small"
                >
                    <TableHead>
                        <TableRow>
                            {headers?.map(
                                (header, index) =>
                                (
                                    <TableCell
                                        key={index}
                                        sx={{
                                            py: .5,
                                            color: 'white',
                                            backgroundColor: "#409cff",
                                            whiteSpace: "nowrap",
                                            textAlign: "center",
                                            borderRight: 1,
                                            borderColor: "white",
                                            fontSize: 14,
                                        }}
                                    >
                                        <p className={`${header === 'SL NO' ? "" : "w-[200px]"}`}>{header}</p>
                                    </TableCell>
                                )
                            )}
                            <TableCell
                                sx={{
                                    py: .5,
                                    color: 'white',
                                    backgroundColor: "#409cff",
                                    whiteSpace: "nowrap",
                                    textAlign: "center",
                                    borderLeft: 1,
                                    borderColor: "white",
                                    fontSize: 14,
                                    position: 'sticky',
                                    right: 0
                                }}
                            >
                                Action
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {finalData &&
                            finalData?.length > 0 &&
                            finalData
                                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                ?.map((dataRow, index) => (
                                    <ExtractedDataTableRowForEPIssuanceValidation
                                        key={index}
                                        index={index}
                                        headers={headers}
                                        finalData={dataRow}
                                        handleChange={handleChange}
                                        handleDelete={handleDelete}
                                    />
                                ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {
                <div className="my-1 flex justify-center">
                    <Button
                        sx={{
                            height: 25,
                        }}
                        size="small"
                        color="success"
                        variant="contained"
                        onClick={handleUploadShow}
                    >
                        {isLoading ? "Uploading..." : "Upload"}
                    </Button>
                </div>
            }
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div className="">
                        <p className="text-center text-sm">Only data with status successful and warning will be uploaded!</p>
                        <p className="text-center text-sm font-semibold my-2">Data Found: {dataToUpload?.length}</p>
                        {isLoading &&
                            <BorderLinearProgress variant="determinate" value={uploadProgress} />}
                        {uploadStatus &&
                            <p className="text-xs text-center">{uploadStatus}</p>}
                        <div className="mt-3 flex justify-center gap-2">
                            <Button
                                sx={{
                                    height: 25,
                                }}
                                size="small"
                                color="success"
                                variant="contained"
                                onClick={handleUpload}
                                disabled={
                                    uploadStatus === "Uploaded" ||
                                    dataToUpload?.length === 0
                                }
                            >
                                {isLoading ? "Uploading..." : "Upload"}
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
                    </div>
                </Box>
            </Modal>
        </div>
    )
}

export default ExtractedDataTableForEPIssuanceValidation;