import { useEffect, useState } from "react";
import {
    Table,
    Paper,
    TextField,
    Button,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
    TableContainer, 
    TablePagination,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";

const MessageTable = () => {
    const [messages, setMessages] = useState([]);

    const fetchMessage = () => {
        window.engine.onMessage(function (msg) {
            console.log(msg)
            const messageData = {};
            messageData.time = (new Date()).toTimeString()
            messageData.message = msg.message
            messageData.title = msg.title
            // [n => 'normal', w => 'warning, e => 'error]
            setMessages(prev => [messageData, ...prev]);
        })
    }

    const getEngineOnSignal = () => {
        window.engine.onProcessStart(function (message) {
            console.log("message stop", message);
            setMessages([]);
        });
    }

    useEffect(() => {
        getEngineOnSignal();
        fetchMessage();
        return undefined;
    }, []);

    return (
        <TableContainer component={Paper} sx={{ height: 200 }}>
            <Table
                stickyHeader
                sx={{ minWidth: 650, overflow: scroll, maxHeight: 200 }}
                size="small"
            >
                <TableHead>
                    <TableRow>
                        <TableCell
                            sx={{
                                py: .5,
                                width: 200,
                                fontWeight: 400,
                                backgroundColor: "#409cff",
                                color: 'white',
                                whiteSpace: "nowrap",
                                fontSize: 14,
                            }}
                        >
                            Time Stamp
                        </TableCell>
                        <TableCell
                            sx={{
                                py: .5,
                                fontWeight: 400,
                                width: 120,
                                backgroundColor: "#409cff",
                                color: 'white',
                                whiteSpace: "nowrap",
                                fontSize: 14,
                            }}
                            align="center"
                        >
                            Title
                        </TableCell>
                        <TableCell
                            sx={{
                                py: .5,
                                fontWeight: 400,
                                backgroundColor: "#409cff",
                                color: 'white',
                                whiteSpace: "nowrap",
                                fontSize: 14,
                            }}
                            align="center"
                        >
                            Message
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody
                    className="max-h-20 over"
                >
                    {
                        messages &&
                        messages?.length !== 0 &&
                        messages.map((row, index) => (
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
                                            py: 0,
                                            whiteSpace: "nowrap",
                                            fontSize: 14,
                                        }}
                                        component="th"
                                        scope="row"
                                    >
                                        {row?.time}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            py: 0,
                                            whiteSpace: "nowrap",
                                            fontSize: 14,
                                        }}
                                        align="center"
                                    >
                                        {row?.title}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            py: 0,
                                            whiteSpace: "nowrap",
                                            fontSize: 14,
                                        }}
                                        align="center"
                                    >
                                        {row?.message}
                                    </TableCell>
                                </TableRow>
                            )
                            )}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default MessageTable;