"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, Mail, Phone, Clock, CheckCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your backend
    console.log("Form submitted:", formData)
    setIsSubmitted(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-black/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-white">
                OkapIQ
              </Link>
              <Badge variant="secondary" className="ml-3 bg-green-900 text-green-100">
                Bloomberg for LLMs
              </Badge>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/solutions" className="text-gray-300 hover:text-white font-medium">
                Solutions
              </Link>
              <Link href="/case-studies" className="text-gray-300 hover:text-white font-medium">
                Case Studies
              </Link>
              <Link href="/dashboard" className="text-gray-300 hover:text-white font-medium">
                Dashboard
              </Link>
              <Link href="/contact">
                <Button className="bg-green-600 hover:bg-green-700 text-white">Contact Now</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="pt-16 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="inline-flex items-center text-green-400 hover:text-green-300 mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Get Started with OkapIQ</h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Ready to transform your deal flow? Book a demo and see how OkapIQ can 8x your response rates and reduce deal
            time by 90%.
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              {!isSubmitted ? (
                <Card className="border-2 border-gray-800 bg-gray-900">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-white">Book Your Demo</CardTitle>
                    <CardDescription className="text-gray-300">
                      Fill out the form below and we'll get back to you within 24 hours to schedule your personalized
                      demo.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name" className="text-white">
                            Full Name *
                          </Label>
                          <Input
                            id="name"
                            name="name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={handleInputChange}
                            className="mt-1 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                            placeholder="John Smith"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email" className="text-white">
                            Email Address *
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                            className="mt-1 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                            placeholder="john@company.com"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="company" className="text-white">
                          Company Name
                        </Label>
                        <Input
                          id="company"
                          name="company"
                          type="text"
                          value={formData.company}
                          onChange={handleInputChange}
                          className="mt-1 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                          placeholder="Your Company"
                        />
                      </div>
                      <div>
                        <Label htmlFor="message" className="text-white">
                          Tell us about your needs
                        </Label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          className="mt-1 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                          rows={4}
                          placeholder="What type of deals are you looking for? What's your current process?"
                        />
                      </div>
                      <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-3">
                        Book Demo Now
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-2 border-green-600 bg-green-900/20">
                  <CardHeader>
                    <div className="flex items-center">
                      <CheckCircle className="h-8 w-8 text-green-400 mr-3" />
                      <CardTitle className="text-2xl font-bold text-green-400">Thank You!</CardTitle>
                    </div>
                    <CardDescription className="text-green-300">
                      Your demo request has been submitted successfully.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-green-300">
                        We've received your information and will contact you within 24 hours to schedule your
                        personalized OkapIQ demo.
                      </p>
                      <div className="bg-gray-800 p-4 rounded-lg">
                        <h4 className="font-semibold text-white mb-2">What to expect in your demo:</h4>
                        <ul className="space-y-1 text-gray-300">
                          <li>• Live walkthrough of AI Deal Engine</li>
                          <li>• Custom Oppy valuation analysis</li>
                          <li>• Geographic clustering for your market</li>
                          <li>• ROI projections for your use case</li>
                        </ul>
                      </div>
                      <Button
                        onClick={() => setIsSubmitted(false)}
                        variant="outline"
                        className="w-full border-green-600 text-green-400 hover:bg-green-600 hover:text-white"
                      >
                        Submit Another Request
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              {/* Contact Details */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-white">Get in Touch</CardTitle>
                  <CardDescription className="text-gray-300">Multiple ways to reach our team</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-green-400 mr-3" />
                    <div>
                      <p className="font-medium text-white">Email</p>
                      <p className="text-gray-300">osirislamon@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-green-400 mr-3" />
                    <div>
                      <p className="font-medium text-white">Phone</p>
                      <p className="text-gray-300">+1 (661) 566-4627</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-green-400 mr-3" />
                    <div>
                      <p className="font-medium text-white">Response Time</p>
                      <p className="text-gray-300">Within 24 hours</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Demo Stats */}
              <Card className="bg-green-900/20 border-green-600">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-green-400">Demo Success Stats</CardTitle>
                  <CardDescription className="text-green-300">What our prospects achieve after demos</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">95%</div>
                      <div className="text-sm text-green-300">Move to Trial</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">8x</div>
                      <div className="text-sm text-green-300">Response Rate Boost</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">90%</div>
                      <div className="text-sm text-green-300">Time Savings</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">30 min</div>
                      <div className="text-sm text-green-300">Demo Length</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* What to Expect */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-white">What to Expect</CardTitle>
                  <CardDescription className="text-gray-300">Your personalized demo experience</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="bg-green-600 rounded-full p-2 mr-3 mt-1">
                        <span className="text-white font-bold text-sm">1</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">Discovery Call</h4>
                        <p className="text-gray-300 text-sm">
                          We'll learn about your current process and deal flow challenges
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-green-600 rounded-full p-2 mr-3 mt-1">
                        <span className="text-white font-bold text-sm">2</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">Live Demo</h4>
                        <p className="text-gray-300 text-sm">
                          See OkapIQ in action with your specific use case and market
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-green-600 rounded-full p-2 mr-3 mt-1">
                        <span className="text-white font-bold text-sm">3</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">ROI Analysis</h4>
                        <p className="text-gray-300 text-sm">
                          Custom projections showing potential time and cost savings
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-green-600 rounded-full p-2 mr-3 mt-1">
                        <span className="text-white font-bold text-sm">4</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">Next Steps</h4>
                        <p className="text-gray-300 text-sm">Discuss trial options and implementation timeline</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold mb-4 text-white">OkapIQ</div>
              <p className="text-green-400 mb-4">Bloomberg for LLMs</p>
              <p className="text-gray-400 text-sm">Real-time SMB data and AI-powered deal flow for modern investors.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white">Solutions</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/solutions" className="hover:text-green-400">
                    AI Deal Engine
                  </Link>
                </li>
                <li>
                  <Link href="/solutions" className="hover:text-green-400">
                    Oppy Valuations
                  </Link>
                </li>
                <li>
                  <Link href="/solutions" className="hover:text-green-400">
                    Geo Smart Analysis
                  </Link>
                </li>
                <li>
                  <Link href="/solutions" className="hover:text-green-400">
                    Post-Acquisition
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/case-studies" className="hover:text-green-400">
                    Case Studies
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-green-400">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-green-400">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white">Contact</h3>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-green-400 mr-2" />
                  <span>osirislamon@gmail.com</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-green-400 mr-2" />
                  <span>+1 (661) 566-4627</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 OkapIQ. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
