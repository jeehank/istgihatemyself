'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Heart, Calendar, User, MessageCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface NewsItem {
  id: string
  title: string
  content: string
  author: string
  likes: number
  created_at: string
  club_id: string
}

interface ClubNewsProps {
  clubId: string
  clubName: string
}

export default function ClubNews({ clubId, clubName }: ClubNewsProps) {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchNews()
  }, [clubId])

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('club_id', clubId)
        .order('created_at', { ascending: false })
        .limit(5)

      if (error) {
        console.error('Error fetching news:', error)
        // For demo purposes, use mock data if Supabase is not connected
        setNews(generateMockNews(clubId, clubName))
      } else {
        setNews(data || [])
      }
    } catch (error) {
      console.error('Error:', error)
      // Use mock data if there's an error
      setNews(generateMockNews(clubId, clubName))
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (newsId: string) => {
    if (likedPosts.has(newsId)) return

    try {
      const newsItem = news.find(item => item.id === newsId)
      if (!newsItem) return

      const { error } = await supabase
        .from('news')
        .update({ likes: newsItem.likes + 1 })
        .eq('id', newsId)

      if (!error) {
        setNews(prevNews =>
          prevNews.map(item =>
            item.id === newsId ? { ...item, likes: item.likes + 1 } : item
          )
        )
        setLikedPosts(prev => new Set([...prev, newsId]))
      }
    } catch (error) {
      console.error('Error liking post:', error)
      // Optimistic update for demo
      setNews(prevNews =>
        prevNews.map(item =>
          item.id === newsId ? { ...item, likes: item.likes + 1 } : item
        )
      )
      setLikedPosts(prev => new Set([...prev, newsId]))
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="p-8">
        <h2 className="font-inter text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Latest News
        </h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8"
    >
      <h2 className="font-inter text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
        <MessageCircle className="w-8 h-8 mr-3 text-green-500" />
        Latest News
      </h2>

      {news.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-8 h-8 text-gray-400" />
          </div>
          <p className="font-calibri text-gray-500 dark:text-gray-400">No news available yet.</p>
          <p className="font-calibri text-sm text-gray-400 dark:text-gray-500 mt-2">
            Check back later for updates from {clubName}!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {news.map((item, index) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm border border-white/30 dark:border-gray-600/30 rounded-2xl p-6 hover:bg-white/80 dark:hover:bg-gray-700/80 transition-all duration-300"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-inter font-semibold text-gray-900 dark:text-white">{item.author}</p>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(item.created_at)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <h3 className="font-inter text-xl font-bold text-gray-900 dark:text-white mb-3">
                {item.title}
              </h3>
              <p className="font-calibri text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                {item.content}
              </p>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => handleLike(item.id)}
                  disabled={likedPosts.has(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                    likedPosts.has(item.id)
                      ? 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 cursor-not-allowed'
                      : 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-900/50 hover:text-red-600 dark:hover:text-red-400'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${likedPosts.has(item.id) ? 'fill-current' : ''}`} />
                  <span className="font-calibri text-sm">{item.likes}</span>
                </button>
                
                <span className="font-calibri text-sm text-gray-500 dark:text-gray-400">
                  {clubName}
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </motion.div>
  )
}

// Mock data generator for demo purposes
function generateMockNews(clubId: string, clubName: string): NewsItem[] {
  const mockNews = [
    {
      id: `${clubId}-1`,
      title: `${clubName} Welcomes New Members`,
      content: `We're excited to announce that ${clubName} is welcoming new members for this semester! Join us for an amazing journey of learning and growth.`,
      author: 'Club President',
      likes: (parseInt(clubId) || 1) * 3 + 5,
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      club_id: clubId
    },
    {
      id: `${clubId}-2`,
      title: 'Upcoming Workshop Announcement',
      content: `Don't miss our upcoming workshop scheduled for next week! It's going to be an intensive session covering the latest trends and techniques.`,
      author: 'Workshop Coordinator',
      likes: (parseInt(clubId) || 1) * 2 + 3,
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      club_id: clubId
    },
    {
      id: `${clubId}-3`,
      title: 'Competition Results',
      content: `Congratulations to all participants in our recent competition! The results are in and we're proud of everyone's performance.`,
      author: 'Event Manager',
      likes: (parseInt(clubId) || 1) * 4 + 8,
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      club_id: clubId
    }
  ]

  return mockNews
}
