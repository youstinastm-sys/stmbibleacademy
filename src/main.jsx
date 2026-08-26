import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  BookOpen,
  Trophy,
  Flame,
  Users,
  Star,
  LogOut,
  LayoutDashboard,
  ClipboardCheck,
  GraduationCap,
  CheckCircle2,
  Settings,
  UserRound,
  BarChart3,
  ArrowLeft,
  ChevronRight
} from 'lucide-react'

import { supabase } from './supabase'
import './styles.css'

const navigation = {
  student: [
    ['Dashboard', LayoutDashboard],
    ['My Progress', BarChart3],
    ['Daily Reading', BookOpen],
    ['Homework', ClipboardCheck],
    ['Memory Verses', GraduationCap],
    ['Physical Bible', BookOpen],
    ['Attendance', CheckCircle2],
    ['Achievements', Star],
    ['Profile', UserRound]
  ],

  servant: [
    ['Dashboard', LayoutDashboard],
    ['My Class', Users],
    ['Attendance', CheckCircle2],
    ['Quick Entry', ClipboardCheck],
    ['Students', GraduationCap],
    ['Reports', BarChart3],
    ['Profile', UserRound]
  ],

  admin: [
    ['Dashboard', LayoutDashboard],
    ['Classes', Users],
    ['Students', GraduationCap],
    ['Servants', UserRound],
    ['Points System', Trophy],
    ['Reports', BarChart3],
    ['Settings', Settings]
  ]
}

function App() {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function start() {
      const {
        data: { session }
      } = await supabase.auth.getSession()

      setSession(session)

      if (session?.user) {
        await loadProfile(session.user.id)
      } else {
        setLoading(false)
      }
    }

    start()

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession)

      if (newSession?.user) {
        await loadProfile(newSession.user.id)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function loadProfile(userId) {
    setLoading(true)

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Profile error:', error)
      setProfile(null)
    } else {
      setProfile(data)
    }

    setLoading(false)
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <BookOpen size={34} />
        <p>Loading Bible Study Academy...</p>
      </div>
    )
  }

  if (!session) {
    return <Login />
  }

  if (!profile) {
    return (
      <div className="loading-screen">
        <h2>Account found, but no profile was found.</h2>

        <p>
          Please make sure this user exists in the profiles table.
        </p>

        <button
          className="primary-button small-button"
          onClick={() => supabase.auth.signOut()}
        >
          Sign Out
        </button>
      </div>
    )
  }

  return <DashboardShell profile={profile} />
}

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleLogin(event) {
    event.preventDefault()

    setBusy(true)
    setErrorMessage('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      setErrorMessage(error.message)
    }

    setBusy(false)
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <BookOpen size={30} />
        </div>

        <h1>Bible Study Academy</h1>

        <p className="login-subtitle">
          Grow in God's Word, one day at a time.
        </p>

        <form onSubmit={handleLogin}>
          <label>Email</label>

          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
          />

          <label>Password</label>

          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            required
          />

          {errorMessage && (
            <div className="error-message">
              {errorMessage}
            </div>
          )}

          <button
            className="primary-button"
            type="submit"
            disabled={busy}
          >
            {busy ? 'Signing in...' : 'Log In'}
          </button>
        </form>
      </div>
    </div>
  )
}

function DashboardShell({ profile }) {
  const role = profile.role
  const [activePage, setActivePage] = useState('Dashboard')

  function renderPage() {
    if (role === 'admin') {
      if (activePage === 'Dashboard') {
        return <AdminDashboard />
      }

      if (activePage === 'Classes') {
        return <AdminClasses />
      }

      return (
        <ComingSoon
          title={activePage}
          role="Admin"
        />
      )
    }

    if (role === 'servant') {
      if (activePage === 'Dashboard') {
        return <ServantDashboard profile={profile} />
      }

      return (
        <ComingSoon
          title={activePage}
          role="Servant"
        />
      )
    }

    if (role === 'student') {
      if (activePage === 'Dashboard') {
        return <StudentDashboard profile={profile} />
      }

      return (
        <ComingSoon
          title={activePage}
          role="Student"
        />
      )
    }

    return null
  }

  return (
    <div className={`app-layout ${role}`}>
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-logo">
            <BookOpen size={23} />
          </div>

          <div>
            <strong>BIBLE STUDY</strong>
            <span>ACADEMY</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navigation[role]?.map(([label, Icon]) => (
            <button
              key={label}
              className={
                activePage === label ? 'active' : ''
              }
              onClick={() => setActivePage(label)}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-user">
          <div className="avatar">
            {profile.first_name?.charAt(0) || '?'}
          </div>

          <div className="sidebar-user-info">
            <strong>
              {profile.first_name} {profile.last_name}
            </strong>

            <span>{capitalize(role)}</span>
          </div>

          <button
            className="logout-button"
            onClick={() => supabase.auth.signOut()}
            title="Sign out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        {renderPage()}
      </main>
    </div>
  )
}

function StudentDashboard({ profile }) {
  const [stats, setStats] = useState({
    points: 0,
    attendance: 0,
    reading: 0,
    homework: 0,
    verse: 0,
    physicalBible: 0,
    participation: 0
  })

  useEffect(() => {
    loadStudentStats()
  }, [])

  async function loadStudentStats() {
    const studentId = profile.id

    const [
      attendanceResult,
      readingResult,
      homeworkResult,
      versesResult,
      bibleResult,
      participationResult,
      bonusResult,
      rulesResult
    ] = await Promise.all([
      supabase
        .from('attendance')
        .select('*')
        .eq('student_id', studentId),

      supabase
        .from('daily_reading')
        .select('*')
        .eq('student_id', studentId),

      supabase
        .from('homework')
        .select('*')
        .eq('student_id', studentId),

      supabase
        .from('memory_verses')
        .select('*')
        .eq('student_id', studentId),

      supabase
        .from('physical_bible')
        .select('*')
        .eq('student_id', studentId),

      supabase
        .from('participation')
        .select('*')
        .eq('student_id', studentId),

      supabase
        .from('bonus_points')
        .select('*')
        .eq('student_id', studentId),

      supabase
        .from('point_rules')
        .select('*')
    ])

    const attendance = attendanceResult.data || []
    const reading = readingResult.data || []
    const homework = homeworkResult.data || []
    const verses = versesResult.data || []
    const physicalBible = bibleResult.data || []
    const participation = participationResult.data || []
    const bonus = bonusResult.data || []
    const rules = rulesResult.data || []

    const pointRules = {}

    rules.forEach((rule) => {
      pointRules[rule.category] = rule.points
    })

    const countTrue = (items, field) =>
      items.filter((item) => item[field] === true).length

    const percentage = (complete, total) => {
      if (!total) return 0

      return Math.round((complete / total) * 100)
    }

    const attendanceCompleted =
      countTrue(attendance, 'present')

    const readingCompleted =
      countTrue(reading, 'completed')

    const homeworkCompleted =
      countTrue(homework, 'completed')

    const verseCompleted =
      countTrue(verses, 'completed')

    const bibleCompleted =
      countTrue(physicalBible, 'brought_bible')

    const participationPoints = participation.reduce(
      (sum, record) => sum + (record.points || 0),
      0
    )

    const bonusPoints = bonus.reduce(
      (sum, record) => sum + (record.points || 0),
      0
    )

    const totalPoints =
      attendanceCompleted *
        (pointRules.attendance || 0) +
      readingCompleted *
        (pointRules.daily_reading || 0) +
      homeworkCompleted *
        (pointRules.homework || 0) +
      verseCompleted *
        (pointRules.memory_verse || 0) +
      bibleCompleted *
        (pointRules.physical_bible || 0) +
      participationPoints +
      bonusPoints

    setStats({
      points: totalPoints,

      attendance: percentage(
        attendanceCompleted,
        attendance.length
      ),

      reading: percentage(
        readingCompleted,
        reading.length
      ),

      homework: percentage(
        homeworkCompleted,
        homework.length
      ),

      verse: percentage(
        verseCompleted,
        verses.length
      ),

      physicalBible: percentage(
        bibleCompleted,
        physicalBible.length
      ),

      participation: participation.length
        ? Math.min(
            100,
            Math.round(
              (participationPoints /
                (participation.length * 5)) *
                100
            )
          )
        : 0
    })
  }

  return (
    <>
      <DashboardHeader
        title={`Welcome back, ${profile.first_name}! 👋`}
        subtitle="Keep growing in God's Word every day."
      />

      <div className="scripture-banner">
        “I have hidden your word in my heart that I might
        not sin against you.”
        <strong> Psalm 119:11</strong>
      </div>

      <div className="stats-grid">
        <StatCard
          icon={<Trophy />}
          label="Total Points"
          value={stats.points}
          helper="Keep growing!"
        />

        <StatCard
          icon={<Flame />}
          label="Reading Streak"
          value="0"
          helper="Coming soon"
        />

        <StatCard
          icon={<CheckCircle2 />}
          label="Attendance"
          value={`${stats.attendance}%`}
          helper="Bible Study"
        />

        <StatCard
          icon={<Star />}
          label="This Week's Rank"
          value="—"
          helper="Coming soon"
        />
      </div>

      <section className="dashboard-card">
        <h2>My Progress</h2>

        <div className="progress-grid">
          <ProgressCircle
            label="Daily Reading"
            value={stats.reading}
            emoji="📖"
          />

          <ProgressCircle
            label="Attendance"
            value={stats.attendance}
            emoji="⛪"
          />

          <ProgressCircle
            label="Homework"
            value={stats.homework}
            emoji="✏️"
          />

          <ProgressCircle
            label="Memory Verse"
            value={stats.verse}
            emoji="🧠"
          />

          <ProgressCircle
            label="Physical Bible"
            value={stats.physicalBible}
            emoji="📕"
          />

          <ProgressCircle
            label="Participation"
            value={stats.participation}
            emoji="⭐"
          />
        </div>
      </section>

      <section className="dashboard-card weekly-goal">
        <div>
          <h3>This Week's Goal</h3>

          <p>
            Complete your daily Bible reading and keep
            building your progress.
          </p>
        </div>

        <Star size={30} />
      </section>
    </>
  )
}

function ServantDashboard({ profile }) {
  const [className, setClassName] =
    useState('My Bible Study Class')

  const [students, setStudents] = useState([])

  useEffect(() => {
    loadClass()
  }, [])

  async function loadClass() {
    const { data: assignment } = await supabase
      .from('servant_classes')
      .select('class_id')
      .eq('servant_id', profile.id)
      .limit(1)
      .maybeSingle()

    if (!assignment) return

    const { data: classRecord } = await supabase
      .from('classes')
      .select('*')
      .eq('id', assignment.class_id)
      .single()

    if (classRecord) {
      setClassName(classRecord.name)
    }

    const { data: memberships } = await supabase
      .from('class_members')
      .select('student_id')
      .eq('class_id', assignment.class_id)

    const studentIds =
      memberships?.map(
        (membership) => membership.student_id
      ) || []

    if (!studentIds.length) {
      setStudents([])
      return
    }

    const { data: studentProfiles } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, grade')
      .in('id', studentIds)

    setStudents(studentProfiles || [])
  }

  return (
    <>
      <DashboardHeader
        title="Servant Dashboard"
        subtitle={`${className} • ${students.length} students`}
      />

      <div className="stats-grid">
        <StatCard
          icon={<Users />}
          label="Students"
          value={students.length}
          helper="Class roster"
        />

        <StatCard
          icon={<CheckCircle2 />}
          label="Present"
          value="—"
          helper="This Friday"
        />

        <StatCard
          icon={<BarChart3 />}
          label="Attendance"
          value="—"
          helper="Class average"
        />

        <StatCard
          icon={<Star />}
          label="Points Awarded"
          value="—"
          helper="This week"
        />
      </div>

      <section className="dashboard-card">
        <h2>Class Roster</h2>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Attendance</th>
                <th>Reading</th>
                <th>Homework</th>
                <th>Memory Verse</th>
                <th>Physical Bible</th>
              </tr>
            </thead>

            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>
                    <strong>
                      {student.first_name}{' '}
                      {student.last_name}
                    </strong>
                  </td>

                  <td>—</td>
                  <td>—</td>
                  <td>—</td>
                  <td>—</td>
                  <td>—</td>
                </tr>
              ))}

              {!students.length && (
                <tr>
                  <td colSpan="6">
                    No students are assigned to this class
                    yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}

function AdminDashboard() {
  const [classes, setClasses] = useState([])
  const [students, setStudents] = useState(0)
  const [servants, setServants] = useState(0)

  useEffect(() => {
    loadAdminData()
  }, [])

  async function loadAdminData() {
    const [classesResult, profilesResult] =
      await Promise.all([
        supabase
          .from('classes')
          .select('*')
          .eq('active', true),

        supabase
          .from('profiles')
          .select('role')
      ])

    const classData = classesResult.data || []
    const profiles = profilesResult.data || []

    setClasses(classData)

    setStudents(
      profiles.filter(
        (profile) => profile.role === 'student'
      ).length
    )

    setServants(
      profiles.filter(
        (profile) => profile.role === 'servant'
      ).length
    )
  }

  return (
    <>
      <DashboardHeader
        title="Admin Dashboard"
        subtitle="Overview of Bible Study Academy"
      />

      <div className="stats-grid">
        <StatCard
          icon={<LayoutDashboard />}
          label="Classes"
          value={classes.length}
          helper="Active groups"
        />

        <StatCard
          icon={<Users />}
          label="Students"
          value={students}
          helper="Total students"
        />

        <StatCard
          icon={<UserRound />}
          label="Servants"
          value={servants}
          helper="Total servants"
        />

        <StatCard
          icon={<Trophy />}
          label="Points Awarded"
          value="—"
          helper="This week"
        />
      </div>

      <section className="dashboard-card">
        <h2>Classes Overview</h2>

        <div className="classes-grid">
          {classes.map((classItem) => (
            <div
              className="class-card"
              key={classItem.id}
            >
              <div className="class-icon">
                <BookOpen size={22} />
              </div>

              <div>
                <strong>{classItem.name}</strong>
                <span>{classItem.grade_group}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

function AdminClasses() {
  const [classes, setClasses] = useState([])
  const [selectedClass, setSelectedClass] = useState(null)
  const [students, setStudents] = useState([])
  const [servants, setServants] = useState([])
  const [loading, setLoading] = useState(true)
  const [detailLoading, setDetailLoading] =
    useState(false)

  useEffect(() => {
    loadClasses()
  }, [])

  async function loadClasses() {
    setLoading(true)

    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .eq('active', true)
      .order('id')

    if (error) {
      console.error('Classes error:', error)
    }

    setClasses(data || [])
    setLoading(false)
  }

  async function openClass(classItem) {
    setSelectedClass(classItem)
    setDetailLoading(true)
    setStudents([])
    setServants([])

    const [
      studentMembershipsResult,
      servantMembershipsResult
    ] = await Promise.all([
      supabase
        .from('class_members')
        .select('student_id')
        .eq('class_id', classItem.id),

      supabase
        .from('servant_classes')
        .select('servant_id')
        .eq('class_id', classItem.id)
    ])

    const studentIds =
      studentMembershipsResult.data?.map(
        (record) => record.student_id
      ) || []

    const servantIds =
      servantMembershipsResult.data?.map(
        (record) => record.servant_id
      ) || []

    if (studentIds.length) {
      const { data: studentProfiles } = await supabase
        .from('profiles')
        .select(
          'id, first_name, last_name, grade, active'
        )
        .in('id', studentIds)
        .order('first_name')

      setStudents(studentProfiles || [])
    }

    if (servantIds.length) {
      const { data: servantProfiles } = await supabase
        .from('profiles')
        .select(
          'id, first_name, last_name, active'
        )
        .in('id', servantIds)
        .order('first_name')

      setServants(servantProfiles || [])
    }

    setDetailLoading(false)
  }

  if (selectedClass) {
    return (
      <>
        <button
          onClick={() => setSelectedClass(null)}
          style={{
            border: 'none',
            background: 'transparent',
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            padding: '0',
            marginBottom: '18px',
            cursor: 'pointer',
            color: '#6b35c0',
            fontWeight: '700'
          }}
        >
          <ArrowLeft size={18} />
          Back to Classes
        </button>

        <DashboardHeader
          title={selectedClass.name}
          subtitle={
            selectedClass.grade_group ||
            'Bible Study class'
          }
        />

        <div className="stats-grid">
          <StatCard
            icon={<GraduationCap />}
            label="Students"
            value={students.length}
            helper="Assigned students"
          />

          <StatCard
            icon={<UserRound />}
            label="Servants"
            value={servants.length}
            helper="Assigned servants"
          />

          <StatCard
            icon={<CheckCircle2 />}
            label="Attendance"
            value="—"
            helper="Coming soon"
          />

          <StatCard
            icon={<Trophy />}
            label="Class Points"
            value="—"
            helper="Coming soon"
          />
        </div>

        {detailLoading ? (
          <section className="dashboard-card">
            <p>Loading class...</p>
          </section>
        ) : (
          <>
            <section className="dashboard-card">
              <h2>Students</h2>

              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Grade</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {students.map((student) => (
                      <tr key={student.id}>
                        <td>
                          <strong>
                            {student.first_name}{' '}
                            {student.last_name}
                          </strong>
                        </td>

                        <td>
                          {student.grade || '—'}
                        </td>

                        <td>
                          {student.active
                            ? 'Active'
                            : 'Inactive'}
                        </td>
                      </tr>
                    ))}

                    {!students.length && (
                      <tr>
                        <td colSpan="3">
                          No students are assigned to this
                          class yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="dashboard-card">
              <h2>Servants</h2>

              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {servants.map((servant) => (
                      <tr key={servant.id}>
                        <td>
                          <strong>
                            {servant.first_name}{' '}
                            {servant.last_name}
                          </strong>
                        </td>

                        <td>
                          {servant.active
                            ? 'Active'
                            : 'Inactive'}
                        </td>
                      </tr>
                    ))}

                    {!servants.length && (
                      <tr>
                        <td colSpan="2">
                          No servants are assigned to this
                          class yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </>
    )
  }

  return (
    <>
      <DashboardHeader
        title="Classes"
        subtitle="Manage Bible Study groups and view class rosters"
      />

      <div style={{ marginTop: '24px' }}>
        {loading ? (
          <section className="dashboard-card">
            <p>Loading classes...</p>
          </section>
        ) : (
          <div className="classes-grid">
            {classes.map((classItem) => (
              <button
                key={classItem.id}
                className="class-card"
                onClick={() => openClass(classItem)}
                style={{
                  width: '100%',
                  background: 'white',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div className="class-icon">
                  <BookOpen size={22} />
                </div>

                <div style={{ flex: 1 }}>
                  <strong>{classItem.name}</strong>

                  <span>
                    {classItem.grade_group}
                  </span>
                </div>

                <ChevronRight
                  size={20}
                  color="#8b90a1"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

function ComingSoon({ title, role }) {
  return (
    <>
      <DashboardHeader
        title={title}
        subtitle={`${role} tools`}
      />

      <section
        className="dashboard-card"
        style={{
          marginTop: '24px',
          textAlign: 'center',
          padding: '60px 25px'
        }}
      >
        <div
          style={{
            fontSize: '44px',
            marginBottom: '12px'
          }}
        >
          🚧
        </div>

        <h2 style={{ marginBottom: '8px' }}>
          {title}
        </h2>

        <p
          style={{
            color: '#6b7280',
            margin: 0
          }}
        >
          We're building this section next.
        </p>
      </section>
    </>
  )
}

function DashboardHeader({ title, subtitle }) {
  return (
    <header className="dashboard-header">
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </header>
  )
}

function StatCard({
  icon,
  label,
  value,
  helper
}) {
  return (
    <div className="stat-card">
      <div className="stat-icon">
        {icon}
      </div>

      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{helper}</small>
      </div>
    </div>
  )
}

function ProgressCircle({
  label,
  value,
  emoji
}) {
  const degrees =
    Math.min(
      100,
      Math.max(0, value)
    ) * 3.6

  return (
    <div className="progress-item">
      <div
        className="progress-ring"
        style={{
          background: `conic-gradient(
            var(--accent) ${degrees}deg,
            #ececf4 ${degrees}deg
          )`
        }}
      >
        <div className="progress-center">
          <span>{emoji}</span>
          <strong>{value}%</strong>
        </div>
      </div>

      <strong className="progress-label">
        {label}
      </strong>
    </div>
  )
}

function capitalize(value) {
  if (!value) return ''

  return (
    value.charAt(0).toUpperCase() +
    value.slice(1)
  )
}

createRoot(
  document.getElementById('root')
).render(<App />)
