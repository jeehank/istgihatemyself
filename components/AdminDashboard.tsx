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
  X,
  Bell,
  UserPlus,
  Check,
  Clock,
  Mail,
  Phone,
  GraduationCap,
  Star,
  StarOff
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
  featured?: boolean
}

interface ClubRegistration {
  id: string
  name: string
  email: string
  class: string
  section: string
  roll_no: string
  phone?: string
  club_id: string
  club_name: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [clubName, setClubName] = useState('')
  const [clubId, setClubId] = useState('')
  const [news, setNews] = useState<NewsItem[]>([])
  const [registrations, setRegistrations] = useState<ClubRegistration[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    featured: false
  })
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    checkAuth()
  }, [])

  useEffect(() => {
    if (isAuthenticated && clubId) {
      fetchClubNews()
      fetchClubRegistrations()
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
        // For demo purposes, use mock data if database is not available
        setNews(generateMockNewsForClub(clubId, clubName))
      } else {
        setNews(data || [])
      }
    } catch (error) {
      console.error('Database connection error:', error)
      // Fallback to mock data for development
      setNews(generateMockNewsForClub(clubId, clubName))
    }
  }

  const fetchClubRegistrations = async () => {
    try {
      let query = supabase.from('club_registrations').select('*').order('created_at', { ascending: false })

      // If it's a specific club, filter by club_id
      if (clubId !== 'admin') {
        query = query.eq('club_id', clubId)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching registrations:', error)
        // For demo purposes, use mock data if database is not available
        setRegistrations(generateMockRegistrations(clubId, clubName))
      } else {
        setRegistrations(data || [])
      }
    } catch (error) {
      console.error('Database connection error:', error)
      // Fallback to mock data for development
      setRegistrations(generateMockRegistrations(clubId, clubName))
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/admin/login')
  }

  const handleRegistrationAction = async (registrationId: string, action: 'approved' | 'rejected') => {
    try {
      // Get the registration details first
      const registration = registrations.find(reg => reg.id === registrationId)
      if (!registration) return

      // Update registration status
      const { error: updateError } = await supabase
        .from('club_registrations')
        .update({ status: action })
        .eq('id', registrationId)

      if (!updateError) {
        // If approved, create member account and add to club
        if (action === 'approved') {
          try {
            // Create member account with default password (they can change it later)
            const defaultPassword = `${registration.name.toLowerCase().replace(/\s+/g, '')}${registration.roll_no}`
            const passwordHash = hashPassword(defaultPassword)

            const { data: memberData, error: memberError } = await supabase
              .from('members')
              .insert([{
                name: registration.name,
                class: registration.class,
                section: registration.section,
                roll_no: registration.roll_no,
                password_hash: passwordHash,
                email: registration.email,
                phone: registration.phone
              }])
              .select()
              .single()

            if (!memberError && memberData) {
              // Add member to club
              await supabase
                .from('club_memberships')
                .insert([{
                  member_id: memberData.id,
                  club_id: registration.club_id,
                  club_name: registration.club_name,
                  status: 'active'
                }])

              // Send welcome message to club group
              await sendWelcomeMessage(registration.club_id, registration.name, registration.club_name)
            }
          } catch (memberError) {
            console.error('Error creating member account:', memberError)
          }
        }

        setRegistrations(prev =>
          prev.map(reg =>
            reg.id === registrationId ? { ...reg, status: action } : reg
          )
        )
      }
    } catch (error) {
      console.error('Error updating registration:', error)
      // For demo purposes, update locally
      setRegistrations(prev =>
        prev.map(reg =>
          reg.id === registrationId ? { ...reg, status: action } : reg
        )
      )
    }
  }

  const sendWelcomeMessage = async (clubId: string, memberName: string, clubName: string) => {
    try {
      // Get the club group
      const { data: groupData } = await supabase
        .from('club_groups')
        .select('id')
        .eq('club_id', clubId)
        .single()

      if (groupData) {
        // Send welcome message
        await supabase
          .from('group_messages')
          .insert([{
            group_id: groupData.id,
            sender_name: 'System',
            sender_type: 'system',
            message_text: `🎉 Welcome ${memberName} to ${clubName}! We're excited to have you as a new member.`,
            message_type: 'system'
          }])
      }
    } catch (error) {
      console.error('Error sending welcome message:', error)
    }
  }

  const sendNewsUpdateToGroup = async (newsItem: NewsItem, clubName: string) => {
    try {
      // Get the club group
      const { data: groupData } = await supabase
        .from('club_groups')
        .select('id')
        .eq('club_id', newsItem.club_id)
        .single()

      if (groupData) {
        // Create a formatted news message
        const newsMessage = `📰 **NEW UPDATE**\n\n**${newsItem.title}**\n\n${newsItem.content}\n\n- ${newsItem.author}`

        // Send news update to group chat
        await supabase
          .from('group_messages')
          .insert([{
            group_id: groupData.id,
            sender_name: `${clubName} Admin`,
            sender_type: 'admin',
            message_text: newsMessage,
            message_type: 'news_update',
            metadata: {
              news_id: newsItem.id,
              news_title: newsItem.title
            }
          }])
      }
    } catch (error) {
      console.error('Error sending news update to group:', error)
    }
  }

  const sendNewsEditNotification = async (newsItem: NewsItem, clubName: string) => {
    try {
      // Get the club group
      const { data: groupData } = await supabase
        .from('club_groups')
        .select('id')
        .eq('club_id', newsItem.club_id)
        .single()

      if (groupData) {
        // Create a formatted edit notification message
        const editMessage = `✏️ **UPDATE EDITED**\n\n**${newsItem.title}**\n\n${newsItem.content}\n\n- ${newsItem.author}`

        // Send edit notification to group chat
        await supabase
          .from('group_messages')
          .insert([{
            group_id: groupData.id,
            sender_name: `${clubName} Admin`,
            sender_type: 'admin',
            message_text: editMessage,
            message_type: 'announcement',
            metadata: {
              news_id: newsItem.id,
              news_title: newsItem.title,
              action: 'edited'
            }
          }])
      }
    } catch (error) {
      console.error('Error sending news edit notification to group:', error)
    }
  }

  // Simple hash function (same as in memberAuth.ts)
  const hashPassword = (password: string): string => {
    let hash = 0
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    return Math.abs(hash).toString(36)
  }

  const handleCreateNews = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const newsItem = {
        title: formData.title,
        content: formData.content,
        author: formData.author,
        club_id: clubId,
        likes: 0,
        featured: formData.featured
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

        // Auto-send news update to club group chat
        await sendNewsUpdateToGroup(data[0], clubName)
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
        created_at: new Date().toISOString(),
        featured: formData.featured
      }
      setNews(prev => [mockNewsItem, ...prev])

      // Send news update even for mock data
      await sendNewsUpdateToGroup(mockNewsItem, clubName)
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
          author: formData.author,
          featured: formData.featured
        })
        .eq('id', editingNews.id)

      if (!error) {
        const updatedNews = { ...editingNews, title: formData.title, content: formData.content, author: formData.author, featured: formData.featured }
        setNews(prev => prev.map(item =>
          item.id === editingNews.id ? updatedNews : item
        ))

        // Send update notification to group chat
        await sendNewsEditNotification(updatedNews, clubName)
      }

      resetForm()
    } catch (error) {
      console.error('Error updating news:', error)
      // For demo purposes, update locally
      const updatedNews = { ...editingNews, title: formData.title, content: formData.content, author: formData.author, featured: formData.featured }
      setNews(prev => prev.map(item =>
        item.id === editingNews.id ? updatedNews : item
      ))

      // Send update notification even for demo
      await sendNewsEditNotification(updatedNews, clubName)
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
      author: newsItem.author,
      featured: newsItem.featured || false
    })
    setShowCreateForm(true)
  }

  const resetForm = () => {
    setFormData({ title: '', content: '', author: '', featured: false })
    setShowCreateForm(false)
    setEditingNews(null)
  }

  const toggleFeatured = async (newsId: string, currentFeatured: boolean) => {
    try {
      const { error } = await supabase
        .from('news')
        .update({ featured: !currentFeatured })
        .eq('id', newsId)

      if (!error) {
        setNews(prev => prev.map(item =>
          item.id === newsId ? { ...item, featured: !currentFeatured } : item
        ))
      }
    } catch (error) {
      console.error('Error toggling featured status:', error)
      // For demo purposes, update locally
      setNews(prev => prev.map(item =>
        item.id === newsId ? { ...item, featured: !currentFeatured } : item
      ))
    }
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 md:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h1 className="font-inter text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                Admin Dashboard
              </h1>
              <p className="font-calibri text-gray-600 dark:text-gray-300">
                Welcome back, {clubName}
              </p>
            </div>
            <div className="flex items-center space-x-2 md:space-x-4">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative flex items-center space-x-2 px-3 md:px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-xl transition-colors duration-300"
              >
                <Bell className="w-4 h-4" />
                <span className="font-calibri hidden sm:inline">Notifications</span>
                {registrations.filter(r => r.status === 'pending').length > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {registrations.filter(r => r.status === 'pending').length}
                  </span>
                )}
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 md:px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl transition-colors duration-300"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-calibri hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 md:px-8 py-6 md:py-8">
        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-calibri text-gray-600 dark:text-gray-400">Total News</p>
                <p className="font-inter text-3xl font-bold text-gray-900 dark:text-white">{news.length}</p>
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
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-calibri text-gray-600 dark:text-gray-400">Total Likes</p>
                <p className="font-inter text-3xl font-bold text-gray-900 dark:text-white">
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
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-calibri text-gray-600 dark:text-gray-400">Featured News</p>
                <p className="font-inter text-3xl font-bold text-gray-900 dark:text-white">
                  {news.filter(item => item.featured).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-calibri text-gray-600 dark:text-gray-400">Club</p>
                <p className="font-inter text-lg font-bold text-gray-900 dark:text-white">{clubName}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-calibri text-gray-600 dark:text-gray-400">Pending Requests</p>
                <p className="font-inter text-3xl font-bold text-gray-900 dark:text-white">
                  {registrations.filter(r => r.status === 'pending').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Bell className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Notifications Panel */}
        <AnimatePresence>
          {showNotifications && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-inter text-xl font-bold text-gray-900 dark:text-white flex items-center">
                  <Bell className="w-6 h-6 mr-3 text-blue-600" />
                  Club Join Requests
                </h2>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-300"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {registrations.filter(r => r.status === 'pending').length === 0 ? (
                <div className="text-center py-8">
                  <UserPlus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-inter text-lg font-bold text-gray-900 mb-2">
                    No Pending Requests
                  </h3>
                  <p className="font-calibri text-gray-600">
                    All club join requests have been processed.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {registrations.filter(r => r.status === 'pending').map((registration) => (
                    <motion.div
                      key={registration.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border border-gray-200 rounded-xl p-6 hover:bg-gray-50 transition-colors duration-300"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <User className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h3 className="font-inter text-lg font-bold text-gray-900">
                                {registration.name}
                              </h3>
                              <p className="font-calibri text-gray-600 text-sm">
                                Class {registration.class}{registration.section} • Roll #{registration.roll_no}
                              </p>
                            </div>
                          </div>

                          <div className="grid sm:grid-cols-2 gap-4 mb-4">
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Mail className="w-4 h-4 flex-shrink-0" />
                              <span className="truncate">{registration.email}</span>
                            </div>
                            {registration.phone && (
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <Phone className="w-4 h-4 flex-shrink-0" />
                                <span>{registration.phone}</span>
                              </div>
                            )}
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <GraduationCap className="w-4 h-4 flex-shrink-0" />
                              <span>Class {registration.class}{registration.section}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Clock className="w-4 h-4 flex-shrink-0" />
                              <span>{new Date(registration.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 lg:ml-4 lg:flex-shrink-0">
                          <button
                            onClick={() => handleRegistrationAction(registration.id, 'approved')}
                            className="flex items-center justify-center space-x-2 bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-lg transition-colors duration-300"
                          >
                            <Check className="w-4 h-4" />
                            <span className="font-calibri">Approve</span>
                          </button>
                          <button
                            onClick={() => handleRegistrationAction(registration.id, 'rejected')}
                            className="flex items-center justify-center space-x-2 bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg transition-colors duration-300"
                          >
                            <X className="w-4 h-4" />
                            <span className="font-calibri">Reject</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-inter text-xl font-bold text-gray-900 dark:text-white">
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
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-inter text-xl font-bold text-gray-900 dark:text-white">
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
                  <label className="block font-calibri text-gray-700 dark:text-gray-300 mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-calibri"
                    placeholder="Enter news title"
                  />
                </div>

                <div>
                  <label className="block font-calibri text-gray-700 dark:text-gray-300 mb-2">Author</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-calibri"
                    placeholder="Enter author name"
                  />
                </div>

                <div>
                  <label className="block font-calibri text-gray-700 dark:text-gray-300 mb-2">Content</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-calibri resize-none"
                    placeholder="Enter news content"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <label htmlFor="featured" className="font-calibri text-gray-700 dark:text-gray-300 flex items-center cursor-pointer">
                    <Star className="w-4 h-4 mr-1 text-yellow-500" />
                    Mark as Featured
                  </label>
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
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
              <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="font-inter text-xl font-bold text-gray-900 dark:text-white mb-2">
                No News Yet
              </h3>
              <p className="font-calibri text-gray-600 dark:text-gray-400">
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
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-inter text-xl font-bold text-gray-900 dark:text-white">
                        {item.title}
                      </h3>
                      {item.featured && (
                        <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                          <Star className="w-3 h-3" />
                          <span>Featured</span>
                        </div>
                      )}
                    </div>
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
                      onClick={() => toggleFeatured(item.id, item.featured || false)}
                      className={`p-2 rounded-lg transition-colors duration-300 ${
                        item.featured
                          ? 'bg-yellow-100 hover:bg-yellow-200 text-yellow-600'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                      }`}
                      title={item.featured ? 'Remove from featured' : 'Mark as featured'}
                    >
                      {item.featured ? <Star className="w-4 h-4" /> : <StarOff className="w-4 h-4" />}
                    </button>
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
                <p className="font-calibri text-gray-700 dark:text-gray-300 leading-relaxed">
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
      club_id: clubId,
      featured: true
    },
    {
      id: `${clubId}-admin-2`,
      title: 'Upcoming Event Announcement',
      content: `We're excited to announce our upcoming event! Mark your calendars and stay tuned for more details. This is going to be our biggest event yet.`,
      author: 'Event Team',
      likes: (parseInt(clubId) || 1) + 2,
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      club_id: clubId,
      featured: false
    }
  ]
}

// Mock registration data generator for demo purposes
function generateMockRegistrations(clubId: string, clubName: string): ClubRegistration[] {
  if (clubId === 'admin') {
    // For admin accounts, show registrations from all clubs
    return [
      {
        id: 'reg-1',
        name: 'Arjun Kumar',
        email: 'arjun.kumar@student.sxc.edu',
        class: '11',
        section: 'A',
        roll_no: '15',
        phone: '+91 98765 43210',
        club_id: '1',
        club_name: 'X Code',
        status: 'pending',
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'reg-2',
        name: 'Priya Sharma',
        email: 'priya.sharma@student.sxc.edu',
        class: '10',
        section: 'B',
        roll_no: '22',
        club_id: '2',
        club_name: 'X Commercia',
        status: 'pending',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  } else {
    // For specific clubs, show only their registrations
    return [
      {
        id: `reg-${clubId}-1`,
        name: 'Rahul Verma',
        email: 'rahul.verma@student.sxc.edu',
        class: '11',
        section: 'A',
        roll_no: '08',
        phone: '+91 87654 32109',
        club_id: clubId,
        club_name: clubName,
        status: 'pending',
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: `reg-${clubId}-2`,
        name: 'Sneha Patel',
        email: 'sneha.patel@student.sxc.edu',
        class: '10',
        section: 'C',
        roll_no: '31',
        club_id: clubId,
        club_name: clubName,
        status: 'approved',
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  }
}
