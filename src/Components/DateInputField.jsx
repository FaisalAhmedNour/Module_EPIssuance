import { useContext } from "react"
import { TextField } from "@mui/material"
import { EPDataContext } from "../providers/EPDataProvider";
import FormTitle from "./FormTitle";

const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const DateInputField = ({ value, setValue, formLength, formTitle, isCompulsory }) => {
    const { currentDate } = useContext(EPDataContext);

    const convertDateFormate = (date) => {
        const formatDate = new Date(date);
        return `${formatDate.getDate() > 9 ? formatDate.getDate() : `0${formatDate.getDate()}`}-${month[formatDate.getMonth()]}-${formatDate.getFullYear()}`;
    }

    return (
        <div className="flex justify-end gap-1">
            <FormTitle text={formTitle} isCompulsory={isCompulsory} length={formLength} />
            <div className="flex w-full gap-1">
                <TextField
                    size="small"
                    placeholder="DD-MMM-YYYY"
                    value={value ? convertDateFormate(value) : value}
                    className="editableInput"
                    inputProps={{ readOnly: true }}
                    sx={{
                        width: "150px",
                        "& .MuiInputBase-root": {
                            // maxHeight: 25,
                            height: 25,
                            overflow: "hidden",
                            flexGrow: 1,
                            fontSize: 14,
                        },
                    }}
                />
                <input
                    type="date"
                    onChange={(e) => setValue(e.target.value)}
                    className="w-[20px] border h-[25px] rounded"
                    max={`${currentDate?.maxDate}`}
                />
            </div>
        </div>
    )
}

export default DateInputField;