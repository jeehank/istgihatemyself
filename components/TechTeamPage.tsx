'use client'

import { motion } from 'framer-motion'
import { Code, Zap, Heart, Award, Github, Linkedin, Mail } from 'lucide-react'
import Navbar from './Navbar'
import Footer from './Footer'

export default function TechTeamPage() {
  const techTeam = [
    { 
      name: 'Jeehan Karanjai', 
      role: 'Tech Team',
      icon: Code,
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      name: 'Param Mehta', 
      role: 'Vice President',
      icon: Zap,
      color: 'from-purple-500 to-pink-500'
    },
    { 
      name: 'Jagrit Parakh', 
      role: 'President',
      icon: Heart,
      color: 'from-green-500 to-emerald-500'
    },
    { 
      name: 'Anchit Kejariwala', 
      role: 'Treasurer',
      icon: Award,
      color: 'from-orange-500 to-red-500'
    },
    { 
      name: 'Shaheer Shahaan', 
      role: 'Secretary',
      icon: Code,
      color: 'from-indigo-500 to-purple-500'
    },
    { 
      name: 'Keshav Agarwala', 
      role: 'Treasurer',
      icon: Zap,
      color: 'from-teal-500 to-blue-500'
    },
    { 
      name: 'Aditya Aluni', 
      role: 'Tech Team',
      icon: Award,
      color: 'from-pink-500 to-rose-500'
    }
  ]

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
        <section className="pt-32 pb-20">
          <div className="container mx-auto px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              <div className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-md rounded-full mb-8">
                <Code className="w-5 h-5 mr-2 text-white" />
                <span className="font-calibri text-white">Secret Access Granted</span>
              </div>
              
              <h1 className="font-inter text-5xl md:text-7xl font-bold text-white mb-6">
                Tech Team
              </h1>
              <p className="font-calibri text-xl md:text-2xl text-white/90 mb-4">
                Meet the brilliant minds behind X-CLUBS
              </p>
              <p className="font-calibri text-lg text-white/80 max-w-2xl mx-auto">
                These amazing developers brought the X-CLUBS platform to life with their creativity, 
                dedication, and technical expertise.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Team Grid */}
        <section className="pb-20">
          <div className="container mx-auto px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {techTeam.map((member, index) => {
                const Icon = member.icon
                return (
                  <motion.div
                    key={member.name}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, rotateY: 5 }}
                    className="group"
                  >
                    <div className="bg-white/20 backdrop-blur-md rounded-3xl p-8 border border-white/30 hover:bg-white/30 transition-all duration-500 text-center">
                      {/* Avatar */}
                      <div className={`w-20 h-20 bg-gradient-to-r ${member.color} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-10 h-10 text-white" />
                      </div>

                      {/* Name */}
                      <h3 className="font-inter text-2xl font-bold text-white mb-2">
                        {member.name}
                      </h3>

                      {/* Role */}
                      <p className="font-calibri text-white/80 mb-6">
                        {member.role}
                      </p>

                      {/* Social Links */}
                      <div className="flex justify-center space-x-4">
                        <button className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-300">
                          <Github className="w-5 h-5 text-white" />
                        </button>
                        <button className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-300">
                          <Linkedin className="w-5 h-5 text-white" />
                        </button>
                        <button className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-300">
                          <Mail className="w-5 h-5 text-white" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Easter Egg Message */}
        <section className="pb-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="container mx-auto px-8 text-center"
          >
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-12 border border-white/20 max-w-4xl mx-auto">
              <h2 className="font-inter text-3xl font-bold text-white mb-6">
                🎉 Congratulations! 🎉
              </h2>
              <p className="font-calibri text-lg text-white/90 mb-4">
                You found the secret tech team page! You must be pretty tech-savvy to discover this Easter egg.
              </p>
              <p className="font-calibri text-white/80">
                This page is a tribute to all the developers who worked tirelessly to create the X-CLUBS platform. 
                Thank you for exploring and finding this hidden gem!
              </p>
              
              <div className="mt-8 inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full">
                <span className="font-calibri text-white font-semibold">Secret Achievement Unlocked!</span>
              </div>
            </div>
          </motion.div>
        </section>

        <Footer />
      </div>
    </div>
  )
}
