// Only prerender when using static adapter for preview
export const prerender = process.env.ADAPTER === 'static';