import { createClient, type SupabaseClient } from '@supabase/supabase-js'

export function createSupabaseBrowserClient (): SupabaseClient {
	const url: string = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
	const anonKey: string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
	if (!url || !anonKey) {
		throw new Error('Missing Supabase env vars in Next app')
	}
	return createClient(url, anonKey)
}

