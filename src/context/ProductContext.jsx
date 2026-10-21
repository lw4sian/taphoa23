import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_PRODUCTS, DEFAULT_CATEGORIES } from '../data/productsData';

const ProductContext = createContext(null);

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('tapHoa23Products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    localStorage.setItem('tapHoa23Products', JSON.stringify(DEFAULT_PRODUCTS));
    return DEFAULT_PRODUCTS;
  });

  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem('tapHoa23Categories');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    localStorage.setItem('tapHoa23Categories', JSON.stringify(DEFAULT_CATEGORIES));
    return DEFAULT_CATEGORIES;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Sync products to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('tapHoa23Products', JSON.stringify(products));
    } catch (e) {}
  }, [products]);

  // Sync categories to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('tapHoa23Categories', JSON.stringify(categories));
    } catch (e) {}
  }, [categories]);

  const addProduct = (newProductData) => {
    const maxId = products.reduce((max, p) => Math.max(max, Number(p.id) || 0), 0);
    const id = maxId + 1;

    const newProduct = {
      ...newProductData,
      id,
      rating: newProductData.rating || 5.0,
      reviews: newProductData.reviews || 1,
      sold: Number(newProductData.sold) || 0,
      stock: Number(newProductData.stock) || 0,
      price: Number(newProductData.price) || 0,
      originalPrice: Number(newProductData.originalPrice) || Number(newProductData.price) || 0,
      isOutOfStock: Number(newProductData.stock) <= 0 || newProductData.status === 'out_of_stock',
      status: Number(newProductData.stock) <= 0 ? 'out_of_stock' : 'available'
    };

    // Auto-discover category if doesn't exist
    if (newProduct.category && newProduct.category !== 'all') {
      const exists = categories.some((c) => c.id === newProduct.category);
      if (!exists) {
        setCategories((prev) => [
          ...prev,
          {
            id: newProduct.category,
            label: newProduct.categoryLabel || newProduct.category,
            icon: newProduct.icon && newProduct.icon.length <= 8 && !newProduct.icon.startsWith('http') ? newProduct.icon : '🏷️'
          }
        ]);
      }
    }

    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = (id, updatedFields) => {
    const numId = Number(id);
    let updatedItem = null;

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === numId) {
          const isOutOf = updatedFields.stock !== undefined
            ? Number(updatedFields.stock) <= 0 || updatedFields.status === 'out_of_stock'
            : p.isOutOfStock;

          updatedItem = {
            ...p,
            ...updatedFields,
            isOutOfStock: isOutOf,
            status: isOutOf ? 'out_of_stock' : 'available'
          };
          return updatedItem;
        }
        return p;
      })
    );
    return updatedItem;
  };

  const deleteProduct = (id) => {
    const numId = Number(id);
    setProducts((prev) => prev.filter((p) => p.id !== numId));
  };

  const toggleStock = (id) => {
    const numId = Number(id);
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === numId) {
          const newOutOfStock = !p.isOutOfStock;
          return {
            ...p,
            isOutOfStock: newOutOfStock,
            status: newOutOfStock ? 'out_of_stock' : 'available',
            stock: newOutOfStock ? 0 : (Number(p.stock) <= 0 ? 10 : p.stock)
          };
        }
        return p;
      })
    );
  };

  const addCategory = (cat) => {
    if (!cat.id || !cat.label) return false;
    setCategories((prev) => [...prev, cat]);
    return true;
  };

  const updateCategory = (id, updatedFields) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updatedFields } : c))
    );
  };

  const deleteCategory = (id) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const getProductById = (id) => {
    const numId = Number(id);
    return products.find((p) => p.id === numId) || null;
  };

  const getRelatedProducts = (product, limit = 4) => {
    if (!product) return [];
    return products
      .filter((p) => p.id !== product.id && (p.category === product.category || p.badge === 'Hot' || p.badge === 'Best'))
      .slice(0, limit);
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleStock,
        addCategory,
        updateCategory,
        deleteCategory,
        getProductById,
        getRelatedProducts
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within ProductProvider');
  }
  return context;
}
