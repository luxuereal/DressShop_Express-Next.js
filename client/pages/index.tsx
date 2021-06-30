import React, { useState, useEffect } from 'react';
import { Spinner, Button, Heading, Container } from 'components/ui';
import { Meta, MobileBottomMenu } from 'components/core';
import { ProductListSkeleton, ProductList } from 'components/product';
import { BannersSection, CategoriesSection } from 'components/home';
import { useShop } from 'contexts';
import { Banner, Category } from 'types';
import { useScrollRestoration } from 'hooks';
import { colors } from 'utils/theme';
import styles from 'styles/Home.module.css';

interface Props {
  banners: Banner[];
  categories: Category[];
}

const Home: React.FC<Props> = () => {
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { isLoading, loadProducts, hasLoadMore, products } = useShop();

  useEffect(() => {
    if (isLoading) {
      loadProducts();
    }
  }, []);

  useScrollRestoration();

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    await loadProducts();
    setIsLoadingMore(false);
  };

  const showLoadMore = () => {
    return !isLoading && hasLoadMore && !isLoadingMore;
  };

  return (
    <>
      <Meta />
      <BannersSection />
      <Container className={styles.container}>
        <CategoriesSection />
        <Heading>Product Overview</Heading>
        {isLoading ? <ProductListSkeleton number={20} /> : <ProductList products={products} />}
        {isLoadingMore && (
          <div className={styles.loadingWrapper}>
            <Spinner color={colors.primary} size={30} />
          </div>
        )}

        {showLoadMore() && (
          <div className={styles.loadMore}>
            <Button
              title="Load More"
              className={styles.loadMoreBtn}
              onClick={handleLoadMore}
              type="button"
              variant="outline"
            />
          </div>
        )}

        {!hasLoadMore && (
          <div className={styles.reachedEnd}>No more products. You have reached the end.</div>
        )}
      </Container>
      <MobileBottomMenu />
    </>
  );
};

export default Home;
