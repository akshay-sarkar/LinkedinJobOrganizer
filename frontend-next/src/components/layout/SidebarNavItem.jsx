'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const SidebarNavItem = ({ item }) => {
  const pathname = usePathname();
  const isActive = pathname === item.path;

  return (
    <li>
      <Link
        href={item.path}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
          isActive
            ? 'bg-linkedin-blue text-white'
            : 'text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700'
        }`}
      >
        <span className="text-xl">{item.icon}</span>
        <span className="font-medium">{item.label}</span>
      </Link>
    </li>
  );
};

export default SidebarNavItem;
