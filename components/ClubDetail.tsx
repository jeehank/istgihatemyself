'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Users, IndianRupee, Calendar, Trophy, Star, Crown, UserCheck, FileText } from 'lucide-react'
import Link from 'next/link'
import { Club } from '@/data/clubs'
import ClubNews from './ClubNews'
import Footer from './Footer'
import Navbar from './Navbar'
import UserRegistration from './UserRegistration'

interface ClubDetailProps {
  club: Club
}

export default function ClubDetail({ club }: ClubDetailProps) {
  const [showRegistration, setShowRegistration] = useState(false)

  const handleJoinClub = () => {
    setShowRegistration(true)
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Gradient Background */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://cdn.builder.io/api/v1/image/assets%2F9c5249cc4ac34ee58fc514520c67d898%2Fb39ddd87a276443a9925ea63b9e45c71?format=webp&width=1600')`
        }}
      />
      
      <div className="relative z-10">
        <Navbar />
        
        {/* Hero Section */}
        <section className={`relative h-96 ${club.color} overflow-hidden`}>
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className={"absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.3\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"}></div>
          </div>

          <div className="relative z-10 container mx-auto px-8 h-full flex items-center">
            <div className="text-white">
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

              {/* Club Title */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <h1 className="font-inter text-5xl md:text-7xl font-bold mb-4">
                  {club.name}
                </h1>
                <p className="font-calibri text-xl md:text-2xl text-white/90 max-w-2xl">
                  {club.description}
                </p>
              </motion.div>
            </div>
          </div>

          {/* Floating Stats */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="absolute bottom-8 right-8 bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white"
          >
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="flex items-center mb-1">
                  <IndianRupee className="w-4 h-4" />
                  <span className="font-inter text-2xl font-bold">{club.entryFee}</span>
                </div>
                <span className="font-calibri text-sm text-white/80">Entry Fee</span>
              </div>
              <div className="w-px h-8 bg-white/30"></div>
              <div className="text-center">
                <div className="flex items-center mb-1">
                  <Users className="w-4 h-4 mr-1" />
                  <span className="font-inter text-2xl font-bold">{(parseInt(club.id) * 7 + 25)}</span>
                </div>
                <span className="font-calibri text-sm text-white/80">Members</span>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Main Content */}
        <section className="py-16">
          <div className="container mx-auto px-8">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {/* About Section */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl p-8 mb-8 border border-white/20"
                >
                  <h2 className="font-inter text-3xl font-bold text-gray-900 mb-6 flex items-center">
                    <Star className="w-8 h-8 mr-3 text-yellow-500" />
                    About {club.name}
                  </h2>
                  <p className="font-calibri text-lg text-gray-700 leading-relaxed">
                    {club.about}
                  </p>
                </motion.div>

                {/* Activities Section */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl p-8 mb-8 border border-white/20"
                >
                  <h2 className="font-inter text-3xl font-bold text-gray-900 mb-6 flex items-center">
                    <Trophy className="w-8 h-8 mr-3 text-blue-500" />
                    Club Activities
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {club.activities.map((activity, index) => (
                      <motion.div
                        key={activity}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className="flex items-center p-4 bg-white/60 rounded-xl hover:bg-white/80 transition-colors duration-300 backdrop-blur-sm"
                      >
                        <div className={`w-3 h-3 rounded-full ${club.color} mr-3 flex-shrink-0`}></div>
                        <span className="font-calibri text-gray-800">{activity}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Leadership Section */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl p-8 mb-8 border border-white/20"
              >
                <h2 className="font-inter text-3xl font-bold text-gray-900 mb-6 flex items-center">
                  <Crown className="w-8 h-8 mr-3 text-amber-500" />
                  Club Leadership
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {/* President */}
                  <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl hover:bg-white/80 transition-all duration-300">
                    <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Crown className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-inter text-lg font-bold text-gray-900 mb-1">P</h3>
                    <p className="font-calibri text-gray-600 text-sm mb-2">President</p>
                    <p className="font-inter font-semibold text-gray-800">{club.leadership.president}</p>
                  </div>

                  {/* Vice President */}
                  <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl hover:bg-white/80 transition-all duration-300">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <UserCheck className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-inter text-lg font-bold text-gray-900 mb-1">VP</h3>
                    <p className="font-calibri text-gray-600 text-sm mb-2">Vice President</p>
                    <p className="font-inter font-semibold text-gray-800">{club.leadership.vicePresident}</p>
                  </div>

                  {/* Secretary */}
                  <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl hover:bg-white/80 transition-all duration-300">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-inter text-lg font-bold text-gray-900 mb-1">S</h3>
                    <p className="font-calibri text-gray-600 text-sm mb-2">Secretary</p>
                    <p className="font-inter font-semibold text-gray-800">{club.leadership.secretary}</p>
                  </div>
                </div>
              </motion.div>

              {/* Club News Section */}
              <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl border border-white/20 overflow-hidden">
                <ClubNews clubId={club.id} clubName={club.name} />
              </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                {/* Join Club Card */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl p-8 text-center border border-white/20"
                >
                  <h3 className="font-inter text-2xl font-bold text-gray-900 mb-4">
                    Ready to Join?
                  </h3>
                  <p className="font-calibri text-gray-600 mb-6">
                    Start your journey with {club.name} today and discover new opportunities.
                  </p>
                  <div className="space-y-4">
                    <div className={`inline-flex items-center px-6 py-3 ${club.color} text-white rounded-full font-inter font-semibold`}>
                      <IndianRupee className="w-5 h-5 mr-2" />
                      Entry Fee: ₹{club.entryFee}
                    </div>
                    <button
                      onClick={handleJoinClub}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-6 rounded-xl font-inter font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                    >
                      Join Now
                    </button>
                  </div>
                </motion.div>

                {/* Quick Info */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl p-8 border border-white/20"
                >
                  <h3 className="font-inter text-xl font-bold text-gray-900 mb-6">
                    Quick Info
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-calibri text-gray-600">Meeting Days:</span>
                      <span className="font-inter font-semibold text-gray-900">Fridays</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-calibri text-gray-600">Time:</span>
                      <span className="font-inter font-semibold text-gray-900">4:00 PM - 5:30 PM</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-calibri text-gray-600">Location:</span>
                      <span className="font-inter font-semibold text-gray-900">Room 201</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-calibri text-gray-600">Faculty:</span>
                      <span className="font-inter font-semibold text-gray-900">Mr. Smith</span>
                    </div>
                  </div>
                </motion.div>

                {/* Other Clubs */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl p-8 border border-white/20"
                >
                  <h3 className="font-inter text-xl font-bold text-gray-900 mb-6">
                    Explore Other Clubs
                  </h3>
                  <Link
                    href="/"
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-calibri transition-colors duration-300"
                  >
                    <span>View All Clubs</span>
                    <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>

      {/* User Registration Modal */}
      <UserRegistration
        isOpen={showRegistration}
        onClose={() => setShowRegistration(false)}
        clubId={club.id}
        clubName={club.name}
      />
    </div>
  )
}
