import React, { useCallback, useEffect, useRef, useState } from "react";

import { DashboardLayout } from "../../components/Layout";
import { ListContainer, ListRow, ListItem } from "../../components/List";
import { LoaderRef } from "../../components/List/ListRow";
import { AddProductModal, ProductDetailModal } from "../../components/Modals";
import SectionHeading from "../../components/SectionHeading";
import useIntersection from "../../hooks/useIntersection";
import useProduct from "../../hooks/useProduct";

const Product = () => {
  const loader = useRef<LoaderRef>(null);
  const { getProducts, products, getProductDetail, productInfo, deleteProductImage, resetProductInfo, updateProductState } = useProduct();
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [showProductDetail, setShowProductDetail] = useState(false);

  const { createObserver } = useIntersection();

  const viewProductDetail = async (id: string) => {
    await getProductDetail(id);
    setShowProductDetail(true);
  };

  const hideProductDetail = useCallback(() => {
    resetProductInfo();
    setShowProductDetail(false);
  }, []);

  const showProductForm = useCallback(() => {
    if (productInfo) {
      setShowProductDetail(false);
    }
    setShowAddProductForm(true);
  }, [productInfo]);

  const hideProductForm = useCallback(() => {
    setShowAddProductForm(false);
    if (productInfo) {
      setShowProductDetail(true);
    }
  }, [productInfo]);

  useEffect(() => {
    getProducts("?select=id&select=title&select=price&select=images&select=quantity&select=categoryIds");
  }, []);

  useEffect(() => {
    let observer: IntersectionObserver;
    if (loader.current) {
      observer = createObserver(loader, () => {
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

  const productIds = Object.keys(products.data);

  return (
    <DashboardLayout>
      <div className="lg:container">
        <SectionHeading title={`Products(${products.count})`} isAction={true} buttonText="Add Product" onAction={showProductForm} />
        <div className="w-full h-full overflow-auto px-2 py-1">
          <ListContainer className="mw-1024 tableMaxHeight px-2 py-2">
            {productIds.map((productId, index) => {
              const isLastRow = productIds.length - 1 === index;
              const product = products.data[productId];

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
                    index={productId}
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
