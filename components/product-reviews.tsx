"use client"

import { useState, useEffect } from "react"
import { Star, ThumbsUp, Loader2, X, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"

interface ProductReviewsProps {
    productId: string
}

export function ProductReviews({ productId }: ProductReviewsProps) {
    const [reviews, setReviews] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isWritingReview, setIsWritingReview] = useState(false)
    const [newReview, setNewReview] = useState({
        user: "",
        rating: 5,
        content: ""
    })
    const [submitting, setSubmitting] = useState(false)

    const fetchReviews = async () => {
        try {
            const res = await fetch(`/api/reviews?productId=${productId}`)
            const data = await res.json()
            setReviews(Array.isArray(data) ? data : [])
        } catch (error) {
            console.error("Failed to fetch reviews", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (productId) fetchReviews()
    }, [productId])

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newReview.user || !newReview.content || !newReview.rating) {
            toast.error("Please fill in all fields")
            return
        }

        setSubmitting(true)
        try {
            const res = await fetch("/api/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...newReview, productId })
            })

            if (res.ok) {
                toast.success("Review submitted successfully!")
                setIsWritingReview(false)
                setNewReview({ user: "", rating: 5, content: "" })
                fetchReviews()
            } else {
                throw new Error("Failed to submit review")
            }
        } catch (error) {
            toast.error("Error submitting review")
        } finally {
            setSubmitting(false)
        }
    }

    const handleHelpful = async (reviewId: string) => {
        try {
            const res = await fetch("/api/reviews", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reviewId })
            })
            if (res.ok) {
                setReviews(reviews.map(r => r._id === reviewId ? { ...r, helpful: r.helpful + 1 } : r))
            }
        } catch (error) {
            console.error(error)
        }
    }

    // Calculations
    const totalReviews = reviews.length
    const averageRating = totalReviews > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
        : "0.0"

    const ratingDistribution = [5, 4, 3, 2, 1].map(star => {
        const count = reviews.filter(r => r.rating === star).length
        const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0
        return { star, percentage: Math.round(percentage) }
    })

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <section className="py-20 border-t border-border mt-20">
            <div className="flex flex-col lg:flex-row gap-20">
                {/* Rating Summary */}
                <div className="lg:w-1/3">
                    <h2 className="text-[10px] font-black tracking-[0.3em] uppercase mb-8 opacity-60">RATINGS & REVIEWS</h2>
                    <div className="flex items-baseline gap-4 mb-3">
                        <span className="text-5xl font-black tracking-tighter">{averageRating}</span>
                        <div className="flex text-yellow-400 gap-0.5">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-5 h-5 fill-current ${i < Math.round(parseFloat(averageRating)) ? "text-yellow-400" : "text-border"}`}
                                />
                            ))}
                        </div>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Based on {totalReviews} Genuine Reviews</p>

                    <div className="mt-12 space-y-4">
                        {ratingDistribution.map((item) => (
                            <div key={item.star} className="flex items-center gap-6 text-[10px] font-black uppercase">
                                <span className="w-4">{item.star}</span>
                                <Star className="w-3.5 h-3.5 fill-current opacity-20" />
                                <div className="flex-1 h-3 bg-muted rounded-none overflow-hidden">
                                    <div
                                        className="h-full bg-foreground transition-all duration-1000"
                                        style={{ width: `${item.percentage}%` }}
                                    />
                                </div>
                                <span className="w-8 text-right opacity-40">{item.percentage}%</span>
                            </div>
                        ))}
                    </div>

                    <Button
                        onClick={() => setIsWritingReview(true)}
                        variant="outline"
                        className="w-full mt-12 h-16 rounded-none border-2 border-foreground font-black tracking-[0.2em] uppercase transition-all hover:bg-foreground hover:text-background"
                    >
                        WRITE A REVIEW
                    </Button>
                </div>

                {/* Individual Reviews */}
                <div className="lg:w-2/3">
                    <div className="space-y-12">
                        {reviews.length === 0 ? (
                            <div className="py-10 border-2 border-dashed border-border flex flex-col items-center justify-center italic text-muted-foreground bg-muted/10">
                                <p className="text-sm">Be the first to review this product!</p>
                            </div>
                        ) : (
                            reviews.map((review) => (
                                <div key={review._id} className="pb-12 border-b border-border last:border-0 group">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex gap-1 text-yellow-400">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`w-4 h-4 fill-current ${i >= review.rating ? "text-border fill-transparent" : ""}`} />
                                            ))}
                                        </div>
                                        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest italic">
                                            {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                                        </span>
                                    </div>
                                    <h4 className="text-sm font-black mb-3 uppercase tracking-tight">{review.user}</h4>
                                    <p className="text-base text-foreground/80 leading-relaxed mb-6 font-medium italic decoration-foreground/20 decoration-2">
                                        &quot;{review.content}&quot;
                                    </p>
                                    <button
                                        onClick={() => handleHelpful(review._id)}
                                        className="flex items-center gap-2.5 text-[10px] font-black tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-all group/btn"
                                    >
                                        <div className="p-2 border border-border group-hover/btn:border-foreground transition-colors">
                                            <ThumbsUp className="w-3.5 h-3.5" />
                                        </div>
                                        HELPFUL ({review.helpful})
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    {reviews.length > 3 && (
                        <button className="mt-12 text-[10px] font-black tracking-[0.3em] uppercase underline underline-offset-8 hover:opacity-50 transition-all">
                            VIEW ALL REVIEWS
                        </button>
                    )}
                </div>
            </div>

            {/* Review Modal */}
            {isWritingReview && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setIsWritingReview(false)} />
                    <div className="relative bg-white w-full max-w-xl p-10 rounded-none shadow-2xl animate-in fade-in zoom-in duration-300">
                        <button onClick={() => setIsWritingReview(false)} className="absolute top-6 right-6 p-2 hover:bg-muted rounded-full">
                            <X className="w-6 h-6" />
                        </button>
                        <h3 className="text-3xl font-black uppercase tracking-tighter mb-2">Share Your Experience</h3>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-10">We value your feedback on our premium collection</p>

                        <form onSubmit={handleSubmitReview} className="space-y-6">
                            <div className="space-y-2 text-center py-4 bg-muted/30 border-2 border-dashed border-border mb-6">
                                <p className="text-[10px] font-black uppercase tracking-widest mb-4">Your Rating</p>
                                <div className="flex justify-center gap-3">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setNewReview({ ...newReview, rating: star })}
                                            className={`p-1 transition-transform hover:scale-125 ${newReview.rating >= star ? "text-yellow-400" : "text-border"}`}
                                        >
                                            <Star className={`w-10 h-10 ${newReview.rating >= star ? "fill-current" : ""}`} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Your Name</label>
                                <input
                                    required
                                    value={newReview.user}
                                    onChange={(e) => setNewReview({ ...newReview, user: e.target.value })}
                                    className="w-full border-2 border-border focus:border-foreground px-5 py-4 text-sm font-bold focus:outline-none transition-all rounded-none"
                                    placeholder="e.g. AHMED K."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Your Review</label>
                                <textarea
                                    required
                                    rows={4}
                                    value={newReview.content}
                                    onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                                    className="w-full border-2 border-border focus:border-foreground px-5 py-4 text-sm font-bold focus:outline-none transition-all rounded-none resize-none"
                                    placeholder="Tell us what you loved about this product..."
                                />
                            </div>

                            <Button disabled={submitting} className="w-full h-16 rounded-none font-black tracking-[0.25em] uppercase shadow-2xl transition-all hover:scale-[1.02]">
                                {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : "POST REVIEW"}
                            </Button>
                        </form>
                    </div>
                </div>
            )}
        </section>
    )
}
