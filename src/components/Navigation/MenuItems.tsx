import { MenuItem, menuItems } from '../../config/menuItems';
import type { Page } from '../../types';
import type { GameState } from '../../types';

interface MenuItemsProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
  onClose: () => void;
  onFullscreen: () => void;
  onHorizontal: () => void;
  onShare: () => void;
  gameState: GameState;
}

export function MenuItems({ 
  currentPage, 
  onPageChange, 
  onClose, 
  onFullscreen,
  onHorizontal,
  onShare 
}: MenuItemsProps) {
  const handleItemClick = (item: MenuItem) => {
    if (item.page) {
      onPageChange(item.page);
      onClose();
    } else if (item.action) {
      switch (item.action) {
        case 'share':
          onShare();
          break;
        case 'fullscreen':
          onFullscreen();
          break;
        case 'horizontal':
          onHorizontal();
          break;
      }
      onClose();
    }
  };

  return (
    <nav className="py-1 relative z-[100]">
      {menuItems.map((item, index) => (
        <button
          key={index}
          onClick={() => handleItemClick(item)}
          className={`w-full px-4 py-2 text-left flex items-center gap-3 ${
            item.page === currentPage
              ? 'bg-emerald-100 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100'
              : 'text-emerald-800 dark:text-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-800/50'
          }`}
        >
          <item.icon className="w-4 h-4" />
          {item.label}
        </button>
      ))}
    </nav>
  );
}