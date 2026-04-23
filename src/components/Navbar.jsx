import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navLinks = [
    { path: '/', label: 'Songs', icon: '🎵' },
    { path: '/favorites', label: 'Favorites', icon: '♥' },
    { path: '/playlists', label: 'Playlists', icon: '◎' },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden md:fixed md:left-0 md:top-0 md:flex md:h-screen md:w-64 md:flex-col md:bg-gray-900 md:border-r md:border-gray-700 md:z-40">
        {/* Logo */}
        <div className="p-6 border-b border-gray-700">
          <Link to="/" className="text-green-500 font-bold text-2xl hover:text-green-400 transition flex items-center gap-2">
            🎵
            <span>Layug Songs</span>
          </Link>
        </div>

        {/* Nav Links */}
        <div className="flex-1 p-6 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`block px-4 py-3 rounded-lg transition ${
                isActive(link.path)
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold shadow-lg'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <span className="mr-2">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700">
          <p className="text-gray-500 text-sm text-center">© 2026 Layug</p>
        </div>
      </nav>

      {/* Mobile Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 z-40">
        <div className="flex justify-around">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex-1 py-3 text-center transition ${
                isActive(link.path)
                  ? 'text-purple-400 shadow-lg shadow-purple-500/50'
                  : 'text-gray-400 hover:text-white'
              }`}
              title={link.label}
            >
              <span className="text-2xl">{link.icon}</span>
              <p className="text-xs mt-1">{link.label}</p>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}