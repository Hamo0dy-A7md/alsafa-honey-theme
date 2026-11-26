import type { ReactNode } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

let mockLocale = 'ar';
vi.mock('@salla.sa/twilight-theme-engine/i18n', () => ({
  useTranslation: () => ({ locale: mockLocale, t: (_k: string, f?: string) => f ?? _k }),
}));
vi.mock('@salla.sa/twilight-theme-engine/hooks/useMoney', () => ({
  useMoney: () => ({ format: (n: number) => `${n} SAR` }),
}));
vi.mock('@salla.sa/twilight-theme-engine/common', () => ({
  Link: ({ to, children, ...rest }: { to: string; children: ReactNode }) => (
    <a href={to} {...rest}>{children}</a>
  ),
}));
const listQuery = vi.fn();
vi.mock('@salla.sa/twilight-theme-engine/api/product', () => ({
  product: {
    queries: {
      list: (args: unknown) => {
        listQuery(args);
        return {
          queryKey: ['products', args],
          queryFn: async () => ({
            items: [
              { id: 11, name: 'عسل السدر', url: '/sidr/p11', price: 59, starting_price: 59, promotion_title: 'الأكثر مبيعًا', image: { url: '/sidr.webp' } },
              { id: 12, name: 'التركيبة', url: '/formula/p12', price: 100, starting_price: 100, image: { url: '/formula.webp' } },
            ],
          }),
        };
      },
    },
  },
}));

import {
  AlSafaHero,
  AlSafaBenefits,
  AlSafaProducts,
  AlSafaPromise,
  AlSafaContact,
} from '../../../app/components/home/AlSafa';

function withQuery(ui: ReactNode) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{ui}</QueryClientProvider>;
}

describe('Al Safa home blocks', () => {
  it('shows the Arabic hero with three bees by default', () => {
    mockLocale = 'ar';
    const { container } = render(<AlSafaHero data={{}} />);
    expect(screen.getByText('عسل سدر أصيل')).toBeTruthy();
    expect(screen.getByText('زوروا محلنا')).toBeTruthy();
    expect(container.querySelectorAll('.as-bee')).toHaveLength(3);
  });

  it('uses the merchant text when it is filled in', () => {
    mockLocale = 'ar';
    render(<AlSafaHero data={{ title: 'عنوان التاجر', eyebrow: '   ' }} />);
    expect(screen.getByText('عنوان التاجر')).toBeTruthy();
    expect(screen.getByText('من الوادي إلى مائدتك')).toBeTruthy();
  });

  it('shows the English wording on the English store', () => {
    mockLocale = 'en';
    render(<AlSafaBenefits data={{}} />);
    expect(screen.getByText("Nature's Golden Treasure")).toBeTruthy();
    expect(screen.getAllByRole('listitem')).toHaveLength(6);
  });

  it('lists the chosen products with their prices and links', async () => {
    mockLocale = 'ar';
    render(withQuery(<AlSafaProducts data={{ products: [{ id: 11 }, { id: 12 }] }} />));
    await waitFor(() => expect(screen.getByText('التركيبة')).toBeTruthy());
    expect(listQuery).toHaveBeenCalledWith(expect.objectContaining({ source: 'selected', sourceValue: [11, 12] }));
    expect(screen.getByText('59 SAR')).toBeTruthy();
    expect(screen.getByText('الأكثر مبيعًا')).toBeTruthy();
    const orderLinks = screen.getAllByText('اختر الحجم واطلب');
    expect(orderLinks[0].closest('a')?.getAttribute('href')).toBe('/sidr/p11');
  });

  it('asks the merchant to pick products when none are chosen', () => {
    mockLocale = 'ar';
    render(withQuery(<AlSafaProducts data={{}} />));
    expect(screen.getByText(/اختر المنتجات التي تظهر هنا/)).toBeTruthy();
  });

  it('shows the guarantee card', () => {
    mockLocale = 'en';
    render(<AlSafaPromise data={{}} />);
    expect(screen.getByText('Your Satisfaction Is Our Promise')).toBeTruthy();
  });

  it('links WhatsApp, phone and the map to the shop', () => {
    mockLocale = 'ar';
    const { container } = render(<AlSafaContact data={{}} />);
    expect(container.querySelector('a[href="tel:0532401152"]')).toBeTruthy();
    expect(container.querySelectorAll('a[href="https://wa.me/966510017007"]')).toHaveLength(2);
    expect(container.querySelector('iframe')?.getAttribute('src')).toContain('21.4860138,39.1915354');
  });
});
