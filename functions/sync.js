// functions/sync.js - Cloudflare Worker для синхронизации
export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const data = await request.json();
    
    // Сохраняем в KV storage
    await env.SYNC_STORAGE.put('prices', JSON.stringify(data.prices));
    await env.SYNC_STORAGE.put('categories', JSON.stringify(data.categories));
    await env.SYNC_STORAGE.put('delivery', JSON.stringify(data.delivery));
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function onRequestGet(context) {
  try {
    const { env } = context;
    
    // Получаем из KV storage
    const [prices, categories, delivery] = await Promise.all([
      env.SYNC_STORAGE.get('prices'),
      env.SYNC_STORAGE.get('categories'),
      env.SYNC_STORAGE.get('delivery')
    ]);
    
    const data = {
      prices: prices ? JSON.parse(prices) : {},
      categories: categories ? JSON.parse(categories) : {},
      delivery: delivery ? JSON.parse(delivery) : {}
    };
    
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}