import { createRequire } from 'module';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
const require = createRequire(import.meta.url);
initializeApp({ credential: cert(require('../functions/serviceAccountKey.json')) });
const db = getFirestore();
const snap = await db.collection('WORK').where('USERS_ID','>=','seed_').where('USERS_ID','<','seed`').limit(1).get();
snap.forEach(d=>{ const v=d.data(); console.log(Object.keys(v).join(', ')); console.log(JSON.stringify(v).slice(0,900)); });
process.exit(0);
