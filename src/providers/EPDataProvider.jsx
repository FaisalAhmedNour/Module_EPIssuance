import { createContext, useState } from "react";
import Swal from "sweetalert2";

const EPDataContext = createContext();

const EPDataProvider = ({ children }) => {
  // for EP Validation
  const [finalData, setFinalData] = useState([]);
  const [fileToUpload, setFileToUpload] = useState([]);
  const [fileName, setFileName] = useState('');
  const [prefix, setPrefix] = useState(null);
  const [remarks, setRemarks] = useState(null);

  // for Data preparation
  const [pageNo, setPageNo] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [isAll, setIsAll] = useState(true);
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [invoiceNo, setInvoiceNo] = useState(null);
  const [expNo, setExpNo] = useState(null);
  const [dataType, setDataType] = useState('pending');
  const [selectedDataToMakeBatch, setSelectedDataToMakeBatch] = useState([]);
  const [query, setQuery] = useState({ page: 0, perPage: rowsPerPage, ATM: '0', ISU: '0' });

  // EP Issue
  const [isIssuing, setIsIssuing] = useState(false);
  const [issuingId, setIssuingId] = useState(null);
  const [isWithPrefix, setIsWithPrefix] = useState(true);
  const [fileLocation, setFileLocation] = useState('');
  const [sleepTime, setSleepTime] = useState(0);
  const [isTestMode, setIsTestMode] = useState(true);
  const [PNpath, setPNpath] = useState('');
  const [EXpath, setEXpath] = useState('');
  const [SCpath, setSCpath] = useState('');
  const [UTpath, setUTpath] = useState('');
  const [CSpath, setCSpath] = useState('');
  const [OTpath, setOTpath] = useState('');
  const [INpath, setINpath] = useState('');

  // for all
  const [currentDate, setCurrentDate] = useState(() => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const today = new Date();
    const yyyy = today.getFullYear();
    // let mmm = months[today.getMonth()];
    let mm = today.getMonth() + 1;
    let dd = today.getDate();

    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;

    return {
      day: dd,
      month: mm,
      year: yyyy,
      maxDate: yyyy + '-' + mm + '-' + dd,
      row: today.toISOString().split('T')[0],
      fullDate: dd + "-" + months[today.getMonth()] + "-" + yyyy,
    };
  });

  // show batch details
  const [isShowDetails, setIsShowDetails] = useState(false);
  const [batchDetails, setBatchDetails] = useState([]);
  const [IdOfBatchToShow, setIdOfBatchToShow] = useState('');
  const [loadingForShowing, setLoadingForShowing] = useState(false);

  const handleGetBatchDetails = async (page, perPage, id = IdOfBatchToShow) => {
    // console.log("-----------", page, perPage, id);
    const data = {
      page,
      perPage,
      id
    }
    const urlQueries = new URLSearchParams(data).toString();
    try {
      setLoadingForShowing(true);
      const result = await window.engine.Proxy("/process/EP/batch?" + urlQueries, 'get');
      // console.log("result", result);
      if (result?.status >= 200 && result?.status < 400) {
        // console.log("result details: ", result);
        setIdOfBatchToShow(id);
        setBatchDetails(result?.data);
        setIsShowDetails(true);
      } else {
        Swal.fire({
          icon: "error",
          title: 'Failed',
          text: result.data.message || 'Failed to get Ep of this batch. Try again later.'
        })
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: 'Failed',
        text: 'Failed to get Ep of this batch. Try again later..'
      })
    }
    finally{
      setLoadingForShowing(false);
    }
  }

  const handleClearBatchToShow = () => {
    setIdOfBatchToShow(null);
    setBatchDetails([]);
    setIsShowDetails(false);
  }

  const values = {
    // validation
    finalData,
    setFinalData,
    fileToUpload,
    setFileToUpload,
    fileName,
    setFileName,
    prefix,
    setPrefix,
    remarks,
    setRemarks,

    // data Preparation
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

    // EP Issue
    isIssuing,
    setIsIssuing,
    issuingId,
    setIssuingId,
    isWithPrefix,
    setIsWithPrefix,
    fileLocation,
    setFileLocation,
    sleepTime,
    setSleepTime,
    isTestMode,
    setIsTestMode,
    PNpath,
    setPNpath,
    EXpath,
    setEXpath,
    SCpath,
    setSCpath,
    UTpath,
    setUTpath,
    CSpath,
    setCSpath,
    OTpath,
    setOTpath,
    INpath, 
    setINpath,

    // others
    currentDate,

    // show batch details
    handleGetBatchDetails,
    batchDetails,
    isShowDetails,
    IdOfBatchToShow,
    handleClearBatchToShow,
    loadingForShowing
  }

  return (
    <EPDataContext.Provider value={values}>
      {children}
    </EPDataContext.Provider>
  );
};

export { EPDataContext, EPDataProvider };