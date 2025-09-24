import React from "react";
import { Snackbar, Alert } from "@mui/material";

export default function Flash({ open, message, severity, onClose }) {
    return (
        <>
            <Snackbar open={open} autoHideDuration={5000} onClose={onClose} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
                <Alert variant="filled"  onClose={onClose} severity={severity} sx={{ width: "100%" }}>
                    {message}
                </Alert>
            </Snackbar>
        </>
    )
}