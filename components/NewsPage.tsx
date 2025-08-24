'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Heart, Calendar, User, MessageCircle, Filter, Search, ArrowLeft, Clock, Tag, TrendingUp } from 'lucide-react'
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
  type?: 'featured' | 'regular' | 'announcement'
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedClub, setSelectedClub] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('date')
  const [searchTerm, setSearchTerm] = useState('')
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchAllNews()
  }, [])

  useEffect(() => {
    filterAndSortNews()
  }, [news, selectedClub, selectedType, sortBy, searchTerm])

  const fetchAllNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching news:', error)
        // Use mock data if database is not available
        setNews(generateMockNewsForAllClubs())
      } else {
        setNews(data || [])
      }
    } catch (error) {
      console.error('Database connection error:', error)
      // Fallback to mock data for development
      setNews(generateMockNewsForAllClubs())
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortNews = () => {
    let filtered = news

    // Filter by club
    if (selectedClub !== 'all') {
      filtered = filtered.filter(item => item.club_id === selectedClub)
    }

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(item => (item.type || 'regular') === selectedType)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.author.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Sort news
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case 'likes':
          return b.likes - a.likes
        case 'club':
          const clubA = getClubName(a.club_id)
          const clubB = getClubName(b.club_id)
          return clubA.localeCompare(clubB)
        default:
          return 0
      }
    })

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

  const getTypeIcon = (type?: string) => {
    switch (type) {
      case 'featured':
        return <TrendingUp className="w-4 h-4" />
      case 'announcement':
        return <MessageCircle className="w-4 h-4" />
      default:
        return <Calendar className="w-4 h-4" />
    }
  }

  const getTypeColor = (type?: string) => {
    switch (type) {
      case 'featured':
        return 'bg-red-100 text-red-700 border-red-200'
      case 'announcement':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
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

  const featuredNews = filteredNews.filter(item => item.type === 'featured')
  const regularNews = filteredNews.filter(item => item.type !== 'featured')

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Newspaper Header */}
      <section className="bg-white border-b-4 border-gray-900 py-8">
        <div className="container mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex items-center justify-center mb-4">
              <Link
                href="/"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-300 mr-8"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                <span className="font-calibri">Back to Home</span>
              </Link>
              <div className="h-px bg-gray-300 flex-1"></div>
              <div className="px-4">
                <Clock className="w-5 h-5 text-gray-600" />
              </div>
              <div className="h-px bg-gray-300 flex-1"></div>
            </div>
            
            <h1 className="font-serif text-6xl md:text-8xl font-bold text-gray-900 mb-2">
              THE X-CLUBS
            </h1>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
              <span>ST.XAVIER'S COLLEGIATE SCHOOL</span>
              <span>•</span>
              <span>{new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
            <div className="mt-4 text-lg font-bold text-gray-800">
              "All the news that's fit to print from our clubs"
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filter Controls */}
      <section className="py-6 bg-white border-b">
        <div className="container mx-auto px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
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
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-none font-serif focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </motion.div>

            {/* Filters */}
            <div className="flex gap-4">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <select
                  value={selectedClub}
                  onChange={(e) => setSelectedClub(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-none font-serif bg-white focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                >
                  <option value="all">All Clubs</option>
                  {clubs.map((club) => (
                    <option key={club.id} value={club.id}>
                      {club.name}
                    </option>
                  ))}
                </select>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-none font-serif bg-white focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  <option value="featured">Featured</option>
                  <option value="regular">Regular</option>
                  <option value="announcement">Announcements</option>
                </select>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-none font-serif bg-white focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                >
                  <option value="date">Sort by Date</option>
                  <option value="likes">Sort by Likes</option>
                  <option value="club">Sort by Club</option>
                </select>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* News Content */}
      <section className="py-8">
        <div className="container mx-auto px-8">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white border border-gray-300 p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 w-1/2 mb-4"></div>
                  <div className="h-20 bg-gray-200 mb-4"></div>
                  <div className="h-4 bg-gray-200 w-1/3"></div>
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
              <div className="w-20 h-20 bg-gray-100 border border-gray-300 flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-gray-900 mb-4">
                No Articles Found
              </h3>
              <p className="font-serif text-gray-600 max-w-md mx-auto">
                {searchTerm || selectedClub !== 'all' || selectedType !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No articles have been published yet. Check back later!'}
              </p>
            </motion.div>
          ) : (
            <div className="space-y-12">
              {/* Featured News Section */}
              {featuredNews.length > 0 && (
                <div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="border-b-2 border-gray-900 pb-2 mb-8"
                  >
                    <h2 className="font-serif text-3xl font-bold text-gray-900">FEATURED STORIES</h2>
                  </motion.div>
                  
                  <div className="grid md:grid-cols-2 gap-8 mb-12">
                    {featuredNews.slice(0, 2).map((item, index) => (
                      <motion.article
                        key={item.id}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className="bg-white border-2 border-gray-900 p-8 hover:shadow-lg transition-all duration-300"
                      >
                        {/* Article Header */}
                        <div className="flex items-center justify-between mb-4">
                          <div className={`inline-flex items-center space-x-2 px-3 py-1 text-xs font-bold border ${getTypeColor(item.type)}`}>
                            {getTypeIcon(item.type)}
                            <span>{item.type?.toUpperCase() || 'REGULAR'}</span>
                          </div>
                          <div className={`px-3 py-1 text-xs font-bold text-white ${getClubColor(item.club_id)}`}>
                            {getClubName(item.club_id)}
                          </div>
                        </div>

                        {/* Content */}
                        <h3 className="font-serif text-2xl font-bold text-gray-900 mb-4 leading-tight">
                          {item.title}
                        </h3>
                        <p className="font-serif text-gray-700 leading-relaxed mb-6 text-lg">
                          {item.content}
                        </p>

                        {/* Author & Date */}
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4" />
                            <span className="font-bold">By {item.author}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(item.created_at)}</span>
                          </div>
                        </div>

                        {/* Like Button */}
                        <button
                          onClick={() => handleLike(item.id)}
                          disabled={likedPosts.has(item.id)}
                          className={`flex items-center space-x-2 px-4 py-2 border transition-all duration-300 ${
                            likedPosts.has(item.id)
                              ? 'border-red-600 bg-red-50 text-red-600 cursor-not-allowed'
                              : 'border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${likedPosts.has(item.id) ? 'fill-current' : ''}`} />
                          <span className="font-serif font-bold">{item.likes}</span>
                        </button>
                      </motion.article>
                    ))}
                  </div>
                </div>
              )}

              {/* Regular News Section */}
              {regularNews.length > 0 && (
                <div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="border-b-2 border-gray-900 pb-2 mb-8"
                  >
                    <h2 className="font-serif text-2xl font-bold text-gray-900">LATEST NEWS</h2>
                  </motion.div>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {regularNews.map((item, index) => (
                      <motion.article
                        key={item.id}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.05 }}
                        className="bg-white border border-gray-300 p-6 hover:shadow-md transition-all duration-300"
                      >
                        {/* Article Header */}
                        <div className="flex items-center justify-between mb-3">
                          <div className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-bold border ${getTypeColor(item.type)}`}>
                            {getTypeIcon(item.type)}
                            <span>{item.type?.toUpperCase() || 'REGULAR'}</span>
                          </div>
                          <div className={`px-2 py-1 text-xs font-bold text-white ${getClubColor(item.club_id)}`}>
                            {getClubName(item.club_id)}
                          </div>
                        </div>

                        {/* Content */}
                        <h3 className="font-serif text-lg font-bold text-gray-900 mb-3 leading-tight line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="font-serif text-gray-700 leading-relaxed mb-4 text-sm line-clamp-3">
                          {item.content}
                        </p>

                        {/* Author & Date */}
                        <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
                          <div className="flex items-center space-x-1">
                            <User className="w-3 h-3" />
                            <span className="font-bold">{item.author}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(item.created_at)}</span>
                          </div>
                        </div>

                        {/* Like Button */}
                        <button
                          onClick={() => handleLike(item.id)}
                          disabled={likedPosts.has(item.id)}
                          className={`flex items-center space-x-2 px-3 py-1 border text-xs transition-all duration-300 ${
                            likedPosts.has(item.id)
                              ? 'border-red-600 bg-red-50 text-red-600 cursor-not-allowed'
                              : 'border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white'
                          }`}
                        >
                          <Heart className={`w-3 h-3 ${likedPosts.has(item.id) ? 'fill-current' : ''}`} />
                          <span className="font-serif font-bold">{item.likes}</span>
                        </button>
                      </motion.article>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}

// Enhanced mock data generator with different news types
function generateMockNewsForAllClubs(): NewsItem[] {
  const mockNews: NewsItem[] = []
  
  clubs.forEach((club, clubIndex) => {
    const newsItems = [
      {
        id: `${club.id}-featured-1`,
        title: `${club.name} Wins Major Inter-School Competition`,
        content: `In a spectacular display of talent and dedication, ${club.name} has emerged victorious in the prestigious inter-school competition held last weekend. Our team showcased exceptional skills and teamwork, bringing glory to St.Xavier's Collegiate School. This victory is a testament to the hard work and commitment of our members.`,
        author: 'Club President',
        likes: (parseInt(club.id) * 5) + 15,
        created_at: new Date(Date.now() - (clubIndex + 1) * 24 * 60 * 60 * 1000).toISOString(),
        club_id: club.id,
        type: clubIndex === 0 || clubIndex === 2 ? 'featured' : 'regular'
      },
      {
        id: `${club.id}-news-2`,
        title: `Upcoming Workshop Series by ${club.name}`,
        content: `${club.name} is excited to announce a series of workshops designed to enhance skills and knowledge in our field. These sessions will be conducted by industry experts and will provide hands-on experience to all participants.`,
        author: 'Event Coordinator',
        likes: (parseInt(club.id) * 2) + 3,
        created_at: new Date(Date.now() - (clubIndex + 3) * 24 * 60 * 60 * 1000).toISOString(),
        club_id: club.id,
        type: 'regular'
      },
      {
        id: `${club.id}-announcement-1`,
        title: `Important Notice: ${club.name} Meeting Schedule`,
        content: `Please note that our regular meeting schedule has been updated. All members are requested to check the new timings and mark their calendars accordingly. Attendance is mandatory for all active members.`,
        author: 'Secretary',
        likes: (parseInt(club.id)) + 1,
        created_at: new Date(Date.now() - (clubIndex + 5) * 24 * 60 * 60 * 1000).toISOString(),
        club_id: club.id,
        type: 'announcement'
      }
    ]
    
    mockNews.push(...newsItems)
  })

  return mockNews.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}
