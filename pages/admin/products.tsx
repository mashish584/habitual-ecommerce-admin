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
            {products.data.map((product, index) => {
              const isLastRow = products.data.length - 1 === index;
              if (isLastRow) {
                console.log(`Index of last row is ${index}`);
              }
              return (
                <ListRow key={index} ref={isLastRow ? loader : null} className="justify-between">
                  <ListItem isImage={true} imagePath={product.images[0].thumbnailUrl} className="w-16 h-16" />
                  <ListItem type="text" text={product.title} className="w-48" />
                  <ListItem type="text" text={`${product.categoryIds.length} categories`} className="w-28" />
                  <ListItem type="text" text={`${product.quantity} qty`} className="w-16" />
                  <ListItem type="text" text={`$${product.price}`} className="w-16" />
                  <ListItem type="text" text="Active" className="w-20" childClasses="text-success" />
                  <ListItem
                    type="action"
                    text="View"
                    index={index}
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
