import { useState } from "react";
import ProcessHeaderWithNote from "../../../Components/ProcessHeaderWithNote";
import UploadedEPList from "./UploadedEPList";

const DataPreparation = () => {
    return (
        <div className="relative mt-5">
            <div className="justify-center flex z-50">
                <ProcessHeaderWithNote
                    title="Data Preparation"
                    note={"No instructions added yet."}
                />
            </div>
            <UploadedEPList />
        </div>
    )
}

export default DataPreparation;