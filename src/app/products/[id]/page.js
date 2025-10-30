import { productsAPI } from '@/lib/api';
import ProductDetail from '@/components/ProductDetail';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  try {
    const response = await productsAPI.getAll();
    const products = response.data;
    
    return products.map((product) => ({
      id: product.id.toString(),
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default async function ProductDetailPage({ params }) {
  try {
    // Next.js 15'te params await ile kullanılmalı
    const { id } = await params;
    const response = await productsAPI.getById(id);
    const product = response.data;

    if (!product) {
      notFound();
    }

    return <ProductDetail product={product} />;
  } catch (error) {
    console.error('Error fetching product:', error);
    notFound();
  }
}
