import React, { useEffect, useRef, useState } from "react";

import { DashboardLayout } from "../../components/Layout";
import { ListContainer, ListRow, ListItem } from "../../components/List";
import { LoaderRef } from "../../components/List/ListRow";
import { AddProductModal, ProductDetailModal } from "../../components/Modals";
import SectionHeading from "../../components/SectionHeading";
import useIntersection from "../../hooks/useIntersection";
import useProduct from "../../hooks/useProduct";

const Product = () => {
  const loader = useRef<LoaderRef>(null);
  const { getProducts, products } = useProduct();
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [showProductDetail, setShowProductDetail] = useState(false);

  const { createObserver } = useIntersection();

  useEffect(() => {
    getProducts();
  }, []);

  useEffect(() => {
    let observer: IntersectionObserver;
    if (loader.current) {
      observer = createObserver(loader, () => {
        console.log(`Next page is ${products.nextPage}`);
        if (products.nextPage) {
          getProducts();
        }
      });
    }
    return () => {
      if (observer && loader.current) {
        observer.disconnect();
      }
    };
  }, [products]);

  return (
    <DashboardLayout>
      <div className="lg:container">
        <SectionHeading
          title={`Products(${products.count})`}
          isAction={true}
          buttonText="Add Product"
          onAction={() => setShowAddProductForm(true)}
        />
        <div className="w-full h-full overflow-auto px-2 py-1">
          <ListContainer className="mw-1024 tableMaxHeight px-2 py-2">
            {products.data.map((_, index) => {
              const isLastRow = products.data.length - 1 === index;
              if (isLastRow) {
                console.log(`Index of last row is ${index}`);
              }
              return (
                <ListRow key={index} ref={isLastRow ? loader : null} className="justify-between">
                  <ListItem isImage={true} imagePath="https://unsplash.it/100/100" className="w-12" />
                  <ListItem type="text" text={`${isLastRow ? "Last row" : ""} Macbook Pro 2020 14 inch Slate Gray`} className="w-fit" />
                  <ListItem type="text" text="Electronics" className="w-fit" />
                  <ListItem type="text" text="200 available" className="w-24" />
                  <ListItem type="text" text="50 sold" className="w-16" />
                  <ListItem type="text" text="$999" className="w-16" />
                  <ListItem type="text" text="Active" className="w-20" childClasses="text-success" />
                  <ListItem
                    type="action"
                    text="View"
                    className="w-40"
                    childClasses="radius-80"
                    onAction={() => setShowProductDetail(true)}
                  />
                </ListRow>
              );
            })}
          </ListContainer>
        </div>
      </div>

      <AddProductModal visible={showAddProductForm} onClose={() => setShowAddProductForm(false)} />
      <ProductDetailModal visible={showProductDetail} onClose={() => setShowProductDetail(false)} />
    </DashboardLayout>
  );
};

export default Product;
