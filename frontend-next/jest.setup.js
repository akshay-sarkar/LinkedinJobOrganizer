import '@testing-library/jest-dom';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => '/',
}));

// Mock react-virtuoso - use React properly
jest.mock('react-virtuoso', () => {
  const React = require('react');
  return {
    Virtuoso: function MockVirtuoso({ totalCount, itemContent, endReached, context, components }) {
      const items = React.useMemo(() => {
        const result = [];
        for (let i = 0; i < Math.min(totalCount, 20); i++) {
          result.push(
            React.createElement('div', { key: i, 'data-testid': `virtuoso-item-${i}` },
              itemContent(i)
            )
          );
        }
        return result;
      }, [totalCount, itemContent]);

      return React.createElement('div', { 'data-testid': 'virtuoso-grid' },
        items,
        totalCount > 20 && React.createElement('button', {
          'data-testid': 'load-more-trigger',
          onClick: () => endReached && endReached()
        }, 'Load More'),
        components?.Footer && React.createElement(components.Footer, { context })
      );
    },
    VirtuosoGrid: function MockVirtuosoGrid({ totalCount, itemContent, endReached, context }) {
      const items = React.useMemo(() => {
        const result = [];
        for (let i = 0; i < Math.min(totalCount, 20); i++) {
          result.push(
            React.createElement('div', { key: i, 'data-testid': `virtuoso-item-${i}` },
              itemContent(i)
            )
          );
        }
        return result;
      }, [totalCount, itemContent]);

      return React.createElement('div', { 'data-testid': 'virtuoso-grid' },
        items,
        totalCount > 20 && React.createElement('button', {
          'data-testid': 'load-more-trigger',
          onClick: () => endReached && endReached()
        }, 'Load More')
      );
    },
  };
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock IntersectionObserver (used by Virtuoso)
class IntersectionObserverMock {
  constructor(callback) {
    this.callback = callback;
  }
  observe() { return null; }
  unobserve() { return null; }
  disconnect() { return null; }
}
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: IntersectionObserverMock,
});

// Mock ResizeObserver (used by Virtuoso)
class ResizeObserverMock {
  observe() { return null; }
  unobserve() { return null; }
  disconnect() { return null; }
}
Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  value: ResizeObserverMock,
});
