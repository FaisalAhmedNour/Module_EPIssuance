import {
    Typography,
} from "@mui/material";

const ErrorText = ({ text }) => {
    return (
        <Typography
            sx={{
                fontSize: 10,
                fontWeight: 400,
                color: 'red',
                position: 'absolute',
                bottom: -13,
                pl: .5
            }}
        >
            {text}
        </Typography>
    );
};

export default ErrorText;