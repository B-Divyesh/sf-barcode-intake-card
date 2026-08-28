import './style.css';
import { clearItems, getItem, getItems, removeItem, saveItem, saveItemsAtomic, seedDemo } from './db';
import { itemsToCsv, parseCsv } from './csv';
import type { CsvMatch, IntakeItem } from './types';

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('The app root is missing.');

const BUILD = 'v1.0.4';
const PRINTABLE_CODE = /^[\x20-\x7e]+$/;
let csvMatches: CsvMatch[] = [];
let lastFocus: HTMLElement | null = null;
let scannerStop: (() => void) | undefined;
let scannerSession = 0;

const escapeHtml = (value: unknown): string => String(value ?? '').replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char] ?? char);
const routeUrl = (): URL => new URL(location.href);
const isDemo = (): boolean => routeUrl().pathname === '/demo' || routeUrl().searchParams.get('demo') === '1';
const demoSuffix = (): string => isDemo() ? '?demo=1' : '';
const uid = (): string => crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;

function setMeta(title: string, description: string, canonicalPath: string): void {
  document.title = title;
  document.querySelector<HTMLMetaElement>('meta[name="description"]')?.setAttribute('content', description);
  document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute('href', `https://barcode-intake-card.sociobot.in${canonicalPath}`);
}

function navigate(path: string, replace = false): void {
  if (replace) history.replaceState({}, '', path);
  else history.pushState({}, '', path);
  void render(true);
}

function shell(content: string, active = ''): string {
  const demo = isDemo();
  return `<div class="shell">
    <header class="site-header">
      <div class="masthead">
        <a class="wordmark" href="/" data-link>Barcode Intake Card<small>Private receiving desk</small></a>
        <nav class="site-nav" aria-label="Primary">
          <a href="/intake${demoSuffix()}" data-link ${active === 'intake' ? 'aria-current="page"' : ''}>Intake</a>
          <a href="/records${demoSuffix()}" data-link ${active === 'records' ? 'aria-current="page"' : ''}>Cards</a>
          <a class="optional" href="/demo" data-link ${demo ? 'aria-current="page"' : ''}>Demo</a>
          <a class="optional" href="/privacy" data-link ${active === 'privacy' ? 'aria-current="page"' : ''}>Privacy</a>
        </nav>
      </div>
    </header>
    ${demo ? `<aside class="demo-banner" aria-label="Demo status"><div class="demo-banner-inner"><strong>Demo — sample data, nothing is saved to your real cards.</strong><button class="link-button" data-action="reset-demo">Reset demo</button><a href="/intake" data-action="start-real">Start for real</a></div></aside>` : '<div></div>'}
    ${content}
    <footer class="site-footer"><div class="footer-inner"><span>Turn a barcode into a private, printable item card.</span><div class="footer-links"><a href="/privacy" data-link>Privacy</a><a href="/terms" data-link>Terms</a><a href="https://sociobot.in" rel="external">Built by Param Factory</a><span>${BUILD}</span><span>Hero art generated for this product.</span></div></div></footer>
    <div class="visually-hidden" aria-live="polite" id="route-announcer"></div>
  </div>`;
}

function landing(): string {
  setMeta('Barcode Intake Card — Make private stock cards', 'Scan or enter a barcode, add item details, and print a private intake card.', '/');
  return shell(`<main id="main">
    <article class="page hero">
      <div class="folio"><span>Workshop utility no. 01</span><span>Local edition · 2026</span></div>
      <div class="hero-grid">
        <div>
          <p class="eyebrow">From parcel to shelf</p>
          <h1 tabindex="-1">Turn scans into item cards</h1>
          <p class="lede">For small sellers and workshops receiving mixed stock without a full inventory system.</p>
          <div class="hero-actions"><a class="button" href="/demo" data-link>Try it with sample data <span aria-hidden="true">→</span></a><p class="action-note">It opens three ready-made cards you can search, edit, and print.</p></div>
          <ul class="facts"><li>Cards stay in this browser</li><li>Works offline after the first visit</li><li>Camera scanning is included</li></ul>
        </div>
        <figure class="hero-figure">
          <picture><source media="(max-width: 760px)" srcset="/assets/receiving-desk-600.webp" type="image/webp"><source srcset="/assets/receiving-desk.webp" type="image/webp"><img src="/assets/receiving-desk.webp" width="900" height="600" alt="An engraved workshop desk with parts, a parcel, a scanner, and a blank intake card." fetchpriority="high" decoding="async"></picture>
          <figcaption>Fig. 01 — Receive the odd parts first. Choose a stock system later.</figcaption>
        </figure>
      </div>
      <section class="section" aria-labelledby="preview-title">
        <div class="section-heading"><h2 id="preview-title">A card before a catalogue</h2><p>Record the facts you know now. Keep uncertainty visible until you review the item.</p></div>
        <div class="preview-sheet" aria-label="Sample intake card preview">
          <div><p class="eyebrow">Intake 0142</p><h3>608ZZ shielded bearing</h3><p>North Street Components</p><div class="barcode-display" aria-hidden="true"></div><p class="record-code">5901234123457</p></div>
          <div class="preview-meta"><div><small>Location</small><strong>Bin A-14</strong></div><div><small>Quantity</small><strong>12</strong></div><div><small>Status</small><strong>Ready to review</strong></div><div><small>Privacy</small><strong>Stored locally</strong></div></div>
        </div>
      </section>
      <section class="section" aria-labelledby="how-title"><div class="section-heading"><h2 id="how-title">How it works</h2><p>Use a scanner, type the code, or match a supplier CSV.</p></div><div class="steps"><div class="step"><h3>Capture the code</h3><p>Scan with your camera or enter any printed code.</p></div><div class="step"><h3>Review the item</h3><p>Add its name, supplier, photo, quantity, and shelf location.</p></div><div class="step"><h3>Print or move on</h3><p>Print one card or export every record as CSV or JSON.</p></div></div></section>
      <section class="section" aria-labelledby="bounds-title"><div class="section-heading"><h2 id="bounds-title">Your intake desk, not an ERP</h2><p>The tool stays small on purpose.</p></div><div class="limits"><p><strong>No automatic web lookup.</strong><br>Supplier and stock details do not leave your device.</p><p><strong>No purchase orders.</strong><br>This records arrivals. It does not run procurement.</p><p><strong>No account or sync.</strong><br>Export a file when you need a backup or another system.</p><p><strong>CSV lookups are explicit.</strong><br>You choose the supplier file. It is read in this browser.</p></div></section>
      <section class="section" aria-labelledby="camera-title"><div class="price-strip"><div><p class="eyebrow">Camera reader</p><h2 id="camera-title">Scan without a checkout</h2><p>Camera scanning, manual intake, and exports are included on this device.</p></div><div><a class="button" href="/intake" data-link>Open the intake desk</a></div></div><p>The camera starts only after you choose <strong>Scan with camera</strong>.</p></section>
    </article>
  </main>`);
}

async function demoPage(): Promise<string> {
  await seedDemo();
  setMeta('Demo — Barcode Intake Card', 'Try Barcode Intake Card with three sample workshop items.', '/demo');
  return recordsPage(true, true);
}

async function intakePage(): Promise<string> {
  const demo = isDemo();
  const editId = routeUrl().searchParams.get('edit');
  const existing = editId ? await getItem(demo, editId) : undefined;
  setMeta(`${existing ? 'Edit card' : 'New intake'} — Barcode Intake Card`, 'Enter a barcode and record an item in this browser.', '/intake');
  return shell(`<main id="main"><div class="page">
    <div class="app-header"><div><p class="eyebrow">Receiving desk</p><h1 tabindex="-1">${existing ? 'Review this item card' : 'Record a new item'}</h1></div><a class="button button-secondary" href="/records${demoSuffix()}" data-link>View saved cards</a></div>
    <p class="status-line" id="form-status" role="status"></p>
    <div class="intake-layout">
      <form id="intake-form" novalidate>
        <input type="hidden" name="id" value="${escapeHtml(existing?.id ?? '')}">
        <div class="field-grid">
          <div class="field full"><label for="barcode">Barcode or SKU <span aria-hidden="true">*</span></label><div class="barcode-entry"><input id="barcode" name="barcode" autocomplete="off" required value="${escapeHtml(existing?.barcode ?? '')}" aria-describedby="barcode-help"><button class="button button-secondary" type="button" data-action="scan">Scan with camera</button></div><small id="barcode-help">Use English letters, numbers, spaces, or standard punctuation. This barcode format cannot print other scripts.</small></div>
          <div class="field full" id="duplicates" aria-live="polite"></div>
          <div class="field"><label for="name">Item name <span aria-hidden="true">*</span></label><input id="name" name="name" required value="${escapeHtml(existing?.name ?? '')}"></div>
          <div class="field"><label for="supplier">Supplier</label><input id="supplier" name="supplier" value="${escapeHtml(existing?.supplier ?? '')}"></div>
          <div class="field"><label for="location">Location note <span aria-hidden="true">*</span></label><input id="location" name="location" required value="${escapeHtml(existing?.location ?? '')}" placeholder="Bin A-14"></div>
          <div class="field"><label for="quantity">Quantity</label><input id="quantity" name="quantity" type="number" min="0" step="1" value="${escapeHtml(existing?.quantity ?? 1)}"></div>
          <div class="field full"><label for="notes">Review notes</label><textarea id="notes" name="notes">${escapeHtml(existing?.notes ?? '')}</textarea></div>
          <div class="field full"><label for="photo">Item photo</label><input id="photo" name="photo" type="file" accept="image/*" capture="environment"><small>Photos stay inside this browser. Images are reduced before storage.</small>${existing?.photo ? `<img class="photo-preview" id="photo-preview" src="${escapeHtml(existing.photo)}" alt="Photo saved with this item.">` : '<img class="photo-preview" id="photo-preview" alt="Selected item photo preview" hidden>'}<input type="hidden" id="photo-data" name="photoData" value="${escapeHtml(existing?.photo ?? '')}"></div>
        </div>
        <div class="form-actions"><button class="button" type="submit">${existing ? 'Save card changes' : 'Save item card'}</button>${existing ? `<a class="button button-secondary" href="/records${demoSuffix()}" data-link>Cancel editing</a>` : '<button class="button button-secondary" type="reset">Clear fields</button>'}</div>
      </form>
      <aside>
        <section class="side-note"><h2>Match a supplier CSV</h2><p>Choose a file with a barcode, code, SKU, EAN, or UPC column. A matching row fills blank fields.</p><label class="button button-secondary" for="csv-file">Choose CSV</label><input id="csv-file" type="file" accept=".csv,text/csv" hidden><p id="csv-status" role="status"></p></section>
        <section class="side-note"><h2>What gets saved</h2><ul><li>The code and item details</li><li>Your reduced item photo</li><li>Created and changed dates</li></ul><p>No supplier request runs in the background.</p></section>
      </aside>
    </div>
    <dialog class="scanner-dialog" id="scanner-dialog" aria-labelledby="scanner-title"><div class="dialog-inner"><div class="dialog-head"><div><p class="eyebrow">Camera reader</p><h2 id="scanner-title">Hold the code in frame</h2></div><button class="icon-button" type="button" data-action="close-scanner" aria-label="Close camera">×</button></div><div class="scan-frame"><video id="scanner-video" muted playsinline aria-label="Live camera preview"></video><span class="scan-line" aria-hidden="true"></span></div><p id="scanner-status" role="status">Starting the camera…</p></div></dialog>
  </div></main>`, 'intake');
}

async function recordsPage(fromDemoRoute = false, nested = false): Promise<string> {
  const demo = fromDemoRoute || isDemo();
  const items = await getItems(demo);
  setMeta(`${demo ? 'Demo' : 'Saved cards'} — Barcode Intake Card`, 'Search, print, and export item cards stored in this browser.', demo ? '/demo' : '/records');
  const list = items.length ? `<div class="record-list">${items.map((item) => `<article class="record"><div class="record-code">${escapeHtml(item.barcode)}</div><div><h2>${escapeHtml(item.name)}</h2><p>${escapeHtml(item.location)} · Qty ${item.quantity}${item.supplier ? ` · ${escapeHtml(item.supplier)}` : ''}</p></div><div class="record-actions"><a class="button button-secondary" href="/intake?edit=${encodeURIComponent(item.id)}${demo ? '&demo=1' : ''}" data-link>Edit card</a><a class="button button-secondary" href="/print/${encodeURIComponent(item.id)}${demo ? '?demo=1' : ''}" data-link>Print card</a><button class="button button-danger" data-action="delete-item" data-id="${escapeHtml(item.id)}" data-name="${escapeHtml(item.name)}">Delete</button></div></article>`).join('')}</div>` : `<div class="empty"><h2>No item cards yet</h2><p>Saved items will appear here. Record a barcode and location to make the first card.</p><a class="button" href="/intake${demo ? '?demo=1' : ''}" data-link>Record an item</a></div>`;
  const content = `<main id="main"><div class="page"><div class="app-header"><div><p class="eyebrow">${demo ? 'Sample ledger' : 'Local ledger'}</p><h1 tabindex="-1">${demo ? 'Review sample intake cards' : 'Find your saved cards'}</h1></div><a class="button" href="/intake${demo ? '?demo=1' : ''}" data-link>Record an item</a></div><div class="toolbar"><label class="field"><span>Search cards</span><input id="record-search" type="search" placeholder="Barcode, item, or location"></label><button class="button button-secondary" data-action="export-csv" ${items.length ? '' : 'disabled'}>Export CSV</button><button class="button button-secondary" data-action="export-json" ${items.length ? '' : 'disabled'}>Export backup</button><label class="button button-secondary" for="json-import">Import backup</label><input id="json-import" type="file" accept="application/json" hidden></div><p class="status-line" id="records-status" role="status">${items.length} ${items.length === 1 ? 'card' : 'cards'} stored ${demo ? 'in the demo' : 'in this browser'}.</p>${list}</div></main>`;
  return nested ? shell(content, 'records') : shell(content, 'records');
}

async function printPage(id: string): Promise<string> {
  const item = await getItem(isDemo(), id);
  if (!item) return notFound();
  setMeta(`Print ${item.name} — Barcode Intake Card`, 'Print one item card with its barcode and location.', `/print/${id}`);
  return shell(`<main id="main"><div class="page"><div class="print-controls app-header"><div><p class="eyebrow">Print proof</p><h1 tabindex="-1">Print one item card</h1></div><div class="toolbar"><button class="button" data-action="print">Print card</button><a class="button button-secondary" href="/records${demoSuffix()}" data-link>Back to cards</a></div></div><div class="notice barcode-error" id="barcode-render-status" role="alert" hidden><p>This code cannot be printed as a Code 128 barcode. Use English letters, numbers, spaces, or standard punctuation.</p> <a class="button button-secondary" href="/intake?edit=${encodeURIComponent(item.id)}${isDemo() ? '&demo=1' : ''}" data-link>Edit this card</a></div><article class="print-card"><p class="eyebrow">Intake card</p><h2>${escapeHtml(item.name)}</h2><div class="barcode-svg"><canvas id="print-barcode" role="img" aria-label="Barcode ${escapeHtml(item.barcode)}"></canvas></div><dl><dt>Code</dt><dd class="record-code">${escapeHtml(item.barcode)}</dd><dt>Location</dt><dd>${escapeHtml(item.location)}</dd><dt>Quantity</dt><dd>${item.quantity}</dd>${item.supplier ? `<dt>Supplier</dt><dd>${escapeHtml(item.supplier)}</dd>` : ''}${item.notes ? `<dt>Notes</dt><dd>${escapeHtml(item.notes)}</dd>` : ''}</dl></article></div></main>`, 'records');
}

function privacyPage(): string {
  setMeta('Privacy — Barcode Intake Card', 'How Barcode Intake Card stores item details and photos.', '/privacy');
  return shell(`<main id="main"><article class="page legal"><p class="eyebrow">Policy · 28 August 2026</p><h1 tabindex="-1">Your cards stay on your device</h1><p class="lede">Barcode Intake Card stores item records and photos in your browser.</p><h2>Data storage</h2><p>Item cards use IndexedDB on this device. Demo cards use a separate database and never read your real cards.</p><h2>Network requests</h2><p>The app does not send item data, barcodes, CSV rows, or photos to us. The service worker fetches app files from this site. The app has no account, sync, checkout, or billing request.</p><h2>Camera and files</h2><p>The camera starts only when you press “Scan with camera.” CSV and photo files are read on this device. You can deny camera access and type the code instead.</p><h2>Delete or export data</h2><p>Delete individual cards from the Cards page. Export CSV or a JSON backup before clearing this site’s browser data.</p><h2>Contact</h2><p>Questions can be sent to <a href="mailto:privacy@sociobot.in">privacy@sociobot.in</a>.</p></article></main>`, 'privacy');
}

function termsPage(): string {
  setMeta('Terms — Barcode Intake Card', 'Terms for using Barcode Intake Card.', '/terms');
  return shell(`<main id="main"><article class="page legal"><p class="eyebrow">Terms · 28 August 2026</p><h1 tabindex="-1">Use the tool as your own record</h1><p class="lede">You are responsible for checking item details, labels, backups, and camera results.</p><h2>What the tool provides</h2><p>Barcode Intake Card records information you enter and creates printable cards. Camera scanning, manual intake, and exports are included. It is not a product database, accounting system, or safety certification.</p><h2>No warranty</h2><p>The software is provided “as is” under the MIT License. Check every scan and print before relying on it.</p><h2>Your data</h2><p>You control your local records and backups. Removing browser data can remove your cards.</p></article></main>`);
}

function licensePage(): string {
  setMeta('Camera scanning — Barcode Intake Card', 'Camera scanning is included in Barcode Intake Card.', '/license');
  return shell(`<main id="main"><div class="page legal"><p class="eyebrow">Camera reader</p><h1 tabindex="-1">Camera scanning is included</h1><p class="lede">There is no license, checkout, or account to set up.</p><div class="license-box"><p>Open the intake desk and choose <strong>Scan with camera</strong> when you are ready to grant camera access.</p><p><a class="button" href="/intake" data-link>Open the intake desk</a></p></div><p>Manual barcode entry and data export are available too. Read the <a href="/terms" data-link>terms</a> and <a href="/privacy" data-link>privacy policy</a>.</p></div></main>`);
}

function notFound(): string {
  setMeta('Page not found — Barcode Intake Card', 'Return to Barcode Intake Card.', '/404');
  return shell(`<main id="main"><div class="page not-found"><p class="eyebrow">Misprint · 404</p><h1 tabindex="-1">This card is not in the file</h1><p class="lede">The address may be wrong, or the card may have moved.</p><a class="button" href="/" data-link>Return to the intake desk</a></div></main>`);
}

async function render(moveFocus = false): Promise<void> {
  stopScanner();
  if (isDemo()) await seedDemo();
  const path = routeUrl().pathname.replace(/\/$/, '') || '/';
  let html: string;
  if (path === '/') html = landing();
  else if (path === '/demo') html = await demoPage();
  else if (path === '/intake') html = await intakePage();
  else if (path === '/records') html = await recordsPage();
  else if (path.startsWith('/print/')) html = await printPage(decodeURIComponent(path.slice(7)));
  else if (path === '/privacy') html = privacyPage();
  else if (path === '/terms') html = termsPage();
  else if (path === '/license') html = licensePage();
  else html = notFound();
  app!.innerHTML = html;
  bindPage();
  if (path.startsWith('/print/')) void drawBarcode();
  if (moveFocus) {
    scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    const heading = document.querySelector<HTMLElement>('main h1');
    heading?.focus();
    const announcer = document.querySelector('#route-announcer');
    if (announcer) announcer.textContent = heading?.textContent ?? '';
  }
}

function bindPage(): void {
  document.querySelector('#intake-form')?.addEventListener('submit', saveForm);
  const barcode = document.querySelector<HTMLInputElement>('#barcode');
  barcode?.addEventListener('input', validateBarcode);
  barcode?.addEventListener('change', checkBarcode);
  if (barcode) validateBarcode({ currentTarget: barcode } as unknown as Event);
  document.querySelector('#photo')?.addEventListener('change', loadPhoto);
  document.querySelector('#csv-file')?.addEventListener('change', loadCsv);
  document.querySelector('#record-search')?.addEventListener('input', filterRecords);
  document.querySelector('#json-import')?.addEventListener('change', importJson);
  const scannerDialog = document.querySelector<HTMLDialogElement>('#scanner-dialog');
  scannerDialog?.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeScanner();
  });
  scannerDialog?.addEventListener('close', stopScanner);
}

async function saveForm(event: Event): Promise<void> {
  event.preventDefault();
  const form = event.currentTarget as HTMLFormElement;
  const barcode = form.elements.namedItem('barcode') as HTMLInputElement | null;
  if (barcode) validateBarcode({ currentTarget: barcode } as unknown as Event);
  if (!form.reportValidity()) {
    const status = document.querySelector('#form-status');
    if (status) status.textContent = barcode?.validationMessage || 'Check the required fields, then try again.';
    return;
  }
  const data = new FormData(form);
  const existingId = String(data.get('id') ?? '');
  const old = existingId ? await getItem(isDemo(), existingId) : undefined;
  const now = new Date().toISOString();
  const item: IntakeItem = {
    id: existingId || uid(), barcode: String(data.get('barcode') ?? '').trim(), name: String(data.get('name') ?? '').trim(), supplier: String(data.get('supplier') ?? '').trim(), location: String(data.get('location') ?? '').trim(), quantity: Math.max(0, Number(data.get('quantity') ?? 0)), notes: String(data.get('notes') ?? '').trim(), photo: String(data.get('photoData') ?? '') || undefined, createdAt: old?.createdAt ?? now, updatedAt: now
  };
  try {
    await saveItem(isDemo(), item);
    const status = document.querySelector('#form-status');
    if (status) status.textContent = `${item.name} was saved. Opening its card.`;
    setTimeout(() => navigate(`/print/${encodeURIComponent(item.id)}${demoSuffix()}`), 250);
  } catch {
    const status = document.querySelector('#form-status');
    if (status) status.textContent = 'The card could not be saved. Free browser storage, then try again.';
  }
}

function validateBarcode(event: Event): void {
  const input = event.currentTarget as HTMLInputElement;
  const code = input.value.trim();
  input.setCustomValidity(code && !PRINTABLE_CODE.test(code) ? 'Use English letters, numbers, spaces, or standard punctuation. This barcode format cannot print other scripts.' : '');
}

async function checkBarcode(): Promise<void> {
  const input = document.querySelector<HTMLInputElement>('#barcode');
  const host = document.querySelector('#duplicates');
  if (!input || !host) return;
  const code = input.value.trim();
  const csv = csvMatches.find((row) => String(row.barcode ?? '') === code || String(row.code ?? '') === code || String(row.sku ?? '') === code || String(row.ean ?? '') === code || String(row.upc ?? '') === code);
  if (csv) {
    for (const name of ['name', 'supplier', 'location', 'quantity'] as const) {
      const field = document.querySelector<HTMLInputElement>(`#${name}`);
      const isUntouchedDefaultQuantity = name === 'quantity' && field?.value === '1';
      if (field && (!field.value || isUntouchedDefaultQuantity) && csv[name] !== undefined && String(csv[name]).length > 0) field.value = String(csv[name]);
    }
    const status = document.querySelector('#form-status');
    if (status) status.textContent = 'A supplier CSV row matched. Review the filled fields.';
  }
  const currentId = document.querySelector<HTMLInputElement>('input[name="id"]')?.value;
  const duplicates = (await getItems(isDemo())).filter((item) => item.barcode === code && item.id !== currentId);
  host.innerHTML = duplicates.length ? `<div class="notice"><strong>${duplicates.length} possible duplicate${duplicates.length > 1 ? 's' : ''}</strong><ul class="duplicate-list">${duplicates.map((item) => `<li>${escapeHtml(item.name)} · ${escapeHtml(item.location)} <a href="/intake?edit=${encodeURIComponent(item.id)}${isDemo() ? '&demo=1' : ''}" data-link>Review this card</a></li>`).join('')}</ul><span>You can still save a separate card.</span></div>` : '';
}

async function loadCsv(event: Event): Promise<void> {
  const file = (event.target as HTMLInputElement).files?.[0];
  const status = document.querySelector('#csv-status');
  if (!file || !status) return;
  try {
    csvMatches = parseCsv(await file.text());
    status.textContent = `${csvMatches.length} lookup rows are ready for this session.`;
    await checkBarcode();
  } catch (error) {
    status.textContent = error instanceof Error ? error.message : 'The CSV could not be read. Check its columns and try again.';
  }
}

async function loadPhoto(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  const status = document.querySelector('#form-status');
  if (!file.type.startsWith('image/')) {
    if (status) status.textContent = 'That file is not an image. Choose a photo and try again.';
    input.value = '';
    return;
  }
  const image = new Image();
  const objectUrl = URL.createObjectURL(file);
  image.src = objectUrl;
  try {
    await image.decode();
    if (!image.naturalWidth || !image.naturalHeight) throw new Error('empty image');
    const max = 1200;
    const scale = Math.min(1, max / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(image.naturalWidth * scale);
    canvas.height = Math.round(image.naturalHeight * scale);
    const context = canvas.getContext('2d');
    if (!context) throw new Error('canvas unavailable');
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', .78);
    const hidden = document.querySelector<HTMLInputElement>('#photo-data');
    const preview = document.querySelector<HTMLImageElement>('#photo-preview');
    if (hidden) hidden.value = dataUrl;
    if (preview) { preview.src = dataUrl; preview.hidden = false; }
    if (status) status.textContent = `Photo ready at ${canvas.width} × ${canvas.height} pixels.`;
  } catch {
    input.value = '';
    if (status) status.textContent = 'That image could not be read. Choose a JPG, PNG, or WebP photo and try again.';
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

async function openScanner(): Promise<void> {
  const dialog = document.querySelector<HTMLDialogElement>('#scanner-dialog');
  const video = document.querySelector<HTMLVideoElement>('#scanner-video');
  const status = document.querySelector('#scanner-status');
  if (!dialog || !video || !status) return;
  stopScanner();
  const session = ++scannerSession;
  lastFocus = document.activeElement as HTMLElement;
  dialog.showModal();
  try {
    const { BrowserMultiFormatReader } = await import('@zxing/browser');
    const reader = new BrowserMultiFormatReader();
    const controls = await reader.decodeFromVideoDevice(undefined, video, (result) => {
      if (!result) return;
      const input = document.querySelector<HTMLInputElement>('#barcode');
      if (input) {
        input.value = result.getText();
        validateBarcode({ currentTarget: input } as unknown as Event);
      }
      status.textContent = `Read ${result.getText()}. Closing the camera.`;
      void checkBarcode();
      setTimeout(closeScanner, 350);
    });
    if (session !== scannerSession || !dialog.open) {
      controls.stop();
      (video.srcObject as MediaStream | null)?.getTracks().forEach((track) => track.stop());
      return;
    }
    scannerStop = () => controls.stop();
    status.textContent = 'Camera ready. Hold one barcode inside the frame.';
  } catch (error) {
    status.textContent = error instanceof DOMException && error.name === 'NotAllowedError' ? 'Camera access was denied. Allow camera access, or close this window and type the code.' : 'The camera could not start. Close this window and type the code.';
  }
}

function stopScanner(): void {
  scannerSession += 1;
  scannerStop?.();
  scannerStop = undefined;
  const video = document.querySelector<HTMLVideoElement>('#scanner-video');
  (video?.srcObject as MediaStream | null)?.getTracks().forEach((track) => track.stop());
  if (video) video.srcObject = null;
}

function closeScanner(): void {
  stopScanner();
  const dialog = document.querySelector<HTMLDialogElement>('#scanner-dialog');
  if (dialog?.open) dialog.close();
  lastFocus?.focus();
}

function download(name: string, content: string, type: string): void {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([content], { type }));
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 500);
}

async function exportData(format: 'csv' | 'json'): Promise<void> {
  const items = await getItems(isDemo());
  if (format === 'csv') download('barcode-intake-cards.csv', itemsToCsv(items), 'text/csv;charset=utf-8');
  else download('barcode-intake-backup.json', JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), items }, null, 2), 'application/json');
  const status = document.querySelector('#records-status');
  if (status) status.textContent = `${items.length} cards exported as ${format.toUpperCase()}.`;
}

async function importJson(event: Event): Promise<void> {
  const file = (event.target as HTMLInputElement).files?.[0];
  const status = document.querySelector('#records-status');
  if (!file || !status) return;
  try {
    const parsed: unknown = JSON.parse(await file.text());
    const items = validateBackup(parsed);
    await saveItemsAtomic(isDemo(), items);
    status.textContent = `${items.length} cards imported. Refreshing the list.`;
    setTimeout(() => void render(), 250);
  } catch {
    status.textContent = 'The backup could not be imported. Choose a Barcode Intake Card JSON backup.';
  }
}

function validTimestamp(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0 && Number.isFinite(Date.parse(value));
}

function validPhoto(value: unknown): value is string | undefined {
  return value === undefined || (typeof value === 'string' && (value === '' || /^data:image\/(?:jpeg|png|webp);base64,[a-z0-9+/]+=*$/i.test(value)));
}

function validBackupItem(value: unknown): value is IntakeItem {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const item = value as Record<string, unknown>;
  return typeof item.id === 'string' && item.id.trim().length > 0
    && typeof item.barcode === 'string' && PRINTABLE_CODE.test(item.barcode.trim())
    && typeof item.name === 'string' && item.name.trim().length > 0
    && typeof item.supplier === 'string'
    && typeof item.location === 'string'
    && typeof item.quantity === 'number' && Number.isSafeInteger(item.quantity) && item.quantity >= 0
    && typeof item.notes === 'string'
    && validPhoto(item.photo)
    && validTimestamp(item.createdAt)
    && validTimestamp(item.updatedAt);
}

function validateBackup(value: unknown): IntakeItem[] {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('bad backup');
  const backup = value as Record<string, unknown>;
  if (backup.version !== 1 || !validTimestamp(backup.exportedAt) || !Array.isArray(backup.items) || !backup.items.every(validBackupItem)) throw new Error('bad backup');
  const ids = new Set(backup.items.map((item) => item.id));
  if (ids.size !== backup.items.length) throw new Error('duplicate ids');
  return backup.items;
}

function filterRecords(event: Event): void {
  const query = (event.target as HTMLInputElement).value.trim().toLowerCase();
  document.querySelectorAll<HTMLElement>('.record').forEach((record) => { record.hidden = !record.innerText.toLowerCase().includes(query); });
}

async function drawBarcode(): Promise<void> {
  const canvas = document.querySelector<HTMLCanvasElement>('#print-barcode');
  const code = document.querySelector('.print-card .record-code')?.textContent?.trim();
  if (!canvas || !code) return;
  try {
    const { default: JsBarcode } = await import('jsbarcode');
    JsBarcode(canvas, code, { format: 'CODE128', displayValue: false, background: '#ffffff', lineColor: '#000000', margin: 12, height: 72, width: 2 });
  } catch {
    canvas.setAttribute('aria-label', `Barcode image unavailable. Code ${code}`);
    const status = document.querySelector<HTMLElement>('#barcode-render-status');
    if (status) status.hidden = false;
    const printButton = document.querySelector<HTMLButtonElement>('[data-action="print"]');
    if (printButton) printButton.disabled = true;
  }
}

document.addEventListener('click', (event) => {
  const target = (event.target as HTMLElement).closest<HTMLElement>('[data-link], [data-action]');
  if (!target) return;
  if (target.matches('[data-link]')) {
    const anchor = target as HTMLAnchorElement;
    if (anchor.origin === location.origin) { event.preventDefault(); navigate(`${anchor.pathname}${anchor.search}${anchor.hash}`); }
    return;
  }
  const action = target.dataset.action;
  if (action === 'scan') { event.preventDefault(); void openScanner(); }
  else if (action === 'close-scanner') closeScanner();
  else if (action === 'print') print();
  else if (action === 'export-csv') void exportData('csv');
  else if (action === 'export-json') void exportData('json');
  else if (action === 'delete-item') {
    const name = target.dataset.name ?? 'this item';
    if (confirm(`Delete ${name}? This cannot be undone.`)) void removeItem(isDemo(), target.dataset.id ?? '').then(() => render());
  } else if (action === 'reset-demo') {
    void clearItems(true).then(seedDemo).then(() => render());
  } else if (action === 'start-real') {
    event.preventDefault();
    void clearItems(true).then(() => navigate('/intake')).catch(() => {
      const status = document.querySelector<HTMLElement>('.demo-banner strong');
      if (status) status.textContent = 'The demo could not be cleared. Reset it, then try again.';
    });
  }
});

window.addEventListener('popstate', () => void render(true));
window.addEventListener('pagehide', stopScanner);
window.addEventListener('online', () => { const status = document.querySelector('.status-line'); if (status) status.textContent = 'Back online. Local cards were available throughout.'; });
window.addEventListener('offline', () => { const status = document.querySelector('.status-line'); if (status) status.textContent = 'Offline. You can keep working with local cards.'; });

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').then((registration) => {
    registration.addEventListener('updatefound', () => {
      const worker = registration.installing;
      worker?.addEventListener('statechange', () => {
        if (worker.state === 'installed' && navigator.serviceWorker.controller) {
          const toast = document.createElement('div');
          toast.className = 'update-toast'; toast.setAttribute('role', 'status');
          toast.innerHTML = 'An update is ready. <button class="link-button" data-action="reload-update">Reload now</button>';
          document.body.append(toast);
        }
      });
    });
  }).catch(() => undefined));
}

document.addEventListener('click', (event) => {
  if ((event.target as HTMLElement).closest('[data-action="reload-update"]')) location.reload();
});

void render();
