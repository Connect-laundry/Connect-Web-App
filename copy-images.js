const fs = require('fs');
const path = require('path');

const brain = path.join('C:', 'Users', 'ERNEST', '.gemini', 'antigravity', 'brain', 'd29c87d5-c6fa-423c-8e97-e409b6feb2da');
const publicDir = path.join('F:', 'My_props', 'CONNECT WEB-APP', 'public');

const files = [
  ['hero_laundry_1773419801407.png', 'hero-laundry.png'],
  ['delivery_service_1773419931483.png', 'delivery-service.png'],
  ['dry_cleaning_1773419950105.png', 'dry-cleaning.png'],
];

for (const [src, dst] of files) {
  try {
    const data = fs.readFileSync(path.join(brain, src));
    fs.writeFileSync(path.join(publicDir, dst), data);
    console.log('Copied:', dst, '-', data.length, 'bytes');
  } catch (err) {
    console.error('Failed to copy', src, ':', err.message);
  }
}
