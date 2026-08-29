# Copy audit — polish 6

Counted with contractions, hyphenated terms, file names, and version numbers as
one word. Every visitor-facing sentence on the landing page has 22 words or
fewer and contains no banned plain-words term.

## Landing page

| Sentence | Words | Result |
| --- | ---: | --- |
| Turn scanned barcodes into item cards | 6 | pass; h1 |
| For small sellers and workshops receiving mixed stock without a full inventory system. | 12 | pass |
| It opens sample workshop cards you can search, edit, and print. | 11 | pass; `demo-edit` |
| Cards stay in this browser | 5 | pass; `local-only` |
| Works offline after the first visit | 6 | pass; `offline-reload` |
| Free to use — no account or checkout | 7 | pass; `free-no-checkout` |
| An engraved workshop desk with parts, a parcel, a scanner, and a blank intake card. | 15 | pass; image alternative |
| Record mixed stock before choosing a full inventory system. | 9 | pass |
| Review and update the item card before printing it. | 9 | pass |
| Check bore before restocking. | 5 | pass; sample note |
| Scan a barcode, type the code, or match a supplier CSV. | 11 | pass; `camera-scan`, `manual-intake`, `csv-lookup` |
| Camera scanning fills the barcode field. | 6 | pass; `camera-scan` |
| You can also type English letters, numbers, spaces, and punctuation. | 10 | pass; `print-card` |
| Add its name, supplier, photo, quantity, and shelf location. | 9 | pass; `manual-intake` |
| Print one item card, or export all cards as CSV or JSON. | 12 | pass; `print-card`, `csv-export`, `json-backup` |
| No automatic web lookup. | 4 | pass; `no-web-lookup` |
| Supplier and stock details do not leave your device. | 9 | pass; `local-only` |
| No purchase orders. | 3 | pass; `no-purchase-orders` |
| This records arrivals. | 3 | pass; verb, not a stored-unit label |
| It does not run procurement. | 5 | pass; `no-purchase-orders` |
| No account or sync. | 4 | pass; `local-only` |
| Export a file when you need a backup or another system. | 11 | pass; `json-backup` |
| CSV lookups are explicit. | 4 | pass; `csv-lookup` |
| You choose the supplier CSV. | 6 | pass; `csv-lookup` |
| It is read in this browser. | 6 | pass; `csv-lookup` |
| Camera scanning, manual entry, and exports are free to use. | 10 | pass; `free-no-checkout` |
| The camera starts only after you choose Scan with camera. | 10 | pass; `camera-ready` |
| Turn a barcode into a private, printable item card. | 9 | pass; footer |

The literal headings and actions are **For mixed-stock intake**, **Try it with
sample data**, **Preview an item card**, **How it works**, **Capture the
code**, **Review the item**, **Print or export the card**, **What this tool
does not do**, **Scan barcodes with the camera**, and **Record an item**. The
preview uses real item-card labels: **Sample item card**, **Location**,
**Quantity**, and **Notes**.

## README and legal-page checks

| Text | Words | Result |
| --- | ---: | --- |
| Printable codes use English letters, numbers, spaces, and punctuation. | 9 | pass; `print-card` |
| Your real cards and sample cards are stored separately in this browser. | 12 | pass |
| The app works offline after your first visit. | 8 | pass; `offline-reload` |
| `staticwebapp.config.json` sends app routes to the right page, returns the designed 404 page, and sets security headers. | 17 | pass |
| Terms for using Barcode Intake Card | 5 | pass; `/terms` h1 |

## Terminology

| Concept | One term |
| --- | --- |
| Stored unit | item card; card after introduction |
| Identifying code | barcode |
| Physical storage note | location |
| User-selected lookup file | supplier CSV |
| Isolated sample state | demo |
| Camera feature | camera scanning |
| Portable full copy | JSON backup, then backup |

The printable-code claim is positively tested with `PART A-12/3`, which
contains English letters, a space, digits, and punctuation. No sentence
exceeds 22 words. No banned word appears.
