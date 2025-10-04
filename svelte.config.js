import cloudflareAdapter from '@sveltejs/adapter-cloudflare';
import staticAdapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

// Use static adapter for preview mode, Cloudflare adapter for production
const isPreview = process.env.ADAPTER === 'static';
const adapter = isPreview ? staticAdapter : cloudflareAdapter;

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess({ script: true }),

	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter({
			// Static adapter config for preview
			...(isPreview && {
				pages: 'build',
				assets: 'build',
				fallback: undefined,
				precompress: false,
				strict: true
			})
		})
	}
};

export default config;
