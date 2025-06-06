
import type { Language, Translations } from '@/types';

export const translations: Translations = {
  // Header
  home: { en: 'Home', bg: 'Начало' },
  products: { en: 'Products', bg: 'Продукти' },
  admin: { en: 'Admin Panel', bg: 'Админ Панел' },
  settings: { en: 'Settings', bg: 'Настройки' },
  loginWithGoogle: { en: 'Login with Google', bg: 'Вход с Google' },
  logout: { en: 'Logout', bg: 'Изход' },
  roleLabel: { en: 'Role', bg: 'Роля' },
  roleAdmin: { en: 'Admin', bg: 'Администратор' },
  roleUser: { en: 'User', bg: 'Потребител' },
  // Homepage
  recentlyAdded: { en: 'Recently Added Products', bg: 'Наскоро Добавени' },
  mostPopular: { en: 'Most Popular Products', bg: 'Най-Популярни' },
  viewProduct: { en: 'View Product', bg: 'Виж Продукта' },
  searchPlaceholder: { en: 'Search products...', bg: 'Търсене на продукти...' },
  noProductsFound: { en: 'No products found matching your search.', bg: 'Няма намерени продукти, отговарящи на вашето търсене.' },
  // Products Page
  allProducts: { en: 'All Products', bg: 'Всички Продукти' },
  // Product Detail Page
  productDetails: { en: 'Product Details', bg: 'Детайли за Продукта' },
  editProduct: { en: 'Edit Product', bg: 'Редактирай Продукт' },
  productNotFound: { en: 'Product not found', bg: 'Продуктът не е намерен' },
  // Admin Page & Edit Product Page
  addProduct: { en: 'Add New Product', bg: 'Добави Нов Продукт' },
  title: { en: 'Title', bg: 'Заглавие' },
  description: { en: 'Description', bg: 'Описание' },
  imageUrl: { en: 'Image URL', bg: 'URL на Изображение' },
  price: { en: 'Price (BGN)', bg: 'Цена (лв)' },
  submit: { en: 'Submit', bg: 'Изпрати' },
  saveChanges: { en: 'Save Changes', bg: 'Запази Промените' },
  productAddedSuccess: { en: 'Product added successfully!', bg: 'Продуктът е добавен успешно!' },
  productAddedError: { en: 'Failed to add product.', bg: 'Неуспешно добавяне на продукт.' },
  productUpdatedSuccess: { en: 'Product updated successfully!', bg: 'Продуктът е актуализиран успешно!' },
  productUpdatedError: { en: 'Failed to update product.', bg: 'Неуспешно актуализиране на продукт.' },
  // Settings Page
  appSettings: { en: 'Application Settings', bg: 'Настройки на Приложението' },
  theme: { en: 'Theme', bg: 'Тема' },
  language: { en: 'Language', bg: 'Език' },
  light: { en: 'Light', bg: 'Светла' },
  dark: { en: 'Dark', bg: 'Тъмна' },
  system: { en: 'System', bg: 'Системна' },
  // General
  currencySymbol: { en: 'BGN', bg: 'лв' },
  loading: { en: 'Loading...', bg: 'Зареждане...' },
  error: { en: 'An error occurred', bg: 'Възникна грешка' },
  pageNotFound: { en: 'Page Not Found', bg: 'Страницата не е намерена' },
  goHome: { en: 'Go to Homepage', bg: 'Към Начална Страница' },
  // Cart
  shoppingCart: { en: 'Shopping Cart', bg: 'Количка' },
  addToCart: { en: 'Add to Cart', bg: 'Добави в количка' },
  itemAddedToCart: { en: 'Item Added to Cart', bg: 'Продукт добавен в количката' },
  itemAddedToCartDescSuffix: { en: 'was added to your cart.', bg: 'беше добавен към вашата количка.' },
  itemRemovedFromCart: { en: 'Item Removed', bg: 'Продукт премахнат' },
  cartCleared: { en: 'Cart Cleared', bg: 'Количката изчистена' },
  yourCartIsEmpty: { en: 'Your Cart is Empty', bg: 'Вашата количка е празна' },
  yourCartIsEmptyDesc: { en: 'Looks like you haven\'t added any products yet. Start browsing!', bg: 'Изглежда все още не сте добавили продукти. Започнете да разглеждате!' },
  startShopping: { en: 'Start Shopping', bg: 'Към продуктите' },
  product: { en: 'Product', bg: 'Продукт' },
  quantity: { en: 'Quantity', bg: 'Количество' },
  total: { en: 'Total', bg: 'Общо' },
  grandTotal: { en: 'Grand Total', bg: 'Крайна сума' },
  remove: { en: 'Remove', bg: 'Премахни' },
  clearCart: { en: 'Clear Cart', bg: 'Изчисти количката' },
  shareCart: { en: 'Share Cart', bg: 'Сподели количка' },
  cartLinkCopiedTitle: { en: 'Link Copied!', bg: 'Линкът е копиран!' },
  cartLinkCopiedDesc: { en: 'Cart link copied to clipboard.', bg: 'Линкът към количката е копиран.' },
  failedToCopyLink: { en: 'Failed to copy link.', bg: 'Неуспешно копиране на линк.' },
  cartIsEmpty: { en: 'Cart is Empty', bg: 'Количката е празна' },
  cannotShareEmptyCart: { en: 'Cannot share an empty cart.', bg: 'Не може да споделите празна количка.' },
  loadSharedCartTitle: { en: 'Load Shared Cart?', bg: 'Зареждане на споделена количка?' },
  loadSharedCartDesc: { en: 'This will replace your current cart items. Do you want to continue?', bg: 'Това ще замени текущите артикули във вашата количка. Искате ли да продължите?' },
  invalidSharedCartLink: { en: 'The shared cart link is invalid or expired.', bg: 'Споделеният линк към количката е невалиден или изтекъл.' },
  errorFetchingCartDetails: { en: 'Error fetching product details for your cart.', bg: 'Грешка при извличане на детайли за продуктите в количката.' },
  loadingProductDetails: { en: 'Loading product details...', bg: 'Зареждане на детайли за продукта...' },
  cancel: { en: 'Cancel', bg: 'Отказ' },
  loadCart: { en: 'Load Cart', bg: 'Зареди количка' },
};

export const getTranslation = (key: string, lang: Language, count?: number): string => {
  const translationSet = translations[key];
  if (!translationSet) {
    console.warn(`Translation key "${key}" not found.`);
    return key;
  }
  const translatedString = translationSet[lang] || translationSet['en']; // Fallback to English
  
  // Basic pluralization (example, can be expanded)
  if (count !== undefined) {
    // Assuming key_plural exists for plural forms
    const pluralKey = `${key}_plural`;
    if (count !== 1 && translations[pluralKey] && translations[pluralKey][lang]) {
      return translations[pluralKey][lang];
    }
  }
  return translatedString;
};
