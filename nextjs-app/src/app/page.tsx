import Editor from "@/components/editor";
import { ThemeProvider } from "@/context/theme";
import { Container } from "@mui/material";
import React from "react";

const LexicalPage = () => {
  return (
    <ThemeProvider isLightMode>
    <Container>
      <h1>Lexical Page</h1>
      <Editor />
    </Container>
    </ThemeProvider>
  );
};

export default LexicalPage;
