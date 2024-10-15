import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { EPDataContext } from "../../../providers/EPDataProvider";
import { headers } from "../Validation/ExtractedDataTableForEPIssuanceValidation";
import { HalfToFull } from "../../../Functions/ConvertHeaders";

const ShowBatchDetails = () => {
    const { batchDetails } = useContext(EPDataContext);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [dataToShow, setDataToShow] = useState([]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);

    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    useEffect(() => {
        const convertedData = batchDetails.map(row => HalfToFull(row));
        setDataToShow(convertedData);
    }, [batchDetails])

    return (
        <div className="relative rounded-md overflow-hidden border-b-2 mt-2">
            <h3 className="text-center text-lg mt-3 font-semibold text-[#2e2d2d] absolute w-full whitespace-nowrap ms-2">
                EP list of batch
            </h3>
            <TablePagination
                sx={{ backgroundColor: "#e4e4e4" }}
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={10}
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
                            {/* <TableCell
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
                            </TableCell> */}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dataToShow &&
                            dataToShow?.length > 0 &&
                            dataToShow?.map((dataRow, index) => (
                                <TableRow
                                    sx={{
                                        "&:last-child td, &:last-child th": { border: 0 },
                                        "&:nth-of-type(even)": {
                                            backgroundColor: "#bee2fd",
                                        },
                                        "&:nth-of-type(odd)": {
                                            backgroundColor: "#eeeeee",
                                        },
                                    }}
                                >
                                    {headers?.map(
                                        (header, indx) => {
                                            if (header !== 'MESSAGE') {
                                                return <TableCell
                                                    sx={{
                                                        paddingY: 0,
                                                        paddingX: .5,
                                                        height: '25px',
                                                        minHeight: '25px',
                                                        lineHeight: '25px',
                                                        whiteSpace: "nowrap",
                                                    }}
                                                    key={indx}
                                                    align="center"
                                                >
                                                    <p className={`p-0 flex gap-1 items-center justify-center h-[20px]`}>
                                                        {(header === 'SL NO') ?
                                                            <p className='text-center '>{
                                                                finalData?.[header]
                                                            }</p> :
                                                            (header === 'STATUS') ?
                                                                <p>{finalData?.[header]}</p>
                                                                :
                                                                < input
                                                                    type="text"
                                                                    className={`text-center py-1 px-1 w-full border rounded index text-[14px] h-[25px] ${index / 2 === 0 ? '#eeeeee' : "#bee2fd"}`}
                                                                    value={finalData?.[header]}
                                                                    onChange={(e) =>
                                                                        handleChange(
                                                                            index,
                                                                            headers[indx],
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                />}
                                                    </p>
                                                </TableCell>
                                            }
                                        }

                                    )}
                                    {/* <TableCell
                                        align="center"
                                        sx={{
                                            paddingY: '0', height: '25px',
                                            position: 'sticky',
                                            right: 0,
                                            zIndex: 20,
                                            whiteSpace: "nowrap",
                                            bgcolor: index % 2 === 0 ? '#eeeeee' : '#bee2fd'
                                        }}
                                    >
                                        <Checkbox
                                            onClick={() => handleSelect(finalData?._id)}
                                            checked={selectedDataToMakeBatch.includes(finalData?._id)}
                                        />
                                        <Tooltip title="Update">
                                            <IconButton
                                                aria-label="update"
                                                disabled={isUpdateDisabled}
                                            // onClick={() => handleDelete(index)}
                                            >
                                                <PublishedWithChangesIcon
                                                    style={{
                                                        color: isUpdateDisabled ? "" : "green",
                                                        padding: 0,
                                                    }}
                                                />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <IconButton
                                                aria-label="delete"
                                                onClick={() => handleDelete(index)}
                                            >
                                                <DeleteIcon
                                                    style={{
                                                        color: "#f64040",
                                                        padding: 0,
                                                    }}
                                                />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell> */}
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default ShowBatchDetails;