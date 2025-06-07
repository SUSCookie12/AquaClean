
import type { Language, Translations } from '@/types';

export const translations: Translations = {
  // Header
  home: { en: 'Home', bg: 'Начало' },
  products: { en: 'Products', bg: 'Продукти' },
  admin: { en: 'Admin Panel', bg: 'Админ Панел' },
  settings: { en: 'Settings', bg: 'Настройки' },
  account: { en: 'Account', bg: 'Профил' },
  loginWithGoogle: { en: 'Login with Google', bg: 'Вход с Google' },
  logout: { en: 'Logout', bg: 'Изход' },
  roleLabel: { en: 'Role', bg: 'Роля' },
  roleAdmin: { en: 'Admin', bg: 'Администратор' },
  roleUser: { en: 'User', bg: 'Потребител' },
  // Homepage
  heroTagline: { en: 'Discover a new standard of clean with our premium detergents and cleaning solutions for your home.', bg: 'Открийте нов стандарт на чистота с нашите премиум перилни препарати и почистващи разтвори за вашия дом.' },
  heroCTA: { en: 'Explore Products', bg: 'Разгледай Продуктите' },
  recentlyAdded: { en: 'Recently Added Products', bg: 'Наскоро Добавени' },
  mostPopular: { en: 'Most Popular Products', bg: 'Най-Популярни' },
  viewProduct: { en: 'View Product', bg: 'Виж Продукта' },
  searchPlaceholder: { en: 'Search products...', bg: 'Търсене на продукти...' },
  noProductsFound: { en: 'No products found matching your search.', bg: 'Няма намерени продукти, отговарящи на вашето търсене.' },
  noProductsAvailable: { en: 'No products available at the moment.', bg: 'В момента няма налични продукти.'},
  errorFetchingRecentProducts: { en: 'Error fetching recent products.', bg: 'Грешка при извличане на наскоро добавени продукти.'},
  errorFetchingPopularProducts: { en: 'Error fetching popular products settings.', bg: 'Грешка при извличане на настройките за популярни продукти.'},
  errorFetchingConfiguredPopularProducts: { en: 'Could not fetch all configured popular products. Please check admin settings.', bg: 'Не можаха да бъдат извлечени всички конфигурирани популярни продукти. Моля, проверете настройките в админ панела.'},
  noPopularProductsConfigured: { en: 'No popular products are currently configured.', bg: 'В момента няма конфигурирани популярни продукти.'},
  // Products Page
  allProducts: { en: 'All Products', bg: 'Всички Продукти' },
  // Product Detail Page
  productDetails: { en: 'Product Details', bg: 'Детайли за Продукта' },
  editProduct: { en: 'Edit Product', bg: 'Редактирай Продукт' },
  productNotFound: { en: 'Product not found', bg: 'Продуктът не е намерен' },
  // Admin Page & Edit Product Page & Add Product Form
  addProduct: { en: 'Add New Product', bg: 'Добави Нов Продукт' },
  title: { en: 'Title', bg: 'Заглавие' },
  description: { en: 'Description', bg: 'Описание' },
  imageUrl: { en: 'Image URL', bg: 'URL на Изображение' },
  price: { en: 'Price', bg: 'Цена' },
  submit: { en: 'Submit', bg: 'Изпрати' },
  submitting: { en: 'Submitting...', bg: 'Изпращане...' },
  addProductButton: { en: 'Add Product to Catalog', bg: 'Добави продукт в каталога' },
  productNamePlaceholder: { en: 'e.g., Ultra Clean Laundry Detergent', bg: 'напр., Перилен Препарат Ултра Чистота' },
  productDescriptionPlaceholder: { en: "Describe the product's features and benefits...", bg: 'Опишете характеристиките и предимствата на продукта...' },
  imageUrlHelpText: { en: "Link to the product image. Use a placeholder if needed.", bg: 'Линк към изображението на продукта. Използвайте заместител, ако е необходимо.'},
  aiImageHintLabel: { en: "AI Image Hint (Optional)", bg: "AI Подсказка за Изображение (Опционално)"},
  aiImageHintPlaceholder: { en: "e.g., 'detergent bottle' or 'cleaning supplies'", bg: "напр., 'бутилка препарат' или 'почистващи препарати'"},
  aiImageHintDesc: { en: "One or two keywords for AI image search if the main URL is a placeholder.", bg: "Една или две ключови думи за AI търсене на изображения, ако основният URL е заместител."},
  saveChanges: { en: 'Save Changes', bg: 'Запази Промените' },
  productAddedSuccess: { en: 'Product Added!', bg: 'Продуктът е добавен!' },
  hasBeenAddedToCatalog: { en: 'has been added to the catalog.', bg: 'беше добавен към каталога.' },
  productAddedError: { en: 'Failed to Add Product', bg: 'Неуспешно добавяне на продукт.' },
  productAddedErrorDesc: { en: 'There was an issue adding the product. Please check the details and try again.', bg: 'Възникна проблем при добавянето на продукта. Моля, проверете детайлите и опитайте отново.' },
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
  currencyLocale: { en: 'en-US', bg: 'bg-BG' },
  loading: { en: 'Loading...', bg: 'Зареждане...' },
  saving: { en: 'Saving...', bg: 'Запазване...' },
  error: { en: 'An error occurred', bg: 'Възникна грешка' },
  pageNotFound: { en: 'Page Not Found', bg: 'Страницата не е намерена' },
  goHome: { en: 'Go to Homepage', bg: 'Към Начална Страница' },
  notAvailable: { en: 'N/A', bg: 'Н/Д' },
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
  // Admin Dashboard
  overview: { en: 'Overview', bg: 'Общ Преглед' },
  userManagement: { en: 'User Management', bg: 'Управление Потребители' },
  productManagement: { en: 'Product Management', bg: 'Управление Продукти' },
  homepageSettings: { en: 'Homepage Settings', bg: 'Настройки Начална Стр.' },
  totalUsers: { en: 'Total Users', bg: 'Общо Потребители' },
  totalProducts: { en: 'Total Products', bg: 'Общо Продукти' },
  siteActivity: { en: 'Site Activity', bg: 'Активност на Сайта' },
  registeredUsersCount: { en: 'Registered users in the system.', bg: 'Регистрирани потребители в системата.' },
  productsInCatalog: { en: 'Products available in the catalog.', bg: 'Продукти налични в каталога.' },
  moreStatsComingSoon: { en: 'More Stats Coming Soon', bg: 'Още Статистики Скоро' },
  moreStatsComingSoonDesc: { en: 'Detailed analytics and reports will be available here.', bg: 'Детайлни анализи и отчети ще бъдат налични тук.' },
  errorLoadingStats: { en: 'Error loading overview statistics.', bg: 'Грешка при зареждане на статистики.' },
  user: { en: 'User', bg: 'Потребител' },
  email: { en: 'Email', bg: 'Имейл' },
  currentRoles: { en: 'Current Roles', bg: 'Текущи Роли' },
  roleClean: { en: 'Clean', bg: 'Чист' },
  noName: { en: '(No Name)', bg: '(Без Име)' },
  errorFetchingUsers: { en: 'Error fetching user list.', bg: 'Грешка при извличане на списъка с потребители.' },
  roleUpdatedSuccess: { en: 'Role Updated', bg: 'Ролята е Актуализирана' },
  roleFor: { en: 'role for', bg: 'роля за' },
  roleUpdatedTo: { en: 'updated to', bg: 'актуализирана на' },
  active: { en: 'active', bg: 'активна' },
  inactive: { en: 'inactive', bg: 'неактивна' },
  roleUpdatedError: { en: 'Role Update Failed', bg: 'Актуализацията на Ролята Неуспешна' },
  errorUpdatingRoleDesc: { en: 'Could not update the user role. Please try again.', bg: 'Неуспешно актуализиране на потребителската роля. Моля, опитайте отново.' },
  userRoleChangeWarning: { en: 'Changing user roles can have significant security implications. Proceed with caution.', bg: 'Промяната на потребителски роли може да има значителни последици за сигурността. Продължавайте с повишено внимание.'},
  adminCautionTitle: { en: "Administrator Actions", bg: "Администраторски Действия"},
  searchUsersPlaceholder: { en: "Search users by name or email...", bg: "Търсене на потребители по име или имейл..."},
  noUsersFoundSearch: { en: "No users found matching your search criteria.", bg: "Няма намерени потребители, отговарящи на вашите критерии за търсене."},
  noUsersInSystem: { en: "There are currently no users in the system.", bg: "В момента няма потребители в системата."},
  loadMoreUsers: { en: "Load More Users", bg: "Зареди още потребители"},
  managePopularProducts: { en: 'Manage Popular Products', bg: 'Управление Популярни Продукти' },
  howToManagePopularTitle: { en: 'How to Manage Popular Products', bg: 'Как да Управлявате Популярните Продукти'},
  selectAndOrderPopularProductsDesc: { en: 'Select and order exactly {count} products to feature in the "Most Popular" section on the homepage.', bg: 'Изберете и подредете точно {count} продукта, които да се показват в секцията "Най-популярни" на началната страница.' },
  currentPopularSelectionTitle: { en: 'Selected Popular Products ({count}/{required})', bg: 'Избрани Популярни Продукти ({count}/{required})' },
  noProductsCurrentlySelectedForPopular: { en: 'No products are currently selected to be featured.', bg: 'В момента няма избрани продукти за показване.' },
  addProductToPopularTitle: { en: 'Add Product to Popular Selection', bg: 'Добави Продукт към Популярните' },
  selectProductToAddPlaceholder: { en: 'Select a product to add...', bg: 'Изберете продукт за добавяне...' },
  noMoreProductsAvailable: { en: 'All available products already selected or no other products exist.', bg: 'Всички налични продукти са вече избрани или няма други продукти.' },
  maxPopularProductsReachedSelection: { en: 'Maximum {count} products selected.', bg: 'Избрани са максимален брой ({count}) продукти.'},
  add: { en: 'Add', bg: 'Добави' },
  moveUp: { en: 'Move Up', bg: 'Премести нагоре' },
  moveDown: { en: 'Move Down', bg: 'Премести надолу' },
  exactPopularProductsRequiredTitle: { en: 'Selection Required', bg: 'Изисква се Избор' },
  exactPopularProductsRequiredDesc: { en: 'You must select exactly {count} popular products.', bg: 'Трябва да изберете точно {count} популярни продукта.' },
  maxPopularProductsReachedTitle: { en: 'Limit Reached', bg: 'Достигнат Лимит' },
  maxPopularProductsReachedDesc: { en: 'You can only select {count} popular products.', bg: 'Можете да изберете само {count} популярни продукта.' },
  mustSelectAndOrderExactlyProductsToSave: { en: 'You must select and order exactly {count} products to save changes.', bg: 'Трябва да изберете и подредите точно {count} продукта, за да запазите промените.'},
  popularProductsUpdatedSuccessTitle: { en: 'Popular Products Updated', bg: 'Популярните Продукти са Актуализирани' },
  popularProductsUpdatedSuccessDesc: { en: 'The homepage will now reflect your new selection of popular products.', bg: 'Началната страница вече ще отразява новия ви избор на популярни продукти.' },
  popularProductsUpdatedErrorTitle: { en: 'Update Failed', bg: 'Актуализацията Неуспешна' },
  popularProductsUpdatedErrorDesc: { en: 'Could not save the popular products selection. Please try again.', bg: 'Неуспешно запазване на избора на популярни продукти. Моля, опитайте отново.' },
  errorFetchingPopularProductsConfig: { en: 'Error fetching products or popular products configuration.', bg: 'Грешка при извличане на продукти или конфигурацията на популярни продукти.' },
  noProductsAvailableToSelect: { en: 'No products available to select.', bg: 'Няма налични продукти за избор.' },
  noProductsInSystemTitlePPM: { en: "No Products in Catalog", bg: "Няма Продукти в Каталога"},
  noProductsInSystemDescPPM: { en: "There are currently no products in your catalog. To manage 'Most Popular' products for the homepage, please add some products first using the 'Product Management' tab.", bg: "В момента няма продукти във вашия каталог. За да управлявате 'Най-популярните' продукти за началната страница, моля, първо добавете продукти чрез таб 'Управление Продукти'."},
  sharedCartLoadedTitle: { en: 'Shared Cart Loaded', bg: 'Споделена количка заредена'},
  sharedCartLoadedDesc: { en: 'The items from the shared link have been added to your cart.', bg: 'Артикулите от споделения линк бяха добавени към вашата количка.'},
  // Account Profile Page
  accountProfileTitle: { en: 'Your Account Profile', bg: 'Вашият Профил' },
  accountProfileDesc: { en: 'View and manage your account details.', bg: 'Прегледайте и управлявайте детайлите на вашия профил.' },
  emailLabel: { en: 'Email', bg: 'Имейл' },
  uidLabel: { en: 'User ID', bg: 'Потребителски ID' },
  rolesLabel: { en: 'Your Roles', bg: 'Вашите Роли' },
  // PWA Install Prompt
  installAppPromptMessage: { en: 'Enhance your experience! Install AquaClean on your device.', bg: 'Подобрете изживяването си! Инсталирайте AquaClean на вашето устройство.' },
  installAppButton: { en: 'Install App', bg: 'Инсталирай Приложението' },
};

export const getTranslation = (key: string, lang: Language, options?: { count?: number } | number): string => {
  const translationSet = translations[key];
  if (!translationSet) {
    console.warn(`Translation key "${key}" not found.`);
    return key;
  }
  let translatedString = translationSet[lang] || translationSet['en'];

  let countValue: number | undefined = undefined;
  if (typeof options === 'object' && options !== null && options.count !== undefined) {
    countValue = options.count;
  } else if (typeof options === 'number') {
    countValue = options;
  }

  if (countValue !== undefined) {
    const regex = /{count}/g; 
    translatedString = translatedString.replace(regex, countValue.toString());
  }


  return translatedString;
};
