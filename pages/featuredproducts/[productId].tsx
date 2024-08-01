// pages/featuredproducts/[productId].tsx
"use client"
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { db } from '@/app/firebase'; // Adjust the import according to your project structure
import { doc, getDoc } from 'firebase/firestore';
import FeaturedProductsLayout from './FeaturedProductsLayout';

type Product = {
  featuredproductName: string;
  images: string[];
  price: string;
  brand: string;
  description: string;
  stock: number;
  deliveryInfo: string;
  emi: string;
  discountedPrice: string;
  seller: string;
};

export default function ProductDetails() {
  const router = useRouter();
  const { productId } = router.query;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (productId) {
      const fetchProduct = async () => {
        try {
          console.log("Fetching product with ID:", productId); // Debugging line
          const productDoc = doc(db, 'featuredproducts', productId as string);
          const productSnapshot = await getDoc(productDoc);
          if (productSnapshot.exists()) {
            setProduct(productSnapshot.data() as Product);
            console.log("Product data:", productSnapshot.data()); // Debugging line
          } else {
            console.error("Product not found");
          }
        } catch (error) {
          console.error("Error fetching product:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    } else {
      setLoading(false);
    }
  }, [productId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Loading Product Details.....</div>;
  }

  return (
    <FeaturedProductsLayout>
    <div className="flex justify-center items-center min-h-screen p-4 bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-lg w-full">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">{product.featuredproductName}</h1>
        <div className="mb-4">
          {product.images.map((imageUrl, index) => (
            <Image
              key={index}
              src={imageUrl}
              alt={`Product image ${index + 1}`}
              width={300}
              height={300}
              className="w-full h-auto object-cover mb-2 rounded"
            />
          ))}
        </div>
        <div className="space-y-2 text-gray-700">
          <p className="text-lg font-semibold">Price: <span className="text-red-500">{product.price}</span></p>
          <p className="text-lg font-semibold">Discounted Price: <span className="text-green-500">{product.discountedPrice}</span></p>
          <p className="font-semibold">Brand: <span className="font-normal">{product.brand}</span></p>
          <p className="font-semibold">Description: <span className="font-normal">{product.description}</span></p>
          <p className="font-semibold">Stock: <span className="font-normal">{product.stock}</span></p>
          <p className="font-semibold">Delivery Info: <span className="font-normal">{product.deliveryInfo}</span></p>
          <p className="font-semibold">EMI: <span className="font-normal">{product.emi}</span></p>
          <p className="font-semibold">Seller: <span className="font-normal">{product.seller}</span></p>
        </div>
      </div>
    </div>
    </FeaturedProductsLayout>
  );
}

