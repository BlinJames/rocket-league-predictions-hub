import { Home, Flame, Trophy, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { icon: Home, path: '/', label: 'Accueil' },
    { icon: Flame, path: '/matches', label: 'Matches' },
    { icon: Trophy, path: '/classement', label: 'Classement' },
    { icon: User, path: '/profil', label: 'Profil' },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-card border-t border-border">
      <div className="flex justify-around py-2">
        {navItems.map(({ icon: Icon, path, label }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`nav-item ${location.pathname === path ? 'active' : ''}`}
          >
            <Icon size={20} />
            <span className="text-xs">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};