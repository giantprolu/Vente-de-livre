-- Insert the book being sold
INSERT INTO books (
  title,
  author,
  description,
  price,
  image_url,
  isbn,
  pages,
  published_date
) VALUES (
  'Mon Livre Extraordinaire',
  'Auteur Indépendant',
  'Un livre captivant qui vous transportera dans un univers unique. Découvrez une histoire passionnante qui mêle aventure, émotion et réflexion. Parfait pour tous les amateurs de belle littérature.',
  24.90,
  '/book-cover-with-elegant-design.jpg',
  '978-2-1234-5678-9',
  320,
  '2024-01-15'
) ON CONFLICT DO NOTHING;
