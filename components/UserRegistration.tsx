'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User, Mail, Hash, GraduationCap, Users, CheckCircle, AlertCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface UserRegistrationProps {
  isOpen: boolean
  onClose: () => void
  clubId: string
  clubName: string
}

interface FormData {
  name: string
  email: string
  class: string
  section: string
  rollNo: string
  phone?: string
}

export default function UserRegistration({ isOpen, onClose, clubId, clubName }: UserRegistrationProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    class: '',
    section: '',
    rollNo: '',
    phone: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Validate required fields
      if (!formData.name || !formData.email || !formData.class || !formData.section || !formData.rollNo) {
        throw new Error('Please fill in all required fields')
      }

      // Create user registration record
      const registrationData = {
        name: formData.name,
        email: formData.email,
        class: formData.class,
        section: formData.section.toUpperCase(),
        roll_no: formData.rollNo,
        phone: formData.phone || null,
        club_id: clubId,
        club_name: clubName,
        status: 'pending',
        created_at: new Date().toISOString()
      }

      const { error: dbError } = await supabase
        .from('club_registrations')
        .insert([registrationData])

      if (dbError) {
        console.error('Database error:', dbError)
        // Handle different types of database errors
        const errorMessage = dbError.message || 'Failed to submit registration. Please try again.'
        throw new Error(errorMessage)
      } else {
        setSuccess(true)
      }

      // Reset form
      setFormData({
        name: '',
        email: '',
        class: '',
        section: '',
        rollNo: '',
        phone: ''
      })

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setSuccess(false)
    setError('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          {success ? (
            // Success State
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="font-inter text-2xl font-bold text-gray-900 mb-4">
                Registration Successful!
              </h2>
              <p className="font-calibri text-gray-600 mb-6">
                Your request to join <strong>{clubName}</strong> has been submitted successfully. 
                The club administrators will review your application and get back to you soon.
              </p>
              <button
                onClick={handleClose}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 px-6 rounded-xl font-inter font-semibold transition-all duration-300"
              >
                Close
              </button>
            </div>
          ) : (
            // Form State
            <>
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <h2 className="font-inter text-xl font-bold text-gray-900">
                    Join {clubName}
                  </h2>
                  <p className="font-calibri text-gray-600 text-sm">
                    Fill in your details to request membership
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-300"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center"
                >
                  <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0" />
                  <p className="font-calibri text-red-700 text-sm">{error}</p>
                </motion.div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Name */}
                <div>
                  <label className="block font-calibri text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your full name"
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-calibri"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block font-calibri text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your email address"
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-calibri"
                    />
                  </div>
                </div>

                {/* Class and Section */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-calibri text-gray-700 mb-2">
                      Class <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <select
                        name="class"
                        value={formData.class}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-calibri bg-white appearance-none"
                      >
                        <option value="">Select Class</option>
                        <option value="6">Class 6</option>
                        <option value="7">Class 7</option>
                        <option value="8">Class 8</option>
                        <option value="9">Class 9</option>
                        <option value="10">Class 10</option>
                        <option value="11">Class 11</option>
                        <option value="12">Class 12</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-calibri text-gray-700 mb-2">
                      Section <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="section"
                        value={formData.section}
                        onChange={handleInputChange}
                        required
                        placeholder="A, B, C..."
                        maxLength={1}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-calibri uppercase"
                      />
                    </div>
                  </div>
                </div>

                {/* Roll Number */}
                <div>
                  <label className="block font-calibri text-gray-700 mb-2">
                    Roll Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="rollNo"
                      value={formData.rollNo}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your roll number"
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-calibri"
                    />
                  </div>
                </div>

                {/* Phone (Optional) */}
                <div>
                  <label className="block font-calibri text-gray-700 mb-2">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-calibri"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-6 rounded-xl font-inter font-semibold transition-colors duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-6 rounded-xl font-inter font-semibold transition-all duration-300"
                  >
                    {loading ? 'Submitting...' : 'Join Club'}
                  </button>
                </div>
              </form>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
