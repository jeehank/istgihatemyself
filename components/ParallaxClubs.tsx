'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { clubs } from '@/data/clubs'
import Link from 'next/link'
import { Users, Star, ArrowRight } from 'lucide-react'

export default function ParallaxClubs() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [-100, 100])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  return (
    <section id="clubs" ref={containerRef} className="py-20 bg-gradient-to-b from-gray-900 to-black text-white overflow-hidden">
      <div className="container mx-auto px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-inter text-5xl md:text-6xl font-bold mb-6">
            Explore Our
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {' '}Clubs
            </span>
          </h2>
          <p className="font-calibri text-xl text-gray-300 max-w-3xl mx-auto">
            Discover your passion and join a community of like-minded students. Each club offers unique opportunities for growth, learning, and making lifelong friendships.
          </p>
        </motion.div>

        {/* Clubs Grid */}
        <motion.div 
          style={{ y, opacity }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {clubs.map((club, index) => (
            <motion.div
              key={club.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, rotateY: 5 }}
              className="group relative"
            >
              <div className="relative h-96 bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl overflow-hidden border border-gray-700 hover:border-gray-500 transition-all duration-500">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className={`absolute inset-0 ${club.color} opacity-20`}></div>
                  <div className={"absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"40\" height=\"40\" viewBox=\"0 0 40 40\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.1\"%3E%3Cpath d=\"M20 20c0-11.046-8.954-20-20-20v20h20z\"/%3E%3C/g%3E%3C/svg%3E')]"}></div>
                </div>

                {/* Content */}
                <div className="relative z-10 p-8 h-full flex flex-col">
                  {/* Club Badge */}
                  <div className={`inline-flex items-center px-4 py-2 rounded-full ${club.color} text-white text-sm font-inter font-semibold mb-4 w-fit`}>
                    <Star className="w-4 h-4 mr-2" />
                    Club {String(index + 1).padStart(2, '0')}
                  </div>

                  {/* Club Name */}
                  <h3 className="font-inter text-2xl font-bold mb-3 group-hover:text-blue-400 transition-colors duration-300">
                    {club.name}
                  </h3>

                  {/* Description */}
                  <p className="font-calibri text-gray-300 mb-6 flex-grow">
                    {club.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center text-gray-400">
                      <Users className="w-4 h-4 mr-2" />
                      <span className="font-calibri text-sm">
                        {(parseInt(club.id) * 7 + 25)} members
                      </span>
                    </div>
                    <div className="font-inter text-lg font-semibold text-green-400">
                      ₹{club.entryFee}
                    </div>
                  </div>

                  {/* CTA */}
                  <Link
                    href={`/clubs/${club.slug}`}
                    className="flex items-center justify-center w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-inter font-semibold transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue-500/25"
                  >
                    <span>Explore Club</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-16"
        >
          <p className="font-calibri text-xl text-gray-300 mb-8">
            Ready to join a club and start your journey?
          </p>
          <Link
            href="/news"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full font-inter font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
          >
            View Latest News
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
