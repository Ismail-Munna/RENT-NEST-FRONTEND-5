"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { IProperty, ICategory } from "@/lib/types";
import { API_BASE_URL } from "@/lib/config";

export interface QueryFilters {
    search?: string;
    categoryId?: string;
    status?: string;
    minPrice?: string;
    maxPrice?: string;
    sortBy?: string; // e.g. "price_asc", "price_desc", "newest"
}

interface QueryState {
    properties: IProperty[];
    categories: ICategory[];
    isLoading: boolean;
    isRefetching: boolean;
    error: string | null;
}

// In-memory cache for query results to prevent redundant calls
const queryCache = new Map<string, { data: IProperty[]; timestamp: number }>();
const CACHE_TTL = 30000; // 30 seconds Cache Time-To-Live

export function usePropertiesQuery(filters: QueryFilters, debounceMs = 400) {
    const [state, setState] = useState<QueryState>({
        properties: [],
        categories: [],
        isLoading: true,
        isRefetching: false,
        error: null,
    });

    const [debouncedFilters, setDebouncedFilters] = useState<QueryFilters>(filters);
    const abortControllerRef = useRef<AbortController | null>(null);

    // 1. Debounce filters update
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedFilters(filters);
        }, debounceMs);

        return () => {
            clearTimeout(handler);
        };
    }, [filters, debounceMs]);

    // 2. Fetch categories helper (cached statically as they rarely change)
    const fetchCategories = async (): Promise<ICategory[]> => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/categories`);
            if (!res.ok) return [];
            const json = await res.json();
            return Array.isArray(json?.data) ? json.data : [];
        } catch {
            return [];
        }
    };

    // 3. Fetch properties based on filters
    const fetchProperties = useCallback(async (
        activeFilters: QueryFilters,
        isManualRefetch = false
    ) => {
        // Cancel active requests
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        const controller = new AbortController();
        abortControllerRef.current = controller;

        setState((prev) => ({
            ...prev,
            isLoading: !isManualRefetch && prev.properties.length === 0,
            isRefetching: isManualRefetch || prev.properties.length > 0,
            error: null,
        }));

        try {
            const query = new URLSearchParams();

            if (activeFilters.search) query.append("search", activeFilters.search);
            if (activeFilters.categoryId) query.append("categoryId", activeFilters.categoryId);
            if (activeFilters.status) query.append("status", activeFilters.status);
            if (activeFilters.minPrice) query.append("minPrice", activeFilters.minPrice);
            if (activeFilters.maxPrice) query.append("maxPrice", activeFilters.maxPrice);

            const queryString = query.toString();
            const cacheKey = `properties-${queryString}`;

            // Check cache if not a manual refresh
            if (!isManualRefetch) {
                const cached = queryCache.get(cacheKey);
                if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
                    const categoriesData = await fetchCategories();
                    setState({
                        properties: cached.data,
                        categories: categoriesData,
                        isLoading: false,
                        isRefetching: false,
                        error: null,
                    });
                    return;
                }
            }

            const res = await fetch(`${API_BASE_URL}/api/properties?${queryString}`, {
                signal: controller.signal,
            });

            if (!res.ok) {
                throw new Error(`Failed to fetch properties: ${res.statusText}`);
            }

            const json = await res.json();
            let propertiesData = json?.data;

            // Handle API wrapper structures
            if (propertiesData && !Array.isArray(propertiesData) && Array.isArray(propertiesData.properties)) {
                propertiesData = propertiesData.properties;
            }

            const propertiesList: IProperty[] = Array.isArray(propertiesData) ? propertiesData : [];

            // Apply sorting client-side for immediate visual response
            let sortedList = [...propertiesList];
            if (activeFilters.sortBy === "price_asc") {
                sortedList.sort((a, b) => a.price - b.price);
            } else if (activeFilters.sortBy === "price_desc") {
                sortedList.sort((a, b) => b.price - a.price);
            } else if (activeFilters.sortBy === "newest") {
                sortedList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            }

            // Save to Cache
            queryCache.set(cacheKey, {
                data: sortedList,
                timestamp: Date.now(),
            });

            // Fetch categories in parallel
            const categoriesData = await fetchCategories();

            setState({
                properties: sortedList,
                categories: categoriesData,
                isLoading: false,
                isRefetching: false,
                error: null,
            });
        } catch (err: any) {
            if (err.name === "AbortError") return; // Ignore canceled requests

            setState((prev) => ({
                ...prev,
                isLoading: false,
                isRefetching: false,
                error: err.message || "An unexpected error occurred while fetching properties.",
            }));
        }
    }, []);

    // Fetch on debounced filter change
    useEffect(() => {
        fetchProperties(debouncedFilters);

        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [debouncedFilters, fetchProperties]);

    const refetch = useCallback(() => {
        fetchProperties(filters, true);
    }, [filters, fetchProperties]);

    return {
        ...state,
        refetch,
    };
}
