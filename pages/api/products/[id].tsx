import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PUT') {
        res.status(405).send({ message: 'Only PUT requests allowed' });
        return;
    }

    const { id } = req.query;
    const {
        productName,
        price,
        marketPrice,
        brand,
        seller,
        description,
        manufacturingDate,
        expiryDate,
        listingDate,
        percentageOfDiscountOffered,
        stock,
        category,
        deliveryInfo,
        emi,
        images,
    } = req.body;
    console.log(req.body);
    try {
        const updatedProduct = await prisma.product.update({
            where: { id: String(id) },
            data: {
              productName,
              price: parseFloat(price), // Convert price to Float
              marketPrice: parseFloat(marketPrice), // Convert marketPrice to Float
              brand,
              seller,
              description,
              manufacturingDate: new Date(manufacturingDate), // Convert to Date object
              expiryDate: new Date(expiryDate), // Convert to Date object
              listingDate: new Date(listingDate), // Convert to Date object
              percentageOfDiscountOffered: parseFloat(percentageOfDiscountOffered),
              stock: parseInt(stock), // Convert stock to Integer
              category,
              deliveryInfo,
              emi,
              images,
            },
        });

        res.status(200).json({ message: 'Product updated successfully', updatedProduct });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Error updating product', error });
    }
}
