import { hashSync } from 'bcrypt-ts-edge';

const sampleData = {
  users: [
    {
      name: 'John',
      email: 'admin@example.com',
      password: hashSync('123456', 10),
      role: 'admin'
    },
    {
      name: 'Jane',
      email: 'user@example.com',
      password: hashSync('123456', 10),
      role: 'user'
    },
  ],
  products: [
    {
      name: 'HUGO BOSS Poloshirt til Drenge Strågul',
      slug: 'boss-polo-shirt-yellow',
      category: "Herreskjorter",
      description: 'Poloens ikoniske stil kombineret med ny tids komfort',
      images: [
        '/images/sample-products/p1-1.jpg',
        '/images/sample-products/p1-2.jpg',
      ],
      price: 59.99,
      brand: 'HUGO BOSS',
      rating: 4.5,
      numReviews: 10,
      stock: 5,
      isFeatured: true,
      banner: '/images/sample-products/banner-1.jpg',
    },
    {
      name: 'Lyle And Scott Oxford Skjorte X41 Riviera',
      slug: 'lyle-and-scott-oxford-riviera',
      category: "Herreskjorter",
      description: 'Klassisk design kombineret med luksuriøs komfort',
      images: [
        '/images/sample-products/p2-1.jpg',
        '/images/sample-products/p2-2.jpg',
      ],
      price: 85.9,
      brand: 'Lyle And Scott',
      rating: 4.2,
      numReviews: 8,
      stock: 10,
      isFeatured: true,
      banner: '/images/sample-products/banner-2.jpg',
    },
    {
      name: 'ONLY & SONS Herre Caiden Life Langærmet shirts beige',
      slug: 'only-sons-caiden-life-shirt-beige',
      category: "Herreskjorter",
      description: 'En ideel kombination af elegance og komfort',
      images: [
        '/images/sample-products/p3-1.jpg',
        '/images/sample-products/p3-2.jpg',
      ],
      price: 99.95,
      brand: 'ONLY & SONS',
      rating: 4.9,
      numReviews: 3,
      stock: 0,
      isFeatured: false,
      banner: null,
    },
    {
      name: 'ONLY & SONS Herre Caiden Life Langærmet shirts Blå',
      slug: 'only-sons-caiden-life-shirt-blue',
      category: "Herreskjorter",
      description: 'Enkel og moderne stil i fleksibelt tekstil',
      images: [
        '/images/sample-products/p4-1.jpg',
        '/images/sample-products/p4-2.jpg',
      ],
      price: 39.95,
      brand: 'ONLY & SONS',
      rating: 3.6,
      numReviews: 5,
      stock: 10,
      isFeatured: false,
      banner: null,
    },
    {
      name: 'Indicode Polo Shirt',
      slug: 'polo-indicode-shirt',
      category: "Herreskjorter",
      description: 'Tidløst polodesign med et raffineret udtryk',
      images: [
        '/images/sample-products/p5-1.jpg',
        '/images/sample-products/p5-2.jpg',
      ],
      price: 79.99,
      brand: 'Indicode',
      rating: 4.7,
      numReviews: 18,
      stock: 6,
      isFeatured: false,
      banner: null,
    },
    {
      name: 'Han KJØBENHAVN Hoodie',
      slug: 'han-cph-hoodie',
      category: "Herre Sweatshirts",
      description: 'Behagelig, moderigtig og perfekt til afslappede dage',
      images: [
        '/images/sample-products/p6-1.jpg',
        '/images/sample-products/p6-2.jpg',
      ],
      price: 99.99,
      brand: 'Han KJØBENHAVN',
      rating: 4.6,
      numReviews: 12,
      stock: 8,
      isFeatured: false,
      banner: null,
    },
  ],
};

export default sampleData;
