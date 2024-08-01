"use client";
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { db } from '@/app/firebase'; // Adjust the import according to your project structure
import { doc, getDoc } from 'firebase/firestore';
import ProductsLayout from './ProductsLayout';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Head from 'next/head';

type Product = {
  productName: string;
  images: string[];
  price: string;
  marketPrice: string; // Changed from discountedPrice to marketPrice
  brand: string;
  description: string;
  stock: number;
  deliveryInfo: string;
  emi: string;
  seller: string;
};

export default function ProductDetails() {
  const router = useRouter();
  const { productId } = router.query;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [userUUID, setUserUUID] = useState<string | null>(null);

  useEffect(() => {
    if (productId) {
      const fetchProduct = async () => {
        try {
          const productDoc = doc(db, 'products', productId as string);
          const productSnapshot = await getDoc(productDoc);
          if (productSnapshot.exists()) {
            setProduct(productSnapshot.data() as Product);
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        setUserUUID(user.uid);
      } else {
        setUserUUID(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const addToCart = async () => {
    try {
      const user = getAuth().currentUser;
      if (!user) {
        router.push('/login');
        return;
      }

      const idToken = await user.getIdToken(true);
      console.log("Sending request to /api/cart with data:", { productId, idToken });

      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId: productId, idToken: idToken }), // Make sure productId is in the body
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      console.log('Product added to cart:', data.cart);

      // Display confirmation dialog
      if (confirm('Product added to cart. Click OK to view your cart.')) {
        router.push('/Cart');
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Loading Product Details.....</div>;
  }

  return (
    <>
      <Head>
        <title>{product.productName} - Product Details</title>
        <meta
          name="description"
          content={`Buy ${product.productName} from our e-commerce platform. Explore product details, prices, and special offers.`}
        />
        <meta
          name="keywords"
          content="e-commerce, product details, buy online, best prices, special offers"
        />
        <meta name="robots" content="index, follow" />
      </Head>
      <ProductsLayout>
        <div className="flex justify-center items-center min-h-screen p-4 bg-gray-100">
          <div className="bg-white shadow-md rounded-lg p-6 max-w-lg w-full">
            <h1 className="text-2xl font-bold mb-4 text-black">{product.productName}</h1>
            <div className="mb-4">
              <Carousel showThumbs={false} infiniteLoop useKeyboardArrows autoPlay>
                {product.images.map((imageUrl, index) => (
                  <div key={index}>
                    <Image
                      src={imageUrl}
                      alt={`Product image ${index + 1}`}
                      width={300}
                      height={300}
                      className="w-full h-auto object-cover rounded"
                    />
                  </div>
                ))}
              </Carousel>
            </div>
            <div className="space-y-2 text-black font-bold">
              <p className="text-lg font-bold">Price: <span className="text-red-500">{product.price}</span></p>
              <p className="text-lg font-bold">Market Price: <span className="text-green-500">{product.marketPrice}</span></p> {/* Changed here */}
              <p className="font-bold">Brand: <span className="font-normal">{product.brand}</span></p>
              <p className="font-bold">Description: <span className="font-normal">{product.description}</span></p>
              <p className="font-bold">Stock: <span className="font-normal">{product.stock}</span></p>
              <p className="font-bold">Delivery Info: <span className="font-normal">{product.deliveryInfo}</span></p>
              <p className="font-bold">EMI: <span className="font-normal">{product.emi}</span></p>
              <p className="font-bold">Seller: <span className="font-normal">{product.seller}</span></p>
            </div>
            <button
              onClick={addToCart}
              className="mt-6 w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </ProductsLayout>
    </>
  );
}
