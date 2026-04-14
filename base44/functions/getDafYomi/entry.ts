import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const res = await fetch('https://www.shas.org/api/v1/daf-yomi');
    if (!res.ok) {
      return Response.json({ data: null });
    }

    const data = await res.json();
    
    if (data && data.current_daf && data.current_daf.masechta && data.current_daf.daf) {
      return Response.json({
        data: {
          ref: `${data.current_daf.masechta} ${data.current_daf.daf}`,
          display: `${data.current_daf.masechta} ${data.current_daf.daf}`,
          masechta: data.current_daf.masechta,
          dafPage: data.current_daf.daf,
          cycle: data.cycle
        }
      });
    }
    
    return Response.json({ data: null });
  } catch (error) {
    console.error('Daf Yomi fetch error:', error);
    return Response.json({ data: null });
  }
});