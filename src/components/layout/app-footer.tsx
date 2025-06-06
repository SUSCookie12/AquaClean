import { SITE_NAME } from '@/constants';

const AppFooter = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t">
      <div className="container py-6 text-center text-sm text-muted-foreground">
        <p>
          &copy; {currentYear} {SITE_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default AppFooter;
