async function test() {
  const res = await fetch('https://trip-g.vercel.app/');
  console.log('HTML status:', res.status);
  const html = await res.text();
  console.log('HTML content:\n', html);

  const scripts = [...html.matchAll(/src="([^"]+)"/g)].map(m => m[1]);
  const links = [...html.matchAll(/href="([^"]+)"/g)].map(m => m[1]);
  console.log('Scripts:', scripts);
  console.log('Links:', links);

  for (const s of scripts) {
    const url = s.startsWith('http') ? s : 'https://trip-g.vercel.app' + s;
    const r = await fetch(url);
    console.log(`Script ${url} -> status ${r.status}, type: ${r.headers.get('content-type')}`);
    const text = await r.text();
    console.log(`Script content preview: ${text.slice(0, 150)}`);
  }

  // Also test API
  const apiRes = await fetch('https://trip-g.vercel.app/api/destinations');
  console.log('API status:', apiRes.status, 'type:', apiRes.headers.get('content-type'));
  const apiText = await apiRes.text();
  console.log('API response:', apiText.slice(0, 200));
}

test().catch(console.error);
