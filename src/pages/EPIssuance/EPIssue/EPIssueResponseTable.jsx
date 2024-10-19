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
import Box from '@mui/material/Box';
import ExportExcelButton from "../../../Components/ExportExcelButton";

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

const EPIssueResponseTable = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [finalData, setFinalData] = useState([]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    // useEffect(() => {
    //     if (uploadedExcelData.length > 0) {
    //         const convertedData = uploadedExcelData.map(row => HalfToFull(row));
    //         setFinalData(convertedData);
    //     }
    // }, [uploadedExcelData])

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

    return (
        <div className="relative rounded-md overflow-hidden border-b-2 mt-2">
            <h3 className="text-center text-lg mt-3 font-semibold text-[#2e2d2d] absolute w-full whitespace-nowrap ms-2">
                EP Issue Response
            </h3>
            <div className="absolute mt-3 ms-2 z-10">
                <ExportExcelButton
                    // data={finalData}
                    headers={headers}
                    includeTable={true}
                    filename={`EP Issue Response`}
                />
            </div>
            <TablePagination
                sx={{ backgroundColor: "#e4e4e4" }}
                rowsPerPageOptions={[5, 10, 25, 100]}
                component="div"
                // count={finalData?.length}
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
                                            py: 0,
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
                        {/* {finalData &&
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
                                ))} */}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default EPIssueResponseTable;