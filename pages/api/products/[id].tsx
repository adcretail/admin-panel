import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/app/firebase';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  if (req.method === 'PUT') {
    try {
      const productRef = doc(db, 'products', id as string);
      await updateDoc(productRef, req.body);
      res.status(200).json({ message: 'Product updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating product', error });
    }
  } else if (req.method === 'DELETE') {
    try {
      const productRef = doc(db, 'products', id as string);
      await deleteDoc(productRef);
      res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting product', error });
    }
  } else {
    res.setHeader('Allow', ['PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
