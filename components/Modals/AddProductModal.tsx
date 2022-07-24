import React from "react";
import Button from "../Button";
import { Input, Select } from "../Form";
import ImagePicker from "../Form/ImagePicker";
import ComboBoxExample, { SelectOption } from "../Form/Select";
import SideModal, { SideModalI } from "./SideModal";

interface AddproductModal extends SideModalI {}

const books = [
  { value: "Harper Lee", label: "To Kill a Mockingbird" },
  { value: "Lev Tolstoy", label: "War and Peace" },
  { value: "Fyodor Dostoyevsy", label: "The Idiot" },
  { value: "Oscar Wilde", label: "A Picture of Dorian Gray" },
  { value: "George Orwell", label: "1984" },
  { value: "Jane Austen", label: "Pride and Prejudice" },
  { value: "Marcus Aurelius", label: "Meditations" },
  { value: "Fyodor Dostoevsky", label: "The Brothers Karamazov" },
  { value: "Lev Tolstoy", label: "Anna Karenina" },
  { value: "Fyodor Dostoevsky", label: "Crime and Punishment" },
];

const AddProductModal: React.FC<AddproductModal> = ({ visible, onClose }) => {
  return (
    <SideModal visible={visible} onClose={onClose}>
      <div>
        <h2 className="ff-lato font-black text-2xl">Add Product</h2>
        <form className="mt-10">
          <div>
            <Input type="text" name="title" label="Title" onChange={() => {}} />
            <div className="flex justify-between">
              <Input type="text" name="price" label="Price" onChange={() => {}} className="basis-30" />
              <Input type="text" name="discount" label="Discount" onChange={() => {}} className="basis-30" />
              <Input type="text" name="quantity" label="Quantity" onChange={() => {}} className="basis-30 " />
            </div>
            <Input type="textarea" name="description" label="Description" onChange={() => {}} className="basis-30 " />

            <Select items={books} label="Categories">
              {books.map((book, index) => {
                return (
                  <SelectOption item={book} index={index} onClick={() => alert(index)}>
                    {book.label}
                  </SelectOption>
                );
              })}
            </Select>
            <ImagePicker />
          </div>
          <Button variant="primary" type="button" className="my-10">
            Add Product
          </Button>
        </form>
      </div>
    </SideModal>
  );
};

export default AddProductModal;
