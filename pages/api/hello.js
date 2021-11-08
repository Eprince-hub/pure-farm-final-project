// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

// 20210704103051
// http://localhost:3000/api/hello

// import db from '../../utils/db';

export default async function handler(req, res) {
  // await db.connect();
  // await db.disconnect();
  res.status(200).json({ name: 'John Doe' });
}

// ####################################################

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

// import db from '../../utils/db';

// export default async function handler(req, res) {
//   await db.connect();
//   await db.disconnect();
//   res.status(200).json({ name: 'John Doe' });
// }
