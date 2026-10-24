# Pro winter wardrobe

v1.11.0 artwork, made with the built-in ImageGen tool using the existing Pro whale-maid drawing as the identity reference.

- `winter-puffer`: cream and powder-blue long quilted coat, blue scarf, navy skirt and winter boots.
- `winter-cape`: dark teal fur-trimmed cape, gold crescent clasp, cream cable-knit sweater and a navy embroidered skirt.

Each outfit has 24 independent transparent 512×768 drawings: eleven non-feeding states, one outgoing-transition pose, and twelve feeding poses. The incoming transition reuses the idle drawing under the existing water-and-fade effect. Runtime atlases use 320×480 cells.

Non-feeding states keep the complete body still and move the tail with the outfit's clipping geometry. Feeding uses complete drawings aligned at the lace headband and shoes, repeated for three bites. The headband stays independent of facial expressions and raised feeding hands. No independently generated face, hand or clothing patches are composited onto a different body. Hat placement follows the lace headband in each pose.

The four selected source sheets and exact prompts live in each outfit folder. The importer finds the three full connected characters in each sheet row, avoiding hair cuts caused by uneven generated gutters. All final drawings are stored inside the project; user-supplied reference photos are not redistributed.

To reproduce a source import, run `node scripts/pro-winter-art.cjs <winter-puffer|winter-cape> <poses1|poses2|mealA|mealB> <sheet.png>`, then `node scripts/pro-winter-rig.cjs` and `node scripts/build.cjs` from the repository root.
