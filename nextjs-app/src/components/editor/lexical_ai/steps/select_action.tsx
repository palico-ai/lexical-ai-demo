import React, { useCallback, useMemo } from "react";
import { AIAction } from "../types";
import FloatingContainer from "../utils/floating_container";
import { MenuItem, MenuList } from "@mui/material";

export interface OnSelectParams {
  selectedOptionValue?: string;
}

export interface PromptSelectAIActionProps {
  actions: AIAction[];
  isRangeSelection: boolean;
  cursorPosition?: { x: number; y: number };
  onSelectAction: (action: AIAction, params: OnSelectParams) => void;
}

const PromptSelectAIAction: React.FC<PromptSelectAIActionProps> = ({
  actions,
  cursorPosition,
  isRangeSelection,
  onSelectAction,
}) => {
  const [nestedActionSelected, setNestedActionSelected] =
    React.useState<AIAction>();

  const menuItems = useMemo(() => {
    if (nestedActionSelected && nestedActionSelected.options) {
      return [
        <MenuItem
          key={"back"}
          onClick={() => setNestedActionSelected(undefined)}
        >
          Back
        </MenuItem>,
        nestedActionSelected.options.map((option) => (
          <MenuItem
            key={option.value}
            onClick={() =>
              onSelectAction(nestedActionSelected, {
                selectedOptionValue: option.value,
              })
            }
          >
            {option.label}
          </MenuItem>
        )),
      ];
    }
    const availableActions = actions.filter(action => {
      if (!isRangeSelection && action.requiresRangeSelection) {
        return false;
      }
      return true;
    }).sort((a, b) => { 
      if (a.requiresRangeSelection && !b.requiresRangeSelection) {
        return -1;
      }
      if (!a.requiresRangeSelection && b.requiresRangeSelection) {
        return 1;
      }
      return 0;
    });

    return availableActions.map((action) => (
      <MenuItem
        key={action.name}
        onClick={() => {
          if (action.options) {
            setNestedActionSelected(action);
            return;
          }
          onSelectAction(action, {});
        }}
      >
        {action.label || action.name}
      </MenuItem>
    ));
  }, [actions, isRangeSelection, nestedActionSelected, onSelectAction]);

  return (
    <FloatingContainer x={cursorPosition?.x} y={cursorPosition?.y}>
      <MenuList autoFocusItem>{menuItems}</MenuList>
    </FloatingContainer>
  );
};

export default PromptSelectAIAction;
