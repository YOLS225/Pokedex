import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export type Pokemon = {
    id: number,
    name: string,
    height: number,
    weight: number,
    types: { slot: number, type: { name: string, url: string } }[],
    stats: { base_stat: number, effort: number, stat: { name: string, url: string } }[],
    sprites: {
        front_default: string,
        other: {
            "official-artwork": {
                front_default: string
            }
        }
    }
}

type API = {
    "pokemon?limit=210": {
        count: number,
        next: string | null,
        results: { name: string, url: string }[]
    }
}

const endpoint = "https://pokeapi.co/api/v2/"

export function useFetchQuery<T extends keyof API>(url: T) {
    return useQuery({
        queryKey: [url],
        queryFn: async () => {
            return fetch(endpoint + url)
                .then(res => res.json() as Promise<API[T]>)
        }
    })
}

export type PokemonSpecies = {
    id: number,
    name: string,
    base_happiness: number,
    capture_rate: number,
    is_legendary: boolean,
    is_mythical: boolean,
    genera: { genus: string, language: { name: string } }[],
    habitat: { name: string } | null,
    growth_rate: { name: string },
    flavor_text_entries: { flavor_text: string, language: { name: string } }[],
}

export function usePokemonSpeciesQuery(id: number | string) {
    return useQuery({
        queryKey: ['pokemon-species', id],
        queryFn: async () => {
            return fetch(`${endpoint}pokemon-species/${id}`)
                .then(res => res.json() as Promise<PokemonSpecies>)
        }
    })
}

export function usePokemonQuery(id: number | string) {
    return useQuery({
        queryKey: ['pokemon', id],
        queryFn: async () => {
            return fetch(`${endpoint}pokemon/${id}`)
                .then(res => res.json() as Promise<Pokemon>)
        }
    })
}

export function useInfiniteFetchQuery<T extends keyof API>(url: T) {
    return useInfiniteQuery({
        queryKey: [url],
        initialPageParam: endpoint + url,
        queryFn: async ({ pageParam }) => {
            return fetch(pageParam, {
                headers: {
                    Accept: 'application/json'
                }
            })
                .then(res => res.json() as Promise<API[T]>)
        },
        getNextPageParam: (lastPage) => {
            if ("next" in lastPage) {
                return lastPage.next
            }
            return null
        }
    })
}
