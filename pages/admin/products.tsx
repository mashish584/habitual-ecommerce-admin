import React, { useCallback, useEffect, useRef, useState } from "react";

import { DashboardLayout } from "../../components/Layout";
import { ListContainer, ListRow, ListItem, LoaderRef } from "../../components/List";
import { AddProductModal, ProductDetailModal } from "../../components/Modals";
import SectionHeading from "../../components/SectionHeading";

import { useProduct, useIntersection } from "../../hooks";

const Product = () => {
  const loader = useRef<LoaderRef>(null);
  const { getProducts, products, getProductDetail, productInfo, deleteProductImage, resetProductInfo, updateProductState, loading } =
    useProduct();
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [showProductDetail, setShowProductDetail] = useState(false);

  const { createObserver } = useIntersection();

  const viewProductDetail = useCallback(
    async (id: string) => {
      await getProductDetail(id);
      setShowProductDetail(true);
    },
    [getProductDetail],
  );

  const hideProductDetail = useCallback(() => {
    resetProductInfo();
    setShowProductDetail(false);
  }, [resetProductInfo]);

  const showProductForm = useCallback(() => {
    if (productInfo) {
      setShowProductDetail(false);
    }
    setShowAddProductForm(true);
  }, [productInfo, setShowProductDetail, setShowAddProductForm]);

  const hideProductForm = useCallback(() => {
    setShowAddProductForm(false);
    if (productInfo) {
      setShowProductDetail(true);
    }
  }, [productInfo, setShowAddProductForm, setShowProductDetail]);

  useEffect(() => {
    getProducts("?select=id&select=title&select=price&select=images&select=quantity&select=categoryIds", null);
  }, [getProducts]);

  useEffect(() => {
    let observer: IntersectionObserver;
    if (loader.current) {
      observer = createObserver(loader, () => {
        if (products.nextPage) {
          getProducts("", products.nextPage);
        }
      });
    }
    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [createObserver, getProducts, products]);

  const productsData = Object.values(products.data);

  return (
    <DashboardLayout>
      <div className="lg:container">
        <SectionHeading title={`Products (${products.count})`} isAction={true} buttonText="Add Product" onAction={showProductForm} />
        <div className="w-full h-full overflow-auto px-2 py-1">
          <ListContainer
            className="relative mw-1024 tableMaxHeight"
            isLoading={loading.type === "products" && loading.isLoading}
            message={Object.values(products.data).length === 0 ? "No products available." : null}
          >
            {/* Table heading */}
            <ListRow className="bg-white sticky justify-between table-header">
              <ListItem type="heading" text={"#"} className="w-16 text-center" />
              <ListItem type="heading" text={"Title"} className="w-48" />
              <ListItem type="heading" text={"No. of Categories"} className="w-28" />
              <ListItem type="heading" text={"Quantity"} className="w-16" />
              <ListItem type="heading" text={"Price"} className="w-16" />
              <ListItem type="heading" text={"Status"} className="w-20" />
              <ListItem type="heading" text={"Action"} className="w-40 text-center" />
            </ListRow>

            {/* Table Items */}
            {productsData.map((product, index) => {
              const isLastRow = productsData.length - 1 === index;
              return (
                <ListRow key={index} ref={isLastRow ? loader : null} className={`justify-between ${isLastRow ? "border-b-0" : ""}`}>
                  <ListItem isImage={true} imagePath={product.images[0].thumbnailUrl} className="w-16 h-16" />
                  <ListItem type="text" text={product.title} className="w-48" />
                  <ListItem type="text" text={`${product.categoryIds.length} categories`} className="w-28" />
                  <ListItem type="text" text={`${product.quantity} qty`} className="w-16" />
                  <ListItem type="text" text={`$${product.price}`} className="w-16" />
                  <ListItem type="text" text="Active" className="w-20" childClasses="text-success" />
                  <ListItem
                    type="action"
                    text="View"
                    index={product.id}
                    className="w-40"
                    childClasses="radius-80"
                    onAction={viewProductDetail}
                  />
                </ListRow>
              );
            })}
          </ListContainer>
        </div>
      </div>

      <AddProductModal
        visible={showAddProductForm}
        selectedProduct={productInfo}
        updateProductState={updateProductState}
        onProductImageDelete={deleteProductImage}
        onClose={hideProductForm}
      />
      <ProductDetailModal
        visible={showProductDetail}
        selectedProduct={productInfo}
        onProductEdit={showProductForm}
        onClose={hideProductDetail}
      />
    </DashboardLayout>
  );
};

export default Product;
