import { Box, TextField } from "@mui/material";
import React, { useEffect } from "react";
import FloatingContainer from "../utils/floating_container";

interface PromptFreetextProps {
  cursorY?: number;
  onSubmit: (text: string) => void;
}

const PromptFreetext: React.FC<PromptFreetextProps> = ({
  onSubmit,
  cursorY,
}) => {
  const [text, setText] = React.useState<string>("");
  const [ref, setRef] = React.useState<HTMLInputElement | null>(null);

  useEffect(() => {
    if (ref) {
      ref.focus();
    }
  }, [ref]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() === "") {
      return;
    }
    onSubmit(text);
  };

  return (
    <FloatingContainer x={0} y={cursorY} width={"100%"}>
      <Box component="form" onSubmit={handleSubmit} px={1} pb={1}>
        <TextField
          variant="standard"
          inputRef={(el) => setRef(el)}
          fullWidth
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </Box>
    </FloatingContainer>
  );
};

export default PromptFreetext;
