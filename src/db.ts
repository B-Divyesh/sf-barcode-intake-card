import type { IntakeItem } from './types';

const DB_VERSION = 1;
const STORE = 'items';

function openDb(demo: boolean): Promise<IDBDatabase> {
  const name = demo ? 'barcode-intake-demo' : 'barcode-intake-real';
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(name, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, { keyPath: 'id' });
        store.createIndex('barcode', 'barcode', { unique: false });
        store.createIndex('updatedAt', 'updatedAt', { unique: false });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function withStore<T>(demo: boolean, mode: IDBTransactionMode, run: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await openDb(demo);
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, mode);
    const request = run(tx.objectStore(STORE));
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => db.close();
  });
}

export async function getItems(demo: boolean): Promise<IntakeItem[]> {
  const items = await withStore<IntakeItem[]>(demo, 'readonly', (store) => store.getAll());
  return items.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getItem(demo: boolean, id: string): Promise<IntakeItem | undefined> {
  return withStore<IntakeItem | undefined>(demo, 'readonly', (store) => store.get(id));
}

export async function saveItem(demo: boolean, item: IntakeItem): Promise<IDBValidKey> {
  return withStore<IDBValidKey>(demo, 'readwrite', (store) => store.put(item));
}

export async function removeItem(demo: boolean, id: string): Promise<undefined> {
  return withStore<undefined>(demo, 'readwrite', (store) => store.delete(id));
}

export async function clearItems(demo: boolean): Promise<undefined> {
  return withStore<undefined>(demo, 'readwrite', (store) => store.clear());
}

export async function seedDemo(): Promise<void> {
  const current = await getItems(true);
  if (current.length) return;
  const now = new Date().toISOString();
  const samples: IntakeItem[] = [
    { id: 'demo-bearing', barcode: '5901234123457', name: '608ZZ shielded bearing', supplier: 'North Street Components', location: 'Bin A-14', quantity: 12, notes: 'Check bore before restocking.', createdAt: now, updatedAt: now },
    { id: 'demo-cable', barcode: '5056077741983', name: 'USB-C panel cable, 30 cm', supplier: 'Workshop Surplus Lot', location: 'Drawer C-03', quantity: 6, notes: 'Black, right-angle socket.', createdAt: now, updatedAt: now },
    { id: 'demo-labels', barcode: '4006381333931', name: 'Thermal labels, 50 × 30 mm', supplier: 'Pack & Post Trade', location: 'Shelf P-02', quantity: 4, notes: 'Rolls. Fits bench printer.', createdAt: now, updatedAt: now }
  ];
  for (const item of samples) await saveItem(true, item);
}
