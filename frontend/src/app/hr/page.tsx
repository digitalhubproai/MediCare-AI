"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import Logo from "@/components/Logo"
import {
  Users, UserCheck, UserX, Briefcase, Calendar, TrendingUp, TrendingDown,
  Search, Bell, Settings, ChevronDown, Plus, MoreVertical, Mail, Phone,
  Clock, DollarSign, Star, Award, Target, Activity, BarChart3, PieChart,
  ArrowUpRight, ArrowDownRight, Filter, Download, Eye, Edit, Trash2
} from "lucide-react"

export default function HRPage() {
  const { scrollYProgress } = useScroll()
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null)
  const [showNotification, setShowNotification] = useState(false)

  const stats = [
    { label: "Total Employees", value: "2,847", change: "+12%", trend: "up", icon: Users, color: "from-blue-500 to-cyan-500" },
    { label: "New Hires (Month)", value: "143", change: "+24%", trend: "up", icon: UserCheck, color: "from-emerald-500 to-teal-500" },
    { label: "Turnover Rate", value: "3.2%", change: "-0.8%", trend: "down", icon: UserX, color: "from-rose-500 to-pink-500" },
    { label: "Open Positions", value: "47", change: "+5", trend: "up", icon: Briefcase, color: "from-violet-500 to-purple-500" },
  ]

  const employees = [
    { id: 1, name: "Sarah Johnson", role: "Senior Developer", department: "Engineering", email: "sarah.j@company.com", status: "Active", avatar: "https://i.pravatar.cc/150?img=1", performance: 95 },
    { id: 2, name: "Michael Chen", role: "Product Manager", department: "Product", email: "michael.c@company.com", status: "Active", avatar: "https://i.pravatar.cc/150?img=3", performance: 92 },
    { id: 3, name: "Emily Davis", role: "UX Designer", department: "Design", email: "emily.d@company.com", status: "On Leave", avatar: "https://i.pravatar.cc/150?img=5", performance: 88 },
    { id: 4, name: "James Wilson", role: "Data Analyst", department: "Analytics", email: "james.w@company.com", status: "Active", avatar: "https://i.pravatar.cc/150?img=8", performance: 91 },
    { id: 5, name: "Lisa Anderson", role: "HR Manager", department: "Human Resources", email: "lisa.a@company.com", status: "Active", avatar: "https://i.pravatar.cc/150?img=9", performance: 94 },
  ]

  const upcomingEvents = [
    { title: "Team Building Event", date: "Mar 15, 2026", attendees: 156, type: "event" },
    { title: "Performance Reviews", date: "Mar 20, 2026", attendees: 89, type: "review" },
    { title: "New Hire Orientation", date: "Mar 22, 2026", attendees: 23, type: "orientation" },
    { title: "Leadership Training", date: "Mar 28, 2026", attendees: 45, type: "training" },
  ]

  const departmentStats = [
    { name: "Engineering", employees: 856, growth: 15, color: "bg-blue-500" },
    { name: "Sales", employees: 542, growth: 8, color: "bg-emerald-500" },
    { name: "Marketing", employees: 328, growth: 12, color: "bg-violet-500" },
    { name: "Support", employees: 445, growth: 6, color: "bg-amber-500" },
    { name: "HR", employees: 156, growth: 4, color: "bg-rose-500" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Scroll Progress */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 z-50 origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/30 rounded-full blur-[100px]"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-100/30 rounded-full blur-[100px]"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
        />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-40 bg-white/80 backdrop-blur-2xl border-b border-gray-200"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-4"
            >
              <Logo
                iconContainerClassName="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg shadow-blue-600/30"
                textClassName="text-lg text-gray-900"
                aiClassName="text-blue-600"
              />
            </motion.div>

            <div className="flex items-center gap-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="relative"
              >
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-80 pl-11 pr-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative w-12 h-12 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-all"
                onClick={() => setShowNotification(!showNotification)}
              >
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-all"
              >
                <Settings className="w-5 h-5 text-gray-600" />
              </motion.button>

              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-3 pl-4 border-l border-gray-200"
              >
                <img
                  src="https://i.pravatar.cc/150?img=12"
                  alt="Profile"
                  className="w-10 h-10 rounded-2xl object-cover border-2 border-white shadow-lg"
                />
                <div className="hidden lg:block">
                  <p className="text-sm font-semibold text-gray-900">Admin User</p>
                  <p className="text-xs text-gray-500">HR Director</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        {/* Stats Grid */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <StatCard key={index} stat={stat} index={index} />
          ))}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Employee Table */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-2 bg-white rounded-3xl border border-gray-200 shadow-xl shadow-gray-200/50 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Recent Employees</h2>
                  <p className="text-sm text-gray-500 mt-1">Manage your team members</p>
                </div>
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-all"
                  >
                    <Filter className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Filter</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-shadow"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="text-sm font-semibold">Add Employee</span>
                  </motion.button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Employee</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Performance</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {employees.map((employee, index) => (
                    <EmployeeRow key={employee.id} employee={employee} index={index} onSelect={setSelectedEmployee} />
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Upcoming Events */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-3xl border border-gray-200 shadow-xl shadow-gray-200/50 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Upcoming Events</h2>
                  <p className="text-sm text-gray-500 mt-1">Don't miss important dates</p>
                </div>
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>

            <div className="p-6 space-y-4">
              {upcomingEvents.map((event, index) => (
                <EventCard key={index} event={event} index={index} />
              ))}
            </div>

            <div className="p-6 border-t border-gray-100">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-shadow"
              >
                View All Events
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Department Stats & Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Department Distribution */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl border border-gray-200 shadow-xl shadow-gray-200/50 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Department Distribution</h2>
                <p className="text-sm text-gray-500 mt-1">Employees by department</p>
              </div>
              <PieChart className="w-6 h-6 text-purple-600" />
            </div>

            <div className="space-y-4">
              {departmentStats.map((dept, index) => (
                <DepartmentBar key={index} department={dept} index={index} />
              ))}
            </div>
          </motion.div>

          {/* Analytics Overview */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-3xl border border-gray-200 shadow-xl shadow-gray-200/50 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Analytics Overview</h2>
                <p className="text-sm text-gray-500 mt-1">Key performance metrics</p>
              </div>
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <AnalyticsCard
                title="Employee Satisfaction"
                value="87%"
                change="+5%"
                trend="up"
                icon={Star}
                color="from-amber-500 to-orange-500"
              />
              <AnalyticsCard
                title="Attendance Rate"
                value="94%"
                change="+2%"
                trend="up"
                icon={UserCheck}
                color="from-emerald-500 to-teal-500"
              />
              <AnalyticsCard
                title="Avg. Performance"
                value="91"
                change="+3"
                trend="up"
                icon={Target}
                color="from-blue-500 to-cyan-500"
              />
              <AnalyticsCard
                title="Training Hours"
                value="1,247"
                change="+18%"
                trend="up"
                icon={Award}
                color="from-violet-500 to-purple-500"
              />
            </div>

            {/* Mini Chart */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-end justify-between gap-2 h-32">
                {[65, 78, 52, 89, 73, 95, 82].map((height, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0, opacity: 0 }}
                    whileInView={{ height: `${height}%`, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="flex-1 bg-gradient-to-t from-blue-500 to-purple-500 rounded-t-lg hover:from-blue-400 hover:to-purple-400 transition-all cursor-pointer"
                    whileHover={{ scale: 1.1 }}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-3 text-xs text-gray-500">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                  <span key={day}>{day}</span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

// Stat Card Component
function StatCard({ stat, index }: { stat: any; index: number }) {
  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="relative group bg-white rounded-3xl border border-gray-200 shadow-xl shadow-gray-200/50 overflow-hidden p-6"
    >
      {/* Gradient Background on Hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

      <div className="flex items-start justify-between mb-4">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <stat.icon className="w-7 h-7 text-white" />
        </div>
        <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold ${stat.trend === 'up' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
          {stat.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          {stat.change}
        </div>
      </div>

      <div className="text-3xl font-black text-gray-900 mb-1">{stat.value}</div>
      <div className="text-sm font-medium text-gray-500">{stat.label}</div>

      {/* Shine Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      </div>
    </motion.div>
  )
}

// Employee Row Component
function EmployeeRow({ employee, index, onSelect }: { employee: any; index: number; onSelect: (id: number) => void }) {
  return (
    <motion.tr
      initial={{ x: -40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ scale: 1.01, backgroundColor: "rgba(59, 130, 246, 0.05)" }}
      className="cursor-pointer transition-colors"
      onClick={() => onSelect(employee.id)}
    >
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <motion.img
            whileHover={{ scale: 1.1 }}
            src={employee.avatar}
            alt={employee.name}
            className="w-10 h-10 rounded-2xl object-cover border-2 border-white shadow-md"
          />
          <div>
            <div className="font-semibold text-gray-900">{employee.name}</div>
            <div className="text-sm text-gray-500">{employee.email}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="text-sm font-medium text-gray-700">{employee.department}</span>
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
          employee.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
        }`}>
          {employee.status}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${employee.performance}%` }}
              transition={{ duration: 1, delay: index * 0.1 }}
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
            />
          </div>
          <span className="text-sm font-semibold text-gray-700 w-8">{employee.performance}%</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-all"
          >
            <Eye className="w-4 h-4 text-gray-600" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-all"
          >
            <Edit className="w-4 h-4 text-gray-600" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center hover:border-red-500 hover:bg-red-50 transition-all"
          >
            <Trash2 className="w-4 h-4 text-gray-600" />
          </motion.button>
        </div>
      </td>
    </motion.tr>
  )
}

// Event Card Component
function EventCard({ event, index }: { event: any; index: number }) {
  const typeColors: { [key: string]: string } = {
    event: "from-blue-500 to-cyan-500",
    review: "from-purple-500 to-pink-500",
    orientation: "from-emerald-500 to-teal-500",
    training: "from-amber-500 to-orange-500",
  }

  return (
    <motion.div
      initial={{ x: 40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ x: 5, scale: 1.02 }}
      className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50/50 border border-gray-100 hover:border-blue-200 transition-all cursor-pointer group"
    >
      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${typeColors[event.type]} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
        <Calendar className="w-6 h-6 text-white" />
      </div>
      <div className="flex-1">
        <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{event.title}</div>
        <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
          <Clock className="w-3 h-3" />
          {event.date}
          <span className="mx-1">•</span>
          <Users className="w-3 h-3" />
          {event.attendees} attendees
        </div>
      </div>
      <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
    </motion.div>
  )
}

// Department Bar Component
function DepartmentBar({ department, index }: { department: any; index: number }) {
  return (
    <motion.div
      initial={{ x: -40, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${department.color}`} />
          <span className="text-sm font-medium text-gray-700">{department.name}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-gray-900">{department.employees} employees</span>
          <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
            <TrendingUp className="w-3 h-3" />
            +{department.growth}%
          </span>
        </div>
      </div>
      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${(department.employees / 1000) * 100}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: index * 0.1 }}
          className={`h-full ${department.color} rounded-full group-hover:opacity-80 transition-opacity`}
        />
      </div>
    </motion.div>
  )
}

// Analytics Card Component
function AnalyticsCard({ title, value, change, trend, icon: Icon, color }: { title: string; value: string; change: string; trend: string; icon: any; color: string }) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5, scale: 1.05 }}
      className="p-5 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-200/30 transition-all cursor-pointer group"
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
          <TrendingUp className="w-3 h-3" />
          {change}
        </div>
      </div>
      <div className="text-2xl font-black text-gray-900 mb-1">{value}</div>
      <div className="text-xs font-medium text-gray-500">{title}</div>
    </motion.div>
  )
}
