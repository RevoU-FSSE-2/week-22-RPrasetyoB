import { styled } from "@mui/material/styles";
import TableRow from "@mui/material/TableRow";
import TableCell, { tableCellClasses } from "@mui/material/TableCell"

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    padding: "8px 16px",
  },
}));
const bodyStyle = {
  backgroundColor: "rgb(97, 96, 96)",
  width: "100%",
  height: "100%",
  margin: 0,
  padding: 0,
};
const mainDivStyle = {
  alignItems: "center",
  padding: "auto",
  backgroundColor: "rgb(97, 96, 96)",
  width: "100%",
  height: "95vh",
  position: "relative" as "relative",
};

const mainDivStyleMobile = {
  alignItems: "center",
  padding: "auto",
  backgroundColor: "rgb(97, 96, 96)",
  width: "100%",
  height: "100%",
  position: "relative" as "relative",
};

const subDivStyle = {
  width: "50%",
  margin: "auto",
  textAlign: "center" as "center",
  minWidth: "450px",
  paddingTop: "2vh"
  // transform: "translate(0%, 0%)"
};

const subDivStyleMobile = {
  paddingTop: "5vh",
  width: "auto",
  textAlign: "center" as "center",
  marginLeft: "auto",
  marginRight: "auto",
};

const secondSubStyle = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "5px",
  height: "30px",
  marginLeft: "auto",
  marginRight: "auto"
}

export { subDivStyleMobile, StyledTableRow, StyledTableCell, mainDivStyle, subDivStyle, secondSubStyle, mainDivStyleMobile, bodyStyle };
