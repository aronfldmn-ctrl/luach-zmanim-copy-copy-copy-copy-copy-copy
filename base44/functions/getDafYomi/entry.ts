import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const res = await fetch('https://www.hebcal.com/api/v1/dafyomi');
    if (!res.ok) {
      return Response.json({ data: null });
    }

    const data = await res.json();
    
    if (data && data.daf_yomi) {
      const daf = data.daf_yomi;
      return Response.json({
        data: {
          ref: daf.name,
          display: daf.name,
          masechta: daf.name.split(' ')[0],
          dafPage: daf.name.split(' ')[1]
        }
      });
    }
    
    return Response.json({ data: null });
  } catch (error) {
    console.error('Daf Yomi fetch error:', error);
    return Response.json({ data: null });
  }
});