import {
    Table,
    Paper,
    TextField,
    Button,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
    IconButton,
    TableContainer,
    TablePagination,
    Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { HalfToFull } from "../../../Functions/ConvertHeaders";
import Loader from "../../../Components/Loader";
import ExportExcelButton from "../../../Components/ExportExcelButton";
import convertDateFormate from "../../../Functions/ConvertToDate";
import ExtractedDataTableRowForEPIssuanceValidation from "./ExtractedDataTableRowForEPIssuanceValidation";
import { process } from "../Validation/Validation";

const headers = [
    "SL NO",
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
    "EXP NO",
    "EXP Date",
    "REMARKS",
    "Type of Products",
    "Product Description",
    "FOB/CNF/CIR/CRF/X-Factor/DDU/ Replacement/Free of cost Value",
    "Select HS Code",
    "Net Weight",
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

const UploadedEPFiles = ({
    setReload,
    isReadyToUpload
}) => {
    const [isUploadButtonVisible, setIsUploadButtonVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [finalData, setFinalData] = useState([]);
    const [fileToUpload, setFileToUpload] = useState([]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    useEffect(() => {
        if (fileToUpload?.length != 0) {
            setIsUploadButtonVisible(true);
        }
    }, [fileToUpload])

    useEffect(() => {
        let isMounted = true;

        const handleTableData = (dt) => {
            // console.log(dt)
            if (isMounted) {
                setFileToUpload((prev) => [...prev, dt?.data]);
                const convertedRow = HalfToFull(dt?.data);
                setFinalData((prev) => [...prev, convertedRow]);
            }
        };

        window.engine.onTableData(handleTableData);

        // Cleanup function to prevent state update after unmount
        return () => {
            isMounted = false;
        };
    }, []);

    const handleUpload = async () => {
        setError("");
        setIsLoading(true);
        const uploadedFIleData = {
            Name: `EP ( ${Date().slice(16, 24)} ${convertDateFormate(Date())} )`,
            meta: {
                "Upload Type": "engine",
            },
            payload: fileToUpload,
        };

        try {
            const result = await window.engine.Proxy("/protected/"+process+"/uploadFile", 'post', uploadedFIleData);
            console.log(result);
            if (result?.statusText === "OK") {
                setIsUploadButtonVisible(false);
                setReload(prev => !prev);
                setFileToUpload([]);
                setFinalData([])
                Swal.fire({
                    title: "Updated!",
                    text: "Your file has been updated.",
                    icon: "success",
                });
            } else {
                setError("Failed to upload. Please try again.");
            }
            // console.log(result);
        } catch (error) {
            console.error(error);
            setError("Failed to upload. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (rowIndex, key, value) => {
        const temp = [...finalData];
        const row = temp[rowIndex];
        row[key] = value;
        setFinalData(temp);
        setFileToUpload(temp)
    };

    const handleDelete = (rowIndex) => {
        const temp = [...finalData];
        temp.splice(rowIndex, 1);
        setFinalData(temp);
        setFileToUpload(temp)
        Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
        });
    };

    if (isLoading) {
        return <Loader />;
    }

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
                                            color: 'white',
                                            backgroundColor: "#409cff",
                                            whiteSpace: "nowrap",
                                            textAlign: "center",
                                            borderRight: 1,
                                            borderColor: "white",
                                            fontSize: 14,
                                        }}
                                    >
                                        <p className="w-[200px]">{header}</p>
                                    </TableCell>
                                )
                            )}
                            <TableCell
                                sx={{
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
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((dataRow, index) => (
                                    <ExtractedDataTableRowForEPIssuanceValidation
                                        key={index}
                                        index={index}
                                        headers={headers}
                                        finalData={finalData}
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
                        onClick={handleUpload}
                        disabled={
                            !isUploadButtonVisible ||
                            isLoading ||
                            isReadyToUpload
                        }
                    >
                        {isLoading ? "Uploading..." : "Upload"}
                    </Button>
                </div>
            }
        </div>
    )
}

export default UploadedEPFiles;