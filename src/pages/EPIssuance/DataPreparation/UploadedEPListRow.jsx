import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import { Checkbox, FormControl, IconButton, MenuItem, Modal, Select, TableCell, TableRow, Tooltip, Typography } from '@mui/material';
import DeleteIcon from "@mui/icons-material/Delete";
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import CloseIcon from '@mui/icons-material/Close';
import { useContext, useState } from 'react';
import Box from "@mui/material/Box"
import { EPDataContext } from '../../../providers/EPDataProvider';

const style2 = {
    position: 'absolute',
    top: '50%',
    left: '58%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    p: 4,
    border: 0,
    borderRadius: 2
};

const UploadedEPListRow = ({
    index,
    headers,
    finalData,
    handleChange,
    handleDelete,
}) => {
    const {
        setIsAll,
        selectedDataToMakeBatch,
        setSelectedDataToMakeBatch,
    } = useContext(EPDataContext);
    const [isUpdateDisabled, setIsUpdateDisabled] = useState(false);

    const handleSelect = (id) => {
        if (selectedDataToMakeBatch.includes(id)) {
            console.log(selectedDataToMakeBatch)
            const filteredIds = selectedDataToMakeBatch.filter(item => item !== id);
            if (filteredIds.length === 0) setIsAll(true);
            setSelectedDataToMakeBatch(filteredIds);
        }
        else {
            setIsAll(false)
            setSelectedDataToMakeBatch(prev => [...prev, id]);
        }
    }

    return (
        <>
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
                                                className={`text-center py-1 px-1 w-full border border-[#b0aeae] rounded index text-[14px] h-[22px] ${index / 2 === 0 ? '#eeeeee' : "#bee2fd"}`}
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
                <TableCell
                    align="center"
                    sx={{
                        paddingY: 0, 
                        // height: '25px',
                        position: 'sticky',
                        right: 0,
                        zIndex: 20,
                        whiteSpace: "nowrap",
                        bgcolor: index % 2 === 0 ? '#eeeeee' : '#bee2fd'
                    }}
                    className='space-x-1'
                >
                    <Checkbox
                    // size='small'
                    sx={{p: 0, m: 0}}
                        onClick={() => handleSelect(finalData?._id)}
                        checked={selectedDataToMakeBatch.includes(finalData?._id)}
                    />
                    <Tooltip title="Update">
                        <IconButton
                        sx={{
                            height: 25, width: 25
                        }}
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
                        sx={{
                            height: 25, width: 25
                        }}
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
                </TableCell>
            </TableRow>
        </>
    )
}

export default UploadedEPListRow;