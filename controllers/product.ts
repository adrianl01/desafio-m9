import { productIndex } from '../lib/algolia';

export async function getProductById(productId: string) {
  const product = await productIndex.getObject(productId);

  if (!product) {
    throw new Error('Product not found');
  }

  return product;
}

export async function searchProducts(search: string, offset: number, limit: number) {
  const results = await productIndex.search(search, {
    offset,
    length: limit,
    attributesToRetrieve: ['objectID', 'Name', 'Description', 'Images', 'Type', 'Unit_cost', 'Settings', 'Vendor', 'Materials', 'Color']
  });

  return {
    results: results.hits,

    pagination: {
      offset,
      limit,
      total: results.nbHits
    }
  };
}
