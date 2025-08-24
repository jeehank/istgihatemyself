'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export default function SchoolInfo() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* School Logo */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex justify-center lg:justify-start"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full blur-2xl"></div>
              <Image
                src="https://cdn.builder.io/api/v1/image/assets%2F9c5249cc4ac34ee58fc514520c67d898%2Fd83b398e8e8246e0a5520439e34c4aa3?format=webp&width=800"
                alt="St.Xavier's Collegiate School Logo"
                width={400}
                height={400}
                className="relative z-10 rounded-full shadow-2xl"
              />
            </div>
          </motion.div>

          {/* About School */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <div>
              <h2 className="font-inter text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                About Our School
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
            </div>

            <div className="space-y-4 font-calibri text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              <p>
                <strong className="font-inter font-semibold text-gray-900 dark:text-white">St.Xavier's Collegiate School</strong> stands as a beacon of academic excellence and holistic development. Since our establishment, we have been committed to nurturing young minds and fostering an environment where students can explore their passions and talents.
              </p>
              
              <p>
                Our school believes in the motto <em>"Nihil Ultra"</em> - Nothing Beyond, which encourages our students to strive for excellence in all endeavors. We provide a platform where academic rigor meets creative expression through our diverse range of clubs and extracurricular activities.
              </p>

              <p>
                Through X-CLUBS, we offer students opportunities to engage in various fields - from technology and science to arts and social service. Each club is designed to enhance specific skills while promoting teamwork, leadership, and innovation.
              </p>

              <p>
                Under the guidance of our esteemed faculty and the leadership of our Principal, we continue to shape future leaders who will make meaningful contributions to society.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
              <div className="text-center">
                <div className="font-inter text-3xl font-bold text-blue-600">10+</div>
                <div className="font-calibri text-sm text-gray-600 dark:text-gray-400">Active Clubs</div>
              </div>
              <div className="text-center">
                <div className="font-inter text-3xl font-bold text-purple-600">500+</div>
                <div className="font-calibri text-sm text-gray-600 dark:text-gray-400">Active Members</div>
              </div>
              <div className="text-center">
                <div className="font-inter text-3xl font-bold text-green-600">50+</div>
                <div className="font-calibri text-sm text-gray-600 dark:text-gray-400">Events/Year</div>
              </div>
              <div className="text-center">
                <div className="font-inter text-3xl font-bold text-orange-600">25+</div>
                <div className="font-calibri text-sm text-gray-600 dark:text-gray-400">Years Legacy</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Principal Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 text-center"
        >
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-12 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full blur-xl"></div>
                <Image
                  src="https://www.sxcsccu.edu.in/Images/faculty/Fr-Roshan.jpg"
                  alt="Principal"
                  width={200}
                  height={200}
                  className="relative z-10 rounded-full shadow-lg"
                />
              </div>
              
              <div className="text-left space-y-4">
                <h3 className="font-inter text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  Message from Our Principal
                </h3>
                <blockquote className="font-calibri text-lg text-gray-700 dark:text-gray-300 italic leading-relaxed">
                  "Education is not just about academic excellence, but about nurturing the complete personality of each student. Through our diverse club activities, we aim to develop not just scholars, but well-rounded individuals ready to contribute meaningfully to society."
                </blockquote>
                <div className="font-inter font-semibold text-gray-900 dark:text-white">
                  - Fr. Roshan Tirkey, Principal
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
