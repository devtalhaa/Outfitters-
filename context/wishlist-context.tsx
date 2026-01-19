"use client"

import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

interface WishlistContextType {
    wishlist: any[];
    toggleWishlist: (productId: string) => Promise<void>;
    isWishlisted: (productId: string) => boolean;
    loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const generateId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export function WishlistProvider({ children }: { children: React.ReactNode }) {
    const [wishlist, setWishlist] = useState<any[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Initialize or retrieve Guest ID
        let id = localStorage.getItem("guestId");
        if (!id) {
            id = generateId();
            localStorage.setItem("guestId", id);
        }
        setUserId(id);
        fetchWishlist(id);
    }, []);

    const fetchWishlist = async (id: string) => {
        try {
            const res = await fetch(`/api/wishlist?userId=${id}`);
            const data = await res.json();
            if (data.products) {
                setWishlist(data.products);
            }
        } catch (error) {
            console.error("Failed to fetch wishlist", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleWishlist = async (productId: string) => {
        if (!userId) return;

        try {
            const res = await fetch("/api/wishlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, productId }),
            });
            const data = await res.json();
            if (data.products) {
                setWishlist(data.products);
                const isNowWishlisted = data.products.some((p: any) => p._id === productId);
                if (isNowWishlisted) {
                    toast.success("Added to favorites");
                } else {
                    toast.success("Removed from favorites");
                }
            }
        } catch (error) {
            toast.error("Failed to update favorites");
        }
    };

    const isWishlisted = (productId: string) => {
        return wishlist.some((p: any) => p._id === productId || p.id === productId);
    };

    return (
        <WishlistContext.Provider value={{ wishlist, toggleWishlist, isWishlisted, loading }}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error("useWishlist must be used within a WishlistProvider");
    }
    return context;
}
