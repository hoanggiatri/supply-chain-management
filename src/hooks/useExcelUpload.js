import { useState } from "react";
import * as XLSX from "xlsx";

const useExcelUpload = () => {
  const [excelData, setExcelData] = useState([]);

  const handleExcelUpload = (e, onDataLoaded) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const binaryStr = event.target.result;
        const workbook = XLSX.read(binaryStr, { type: "binary" });

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const data = XLSX.utils.sheet_to_json(sheet);

        if (onDataLoaded) onDataLoaded(data);

        setExcelData(data);
      };
      reader.readAsBinaryString(file);
    }
  };

  return { excelData, handleExcelUpload };
};

export default useExcelUpload;
