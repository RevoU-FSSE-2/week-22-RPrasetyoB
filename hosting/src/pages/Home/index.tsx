import React from "react";
import { StyledEngineProvider } from '@mui/material/styles';
import { TableList } from "../../container";

const HomePage: React.FC = () => {

  return (
    <StyledEngineProvider injectFirst>
      <TableList />      
    </StyledEngineProvider>
  );
};

export default HomePage;
