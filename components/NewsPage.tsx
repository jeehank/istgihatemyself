'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Heart, Calendar, User, MessageCircle, Filter, Search, ArrowLeft } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { clubs } from '@/data/clubs'
import Link from 'next/link'
import Footer from './Footer'
import Navbar from './Navbar'

interface NewsItem {
  id: string
  title: string
  content: string
  author: string
  likes: number
  created_at: string
  club_id: string
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedClub, setSelectedClub] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchAllNews()
  }, [])

  useEffect(() => {
    filterNews()
  }, [news, selectedClub, searchTerm])

  const fetchAllNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching news:', error)
        // For demo purposes, use mock data if Supabase is not connected
        setNews(generateMockNewsForAllClubs())
      } else {
        setNews(data || [])
      }
    } catch (error) {
      console.error('Error:', error)
      // Use mock data if there's an error
      setNews(generateMockNewsForAllClubs())
    } finally {
      setLoading(false)
    }
  }

  const filterNews = () => {
    let filtered = news

    if (selectedClub !== 'all') {
      filtered = filtered.filter(item => item.club_id === selectedClub)
    }

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.author.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredNews(filtered)
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

  const getClubName = (clubId: string) => {
    const club = clubs.find(c => c.id === clubId)
    return club ? club.name : 'Unknown Club'
  }

  const getClubColor = (clubId: string) => {
    const club = clubs.find(c => c.id === clubId)
    return club ? club.color : 'bg-gray-600'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 via-purple-900 to-pink-900 text-white py-20">
        <div className="container mx-auto px-8">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Link
              href="/"
              className="inline-flex items-center text-white/80 hover:text-white transition-colors duration-300"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="font-calibri">Back to Home</span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="font-inter text-5xl md:text-7xl font-bold mb-6">
              Club News
            </h1>
            <p className="font-calibri text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              Stay updated with the latest happenings, events, and achievements from all our amazing clubs
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative flex-1 max-w-md"
            >
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search news..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-calibri"
              />
            </motion.div>

            {/* Club Filter */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={selectedClub}
                onChange={(e) => setSelectedClub(e.target.value)}
                className="pl-12 pr-8 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-calibri bg-white min-w-48"
              >
                <option value="all">All Clubs</option>
                {clubs.map((club) => (
                  <option key={club.id} value={club.id}>
                    {club.name}
                  </option>
                ))}
              </select>
            </motion.div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-16">
        <div className="container mx-auto px-8">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-3xl shadow-xl p-8 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-20 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          ) : filteredNews.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="font-inter text-2xl font-bold text-gray-900 mb-4">
                No News Found
              </h3>
              <p className="font-calibri text-gray-600 max-w-md mx-auto">
                {searchTerm || selectedClub !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No news articles have been published yet. Check back later!'}
              </p>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredNews.map((item, index) => (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  {/* Club Badge */}
                  <div className={`inline-flex items-center px-4 py-2 rounded-full ${getClubColor(item.club_id)} text-white text-sm font-inter font-semibold mb-4`}>
                    {getClubName(item.club_id)}
                  </div>

                  {/* Content */}
                  <h3 className="font-inter text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="font-calibri text-gray-700 leading-relaxed mb-6 line-clamp-3">
                    {item.content}
                  </p>

                  {/* Author & Date */}
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-inter font-semibold text-gray-900 text-sm">{item.author}</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(item.created_at)}
                      </div>
                    </div>
                  </div>

                  {/* Like Button */}
                  <button
                    onClick={() => handleLike(item.id)}
                    disabled={likedPosts.has(item.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                      likedPosts.has(item.id)
                        ? 'bg-red-100 text-red-600 cursor-not-allowed'
                        : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${likedPosts.has(item.id) ? 'fill-current' : ''}`} />
                    <span className="font-calibri text-sm">{item.likes}</span>
                  </button>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}

// Mock data generator for demo purposes
function generateMockNewsForAllClubs(): NewsItem[] {
  const mockNews: NewsItem[] = []
  
  clubs.forEach((club, clubIndex) => {
    const newsItems = [
      {
        id: `${club.id}-news-1`,
        title: `${club.name} Announces New Initiatives`,
        content: `We're excited to share our new initiatives for this semester. ${club.name} is planning several workshops and events to enhance member experience.`,
        author: 'Club President',
        likes: (parseInt(club.id) * 3) + 5,
        created_at: new Date(Date.now() - (clubIndex + 1) * 24 * 60 * 60 * 1000).toISOString(),
        club_id: club.id
      },
      {
        id: `${club.id}-news-2`,
        title: 'Recent Competition Success',
        content: `Congratulations to our ${club.name} members who excelled in the recent inter-school competition. Your dedication and hard work paid off!`,
        author: 'Event Coordinator',
        likes: (parseInt(club.id) * 2) + 3,
        created_at: new Date(Date.now() - (clubIndex + 3) * 24 * 60 * 60 * 1000).toISOString(),
        club_id: club.id
      }
    ]
    
    mockNews.push(...newsItems)
  })

  // Sort by date (newest first)
  return mockNews.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}
