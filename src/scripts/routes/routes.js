import HomePage from '../pages/home/home-page';
import AboutPage from '../pages/about/about-page';
import MapPage from '../pages/map/map-page';
import AddPage from '../pages/add/add-page';
import LoginPage from '../pages/auth/login-page';
import RegisterPage from '../pages/auth/register-page';
import FavoritesPage from '../pages/favorites-page';

// daftar semua halaman yang ada
const routes = {
  '/': new HomePage(),
  '/map': new MapPage(),
  '/add': new AddPage(),
  '/about': new AboutPage(),
  '/login': new LoginPage(),
  '/register': new RegisterPage(),
  '/favorites': new FavoritesPage(),
};

export default routes;
