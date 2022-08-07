import { KeyboardArrowDown } from "@mui/icons-material";
import React, { useContext, useEffect } from "react";
import { useCombobox, UseComboboxGetItemPropsOptions, useMultipleSelection } from "downshift";

export type Option = {
  label: string;
  value: string;
};

interface SelectI {
  items: Option[];
  isSingle?: boolean;
  placeholder?: string;
  label?: string;
  className?: string;
  onChange: (items: string | string[]) => void;
}

interface SelectOptionI {
  item: Option;
  index: number;
  children: string;
  isSelectedItem?: boolean;
  onClick?: () => void;
}

interface SelectContextI {
  getItemProps: ((options: UseComboboxGetItemPropsOptions<Option>) => any) | null;
  selectedItem: Option | null;
  highlightedIndex: number | null;
}

const initialState: SelectContextI = {
  getItemProps: null,
  selectedItem: null,
  highlightedIndex: null,
};

const SelectContext = React.createContext(initialState);

function useSelectContext() {
  const context = useContext(SelectContext);
  if (!context) {
    throw new Error("Context is not wrapped properly.");
  }
  return context;
}

const Select: React.FC<SelectI> = ({ label, className, children, items, onChange, isSingle, placeholder }) => {
  const { getDropdownProps, addSelectedItem, removeSelectedItem, selectedItems, setSelectedItems } = useMultipleSelection<Option>({
    initialSelectedItems: [],
  });

  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
    selectedItem,
  } = useCombobox({
    items,
    itemToString(item) {
      return item ? item.label : "";
    },
    defaultHighlightedIndex: 0, // after selection, highlight the first item.
    selectedItem: null,
    stateReducer(state, actionAndChanges) {
      const { changes, type } = actionAndChanges;

      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
        case useCombobox.stateChangeTypes.InputBlur:
          return {
            ...changes,
            isOpen: !!changes.selectedItem,
          };
      }

      return changes;
    },
    onStateChange({ inputValue, type, selectedItem }) {
      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
          if (selectedItem) {
            const isItemExist = selectedItems.some((item) => item.value === selectedItem.value);
            if (!isItemExist) {
              if (isSingle) {
                setSelectedItems([selectedItem]);
              } else {
                addSelectedItem(selectedItem);
              }
            } else {
              removeSelectedItem(selectedItem);
            }
          }
          break;
        default:
          break;
      }
    },
  });

  let value = placeholder || "";

  if (isSingle && selectedItems.length) {
    value = selectedItems[0].label;
  }

  useEffect(() => {
    if (onChange) {
      onChange(isSingle ? selectedItems[0]?.value || "" : selectedItems.map((item) => item.value));
    }
  }, [selectedItems]);

  return (
    <SelectContext.Provider value={{ getItemProps, selectedItem, highlightedIndex }}>
      <div className="w-full relative">
        <div className={`w-full mb-3.5 ${className || ""}`}>
          {label && (
            <label className="ff-lato text-xs font-extrabold inline-block mb-1" {...getLabelProps()}>
              {label}
            </label>
          )}
          <div className="relative w-full h-12 rounded-2xl border border-gray flex items-center" {...getComboboxProps()}>
            <input className="w-0 h-0 rounded-2xl" {...getInputProps(getDropdownProps({ preventKeyAction: isOpen }))} />
            <button
              aria-label="toggle menu"
              type="button"
              className="w-full border-0 rounded-2xl h-full right-3 w-full border flex items-center px-3 justify-between"
              {...getToggleButtonProps(getDropdownProps({ preventKeyAction: isOpen, tabIndex: 0 }))}
            >
              <div>{value}</div>
              <KeyboardArrowDown />
            </button>
          </div>
        </div>

        <ul className="absolute w-full bg-white shadow-md max-h-80 overflow-scroll w-inherit z-50" {...getMenuProps()}>
          {isOpen && children}
        </ul>
      </div>
    </SelectContext.Provider>
  );
};

const SelectOption = ({ children, index, item, isSelectedItem }: SelectOptionI) => {
  const { getItemProps, selectedItem, highlightedIndex } = useSelectContext();
  const isSelected = isSelectedItem || selectedItem?.value === item.value;
  const isHighlighted = highlightedIndex === index;

  let props: any = {};

  if (getItemProps) {
    props = getItemProps({ item, index });
  }

  return (
    <li
      className={`${isSelected ? "font-bold" : "font-light"} ${
        isHighlighted ? "bg-lightGray" : "bg-white"
      } h-12 flex items-center px-4 border-b border-gray/20 cursor-pointer`}
      {...props}
    >
      {children}
    </li>
  );
};

export default Select;
export { SelectOption };
