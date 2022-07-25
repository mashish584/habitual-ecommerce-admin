import React from "react";
import Button from "../Button";
import { Input, Select } from "../Form";
import ImagePicker from "../Form/ImagePicker";
import { SelectOption } from "../Form/Select";
import SideModal, { SideModalI } from "./SideModal";

interface AddCategoryModalI extends SideModalI {}

const options = [
  { label: "Category 1", value: "Cateogry 1" },
  { label: "Category 2", value: "Cateogry 2" },
];

const AddCategoryModal = ({ visible, onClose }: AddCategoryModalI) => (
    <SideModal visible={visible} onClose={onClose}>
      <div className="h-full">
        <h2 className="ff-lato font-black text-2xl">Add Category</h2>
        <form className="mt-10 h-full flex flex-col justify-between">
          <div>
            <Input type="text" name="title" label="Category Name" onChange={() => {}} />
            <Select items={options} label="Parent Category">
              {options.map((option, index) => (
                <SelectOption item={option} index={index} onClick={() => alert(index)}>
                  {option.label}
                </SelectOption>
              ))}
            </Select>
            <ImagePicker label="Upload Image" actionText="Upload Image" showColorPicker={false} />
          </div>
          <Button variant="primary" type="button" className="my-10">
            Add Category
          </Button>
        </form>
      </div>
    </SideModal>
);

export default AddCategoryModal;
