/**
 * Markaz Al Safa Honey — the five home blocks (hero, benefits, products, what we do, contact).
 * Declared in `twilight.json` as `home.alsafa-*` and registered in `app/router.tsx`.
 * Every text field is optional: an empty field falls back to the wording in `lib/alsafaText.ts`.
 */
import { useRef, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { Product } from '@salla.sa/twilight-theme-engine/types';
import { Link } from '@salla.sa/twilight-theme-engine/common';
import { useTranslation } from '@salla.sa/twilight-theme-engine/i18n';
import { useMoney } from '@salla.sa/twilight-theme-engine/hooks/useMoney';
import { product as productApi, type ProductsListSource } from '@salla.sa/twilight-theme-engine/api/product';
import { ALSAFA_DEFAULTS, ALSAFA_TEXT, type AlSafaLang } from '../../lib/alsafaText';
import { useBeeFlight, useOpenNow, useProductCardMotion, useReveal } from '../../hooks/useAlSafaMotion';
import honeyPour from '../../assets/alsafa/honey-pour.webp';
import sidrStillLife from '../../assets/alsafa/sidr-still-life.webp';
import mountainHoney from '../../assets/alsafa/mountain-honey.webp';
import serviceBadge from '../../assets/alsafa/service-badge.webp';

type BlockData = Record<string, unknown>;

/** Current language and its default wording. */
function useAlSafaText() {
  const { locale } = useTranslation();
  const lang: AlSafaLang = String(locale ?? 'ar').startsWith('en') ? 'en' : 'ar';
  return { lang, text: ALSAFA_TEXT[lang] };
}

/** A merchant text field, or the fallback when it is empty. */
function str(data: BlockData, key: string, fallback: string): string {
  const v = data[key];
  return typeof v === 'string' && v.trim() ? v : fallback;
}

function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="as-eyebrow">{children}</p>;
}

/* ---------- Bee drawing (shared by the flying bees) ---------- */
function Bee({ className }: { className: string }) {
  return (
    <svg className={`as-bee ${className}`} aria-hidden="true" viewBox="0 0 64 48">
      <g className="as-bee-wing">
        <ellipse cx="22" cy="12" rx="11" ry="7" fill="rgba(255,240,200,.55)" stroke="#F5B82E" strokeWidth="1.2" transform="rotate(-25 22 12)" />
      </g>
      <g className="as-bee-wing as-bee-wing-2">
        <ellipse cx="36" cy="10" rx="11" ry="7" fill="rgba(255,240,200,.45)" stroke="#F5B82E" strokeWidth="1.2" transform="rotate(20 36 10)" />
      </g>
      <ellipse cx="31" cy="28" rx="17" ry="11" fill="#F5B82E" />
      <path d="M24 18.5c-2 6-2 13 0 19M31 17c-2 7-2 15 0 22M38 18.5c-2 6-2 13 0 19" stroke="#140F08" strokeWidth="3.2" fill="none" />
      <circle cx="48" cy="26" r="6" fill="#140F08" />
      <path d="M51 21c3-4 6-5 8-5M50 21c1-5 3-7 5-8" stroke="#140F08" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <path d="M14 28l-6 1" stroke="#140F08" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/* ---------- 1) Hero ---------- */
export function AlSafaHero({ data }: { data: BlockData }) {
  const { text } = useAlSafaText();
  const ref = useRef<HTMLDivElement>(null);
  useBeeFlight(ref);
  const imageStart = str(data, 'image_start', honeyPour);
  const imageEnd = str(data, 'image_end', sidrStillLife);

  return (
    <div className="as as-hero" ref={ref}>
      <div className="as-honeycomb" aria-hidden="true" />
      <Bee className="as-bee-1" />
      <Bee className="as-bee-2" />
      <Bee className="as-bee-3" />
      <div className="as-container as-hero-grid">
        <figure className="as-hero-media">
          <div className="as-hex-frame">
            <img src={imageStart} alt="" width={844} height={503} />
          </div>
        </figure>
        <div className="as-hero-copy">
          <Eyebrow>{str(data, 'eyebrow', text.heroEyebrow)}</Eyebrow>
          <h1 className="as-hero-title">
            {str(data, 'title', text.heroTitle)}
            <br />
            <span className="as-text-gold">{str(data, 'title_gold', text.heroTitleGold)}</span>
          </h1>
          <p className="as-lead">{str(data, 'lead', text.heroLead)}</p>
          <div className="as-ctas">
            <a className="as-btn as-btn-gold" href="#as-shop">{str(data, 'cta_text', text.heroCta)}</a>
            <a className="as-btn as-btn-ghost" href="#as-contact">{str(data, 'cta2_text', text.heroCta2)}</a>
          </div>
        </div>
        <figure className="as-hero-media">
          <div className="as-arch-frame">
            <img src={imageEnd} alt="" width={1600} height={900} />
          </div>
        </figure>
      </div>
    </div>
  );
}

/* ---------- 2) Benefits ---------- */
const BENEFIT_ICONS: ReactNode[] = [
  <path key="a" d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />,
  <><path d="M12 3 4 6v6c0 5 3.4 8.4 8 9 4.6-.6 8-4 8-9V6l-8-3Z" /><path d="m9 12 2 2 4-4" /></>,
  <path key="c" d="M12 22c4 0 7-3 7-7 0-5-7-13-7-13S5 10 5 15c0 4 3 7 7 7Z" />,
  <><path d="M4 12a8 8 0 0 1 16 0" /><path d="M12 12v9" /><path d="M8 21h8" /><path d="M7 7l1.5 1.5M17 7l-1.5 1.5M12 4v2" /></>,
  <path key="e" d="M12 21s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.6-7 10-7 10Z" />,
  <><path d="M12 3c-1 4-6 5-6 10a6 6 0 0 0 12 0c0-5-5-6-6-10Z" /><path d="M9.5 14.5a2.5 2.5 0 0 0 2.5 2.5" /></>,
];

export function AlSafaBenefits({ data }: { data: BlockData }) {
  const { text } = useAlSafaText();
  const ref = useRef<HTMLDivElement>(null);
  useReveal(ref);
  return (
    <div className="as as-section as-benefits" id="as-benefits" ref={ref}>
      <div className="as-container as-benefits-grid">
        <figure className="as-benefits-media as-reveal">
          <img src={str(data, 'image', mountainHoney)} alt="" loading="lazy" width={1600} height={900} />
          <figcaption className="as-stat-badge">
            <strong>100%</strong>
            <span>{text.benefitsBadge}</span>
          </figcaption>
        </figure>
        <div className="as-benefits-copy">
          <Eyebrow>{text.benefitsEyebrow}</Eyebrow>
          <h2 className="as-h2">{str(data, 'title', text.benefitsTitle)}</h2>
          <p className="as-section-lead">{str(data, 'lead', text.benefitsLead)}</p>
          <ul className="as-benefit-list">
            {text.benefits.map(([title, desc], i) => (
              <li key={title} className="as-reveal">
                <span className="as-b-icon">
                  <svg aria-hidden="true" viewBox="0 0 24 24">{BENEFIT_ICONS[i]}</svg>
                </span>
                <div>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="as-disclaimer">{str(data, 'note', text.benefitsNote)}</p>
        </div>
      </div>
    </div>
  );
}

/* ---------- 3) Products ---------- */
type ProductsField = Product[] | { source?: string; source_value?: number | number[] | null } | undefined;

/** The block's product picker arrives either as products or as a list source; normalise to a query. */
function productsQuery(field: ProductsField): { source: ProductsListSource; sourceValue?: number | number[] } | null {
  if (Array.isArray(field)) {
    const ids = field.map((p) => p.id).filter((id): id is number => typeof id === 'number');
    return ids.length ? { source: 'selected' as ProductsListSource, sourceValue: ids } : null;
  }
  if (field && typeof field === 'object' && field.source) {
    return { source: field.source as ProductsListSource, sourceValue: field.source_value ?? undefined };
  }
  return null;
}

function AlSafaProductCard({ product }: { product: Product }) {
  const { text } = useAlSafaText();
  const { format } = useMoney();
  const p = product as Product & {
    starting_price?: number | null;
    subtitle?: string | null;
    promotion_title?: string | null;
    is_on_sale?: boolean;
    is_out_of_stock?: boolean;
    sale_price?: number;
    regular_price?: number;
    price?: number;
    image?: { url?: string; alt?: string | null };
  };
  const startingPrice = p.starting_price ?? null;
  const onSale = Boolean(p.is_on_sale) && !startingPrice;

  return (
    <li className="as-product">
      <Link to={p.url} className="as-p-media" aria-label={p.name}>
        {p.promotion_title ? <span className="as-p-badge">{p.promotion_title}</span> : null}
        <span className="as-p-jar">
          {p.image?.url ? <img src={p.image.url} alt={p.image.alt || p.name} loading="lazy" /> : null}
        </span>
        <span className="as-p-sparks" aria-hidden="true">
          {Array.from({ length: 10 }, (_, i) => <i key={i} />)}
        </span>
      </Link>
      <div className="as-p-body">
        <h3 className="as-p-name"><Link to={p.url}>{p.name}</Link></h3>
        {p.subtitle ? <p className="as-p-desc">{p.subtitle}</p> : null}
        <div className="as-p-foot">
          <span className="as-p-price">
            {startingPrice ? <small className="as-p-from">{text.shopFrom}</small> : null}
            {onSale ? <span className="as-p-old">{format(p.regular_price ?? 0)}</span> : null}
            <span>{format(startingPrice ?? (onSale ? p.sale_price : p.price) ?? 0)}</span>
          </span>
          <Link to={p.url} className="as-btn as-btn-gold as-btn-sm">
            {p.is_out_of_stock ? text.shopSoldOut : text.shopOrder}
          </Link>
        </div>
      </div>
    </li>
  );
}

export function AlSafaProducts({ data }: { data: BlockData }) {
  const { text } = useAlSafaText();
  const ref = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLUListElement>(null);
  const query = productsQuery(data.products as ProductsField);
  const { data: result } = useQuery({
    ...productApi.queries.list({ source: query?.source ?? ('latest' as ProductsListSource), sourceValue: query?.sourceValue, perPage: 8 }),
    enabled: Boolean(query),
  });
  const products: Product[] = (result?.items as Product[] | undefined) ?? [];
  useReveal(ref);
  useProductCardMotion(gridRef, products.length);

  return (
    <div className="as as-section as-shop" id="as-shop" ref={ref}>
      <div className="as-container">
        <header className="as-section-head as-reveal">
          <Eyebrow>{text.shopEyebrow}</Eyebrow>
          <h2 className="as-h2">{str(data, 'title', text.shopTitle)}</h2>
          <p className="as-section-lead">{str(data, 'lead', text.shopLead)}</p>
        </header>
        <ul className="as-product-grid" ref={gridRef}>
          {products.map((p) => <AlSafaProductCard key={p.id} product={p} />)}
          {!query ? <li className="as-empty">{text.shopEmpty}</li> : null}
        </ul>
      </div>
    </div>
  );
}

/* ---------- 4) What we do ---------- */
export function AlSafaPromise({ data }: { data: BlockData }) {
  const { text } = useAlSafaText();
  const ref = useRef<HTMLDivElement>(null);
  useReveal(ref);
  return (
    <div className="as as-section as-promise" ref={ref}>
      <div className="as-container">
        <header className="as-section-head as-reveal">
          <Eyebrow>{text.promiseEyebrow}</Eyebrow>
          <h2 className="as-h2">{str(data, 'title', text.promiseTitle)}</h2>
          <p className="as-section-lead">{str(data, 'lead', text.promiseLead)}</p>
        </header>
        <ul className="as-promise-grid">
          <li className="as-promise-card as-reveal">
            <div className="as-hex-photo"><img src={mountainHoney} alt="" loading="lazy" width={1600} height={900} /></div>
            <h3>{text.promiseRawTitle}</h3>
            <p>{text.promiseRawText}</p>
          </li>
          <li className="as-promise-card as-reveal">
            <div className="as-hex-photo is-badge"><img src={serviceBadge} alt="" loading="lazy" width={480} height={554} /></div>
            <h3>{text.promiseGuaranteeTitle}</h3>
            <p>{text.promiseGuaranteeText}</p>
          </li>
        </ul>
      </div>
    </div>
  );
}

/* ---------- 5) Contact & location ---------- */
const ICON = {
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />,
  whatsapp: <><path d="M3.5 20.5 5 16a8.5 8.5 0 1 1 3.2 3.1l-4.7 1.4Z" /><path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.6-2-1-1 .9a5 5 0 0 1-2.8-2.8l.9-1-1-2L9 8.5Z" /></>,
  pin: <><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.5" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
};

function CIcon({ children }: { children: ReactNode }) {
  return <span className="as-c-icon"><svg aria-hidden="true" viewBox="0 0 24 24">{children}</svg></span>;
}

export function AlSafaContact({ data }: { data: BlockData }) {
  const { lang, text } = useAlSafaText();
  const ref = useRef<HTMLDivElement>(null);
  useReveal(ref);
  const open = useOpenNow();
  const phone = str(data, 'phone', ALSAFA_DEFAULTS.phone);
  const wa = str(data, 'whatsapp', ALSAFA_DEFAULTS.whatsapp).replace(/[^\d]/g, '');
  const maps = str(data, 'maps_url', ALSAFA_DEFAULTS.mapsUrl);
  const mapSrc = `https://maps.google.com/maps?q=${ALSAFA_DEFAULTS.mapLat},${ALSAFA_DEFAULTS.mapLng}&z=17&hl=${lang}&output=embed`;

  return (
    <div className="as as-section as-contact" id="as-contact" ref={ref}>
      <div className="as-container">
        <header className="as-section-head as-reveal">
          <Eyebrow>{text.contactEyebrow}</Eyebrow>
          <h2 className="as-h2">{text.contactTitle}</h2>
          <p className="as-section-lead">{text.contactLead}</p>
        </header>
        <div className="as-contact-grid">
          <div className="as-contact-cards">
            <a className="as-c-card" href={`tel:${phone}`}>
              <CIcon>{ICON.phone}</CIcon>
              <span><span className="as-c-label">{text.contactCall}</span><strong dir="ltr">{phone}</strong></span>
            </a>
            <a className="as-c-card" href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer">
              <CIcon>{ICON.whatsapp}</CIcon>
              <span><span className="as-c-label">{text.contactWhatsapp}</span><strong dir="ltr">+{wa}</strong></span>
            </a>
            <a className="as-c-card" href={maps} target="_blank" rel="noopener noreferrer">
              <CIcon>{ICON.pin}</CIcon>
              <span><span className="as-c-label">{text.contactAddress}</span><strong>{str(data, 'address', text.contactAddressValue)}</strong></span>
            </a>
            <div className="as-c-card as-hours">
              <CIcon>{ICON.clock}</CIcon>
              <span className="as-hours-body">
                <span className="as-c-label">{text.contactHours}</span>
                <span className="as-hours-rows">
                  <span><span>{text.contactMorning}</span> <strong dir="ltr">{text.contactMorningValue}</strong></span>
                  <span><span>{text.contactEvening}</span> <strong dir="ltr">{text.contactEveningValue}</strong></span>
                </span>
                {open === null ? null : (
                  <span className={`as-open-status ${open ? 'is-open' : 'is-closed'}`} role="status">
                    {open ? text.contactOpen : text.contactClosed}
                  </span>
                )}
              </span>
            </div>
            <a className="as-btn as-btn-gold as-btn-block" href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer">
              {text.contactCta}
            </a>
          </div>
          <div className="as-map-wrap">
            <iframe title={text.contactMapTitle} src={mapSrc} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Floating WhatsApp button (every page) ---------- */
export function AlSafaWhatsAppFloat({ number = ALSAFA_DEFAULTS.whatsapp }: { number?: string }) {
  return (
    <a className="as-wa-float" href={`https://wa.me/${number.replace(/[^\d]/g, '')}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
      <svg aria-hidden="true" viewBox="0 0 32 32">
        <path fill="currentColor" d="M16 3a13 13 0 0 0-11.2 19.6L3 29l6.6-1.7A13 13 0 1 0 16 3Zm0 23.7a10.7 10.7 0 0 1-5.5-1.5l-.4-.2-3.9 1 1-3.8-.2-.4A10.7 10.7 0 1 1 16 26.7Zm5.9-8c-.3-.2-1.9-1-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7 0a8.8 8.8 0 0 1-4.4-3.8c-.3-.6.3-.5 1-1.8.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6a1.2 1.2 0 0 0-.9.4 3.6 3.6 0 0 0-1.1 2.7 6.3 6.3 0 0 0 1.3 3.3 14.4 14.4 0 0 0 5.5 4.9c2 .9 2.8 1 3.9.8a3.3 3.3 0 0 0 2.1-1.5 2.7 2.7 0 0 0 .2-1.5c-.1-.2-.3-.3-.7-.4Z" />
      </svg>
    </a>
  );
}
