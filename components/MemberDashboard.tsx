'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LogOut, 
  User, 
  MessageCircle, 
  Send, 
  Users, 
  Bell,
  Calendar,
  Book,
  Home
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { getMemberAuthData, memberLogout, getMemberClubs } from '@/lib/memberAuth'
import { supabase } from '@/lib/supabase'
import Navbar from './Navbar'

interface MemberAuthData {
  id: string
  name: string
  class: string
  section: string
  rollNo: string
  isAuthenticated: boolean
  loginTime: number
}

interface ClubMembership {
  id: string
  member_id: string
  club_id: string
  club_name: string
  status: string
  joined_at: string
}

interface GroupMessage {
  id: string
  group_id: string
  sender_id: string | null
  sender_name: string
  sender_type: 'member' | 'admin' | 'system'
  message_text: string
  message_type: 'text' | 'news_update' | 'announcement' | 'system'
  metadata: any
  created_at: string
}

interface ClubGroup {
  id: string
  club_id: string
  club_name: string
  description: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export default function MemberDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [memberData, setMemberData] = useState<MemberAuthData | null>(null)
  const [clubs, setClubs] = useState<ClubMembership[]>([])
  const [selectedClub, setSelectedClub] = useState<ClubMembership | null>(null)
  const [messages, setMessages] = useState<GroupMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    checkAuth()
  }, [])

  useEffect(() => {
    if (isAuthenticated && memberData) {
      fetchMemberClubs()
    }
  }, [isAuthenticated, memberData])

  useEffect(() => {
    if (selectedClub) {
      fetchGroupMessages()
    }
  }, [selectedClub])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const checkAuth = () => {
    const authData = getMemberAuthData()
    if (!authData) {
      router.push('/member/login')
      return
    }

    setIsAuthenticated(true)
    setMemberData(authData)
    setLoading(false)
  }

  const fetchMemberClubs = async () => {
    try {
      const memberClubs = await getMemberClubs(memberData!.id)
      setClubs(memberClubs)
      if (memberClubs.length > 0) {
        setSelectedClub(memberClubs[0])
      }
    } catch (error) {
      console.error('Error fetching member clubs:', error)
      // For demo purposes, create mock data
      const mockClubs: ClubMembership[] = [
        {
          id: 'mock-1',
          member_id: memberData!.id,
          club_id: '1',
          club_name: 'X Code',
          status: 'active',
          joined_at: new Date().toISOString()
        }
      ]
      setClubs(mockClubs)
      setSelectedClub(mockClubs[0])
    }
  }

  const fetchGroupMessages = async () => {
    try {
      // Get group for selected club
      const { data: groupData, error: groupError } = await supabase
        .from('club_groups')
        .select('id')
        .eq('club_id', selectedClub!.club_id)
        .single()

      if (groupError || !groupData) {
        console.error('Error fetching group:', groupError)
        setMessages(generateMockMessages())
        return
      }

      // Fetch messages for the group
      const { data: messagesData, error: messagesError } = await supabase
        .from('group_messages')
        .select('*')
        .eq('group_id', groupData.id)
        .order('created_at', { ascending: true })
        .limit(50)

      if (messagesError) {
        console.error('Error fetching messages:', messagesError)
        setMessages(generateMockMessages())
      } else {
        setMessages(messagesData || [])
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages(generateMockMessages())
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedClub || !memberData) return

    try {
      // Get group for selected club
      const { data: groupData, error: groupError } = await supabase
        .from('club_groups')
        .select('id')
        .eq('club_id', selectedClub.club_id)
        .single()

      if (groupError || !groupData) {
        console.error('Error finding group:', groupError)
        return
      }

      const messageData = {
        group_id: groupData.id,
        sender_id: memberData.id,
        sender_name: memberData.name,
        sender_type: 'member' as const,
        message_text: newMessage.trim(),
        message_type: 'text' as const
      }

      const { data, error } = await supabase
        .from('group_messages')
        .insert([messageData])
        .select()
        .single()

      if (!error && data) {
        setMessages(prev => [...prev, data])
        setNewMessage('')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      // For demo purposes, add message locally
      const mockMessage: GroupMessage = {
        id: `mock-${Date.now()}`,
        group_id: 'mock-group',
        sender_id: memberData.id,
        sender_name: memberData.name,
        sender_type: 'member',
        message_text: newMessage.trim(),
        message_type: 'text',
        metadata: {},
        created_at: new Date().toISOString()
      }
      setMessages(prev => [...prev, mockMessage])
      setNewMessage('')
    }
  }

  const handleLogout = () => {
    memberLogout()
    router.push('/member/login')
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const generateMockMessages = (): GroupMessage[] => {
    return [
      {
        id: 'mock-1',
        group_id: 'mock-group',
        sender_id: null,
        sender_name: 'System',
        sender_type: 'system',
        message_text: `Welcome to ${selectedClub?.club_name} group chat! 🎉`,
        message_type: 'system',
        metadata: {},
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'mock-2',
        group_id: 'mock-group',
        sender_id: 'admin-1',
        sender_name: 'Club Admin',
        sender_type: 'admin',
        message_text: 'Welcome everyone! Don\'t forget about our upcoming workshop this Friday.',
        message_type: 'announcement',
        metadata: {},
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      }
    ]
  }

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  if (!isAuthenticated || !memberData) {
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
                Member Dashboard
              </h1>
              <p className="font-calibri text-gray-600 dark:text-gray-300">
                Welcome back, {memberData.name} - Class {memberData.class}{memberData.section}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/')}
                className="flex items-center space-x-2 px-3 md:px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl transition-colors duration-300"
              >
                <Home className="w-4 h-4" />
                <span className="font-calibri hidden sm:inline">Home</span>
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
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Clubs Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="font-inter text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <Users className="w-5 h-5 mr-3 text-emerald-600" />
                My Clubs
              </h2>
              <div className="space-y-3">
                {clubs.map((club) => (
                  <button
                    key={club.id}
                    onClick={() => setSelectedClub(club)}
                    className={`w-full text-left p-3 rounded-xl transition-colors duration-300 ${
                      selectedClub?.id === club.id
                        ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-700'
                        : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    <div className="font-inter font-semibold">{club.club_name}</div>
                    <div className="font-calibri text-sm opacity-75">
                      Joined {new Date(club.joined_at).toLocaleDateString()}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h3 className="font-inter text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-calibri text-gray-600 dark:text-gray-400">Active Clubs:</span>
                  <span className="font-inter font-semibold text-emerald-600">{clubs.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-calibri text-gray-600 dark:text-gray-400">Class:</span>
                  <span className="font-inter font-semibold text-gray-900 dark:text-white">
                    {memberData.class}{memberData.section}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-calibri text-gray-600 dark:text-gray-400">Roll No:</span>
                  <span className="font-inter font-semibold text-gray-900 dark:text-white">{memberData.rollNo}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg h-[600px] flex flex-col">
              {/* Chat Header */}
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-inter text-xl font-bold text-gray-900 flex items-center">
                      <MessageCircle className="w-6 h-6 mr-3 text-emerald-600" />
                      {selectedClub?.club_name || 'Select a Club'}
                    </h2>
                    {selectedClub && (
                      <p className="font-calibri text-gray-600">Group Chat</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Bell className="w-5 h-5 text-gray-400" />
                    <span className="font-calibri text-sm text-gray-600">
                      {messages.length} messages
                    </span>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${
                      message.sender_id === memberData.id ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                        message.sender_type === 'system'
                          ? 'bg-blue-100 text-blue-800 text-center mx-auto'
                          : message.sender_type === 'admin'
                          ? 'bg-purple-100 text-purple-800'
                          : message.sender_id === memberData.id
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {message.sender_type !== 'system' && message.sender_id !== memberData.id && (
                        <div className="font-calibri text-xs opacity-75 mb-1">
                          {message.sender_name}
                          {message.sender_type === 'admin' && ' (Admin)'}
                        </div>
                      )}
                      <div className="font-calibri">{message.message_text}</div>
                      <div className="font-calibri text-xs opacity-75 mt-1">
                        {formatTime(message.created_at)}
                      </div>
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              {selectedClub && (
                <div className="p-6 border-t">
                  <div className="flex items-center space-x-4">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-calibri"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                      className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-colors duration-300"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
