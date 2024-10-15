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
    TextField,
    FormControl,
    Select,
    MenuItem,
} from "@mui/material";
import { headers } from "../Validation/ExtractedDataTableForEPIssuanceValidation";
import { useContext, useEffect, useState } from "react";
import UploadedEPListRow from "./UploadedEPListRow";
import { HalfToFull } from "../../../Functions/ConvertHeaders";
import Swal from "sweetalert2";
import convertDateFormate from "../../../Functions/ConvertToDate";
import FormTitle from "../../../Components/FormTitle";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import DateInputField from "../../../Components/DateInputField";
import moment from "moment-timezone";
import { EPDataContext } from "../../../providers/EPDataProvider";

const formLength = 100;

const UploadedEPList = () => {
    const {
        pageNo,
        setPageNo,
        rowsPerPage,
        setRowsPerPage,
        query,
        setQuery,
        totalRows,
        setTotalRows,
        isAll,
        setIsAll,
        from,
        setFrom,
        to,
        setTo,
        invoiceNo,
        setInvoiceNo,
        expNo,
        setExpNo,
        dataType,
        setDataType,
        selectedDataToMakeBatch,
        setSelectedDataToMakeBatch,
    } = useContext(EPDataContext);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [uploadedData, setUploadedData] = useState([]);
    const [bundleName, setBundleName] = useState(`EP Issuance Bundle ${Date().slice(16, 24)} ${convertDateFormate(Date())}`)

    const handleChangePage = (event, newPage) => {
        setPageNo(newPage);
        let makeQuery = { ...query };
        makeQuery.page = newPage;
        makeQuery.perPage = rowsPerPage;
        setQuery(makeQuery);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPageNo(0);
        makeQuery.page = 0;
        makeQuery.perPage = +event.target.value;
        setQuery(makeQuery);
    };

    const handleClear = () => {
        setPageNo(0);
        setRowsPerPage(10);
        setInvoiceNo('');
        setExpNo('');
        setFrom('');
        setTo('');
        setDataType('pending');
        setSelectedDataToMakeBatch([]);
        setIsAll(true);
        setQuery({ page: 0, perPage: rowsPerPage, ATM: '0', ISU: '0' });
    }

    const handleGetValidatedData = async () => {
        const urlQueries = new URLSearchParams(query).toString();
        try {
            const result = await window.engine.Proxy(`/process/EP/data?${urlQueries}`, 'get');
            console.log("result", result);
            if (result.status >= 200 && result.status < 400) {
                const convertedData = result?.data?.items?.map(item => HalfToFull(item));
                setUploadedData(convertedData);
                setTotalRows(result?.data?.query?.total);
            }
            else {
                setError(result?.data?.message || "Failed to get data. Please try again.");
            }
        } catch (error) {
            console.error(error);
            setError("Failed to get data. Please try again.");
        }
    }

    useEffect(() => {
        handleGetValidatedData();
    }, [query]);

    // TODO: make change work
    const handleChange = (rowIndex, key, value) => {
        const temp = [...finalData];
        const row = temp[rowIndex];
        row[key] = value;
        setFinalData(temp);
        // setFileToUpload(temp)
    };

    // TODO: make delete work
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

    const handleMakeBatch = async (e) => {
        e.preventDefault();
        const data = {
            Name: bundleName,
            all: isAll ? query : {},
            dIds: isAll ? undefined : selectedDataToMakeBatch
        }
        console.log(data)
        try {
            const result = await window.engine.Proxy("/process/EP/batch", 'post', data);
            console.log(result);
            if (result?.data?.success === true) {
                Swal.fire({
                    title: "Successful!",
                    text: "Batch Created!",
                    icon: "success",
                });
            } else {
                Swal.fire({
                    title: "Failed!",
                    text: "Filed to create batch.",
                    icon: "error",
                });
            }
        } catch (error) {
            console.error(error);
            Swal.fire({
                title: "Failed!",
                text: "Filed to create batch.",
                icon: "error",
            });
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const convertedFrom = moment(from).tz('Asia/Dhaka').toISOString();
        const convertedTo = moment(to).tz('Asia/Dhaka').toISOString();
        let ATM = '0', ISU = '0';
        if (dataType === 'failed') {
            ATM = '1';
            ISU = '0';
        }
        else if (dataType === 'issued') {
            ATM = '1';
            ISU = '1';
        }
        let makeQuery = { ...query };
        makeQuery.ATM = ATM;
        makeQuery.ISU = ISU;
        if (convertedFrom) {
            makeQuery.from = convertedFrom;
        }
        if (convertedTo) {
            makeQuery.to = convertedTo;
        }
        if (invoiceNo) {
            makeQuery.IN = invoiceNo;
        }
        if (expNo) {
            makeQuery.EN = expNo;
        }
        setSelectedDataToMakeBatch([]);
        setIsAll(true);
        setQuery(makeQuery)
    }

    return (
        <>
            <form
                onSubmit={handleSubmit}
                className="border py-2 px-3 relative gap-y-2 gap-x-5 bg-white rounded-md grid grid-cols-3"
            >
                <Typography
                    sx={{
                        position: "absolute",
                        top: -12,
                        left: 5,
                        fontSize: "12px",
                        backgroundColor: "white",
                        color: "#9fe77a",
                        paddingX: "5px",
                        fontWeight: 500,
                        borderRadius: "10px",
                    }}
                >
                    Search Parameter
                </Typography>
                <div className="flex justify-between items-center gap-1">
                    <FormTitle text={"Inv No"} isCompulsory={false} length={formLength} />
                    <TextField
                        sx={{
                            "& .MuiInputBase-root": {
                                paddingY: "1px",
                                paddingX: "4px",
                                fontSize: "14px",
                                height: 25,
                            },
                        }}
                        placeholder="Ex:- 123,456,..."
                        fullWidth
                        type="text"
                        size="small"
                        name="inv_no"
                        className="editableInput"
                        value={invoiceNo}
                        onChange={(e) => setInvoiceNo(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-1">
                    <FormTitle
                        text={"Exp No"}
                        isCompulsory={false}
                        length={formLength}
                    />
                    <TextField
                        fullWidth
                        sx={{
                            "& .MuiInputBase-root": {
                                paddingY: "1px",
                                paddingX: "4px",
                                fontSize: "14px",
                                height: 25,
                            },
                        }}
                        placeholder="Ex:- 123,456,..."
                        type="text"
                        size="small"
                        name="SC_or_LC_No"
                        className="editableInput"
                        value={expNo}
                        onChange={(e) => setExpNo(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-1">
                    <FormTitle text={"Data Type"} isCompulsory={false} length={formLength} />
                    <FormControl fullWidth>
                        <Select
                            sx={{
                                height: "25px",
                                fontSize: "14px",
                                padding: "0px 0px",
                            }}
                            size="small"
                            className="editableInput"
                            labelId="demo-simple-select-label"
                            value={dataType}
                            onChange={(e) => setDataType(e.target.value)}
                        >
                            <MenuItem
                                sx={{
                                    fontSize: 14,
                                }}
                                value="pending"
                            >
                                Pending
                            </MenuItem>
                            <MenuItem
                                sx={{
                                    fontSize: 14,
                                }}
                                value="issued"
                            >
                                Issued
                            </MenuItem>
                            <MenuItem
                                sx={{
                                    fontSize: 14,
                                }}
                                value="failed"
                            >
                                Failed
                            </MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <DateInputField
                    value={from}
                    setValue={setFrom}
                    formLength={formLength}
                    formTitle={'From'}
                    isCompulsory={false}
                />
                <DateInputField
                    value={to}
                    setValue={setTo}
                    formLength={formLength}
                    formTitle={'To'}
                    isCompulsory={false}
                />
                <div className="flex  justify-end gap-2">
                    <Button
                        size="small"
                        type="submit"
                        color="success"
                        variant="contained"
                        // startIcon={<SearchIcon />}
                        sx={{
                            fontSize: "12px",
                            padding: "2px 5px",
                            height: 25,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        size="small"
                        color="error"
                        variant="contained"
                        // startIcon={<CloseIcon />}
                        onClick={handleClear}
                        sx={{
                            fontSize: "12px",
                            padding: "2px 5px",
                            height: 25,
                        }}
                    >
                        Clear
                    </Button>
                </div>
            </form>
            <div className="relative rounded-md overflow-hidden border-b-2 mt-2">
                <h3 className="text-center text-lg mt-3 font-semibold text-[#2e2d2d] absolute w-full whitespace-nowrap ms-2">
                    Uploaded Data List
                </h3>
                <TablePagination
                    sx={{ backgroundColor: "#e4e4e4" }}
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={totalRows}
                    rowsPerPage={rowsPerPage}
                    page={pageNo}
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
                                    (header, index) => {
                                        if (header !== 'MESSAGE') {
                                            return <TableCell
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
                                                <p className={`${(header === 'SL NO' || header === 'STATUS') ? "" : "w-[200px]"}`}>{header}</p>
                                            </TableCell>
                                        }
                                    }
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
                            {uploadedData &&
                                uploadedData?.length > 0 &&
                                uploadedData?.map((dataRow, index) => (
                                    <UploadedEPListRow
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
                <form
                    onSubmit={handleMakeBatch}
                    className="flex justify-end items-center mr-5"
                >
                    <div className="flex">
                        <FormTitle
                            length={160}
                            text={"Insert A Bundle Name"}
                            isCompulsory={true}
                        />
                        <TextField
                            type="text"
                            size="small"
                            name="batch_name"
                            sx={{
                                margin: 1,
                                "& .MuiInputBase-root": {
                                    height: "25px",
                                    fontSize: 14,
                                },
                            }}
                            value={bundleName}
                            className="editableInput"
                            onChange={(e) => setBundleName(e.target.value)}
                        />
                    </div>
                    <FormControl>
                        <Select
                            sx={{
                                mr: 1,
                                height: "25px",
                                fontSize: "14px",
                                padding: "0px 0px",
                            }}
                            size="small"
                            className="editableInput"
                            value={isAll}
                            onChange={(e) => setIsAll(e.target.value)}
                        >
                            <MenuItem
                                sx={{
                                    fontSize: 14,
                                }}
                                value={true}
                            >
                                All
                            </MenuItem>
                            <MenuItem
                                sx={{
                                    fontSize: 14,
                                }}
                                value={false}
                            >
                                Selected
                            </MenuItem>
                        </Select>
                    </FormControl>
                    <Button
                        disabled={
                            (selectedDataToMakeBatch.length === 0 && !isAll) ||
                            isLoading
                        }
                        size="small"
                        type="submit"
                        variant="contained"
                        sx={{ height: 25, whiteSpace: 'nowrap' }}
                    >
                        Make Bundle
                    </Button>
                    <Button
                        disabled={
                            selectedDataToMakeBatch.length === 0 ||
                            isLoading
                        }
                        size="small"
                        color="error"
                        variant="contained"
                        // onClick={handleDelete}
                        sx={{ marginLeft: 1, height: 25 }}
                    >
                        Delete
                    </Button>
                </form>
            </div>
        </>
    )
}

export default UploadedEPList;