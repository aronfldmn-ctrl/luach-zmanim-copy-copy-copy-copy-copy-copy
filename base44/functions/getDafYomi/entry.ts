import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const res = await fetch('https://www.hebcal.com/api/dafyomi?cfg=json');
    if (!res.ok) {
      return Response.json({ data: null, error: `API returned ${res.status}` });
    }

    const data = await res.json();
    
    if (data && data.items && data.items.length > 0) {
      const item = data.items[0];
      return Response.json({
        data: {
          ref: item.title,
          display: item.title,
          masechta: item.title.split(' ')[0],
          dafPage: item.title.split(' ')[1]
        }
      });
    }
    
    return Response.json({ data: null });
  } catch (error) {
    return Response.json({ data: null, error: error.message });
  }
});