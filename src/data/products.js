export const tShirts = [
  { 
    id: 1, 
    name: 'Classic White Cotton Tee', 
    price: 'Rs. 1,299', 
    category: 'T-Shirts',
    badge: 'Sale',
    description: 'Premium quality 100% pure cotton t-shirt. Comfortable fit, perfect for daily wear. Soft fabric that breathes well in all seasons.',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80',
      'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&q=80'
    ],
    sizes: ['S', 'M', 'L', 'XL']
  },
  { 
    id: 2, 
    name: 'Oversized Streetwear Tee', 
    price: 'Rs. 1,599', 
    category: 'T-Shirts',
    badge: 'New',
    description: 'Trendy oversized streetwear t-shirt with bold prints. Made with premium heavyweight cotton for a relaxed feel.',
    images: [
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80',
      'https://images.unsplash.com/photo-1571455786673-9d9d6c194f90?w=800&q=80',
      'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=800&q=80'
    ],
    sizes: ['M', 'L', 'XL']
  },
  { 
    id: 3, 
    name: 'Premium Polo Collar Tee', 
    price: 'Rs. 1,899', 
    category: 'T-Shirts',
    badge: '',
    description: 'Classic polo collar tee with a modern fit. Perfect for smart-casual occasions. Features durable stitching and premium fabric.',
    images: [
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80',
      'https://images.unsplash.com/photo-1626497764746-6dc36546b388?w=800&q=80',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80'
    ],
    sizes: ['S', 'M', 'L', 'XL']
  },
  { 
    id: 4, 
    name: 'Graphic Print T-Shirt', 
    price: 'Rs. 1,499', 
    category: 'T-Shirts',
    badge: 'Best Seller',
    description: 'Eye-catching graphic print t-shirt. Made with soft cotton blend for ultimate comfort. Unique designs you won\'t find elsewhere.',
    images: [
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80',
      'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&q=80'
    ],
    sizes: ['S', 'M', 'L']
  },
];

export const kurtis = [
  { 
    id: 5, 
    name: 'Embroidered Cotton Kurti', 
    price: 'Rs. 2,499', 
    category: 'Kurtis',
    badge: 'New',
    description: 'Beautiful printed cotton kurti with vibrant colors. Traditional design with modern comfort. Perfect for everyday wear.',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80',
      'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&q=80',
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80'
    ],
    sizes: ['S', 'M', 'L', 'XL']
  },
  { 
    id: 6, 
    name: 'Straight Cut Premium Kurta', 
    price: 'Rs. 3,199', 
    category: 'Kurtis',
    badge: '',
    description: 'Elegant straight cut kurta with premium fabric. Versatile design suitable for both casual and formal occasions.',
    images: [
      'https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=800&q=80',
      'https://images.unsplash.com/photo-1604004555489-723a93d6ce74?w=800&q=80',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80'
    ],
    sizes: ['M', 'L', 'XL']
  },
  { 
    id: 7, 
    name: 'Anarkali Floral Kurti', 
    price: 'Rs. 4,599', 
    category: 'Kurtis',
    badge: 'Sale',
    description: 'Stunning Anarkali style kurti with delicate floral embroidery. Perfect for festive occasions and special events.',
    images: [
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&q=80',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80',
      'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80',
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80'
    ],
    sizes: ['S', 'M', 'L']
  },
  { 
    id: 8, 
    name: 'Lawn Embroidered Kurti', 
    price: 'Rs. 3,899', 
    category: 'Kurtis',
    badge: 'Trending',
    description: 'Premium lawn fabric with intricate embroidery. Breathable and comfortable for summer season. A must-have in every wardrobe.',
    images: [
      'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&q=80',
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80'
    ],
    sizes: ['S', 'M', 'L', 'XL']
  },
];

export const allProducts = [...tShirts, ...kurtis];

export const getProductById = (id) => {
  return allProducts.find(p => p.id === parseInt(id));
};