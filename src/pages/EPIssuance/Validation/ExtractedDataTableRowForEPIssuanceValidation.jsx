import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import { FormControl, IconButton, MenuItem, Modal, Select, TableCell, TableRow, Typography } from '@mui/material';
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import Box from "@mui/material/Box"

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

const ExtractedDataTableRowForEPIssuanceValidation = ({
    index,
    headers,
    finalData,
    handleChange,
    handleDelete
}) => {
    const [open5, setOpen5] = useState(false);

    const handleOpen5 = () => {
        setOpen5(true)
    };

    const handleClose5 = () => {
        setOpen5(false)
    }

    return (
        <>
            <TableRow
                key={index}
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
                    (header, indx) =>
                    (
                        <TableCell
                            sx={{
                                paddingY: 0,
                                paddingX: .5,
                                height: '25px',
                                minHeight: '25px',
                                lineHeight: '25px',
                                whiteSpace: "nowrap",
                                backgroundColor: finalData?.STATUS === 'n'
                                    ? '' :
                                    finalData?.STATUS === 'e' ?
                                        "#f0a6a6" :
                                        finalData?.STATUS === 'e' ? "yellow" : '',
                            }}
                            key={indx}
                            align="center"
                        >
                            <p className={`p-0 flex gap-1 items-center justify-center h-[20px]`}>
                                {(header === 'SL NO' || header === 'MESSAGE') ?
                                    <p className='text-center '>{
                                        (header === 'MESSAGE') ?
                                            finalData?.[header]?.slice(0, 10) :
                                            finalData?.[header]
                                    }</p> :
                                    (header === 'STATUS') ?
                                        <FormControl fullWidth size="small">
                                            <Select
                                                value={finalData?.[header]}
                                                sx={{
                                                    height: 25,
                                                    fontSize: 14,
                                                    overflow: "hidden",
                                                }}
                                                onChange={(e) => handleChange(
                                                    index,
                                                    headers[indx],
                                                    e.target.value
                                                )}
                                                className="editableInput"
                                            >
                                                <MenuItem
                                                    sx={{ fontSize: 14, height: 25 }}
                                                    value="e"
                                                >
                                                    Failed
                                                </MenuItem>
                                                <MenuItem
                                                    sx={{ fontSize: 14, height: 25 }}
                                                    value="w"
                                                >
                                                    Warning
                                                </MenuItem>
                                                <MenuItem
                                                    sx={{ fontSize: 14, height: 25 }}
                                                    value={'n'}
                                                >
                                                    Succeed
                                                </MenuItem>
                                            </Select>
                                        </FormControl> :
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
                                {
                                    header === 'MESSAGE' &&
                                    <RemoveRedEyeOutlinedIcon
                                        onClick={handleOpen5}
                                        sx={{ fontSize: 16 }}
                                    />
                                }
                            </p>
                        </TableCell>
                    )
                )}
                <TableCell
                    align="center"
                    sx={{
                        paddingY: '0', height: '25px',
                        position: 'sticky',
                        right: 0,
                        zIndex: 20,
                        whiteSpace: "nowrap",
                        backgroundColor: finalData?.STATUS === 'n'
                            ? "" :
                            finalData?.STATUS === 'e' ?
                                "#f0a6a6" :
                                finalData?.STATUS === 'e' ? "yellow" : '',
                    }}
                >
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
                </TableCell>
            </TableRow>
            <Modal
                open={open5}
                onClose={handleClose5}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style2}>
                    <div className="relative">
                        <span onClick={handleClose5} className="absolute -top-5 -right-4 cursor-pointer text-xl">
                            <CloseIcon />
                        </span>
                        <Typography
                            sx={{
                                textAlign: 'center',
                                fontWeight: 600,
                                fontSize: '20px'
                            }}
                        >
                            Message
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2, textAlign: 'justify' }}>
                            {finalData?.["MESSAGE"]}
                        </Typography>
                    </div>
                </Box>
            </Modal>
        </>
    )
}

export default ExtractedDataTableRowForEPIssuanceValidation;