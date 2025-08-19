'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Edit3, 
  Trash2, 
  LogOut, 
  User, 
  Calendar, 
  Heart,
  MessageCircle,
  Eye,
  Save,
  X
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { getAuthData, logout, getClubName } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { clubs } from '@/data/clubs'
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

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [clubName, setClubName] = useState('')
  const [clubId, setClubId] = useState('')
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: ''
  })
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    checkAuth()
  }, [])

  useEffect(() => {
    if (isAuthenticated && clubId) {
      fetchClubNews()
    }
  }, [isAuthenticated, clubId])

  const checkAuth = () => {
    const authData = getAuthData()
    if (!authData) {
      router.push('/admin/login')
      return
    }

    setIsAuthenticated(true)
    setClubName(authData.clubName)
    
    // Find club ID
    const club = clubs.find(c => c.name === authData.clubName)
    if (club) {
      setClubId(club.id)
    } else {
      // For admin accounts that don't match club names
      setClubId('admin')
    }
    setLoading(false)
  }

  const fetchClubNews = async () => {
    try {
      let query = supabase.from('news').select('*').order('created_at', { ascending: false })
      
      // If it's a specific club, filter by club_id
      if (clubId !== 'admin') {
        query = query.eq('club_id', clubId)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching news:', error)
        // For demo purposes, use mock data
        setNews(generateMockNewsForClub(clubId, clubName))
      } else {
        setNews(data || [])
      }
    } catch (error) {
      console.error('Error:', error)
      setNews(generateMockNewsForClub(clubId, clubName))
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/admin/login')
  }

  const handleCreateNews = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const newsItem = {
        title: formData.title,
        content: formData.content,
        author: formData.author,
        club_id: clubId,
        likes: 0
      }

      const { data, error } = await supabase
        .from('news')
        .insert([newsItem])
        .select()

      if (error) {
        throw error
      }

      if (data && data[0]) {
        setNews(prev => [data[0], ...prev])
      }
      
      resetForm()
    } catch (error) {
      console.error('Error creating news:', error)
      // For demo purposes, create mock news item
      const mockNewsItem: NewsItem = {
        id: `mock-${Date.now()}`,
        title: formData.title,
        content: formData.content,
        author: formData.author,
        club_id: clubId,
        likes: 0,
        created_at: new Date().toISOString()
      }
      setNews(prev => [mockNewsItem, ...prev])
      resetForm()
    }
  }

  const handleUpdateNews = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingNews) return

    try {
      const { error } = await supabase
        .from('news')
        .update({
          title: formData.title,
          content: formData.content,
          author: formData.author
        })
        .eq('id', editingNews.id)

      if (!error) {
        setNews(prev => prev.map(item => 
          item.id === editingNews.id 
            ? { ...item, title: formData.title, content: formData.content, author: formData.author }
            : item
        ))
      }
      
      resetForm()
    } catch (error) {
      console.error('Error updating news:', error)
      // For demo purposes, update locally
      setNews(prev => prev.map(item => 
        item.id === editingNews.id 
          ? { ...item, title: formData.title, content: formData.content, author: formData.author }
          : item
      ))
      resetForm()
    }
  }

  const handleDeleteNews = async (newsId: string) => {
    if (!confirm('Are you sure you want to delete this news item?')) return

    try {
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', newsId)

      if (!error) {
        setNews(prev => prev.filter(item => item.id !== newsId))
      }
    } catch (error) {
      console.error('Error deleting news:', error)
      // For demo purposes, delete locally
      setNews(prev => prev.filter(item => item.id !== newsId))
    }
  }

  const startEdit = (newsItem: NewsItem) => {
    setEditingNews(newsItem)
    setFormData({
      title: newsItem.title,
      content: newsItem.content,
      author: newsItem.author
    })
    setShowCreateForm(true)
  }

  const resetForm = () => {
    setFormData({ title: '', content: '', author: '' })
    setShowCreateForm(false)
    setEditingNews(null)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-inter text-2xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="font-calibri text-gray-600">
                Welcome back, {clubName}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl transition-colors duration-300"
            >
              <LogOut className="w-4 h-4" />
              <span className="font-calibri">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-8 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-calibri text-gray-600">Total News</p>
                <p className="font-inter text-3xl font-bold text-gray-900">{news.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-calibri text-gray-600">Total Likes</p>
                <p className="font-inter text-3xl font-bold text-gray-900">
                  {news.reduce((sum, item) => sum + item.likes, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-calibri text-gray-600">Club</p>
                <p className="font-inter text-lg font-bold text-gray-900">{clubName}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-inter text-xl font-bold text-gray-900">
            Manage News
          </h2>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-colors duration-300"
          >
            <Plus className="w-5 h-5" />
            <span className="font-calibri">Create News</span>
          </button>
        </div>

        {/* Create/Edit Form */}
        <AnimatePresence>
          {showCreateForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-8 mb-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-inter text-xl font-bold text-gray-900">
                  {editingNews ? 'Edit News' : 'Create New News'}
                </h3>
                <button
                  onClick={resetForm}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-300"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={editingNews ? handleUpdateNews : handleCreateNews} className="space-y-6">
                <div>
                  <label className="block font-calibri text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-calibri"
                    placeholder="Enter news title"
                  />
                </div>

                <div>
                  <label className="block font-calibri text-gray-700 mb-2">Author</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-calibri"
                    placeholder="Enter author name"
                  />
                </div>

                <div>
                  <label className="block font-calibri text-gray-700 mb-2">Content</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-calibri resize-none"
                    placeholder="Enter news content"
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-colors duration-300"
                  >
                    <Save className="w-4 h-4" />
                    <span className="font-calibri">
                      {editingNews ? 'Update' : 'Create'}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex items-center space-x-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-xl transition-colors duration-300"
                  >
                    <X className="w-4 h-4" />
                    <span className="font-calibri">Cancel</span>
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* News List */}
        <div className="grid gap-6">
          {news.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="font-inter text-xl font-bold text-gray-900 mb-2">
                No News Yet
              </h3>
              <p className="font-calibri text-gray-600">
                Create your first news item to get started.
              </p>
            </div>
          ) : (
            news.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-inter text-xl font-bold text-gray-900 mb-2">
                      {item.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {item.author}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(item.created_at)}
                      </div>
                      <div className="flex items-center">
                        <Heart className="w-4 h-4 mr-1" />
                        {item.likes} likes
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => startEdit(item)}
                      className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-colors duration-300"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteNews(item.id)}
                      className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors duration-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="font-calibri text-gray-700 leading-relaxed">
                  {item.content}
                </p>
              </motion.div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}

// Mock data generator for demo purposes
function generateMockNewsForClub(clubId: string, clubName: string): NewsItem[] {
  return [
    {
      id: `${clubId}-admin-1`,
      title: `${clubName} Monthly Update`,
      content: `This month has been exciting for ${clubName}! We've organized several successful events and welcomed new members to our community.`,
      author: 'Admin',
      likes: (parseInt(clubId) || 1) * 2 + 5,
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      club_id: clubId
    },
    {
      id: `${clubId}-admin-2`,
      title: 'Upcoming Event Announcement',
      content: `We're excited to announce our upcoming event! Mark your calendars and stay tuned for more details. This is going to be our biggest event yet.`,
      author: 'Event Team',
      likes: (parseInt(clubId) || 1) + 2,
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      club_id: clubId
    }
  ]
}
