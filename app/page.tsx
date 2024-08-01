"use client"
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { db } from './firebase';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';

interface Category {
  id: string;
  categoryName: string;
  images: string[];
}

interface Product {
  id: string;
  productName: string;
  categoryId: string;
  price: number;
  images: string[];
  description: string;
  emi: string;
  expiryDate: string;
  listingDate: string;
  manufacturingDate: string;
  marketPrice: string;
  percentageOfDiscountOffered: string;
  seller: string;
  stock: string;
  userId: string;
}

const AdminDashboard = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryCollection = collection(db, 'categories');
        const categorySnapshot = await getDocs(categoryCollection);
        const categoryList = categorySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Category[];
        setCategories(categoryList);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchProducts = async () => {
      try {
        const productCollection = collection(db, 'products');
        const productSnapshot = await getDocs(productCollection);
        const productList = productSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Product[];
        setProducts(productList);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchCategories();
    fetchProducts();
  }, []);

  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'categories', id));
      setCategories(categories.filter(category => category.id !== id));
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
      setProducts(products.filter(product => product.id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleUpdateCategory = async (e: FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      try {
        const response = await fetch(`/api/categories/${editingCategory.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editingCategory),
        });

        if (response.ok) {
          setCategories(categories.map(cat => (cat.id === editingCategory.id ? editingCategory : cat)));
          setEditingCategory(null);
        } else {
          console.error('Error updating category');
        }
      } catch (error) {
        console.error('Error updating category:', error);
      }
    }
  };

  const handleUpdateProduct = async (e: FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      try {
        const response = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editingProduct),
        });

        if (response.ok) {
          setProducts(products.map(prod => (prod.id === editingProduct.id ? editingProduct : prod)));
          setEditingProduct(null);
        } else {
          console.error('Error updating product');
        }
      } catch (error) {
        console.error('Error updating product:', error);
      }
    }
  };

  const handleCategoryChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditingCategory(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleProductChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditingProduct(prev => prev ? { ...prev, [name]: value } : null);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      {/* Categories Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-2">Categories</h2>
        <div className="bg-white p-4 rounded shadow-md">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">ID</th>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Images</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td className="py-2 px-4 border-b">{category.id}</td>
                  <td className="py-2 px-4 border-b">{category.categoryName}</td>
                  <td className="py-2 px-4 border-b">
                    {category.images.map((image, index) => (
                      <img key={index} src={image} alt={category.categoryName} className="w-12 h-12 object-cover inline-block mr-2" />
                    ))}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <button onClick={() => setEditingCategory(category)} className="mr-2 bg-blue-500 text-white px-4 py-2 rounded">Update</button>
                    <button onClick={() => handleDeleteCategory(category.id)} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update Category Form */}
      {editingCategory && (
        <form onSubmit={handleUpdateCategory} className="mb-8">
          <h3 className="text-lg font-bold mb-2">Update Category</h3>
          <div className="bg-white p-4 rounded shadow-md">
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Name</label>
              <input
                type="text"
                name="categoryName"
                value={editingCategory.categoryName}
                onChange={handleCategoryChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Save</button>
            <button type="button" onClick={() => setEditingCategory(null)} className="ml-2 bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
          </div>
        </form>
      )}

      {/* Products Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-2">Products</h2>
        <div className="bg-white p-4 rounded shadow-md">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">ID</th>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Category ID</th>
                <th className="py-2 px-4 border-b">Price</th>
                <th className="py-2 px-4 border-b">Images</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="py-2 px-4 border-b">{product.id}</td>
                  <td className="py-2 px-4 border-b">{product.productName}</td>
                  <td className="py-2 px-4 border-b">{product.categoryId}</td>
                  <td className="py-2 px-4 border-b">{product.price}</td>
                  <td className="py-2 px-4 border-b">
                    {product.images.map((image, index) => (
                      <img key={index} src={image} alt={product.productName} className="w-12 h-12 object-cover inline-block mr-2" />
                    ))}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <button onClick={() => setEditingProduct(product)} className="mr-2 bg-blue-500 text-white px-4 py-2 rounded">Update</button>
                    <button onClick={() => handleDeleteProduct(product.id)} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update Product Form */}
      {editingProduct && (
        <form onSubmit={handleUpdateProduct} className="mb-8">
          <h3 className="text-lg font-bold mb-2">Update Product</h3>
          <div className="bg-white p-4 rounded shadow-md">
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Name</label>
              <input
                type="text"
                name="productName"
                value={editingProduct.productName}
                onChange={handleProductChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Category ID</label>
              <input
                type="text"
                name="categoryId"
                value={editingProduct.categoryId}
                onChange={handleProductChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Price</label>
              <input
                type="number"
                name="price"
                value={editingProduct.price}
                onChange={handleProductChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                value={editingProduct.description}
                onChange={handleProductChange}
                className="w-full p-2 border border-gray-300 rounded"
              ></textarea>
            </div>
            {/* Add additional fields as necessary */}
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Save</button>
            <button type="button" onClick={() => setEditingProduct(null)} className="ml-2 bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AdminDashboard;
