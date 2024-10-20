export function FullToHalf(row) {
    return {
        "SL": row?.['SL NO'],
        "UN": row?.['Undertaking No'],
        "UD": row?.['Undertaking Date'],
        "IN": row?.['Invoice/Vendor Reference No'],
        "ID": row?.['Invoice/Vendor Reference Date'],
        "TC": row?.['Type of Carrier From Reg.'],
        "IV": row?.['Invoice Value (FOB/CIF/CFR/C&F) (Select currency)'],
        "PL": row?.['Place of Loading'],
        "DP": row?.['Port of Destination'],
        "DC": row?.['Destination Country'],
        "CN": row?.['Consignee Name'],
        "CA": row?.['Consignee Address'],
        "EN": row?.['EXP NO'],
        "ED": row?.['EXP Date'],
        "RM": row?.['REMARKS'],
        "TP": row?.['Type of Products'],
        "PD": row?.['Product Description'],
        "FB": row?.['FOB/CNF/CIR/CRF/X-Factor/DDU/ Replacement/Free of cost Value'],
        "HS": row?.['Select HS Code'],
        "NW": row?.['Net Weight'],
        "QT": row?.['Quantity'],
        "UQ": row?.['Unit of Quantity'],
        "LC": row?.['LC No'],
        "LV": row?.['LC Value'],
        "ISD": row?.['Issue Date'],
        "IB": row?.['Issuing Bank'],
        "TY": row?.['Type'],
        "DE": row?.['Expire Date'],
        "ST": row?.['STATUS'],
        "MS": row?.['MESSAGE'],
    }
}

export function HalfToFull(row) {
    return {
        "_id": row?._id ? row?._id : undefined,
        "SL NO": row?.SL || '',
        "Undertaking No": row?.UN || '',
        "Undertaking Date": row?.UD || '',
        "Invoice/Vendor Reference No": row?.IN || '',
        "Invoice/Vendor Reference Date": row?.ID || '',
        "Type of Carrier From Reg.": row?.TC || '',
        "Invoice Value (FOB/CIF/CFR/C&F) (Select currency)": row?.IV || '',
        "Place of Loading": row?.PL || '',
        "Port of Destination": row?.DP || '',
        "Destination Country": row?.DC || '',
        "Consignee Name": row?.CN || '',
        "Consignee Address": row?.CA || '',
        "EXP NO": row?.EN || '',
        "EXP Date": row?.ED || '',
        "REMARKS": row?.RM || '',
        "Type of Products": row?.TP || '',
        "Product Description": row?.PD || '',
        "FOB/CNF/CIR/CRF/X-Factor/DDU/ Replacement/Free of cost Value": row?.FB || '',
        "Select HS Code": row?.HS || '',
        "Net Weight": row?.NW || '',
        "Quantity": row?.QT || '',
        "Unit of Quantity": row?.UQ || '',
        "LC No": row?.LC || '',
        "LC Value": row?.LV || '',
        "Issue Date": row?.ISD || '',
        "Issuing Bank": row?.IB || '',
        "Type": row?.TY || '',
        "Expire Date": row?.DE || '',
        "STATUS": row?.ST ?
            (row?.ST || '') :
            ((row?.ATM === true && row?.ISU === true) ? 'Issued' :
                (row?.ATM === false && row?.ISU === false) ? 'Pending' : 'Failed'),
        "MESSAGE": row?.MS || '',
    }
}