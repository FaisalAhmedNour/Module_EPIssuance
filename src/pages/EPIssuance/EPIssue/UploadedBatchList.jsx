import {
    Table,
    Paper,
    Button,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
    IconButton,
    TableContainer,
    Typography,
    TablePagination,
    Tooltip,
    CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import Swal from "sweetalert2";
import { useState, useEffect, useContext } from "react";
import Loader from "../../../Components/Loader";
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import convertDateFormate from "../../../Functions/ConvertToDate";
import DateInputField from "../../../Components/DateInputField";
import { EPDataContext } from "../../../providers/EPDataProvider";

const UploadedBatchList = ({
    handleOpen,
    handleStop
}) => {
    const {
        isIssuing,
        issuingId,
        handleGetBatchDetails,
        IdOfBatchToShow,
        handleClearBatchToShow,
        loadingForShowing
    } = useContext(EPDataContext);
    const [batches, setBatches] = useState([]);
    const [error, setError] = useState(null);
    const [pageNoOfBatch, setPageNoOfBatch] = useState(0);
    const [rowsPerPageOfBatch, setRowsPerPageOfBatch] = useState(10);
    const [totalRowsOfBatch, setTotalRowsOfBatch] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [queryOfBatch, setQueryOfBatch] = useState({ page: 0, perPage: 10 });
    const [updateBatchList, setUpdateBatchList] = useState(false);

    const handleChangePage = (event, newPage) => {
        setPageNoOfBatch(newPage);
        let makeQuery = { ...queryOfBatch };
        makeQuery.page = newPage;
        makeQuery.perPage = rowsPerPageOfBatch;
        setQueryOfBatch(makeQuery);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPageOfBatch(+event.target.value);
        setPageNoOfBatch(0);
        makeQuery.page = 0;
        makeQuery.perPage = +event.target.value;
        setQueryOfBatch(makeQuery);
    };

    const handleGetBatchFiles = async () => {
        const urlQueries = new URLSearchParams(queryOfBatch).toString();
        try {
            const result = await window.engine.Proxy("/process/EP/batch?" + urlQueries, 'get');
            console.log("result", result);
            if (result?.status >= 200 && result?.status < 400) {
                setBatches(result.data.items);
                setTotalRowsOfBatch(result?.data?.query?.total)
            } else {
                setError(result.data.message || "Something went wrong. Please try again later.");
            }
        } catch (error) {
            console.error(error);
            setError("Something went wrong. Please try again later.");
        }
    }

    useEffect(() => {
        handleGetBatchFiles();
    }, [queryOfBatch, updateBatchList]);

    const handleDelete = async (id) => {
        const payload = { ids: [id] };
        try {
            const result = await window.engine.Proxy("/process/EP/batch", 'delete', payload);
            // console.log("result", result);
            if (result?.status >= 200 && result?.status < 400) {
                setUpdateBatchList(prev => !prev);
                Swal.fire({
                    icon: "success",
                    title: 'Deleted',
                    text: 'Batch deleted successfully.'
                })
            } else {
                Swal.fire({
                    icon: "error",
                    title: 'Failed',
                    text: result.data.message || 'Failed to delete batch.'
                })
            }
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: 'Failed',
                text: 'Failed to delete batch.'
            })
        }
    }

    return (
        <div className="relative rounded-md overflow-hidden mt-2">
            {/* <form
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
                <DateInputField
                    value={formOfBatch}
                    setValue={setFormOfBatch}
                    formLength={formLength}
                    formTitle={'From'}
                    isCompulsory={false}
                />
                <DateInputField
                    value={toOfBatch}
                    setValue={setToOfBatch}
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
            </form> */}
            <h2 className="text-center text-lg font-semibold text-[#3a3737] mt-3 ms-2 w-full">
                Uploaded Batch List
            </h2>
            {isLoading ? (
                <Loader />
            ) : error ? (
                <Typography
                    fontSize={14}
                    sx={{
                        textAlign: "center",
                        color: "red",
                    }}
                >
                    Error: {error}
                </Typography>
            ) : (
                <div>
                    <TablePagination
                        sx={{ backgroundColor: "#e4e4e4" }}
                        rowsPerPageOptions={[10, 25, 100]}
                        component="div"
                        count={totalRowsOfBatch}
                        rowsPerPage={rowsPerPageOfBatch}
                        page={pageNoOfBatch}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                    <TableContainer component={Paper}>
                        <Table
                            sx={{ minWidth: 650 }}
                            size="small"
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell
                                        sx={{
                                            width: 10,
                                            color: 'white',
                                            backgroundColor: "#409cff",
                                            whiteSpace: "nowrap",
                                            fontSize: 14,
                                        }}
                                        align="center"
                                    >
                                        SL No
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            width: 5,
                                            color: 'white',
                                            backgroundColor: "#409cff",
                                            whiteSpace: "nowrap",
                                            fontSize: 14,
                                        }}
                                        align="center"
                                    >
                                        File Name
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            width: 10,
                                            color: 'white',
                                            backgroundColor: "#409cff",
                                            whiteSpace: "nowrap",
                                            fontSize: 14,
                                        }}
                                        align="center"
                                    >
                                        Data Count
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            width: 5,
                                            color: 'white',
                                            backgroundColor: "#409cff",
                                            whiteSpace: "nowrap",
                                            fontSize: 14,
                                        }}
                                        align="center"
                                    >
                                        Create Date
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            width: 5,
                                            color: 'white',
                                            backgroundColor: "#409cff",
                                            whiteSpace: "nowrap",
                                            fontSize: 14,
                                        }}
                                        align="center"
                                    >
                                        Issue
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            width: 5,
                                            color: 'white',
                                            backgroundColor: "#409cff",
                                            whiteSpace: "nowrap",
                                            fontSize: 14,
                                        }}
                                        align="center"
                                    >
                                        Action
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    batches &&
                                    batches?.length !== 0 &&
                                    batches.map((row, index) => {
                                        return (
                                            <TableRow
                                                key={index}
                                                sx={{
                                                    "&:nth-of-type(even)": {
                                                        backgroundColor: "#bee2fd",
                                                    },
                                                    "&:nth-of-type(odd)": {
                                                        backgroundColor: "#eeeeee",
                                                    },
                                                }}
                                            >
                                                <TableCell
                                                    sx={{
                                                        paddingY: 0,
                                                        whiteSpace: "nowrap",
                                                        fontSize: 14,
                                                    }}
                                                    component="th"
                                                    scope="row"
                                                    align="center"
                                                >
                                                    {row?.bId}
                                                </TableCell>
                                                <TableCell
                                                    sx={{
                                                        paddingY: 0,
                                                        whiteSpace: "nowrap",
                                                        fontSize: 14,
                                                    }}
                                                    align="left"
                                                >
                                                    {row?.Name}
                                                </TableCell>
                                                <TableCell
                                                    sx={{
                                                        paddingY: 0,
                                                        whiteSpace: "nowrap",
                                                        fontSize: 14,
                                                    }}
                                                    align="center"
                                                >
                                                    {row?.dCount}
                                                </TableCell>
                                                <TableCell
                                                    sx={{
                                                        paddingY: 0,
                                                        whiteSpace: "nowrap",
                                                        fontSize: 14,
                                                    }}
                                                    align="center"
                                                >
                                                    {row?.created_at ? convertDateFormate(row?.created_at) : null}
                                                </TableCell>
                                                <TableCell
                                                    sx={{
                                                        paddingY: 0,
                                                    }}
                                                    align="center"
                                                >
                                                    <div className="flex justify-center gap-1 items-center">
                                                        {(isIssuing && issuingId === row?._id) ?
                                                            <>
                                                                <Button
                                                                    size="small"
                                                                    variant="contained"
                                                                    sx={{ padding: 0, height: 20, fontSize: 12 }}
                                                                    disabled
                                                                // onClick={() => row?.S === "Saved" && handleOpen(row?._id)}
                                                                >
                                                                    Issuing
                                                                </Button>
                                                                <Button
                                                                    color="error"
                                                                    size="small"
                                                                    variant="contained"
                                                                    sx={{ padding: 0, height: 20, fontSize: 12 }}
                                                                    onClick={() => handleStop(row?._id)}
                                                                >
                                                                    Stop
                                                                </Button>
                                                            </> :
                                                            <Button
                                                                color="success"
                                                                size="small"
                                                                variant="contained"
                                                                sx={{ padding: 0, height: 20, fontSize: 12 }}
                                                                disabled={row?.S !== "Saved" || isIssuing}
                                                                onClick={() => row?.S === "Saved" && handleOpen(row?._id)}
                                                            >
                                                                {row?.S === "Saved" ? (
                                                                    <span>Issue</span>
                                                                ) : (
                                                                    <span>Issued</span>
                                                                )}
                                                            </Button>}
                                                    </div>
                                                </TableCell>
                                                <TableCell
                                                    sx={{
                                                        paddingY: 0,
                                                        whiteSpace: "nowrap",
                                                        fontSize: 14,
                                                    }}
                                                    align="center"
                                                >
                                                    <div className="flex justify-center gap-2">
                                                        <Tooltip title={row?._id === IdOfBatchToShow ? "Hide" : "show"}>
                                                            <IconButton
                                                                color="primary"
                                                                sx={{ padding: 0, height: 25, width: 20 }}
                                                                disabled={isIssuing}
                                                                aria-label="edit"
                                                                onClick={() => row?._id === IdOfBatchToShow ?
                                                                    handleClearBatchToShow() :
                                                                    handleGetBatchDetails(0, 10, row?._id)}
                                                            >
                                                                {row?._id === IdOfBatchToShow ?
                                                                    (loadingForShowing ?
                                                                        <CircularProgress size={16} thickness={6} /> : <VisibilityOffOutlinedIcon />) :
                                                                    <RemoveRedEyeOutlinedIcon />}
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="delete">
                                                            <IconButton
                                                                color="error"
                                                                sx={{ padding: 0, height: 25 }}
                                                                disabled={isIssuing}
                                                                aria-label="delete"
                                                                onClick={() => handleDelete(row?._id)}
                                                            >
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                            // <></>
                                        );
                                    })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            )}
        </div>
    )
}

export default UploadedBatchList;