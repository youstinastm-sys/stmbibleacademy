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
  ChevronRight,
  CalendarDays,
  Clock
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
    ['Weekly Management', CalendarDays],
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
    <div
      className="login-page"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '34px 18px',
        background:
          'linear-gradient(180deg, #f8f4ff 0%, #f3eefb 52%, #eee7f8 100%)'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '500px'
        }}
      >
        <div
          style={{
            textAlign: 'center',
            marginBottom: '22px'
          }}
        >
          <img
            src="/Logo%201.png"
            alt="St. Macarius the Great Coptic Orthodox Church"
            style={{
              width: '190px',
              maxWidth: '48vw',
              height: 'auto',
              display: 'block',
              margin: '0 auto 14px'
            }}
          />

          <div
            style={{
              fontSize: '13px',
              fontWeight: '800',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#6b35c0',
              marginBottom: '7px'
            }}
          >
            Bible Study Academy
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: '30px',
              color: '#1f2430'
            }}
          >
            Welcome Back
          </h1>

          <p
            style={{
              margin: '8px 0 0',
              color: '#6b7280',
              lineHeight: 1.5
            }}
          >
            St. Macarius the Great Coptic Orthodox Church
          </p>

          <p
            style={{
              margin: '5px 0 0',
              color: '#6b35c0',
              fontWeight: '700',
              fontSize: '14px'
            }}
          >
            Growing in God's Word Together
          </p>
        </div>

        <div
          className="login-card"
          style={{
            width: '100%',
            maxWidth: '460px',
            margin: '0 auto',
            boxSizing: 'border-box',
            borderRadius: '22px',
            border: '1px solid #e8e3f3',
            boxShadow: '0 18px 50px rgba(50, 33, 92, 0.10)',
            background: 'white'
          }}
        >
          <form
            onSubmit={handleLogin}
            style={{
              width: '100%',
              maxWidth: '410px',
              margin: '0 auto'
            }}
          >
            <label>Email</label>

            <input
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value)
                setErrorMessage('')
              }}
              placeholder="you@example.com"
              required
              disabled={busy}
              style={{ width: '100%' }}
            />

            <label>Password</label>

            <input
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value)
                setErrorMessage('')
              }}
              placeholder="Enter your password"
              required
              disabled={busy}
              style={{ width: '100%' }}
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

            <p
              style={{
                textAlign: 'center',
                margin: '18px 0 0',
                color: '#7b8190',
                fontSize: '13px'
              }}
            >
              Need an account? Contact your Bible Study servant.
            </p>
          </form>
        </div>
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

      if (activePage === 'Students') {
        return <AdminStudents />
      }

      if (activePage === 'Servants') {
        return <AdminServants />
      }

      if (activePage === 'Points System') {
        return <AdminPointsSystem />
      }

      if (activePage === 'Reports') {
        return <AdminReports />
      }

      if (activePage === 'Settings') {
        return <AdminSettings />
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

      if (activePage === 'My Class') {
        return <ServantMyClass profile={profile} />
      }

      if (activePage === 'Weekly Management') {
        return <ServantWeeklyManagement profile={profile} />
      }

      if (activePage === 'Students') {
        return <ServantStudents profile={profile} />
      }

      if (activePage === 'Reports') {
        return <ServantReports profile={profile} />
      }

      if (activePage === 'Profile') {
        return <ServantProfile profile={profile} />
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

      if (activePage === 'My Progress') {
        return <StudentMyProgress profile={profile} />
      }

      if (activePage === 'Daily Reading') {
        return <StudentDailyReading profile={profile} />
      }

      if (activePage === 'Homework') {
        return <StudentHomework profile={profile} />
      }

      if (activePage === 'Memory Verses') {
        return <StudentMemoryVerses profile={profile} />
      }

      if (activePage === 'Achievements') {
        return <StudentAchievements profile={profile} />
      }

      if (activePage === 'Physical Bible') {
        return <StudentPhysicalBible profile={profile} />
      }

      if (activePage === 'Attendance') {
        return <StudentAttendance profile={profile} />
      }

      if (activePage === 'Profile') {
        return <StudentProfile profile={profile} />
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
    readingStreak: 0,
    completedReadings: 0
  })

  const [currentVerse, setCurrentVerse] = useState(null)
  const [nextHomework, setNextHomework] = useState(null)
  const [todayReading, setTodayReading] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboard()
  }, [])

  function calculateReadingStreak(records) {
    const completedDates = new Set(
      records
        .filter((record) => record.completed === true)
        .map((record) => record.reading_date)
    )

    let streak = 0
    const cursor = new Date()
    cursor.setHours(12, 0, 0, 0)

    const today = cursor.toISOString().slice(0, 10)

    if (!completedDates.has(today)) {
      cursor.setDate(cursor.getDate() - 1)
    }

    while (completedDates.has(cursor.toISOString().slice(0, 10))) {
      streak += 1
      cursor.setDate(cursor.getDate() - 1)
    }

    return streak
  }

  async function loadDashboard() {
    setLoading(true)

    const studentId = profile.id
    const today = new Date().toISOString().slice(0, 10)

    const { data: membership } = await supabase
      .from('class_members')
      .select('class_id')
      .eq('student_id', studentId)
      .limit(1)
      .maybeSingle()

    const classId = membership?.class_id || null

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
        .select('present')
        .eq('student_id', studentId),

      supabase
        .from('daily_reading')
        .select('reading_date, completed')
        .eq('student_id', studentId)
        .order('reading_date', { ascending: false }),

      supabase
        .from('homework')
        .select('completed')
        .eq('student_id', studentId),

      supabase
        .from('memory_verses')
        .select('completed')
        .eq('student_id', studentId),

      supabase
        .from('physical_bible')
        .select('brought_bible')
        .eq('student_id', studentId),

      supabase
        .from('participation')
        .select('points')
        .eq('student_id', studentId),

      supabase
        .from('bonus_points')
        .select('points')
        .eq('student_id', studentId),

      supabase
        .from('point_rules')
        .select('category, points')
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
      pointRules[rule.category] = Number(rule.points) || 0
    })

    const countTrue = (items, field) =>
      items.filter((item) => item[field] === true).length

    const percentage = (complete, total) =>
      total ? Math.round((complete / total) * 100) : 0

    const attendanceCompleted = countTrue(attendance, 'present')
    const readingCompleted = countTrue(reading, 'completed')
    const homeworkCompleted = countTrue(homework, 'completed')
    const verseCompleted = countTrue(verses, 'completed')
    const bibleCompleted = countTrue(physicalBible, 'brought_bible')

    const participationPoints = participation.reduce(
      (sum, record) => sum + (Number(record.points) || 0),
      0
    )

    const bonusPoints = bonus.reduce(
      (sum, record) => sum + (Number(record.points) || 0),
      0
    )

    const totalPoints =
      attendanceCompleted * (pointRules.attendance || 0) +
      readingCompleted * (pointRules.daily_reading || 0) +
      homeworkCompleted * (pointRules.homework || 0) +
      verseCompleted * (pointRules.memory_verse || 0) +
      bibleCompleted * (pointRules.physical_bible || 0) +
      participationPoints +
      bonusPoints

    setStats({
      points: totalPoints,
      attendance: percentage(
        attendanceCompleted,
        attendance.length
      ),
      reading: percentage(readingCompleted, reading.length),
      homework: percentage(homeworkCompleted, homework.length),
      verse: percentage(verseCompleted, verses.length),
      physicalBible: percentage(
        bibleCompleted,
        physicalBible.length
      ),
      readingStreak: calculateReadingStreak(reading),
      completedReadings: readingCompleted
    })

    if (classId) {
      const [verseResult, homeworkQuizResult, readingAssignmentResult] =
        await Promise.all([
          supabase
            .from('memory_verse_assignments')
            .select(
              'id, bible_study_date, verse_reference, verse_text'
            )
            .eq('class_id', classId)
            .gte('bible_study_date', today)
            .order('bible_study_date', { ascending: true })
            .limit(1)
            .maybeSingle(),

          supabase
            .from('homework_quizzes')
            .select('id, title, bible_study_date, due_date')
            .eq('class_id', classId)
            .gte('due_date', today)
            .order('due_date', { ascending: true })
            .limit(1)
            .maybeSingle(),

          supabase
            .from('daily_reading_assignments')
            .select('id, reading_date, passage, title')
            .eq('class_id', classId)
            .eq('reading_date', today)
            .maybeSingle()
        ])

      setCurrentVerse(verseResult.data || null)
      setNextHomework(homeworkQuizResult.data || null)
      setTodayReading(readingAssignmentResult.data || null)
    }

    setLoading(false)
  }

  const overallProgress = Math.round(
    (
      stats.attendance +
      stats.reading +
      stats.homework +
      stats.verse +
      stats.physicalBible
    ) / 5
  )

  return (
    <>
      <DashboardHeader
        title={`Welcome back, ${profile.first_name}! 👋`}
        subtitle="Here's what is happening in Bible Study Academy."
      />

      <div
        className="scripture-banner"
        style={{
          padding: '22px 24px',
          borderRadius: '18px',
          lineHeight: 1.6
        }}
      >
        “I have hidden your word in my heart that I might not sin
        against you.”
        <strong> Psalm 119:11</strong>
      </div>

      <div className="stats-grid">
        <StatCard
          icon={<Trophy />}
          label="Total Points"
          value={stats.points}
          helper="All points earned"
        />

        <StatCard
          icon={<Flame />}
          label="Reading Streak"
          value={stats.readingStreak}
          helper={
            stats.readingStreak === 1
              ? 'day in a row'
              : 'days in a row'
          }
        />

        <StatCard
          icon={<CheckCircle2 />}
          label="Attendance"
          value={`${stats.attendance}%`}
          helper="Bible Study Fridays"
        />

        <StatCard
          icon={<Star />}
          label="Overall Progress"
          value={`${overallProgress}%`}
          helper="Across your main goals"
        />
      </div>

      <section className="dashboard-card">
        <h2>This Week</h2>

        {loading ? (
          <p>Loading your week...</p>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fit, minmax(230px, 1fr))',
              gap: '16px',
              marginTop: '18px'
            }}
          >
            <div
              style={{
                border: '1px solid #ececf2',
                borderRadius: '16px',
                padding: '18px'
              }}
            >
              <BookOpen size={22} />
              <h3 style={{ marginBottom: '6px' }}>
                Today's Reading
              </h3>
              <strong style={{ color: '#6b35c0' }}>
                {todayReading?.passage || 'No reading assigned today'}
              </strong>
              {todayReading?.title && (
                <p
                  style={{
                    color: '#6b7280',
                    marginBottom: 0
                  }}
                >
                  {todayReading.title}
                </p>
              )}
            </div>

            <div
              style={{
                border: '1px solid #ececf2',
                borderRadius: '16px',
                padding: '18px'
              }}
            >
              <ClipboardCheck size={22} />
              <h3 style={{ marginBottom: '6px' }}>
                Next Homework
              </h3>
              <strong style={{ color: '#6b35c0' }}>
                {nextHomework?.title || 'No upcoming homework'}
              </strong>
              {nextHomework?.due_date && (
                <p
                  style={{
                    color: '#6b7280',
                    marginBottom: 0
                  }}
                >
                  Due {nextHomework.due_date}
                </p>
              )}
            </div>

            <div
              style={{
                border: '1px solid #ececf2',
                borderRadius: '16px',
                padding: '18px'
              }}
            >
              <GraduationCap size={22} />
              <h3 style={{ marginBottom: '6px' }}>
                Memory Verse
              </h3>
              <strong style={{ color: '#6b35c0' }}>
                {currentVerse?.verse_reference ||
                  'No verse assigned yet'}
              </strong>
              {currentVerse?.bible_study_date && (
                <p
                  style={{
                    color: '#6b7280',
                    marginBottom: 0
                  }}
                >
                  For {currentVerse.bible_study_date}
                </p>
              )}
            </div>
          </div>
        )}
      </section>

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
        </div>
      </section>

      <section className="dashboard-card weekly-goal">
        <div>
          <h3>Keep Building Your Streak 🔥</h3>

          <p>
            You've completed {stats.completedReadings} Bible reading
            {stats.completedReadings === 1 ? '' : 's'} so far.
            Keep reading and collecting your SPACE PETS gems.
          </p>
        </div>

        <Flame size={30} />
      </section>
    </>
  )
}


function StudentMyProgress({ profile }) {
  const [stats, setStats] = useState({
    points: 0,
    attendance: 0,
    reading: 0,
    homework: 0,
    verse: 0,
    physicalBible: 0,
    participationPoints: 0,
    bonusPoints: 0
  })
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadProgress()
  }, [])

  async function loadProgress() {
    setLoading(true)
    setMessage('')

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
        .select('present')
        .eq('student_id', studentId),

      supabase
        .from('daily_reading')
        .select('completed')
        .eq('student_id', studentId),

      supabase
        .from('homework')
        .select('completed')
        .eq('student_id', studentId),

      supabase
        .from('memory_verses')
        .select('completed')
        .eq('student_id', studentId),

      supabase
        .from('physical_bible')
        .select('brought_bible')
        .eq('student_id', studentId),

      supabase
        .from('participation')
        .select('points')
        .eq('student_id', studentId),

      supabase
        .from('bonus_points')
        .select('points')
        .eq('student_id', studentId),

      supabase
        .from('point_rules')
        .select('category, points')
    ])

    const results = [
      attendanceResult,
      readingResult,
      homeworkResult,
      versesResult,
      bibleResult,
      participationResult,
      bonusResult,
      rulesResult
    ]

    const firstError =
      results.find((result) => result.error)?.error

    if (firstError) {
      setMessage(firstError.message)
      setLoading(false)
      return
    }

    const attendance = attendanceResult.data || []
    const reading = readingResult.data || []
    const homework = homeworkResult.data || []
    const verses = versesResult.data || []
    const bibles = bibleResult.data || []
    const participation = participationResult.data || []
    const bonus = bonusResult.data || []

    const rules = {}
    ;(rulesResult.data || []).forEach((rule) => {
      rules[rule.category] = Number(rule.points) || 0
    })

    const countTrue = (items, field) =>
      items.filter((item) => item[field] === true).length

    const percent = (items, field) =>
      items.length
        ? Math.round(
            (countTrue(items, field) / items.length) * 100
          )
        : 0

    const attendanceDone =
      countTrue(attendance, 'present')
    const readingDone =
      countTrue(reading, 'completed')
    const homeworkDone =
      countTrue(homework, 'completed')
    const verseDone =
      countTrue(verses, 'completed')
    const bibleDone =
      countTrue(bibles, 'brought_bible')

    const participationPoints = participation.reduce(
      (sum, record) =>
        sum + (Number(record.points) || 0),
      0
    )

    const bonusPoints = bonus.reduce(
      (sum, record) =>
        sum + (Number(record.points) || 0),
      0
    )

    const totalPoints =
      attendanceDone * (rules.attendance || 0) +
      readingDone * (rules.daily_reading || 0) +
      homeworkDone * (rules.homework || 0) +
      verseDone * (rules.memory_verse || 0) +
      bibleDone * (rules.physical_bible || 0) +
      participationPoints +
      bonusPoints

    setStats({
      points: totalPoints,
      attendance: percent(attendance, 'present'),
      reading: percent(reading, 'completed'),
      homework: percent(homework, 'completed'),
      verse: percent(verses, 'completed'),
      physicalBible: percent(bibles, 'brought_bible'),
      participationPoints,
      bonusPoints
    })

    setLoading(false)
  }

  return (
    <>
      <DashboardHeader
        title="My Progress"
        subtitle="See how you're growing throughout Bible Study."
      />

      {message && (
        <section className="dashboard-card">
          <p>{message}</p>
        </section>
      )}

      {loading ? (
        <section className="dashboard-card">
          <p>Loading your progress...</p>
        </section>
      ) : (
        <>
          <div className="stats-grid">
            <StatCard
              icon={<Trophy />}
              label="Total Points"
              value={stats.points}
              helper="All points earned"
            />

            <StatCard
              icon={<CheckCircle2 />}
              label="Attendance"
              value={`${stats.attendance}%`}
              helper="Bible Study attendance"
            />

            <StatCard
              icon={<BookOpen />}
              label="Daily Reading"
              value={`${stats.reading}%`}
              helper="Reading completed"
            />

            <StatCard
              icon={<Star />}
              label="Bonus Points"
              value={stats.bonusPoints}
              helper="Extra points earned"
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
            </div>
          </section>

          <section className="dashboard-card">
            <h2>Points Breakdown</h2>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Progress / Points</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td>Daily Reading</td>
                    <td>{stats.reading}%</td>
                  </tr>
                  <tr>
                    <td>Attendance</td>
                    <td>{stats.attendance}%</td>
                  </tr>
                  <tr>
                    <td>Homework</td>
                    <td>{stats.homework}%</td>
                  </tr>
                  <tr>
                    <td>Memory Verse</td>
                    <td>{stats.verse}%</td>
                  </tr>
                  <tr>
                    <td>Physical Bible</td>
                    <td>{stats.physicalBible}%</td>
                  </tr>
                  <tr>
                    <td>Participation</td>
                    <td>{stats.participationPoints} pts</td>
                  </tr>
                  <tr>
                    <td>Bonus</td>
                    <td>{stats.bonusPoints} pts</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Total</strong>
                    </td>
                    <td>
                      <strong>{stats.points} pts</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </>
  )
}



function StudentDailyReading({ profile }) {
  const today = new Date().toISOString().slice(0, 10)

  const emptyGems = {
    sin: '',
    promise: '',
    attitude: '',
    command: '',
    example: '',
    prayer: '',
    error: '',
    truth: '',
    thanks: ''
  }

  const [classId, setClassId] = useState(null)
  const [assignment, setAssignment] = useState(null)
  const [completed, setCompleted] = useState(false)
  const [gems, setGems] = useState(emptyGems)
  const [history, setHistory] = useState([])
  const [streak, setStreak] = useState(0)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadDailyReading()
  }, [])

  async function loadDailyReading() {
    setLoading(true)
    setMessage('')

    const { data: membership, error: membershipError } =
      await supabase
        .from('class_members')
        .select('class_id')
        .eq('student_id', profile.id)
        .limit(1)
        .maybeSingle()

    if (membershipError) {
      setMessage(membershipError.message)
      setLoading(false)
      return
    }

    if (!membership) {
      setMessage('You are not assigned to a Bible Study class yet.')
      setLoading(false)
      return
    }

    setClassId(membership.class_id)

    const [assignmentResult, readingResult] = await Promise.all([
      supabase
        .from('reading_assignments')
        .select('id, reading_date, title, passage, notes')
        .eq('class_id', membership.class_id)
        .eq('reading_date', today)
        .maybeSingle(),

      supabase
        .from('daily_reading')
        .select('reading_date, completed, gems')
        .eq('student_id', profile.id)
        .order('reading_date', { ascending: false })
    ])

    if (assignmentResult.error) {
      setMessage(assignmentResult.error.message)
      setLoading(false)
      return
    }

    if (readingResult.error) {
      setMessage(readingResult.error.message)
      setLoading(false)
      return
    }

    setAssignment(assignmentResult.data || null)

    const records = readingResult.data || []
    setHistory(records)

    const todayRecord = records.find(
      (record) => record.reading_date === today
    )

    setCompleted(todayRecord?.completed === true)
    setGems({
      ...emptyGems,
      ...(todayRecord?.gems || {})
    })

    calculateStreak(records)
    setLoading(false)
  }

  function calculateStreak(records) {
    const completedDates = new Set(
      records
        .filter((record) => record.completed === true)
        .map((record) => record.reading_date)
    )

    let count = 0
    const cursor = new Date(`${today}T12:00:00`)

    while (completedDates.has(cursor.toISOString().slice(0, 10))) {
      count += 1
      cursor.setDate(cursor.getDate() - 1)
    }

    setStreak(count)
  }

  function updateGem(field, value) {
    setGems((current) => ({
      ...current,
      [field]: value
    }))
    setMessage('')
  }

  async function saveReading() {
    if (!assignment) {
      setMessage('There is no reading assigned for today.')
      return
    }

    if (!completed) {
      setMessage(
        "Check that you completed today's reading before submitting."
      )
      return
    }

    setSaving(true)
    setMessage('')

    const { error: deleteError } = await supabase
      .from('daily_reading')
      .delete()
      .eq('student_id', profile.id)
      .eq('reading_date', today)

    if (deleteError) {
      setMessage(deleteError.message)
      setSaving(false)
      return
    }

    const { error: insertError } = await supabase
      .from('daily_reading')
      .insert({
        student_id: profile.id,
        reading_date: today,
        completed: true,
        gems
      })

    if (insertError) {
      setMessage(insertError.message)
      setSaving(false)
      return
    }

    await loadDailyReading()
    setMessage('Great job! Today’s reading has been completed. 💎')
    setSaving(false)
  }

  const completedCount = history.filter(
    (record) => record.completed === true
  ).length

  const gemFields = [
    ['sin', 'S', 'Sin to confess'],
    ['promise', 'P', 'Promise to claim'],
    ['attitude', 'A', 'Attitude to change'],
    ['command', 'C', 'Command to keep'],
    ['example', 'E', 'Example to follow'],
    ['prayer', 'P', 'Prayer to pray'],
    ['error', 'E', 'Error to avoid'],
    ['truth', 'T', 'Truth to believe'],
    ['thanks', 'S', 'Something to thank God for']
  ]

  const lastSevenDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(`${today}T12:00:00`)
    date.setDate(date.getDate() - index)
    const dateString = date.toISOString().slice(0, 10)
    const record = history.find(
      (item) => item.reading_date === dateString
    )

    return {
      date: dateString,
      label: date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      }),
      completed: record?.completed === true
    }
  })

  return (
    <>
      <DashboardHeader
        title="Daily Reading"
        subtitle="Read God's Word, discover your gems, and keep growing."
      />

      {message && (
        <div
          style={{
            marginTop: '20px',
            padding: '12px 14px',
            borderRadius: '12px',
            background:
              message.includes('Great job')
                ? '#ecfdf3'
                : '#fef3f2',
            color:
              message.includes('Great job')
                ? '#087257'
                : '#b42318',
            fontWeight: '600'
          }}
        >
          {message}
        </div>
      )}

      {loading ? (
        <section className="dashboard-card">
          <p>Loading today's reading...</p>
        </section>
      ) : (
        <>
          <div className="stats-grid">
            <StatCard
              icon={<Flame />}
              label="Reading Streak"
              value={streak}
              helper={streak === 1 ? 'day in a row' : 'days in a row'}
            />

            <StatCard
              icon={<BookOpen />}
              label="Completed"
              value={completedCount}
              helper="Total reading days"
            />

            <StatCard
              icon={<CheckCircle2 />}
              label="Today"
              value={completed ? 'Done ✓' : 'Not Yet'}
              helper={today}
            />
          </div>

          <section className="dashboard-card">
            <h2>Today's Reading</h2>

            {assignment ? (
              <div
                style={{
                  marginTop: '16px',
                  padding: '20px',
                  borderRadius: '16px',
                  border: '1px solid #e8e3f3',
                  background: '#faf8ff'
                }}
              >
                {assignment.title && (
                  <h3 style={{ marginTop: 0 }}>
                    {assignment.title}
                  </h3>
                )}

                <div
                  style={{
                    fontSize: '22px',
                    fontWeight: '800',
                    color: '#6b35c0',
                    margin: '8px 0'
                  }}
                >
                  {assignment.passage}
                </div>

                {assignment.notes && (
                  <p
                    style={{
                      color: '#606575',
                      marginBottom: 0
                    }}
                  >
                    {assignment.notes}
                  </p>
                )}
              </div>
            ) : (
              <div
                style={{
                  marginTop: '16px',
                  padding: '20px',
                  borderRadius: '16px',
                  border: '1px solid #ececf2'
                }}
              >
                <strong>No reading has been assigned for today.</strong>
                <p
                  style={{
                    color: '#6b7280',
                    marginBottom: 0
                  }}
                >
                  Check back after your servant assigns today's reading.
                </p>
              </div>
            )}

            {assignment && (
              <label
                style={{
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'center',
                  marginTop: '20px',
                  cursor: 'pointer'
                }}
              >
                <input
                  type="checkbox"
                  checked={completed}
                  onChange={(event) => {
                    setCompleted(event.target.checked)
                    setMessage('')
                  }}
                  disabled={saving}
                  style={{
                    width: '22px',
                    height: '22px'
                  }}
                />
                <strong>
                  I finished today's Bible reading
                </strong>
              </label>
            )}
          </section>

          {assignment && (
            <section className="dashboard-card">
              <h2>SPACE PETS Gems 💎</h2>

              <p
                style={{
                  color: '#6b7280',
                  marginTop: '-8px'
                }}
              >
                You do not have to find every kind of gem every day.
                Write down the gems you discover while reading.
              </p>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: '14px',
                  marginTop: '18px'
                }}
              >
                {gemFields.map(([field, letter, label]) => (
                  <div
                    key={field}
                    style={{
                      border: '1px solid #ececf2',
                      borderRadius: '14px',
                      padding: '14px'
                    }}
                  >
                    <label
                      style={{
                        display: 'flex',
                        gap: '8px',
                        alignItems: 'center'
                      }}
                    >
                      <span
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          display: 'inline-flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          background: '#f3edff',
                          color: '#6b35c0',
                          fontWeight: '800'
                        }}
                      >
                        {letter}
                      </span>
                      {label}
                    </label>

                    <textarea
                      rows="3"
                      value={gems[field]}
                      onChange={(event) =>
                        updateGem(field, event.target.value)
                      }
                      placeholder="What did you find?"
                      disabled={saving || completed}
                      style={{
                        width: '100%',
                        marginTop: '10px',
                        resize: 'vertical',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: '1px solid #dfe2ea',
                        font: 'inherit'
                      }}
                    />
                  </div>
                ))}
              </div>

              {!completed && (
                <button
                  className="primary-button small-button"
                  type="button"
                  onClick={saveReading}
                  disabled={saving}
                  style={{
                    width: 'auto',
                    marginTop: '20px'
                  }}
                >
                  {saving
                    ? 'Submitting...'
                    : 'Complete Today’s Reading'}
                </button>
              )}

              {completed && (
                <div
                  style={{
                    marginTop: '20px',
                    fontWeight: '700',
                    color: '#087257'
                  }}
                >
                  ✓ Today's reading is complete!
                </div>
              )}
            </section>
          )}

          <section className="dashboard-card">
            <h2>Last 7 Days</h2>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {lastSevenDays.map((day) => (
                    <tr key={day.date}>
                      <td>{day.label}</td>
                      <td>
                        {day.completed ? (
                          <span
                            style={{
                              color: '#087257',
                              fontWeight: '700'
                            }}
                          >
                            ✓ Completed
                          </span>
                        ) : (
                          <span style={{ color: '#8a8f9c' }}>
                            Not completed
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </>
  )
}



function StudentHomework({ profile }) {
  const [classId, setClassId] = useState(null)
  const [quizzes, setQuizzes] = useState([])
  const [submissions, setSubmissions] = useState([])
  const [activeQuiz, setActiveQuiz] = useState(null)
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(true)
  const [loadingQuiz, setLoadingQuiz] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadHomework()
  }, [])

  async function loadHomework() {
    setLoading(true)
    setMessage('')

    const { data: membership, error: membershipError } =
      await supabase
        .from('class_members')
        .select('class_id')
        .eq('student_id', profile.id)
        .limit(1)
        .maybeSingle()

    if (membershipError) {
      setMessage(membershipError.message)
      setLoading(false)
      return
    }

    if (!membership) {
      setMessage('You are not assigned to a Bible Study class yet.')
      setLoading(false)
      return
    }

    setClassId(membership.class_id)

    const [quizResult, submissionResult] = await Promise.all([
      supabase
        .from('homework_quizzes')
        .select('id, bible_study_date, title, due_date, created_at')
        .eq('class_id', membership.class_id)
        .order('bible_study_date', { ascending: false }),

      supabase
        .from('homework_submissions')
        .select(
          'id, quiz_id, score, total_questions, percentage, submitted_at'
        )
        .eq('student_id', profile.id)
        .order('submitted_at', { ascending: false })
    ])

    if (quizResult.error || submissionResult.error) {
      setMessage(
        quizResult.error?.message ||
        submissionResult.error?.message
      )
      setLoading(false)
      return
    }

    setQuizzes(quizResult.data || [])
    setSubmissions(submissionResult.data || [])
    setLoading(false)
  }

  function submissionForQuiz(quizId) {
    return submissions.find(
      (submission) => submission.quiz_id === quizId
    )
  }

  async function openQuiz(quiz) {
    const existingSubmission = submissionForQuiz(quiz.id)

    if (existingSubmission) {
      setResult(existingSubmission)
      setActiveQuiz(quiz)
      setQuestions([])
      setAnswers({})
      setMessage('')
      return
    }

    setLoadingQuiz(true)
    setMessage('')
    setResult(null)

    const { data, error } = await supabase.functions.invoke(
      'get-homework-quiz',
      {
        body: {
          quiz_id: quiz.id
        }
      }
    )

    if (error) {
      let detail = error.message

      try {
        if (error.context) {
          const body = await error.context.json()
          detail = body?.error || detail
        }
      } catch {
        // Keep original message.
      }

      setMessage(detail || 'Could not load the homework quiz.')
      setLoadingQuiz(false)
      return
    }

    if (data?.error) {
      setMessage(data.error)
      setLoadingQuiz(false)
      return
    }

    setActiveQuiz(data.quiz || quiz)

    if (data?.submission) {
      setResult(data.submission)
      setQuestions([])
    } else {
      setResult(null)
      setQuestions(data.questions || [])
    }

    setAnswers({})
    setLoadingQuiz(false)
  }

  function updateAnswer(questionId, value) {
    setAnswers((current) => ({
      ...current,
      [questionId]: value
    }))
    setMessage('')
  }

  function updateMatchingAnswer(questionId, leftIndex, value) {
    setAnswers((current) => ({
      ...current,
      [questionId]: {
        ...(current[questionId] || {}),
        [leftIndex]: value
      }
    }))
    setMessage('')
  }

  function questionAnswered(question) {
    const answer = answers[question.id]

    if (question.question_type === 'matching') {
      const pairCount = question.question_data?.left_items?.length || 0
      if (!pairCount) return false

      return Array.from({ length: pairCount }).every(
        (_, index) => answer?.[index]
      )
    }

    if (question.question_type === 'fill_blank') {
      return typeof answer === 'string' && answer.trim().length > 0
    }

    return Boolean(answer)
  }

  async function submitQuiz() {
    if (!activeQuiz || !questions.length) return

    const unanswered = questions.filter(
      (question) => !questionAnswered(question)
    )

    if (unanswered.length) {
      setMessage(
        `Please answer every question before submitting. ${unanswered.length} left.`
      )
      return
    }

    const confirmed = window.confirm(
      'Submit your homework? You will not be able to retake it after submitting.'
    )

    if (!confirmed) return

    setSubmitting(true)
    setMessage('')

    const payloadAnswers = questions.map((question) => ({
      question_id: question.id,
      answer: answers[question.id]
    }))

    const { data, error } = await supabase.functions.invoke(
      'submit-homework-quiz',
      {
        body: {
          quiz_id: activeQuiz.id,
          answers: payloadAnswers
        }
      }
    )

    if (error) {
      let detail = error.message

      try {
        if (error.context) {
          const body = await error.context.json()
          detail = body?.error || detail
        }
      } catch {
        // Keep original message.
      }

      setMessage(detail || 'Could not submit the homework quiz.')
      setSubmitting(false)
      return
    }

    if (data?.error) {
      setMessage(data.error)
      setSubmitting(false)
      return
    }

    setResult(data.submission)
    setQuestions([])
    setAnswers({})

    setSubmissions((current) => [
      data.submission,
      ...current.filter(
        (submission) => submission.quiz_id !== activeQuiz.id
      )
    ])

    setMessage('Homework submitted successfully!')
    await loadHomework()
    setSubmitting(false)
  }

  function renderQuestion(question, index) {
    const data = question.question_data || {}

    if (question.question_type === 'multiple_choice') {
      const choices = data.choices || []

      return (
        <div
          key={question.id}
          style={{
            border: '1px solid #e7e7ef',
            borderRadius: '16px',
            padding: '18px',
            marginBottom: '16px'
          }}
        >
          <strong>
            {index + 1}. {question.question_text}
          </strong>

          <div
            style={{
              display: 'grid',
              gap: '10px',
              marginTop: '14px'
            }}
          >
            {choices.map((choice, choiceIndex) => {
              const letter = ['A', 'B', 'C', 'D'][choiceIndex]

              return (
                <label
                  key={letter}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px 14px',
                    border:
                      answers[question.id] === letter
                        ? '2px solid #6b35c0'
                        : '1px solid #dfe2ea',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    background:
                      answers[question.id] === letter
                        ? '#f7f2ff'
                        : 'white'
                  }}
                >
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    checked={answers[question.id] === letter}
                    onChange={() =>
                      updateAnswer(question.id, letter)
                    }
                  />
                  <strong>{letter}.</strong>
                  <span>{choice}</span>
                </label>
              )
            })}
          </div>
        </div>
      )
    }

    if (question.question_type === 'true_false') {
      return (
        <div
          key={question.id}
          style={{
            border: '1px solid #e7e7ef',
            borderRadius: '16px',
            padding: '18px',
            marginBottom: '16px'
          }}
        >
          <strong>
            {index + 1}. {question.question_text}
          </strong>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '10px',
              marginTop: '14px',
              maxWidth: '440px'
            }}
          >
            {[
              ['true', 'True'],
              ['false', 'False']
            ].map(([value, label]) => (
              <label
                key={value}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '14px 16px',
                  border:
                    answers[question.id] === value
                      ? '2px solid #6b35c0'
                      : '1px solid #dfe2ea',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  background:
                    answers[question.id] === value
                      ? '#f7f2ff'
                      : 'white',
                  fontWeight: '700'
                }}
              >
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  checked={answers[question.id] === value}
                  onChange={() =>
                    updateAnswer(question.id, value)
                  }
                />
                {label}
              </label>
            ))}
          </div>
        </div>
      )
    }

    if (question.question_type === 'fill_blank') {
      return (
        <div
          key={question.id}
          style={{
            border: '1px solid #e7e7ef',
            borderRadius: '16px',
            padding: '18px',
            marginBottom: '16px'
          }}
        >
          <strong>
            {index + 1}. {question.question_text}
          </strong>

          <div style={{ marginTop: '14px', maxWidth: '520px' }}>
            <label>Your Answer</label>
            <input
              type="text"
              value={answers[question.id] || ''}
              onChange={(event) =>
                updateAnswer(question.id, event.target.value)
              }
              placeholder="Type your answer..."
              style={{ width: '100%' }}
            />
          </div>
        </div>
      )
    }

    if (question.question_type === 'matching') {
      const leftItems = data.left_items || []
      const rightItems = data.right_items || []

      return (
        <div
          key={question.id}
          style={{
            border: '1px solid #e7e7ef',
            borderRadius: '16px',
            padding: '18px',
            marginBottom: '16px'
          }}
        >
          <strong>
            {index + 1}. {question.question_text}
          </strong>

          <p
            style={{
              color: '#6b7280',
              fontSize: '14px'
            }}
          >
            Match each item on the left with the correct answer.
          </p>

          <div style={{ display: 'grid', gap: '12px' }}>
            {leftItems.map((leftItem, leftIndex) => (
              <div
                key={`${question.id}-${leftIndex}`}
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    'minmax(160px, 1fr) minmax(180px, 1fr)',
                  gap: '12px',
                  alignItems: 'center'
                }}
              >
                <div
                  style={{
                    padding: '11px 12px',
                    borderRadius: '10px',
                    background: '#fafafa',
                    border: '1px solid #e7e7ef',
                    fontWeight: '700'
                  }}
                >
                  {leftItem}
                </div>

                <select
                  value={
                    answers[question.id]?.[leftIndex] || ''
                  }
                  onChange={(event) =>
                    updateMatchingAnswer(
                      question.id,
                      leftIndex,
                      event.target.value
                    )
                  }
                  style={{ width: '100%' }}
                >
                  <option value="">Choose a match</option>
                  {rightItems.map((rightItem, optionIndex) => (
                    <option
                      key={`${rightItem}-${optionIndex}`}
                      value={rightItem}
                    >
                      {rightItem}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      )
    }

    return null
  }

  if (activeQuiz) {
    return (
      <>
        <button
          type="button"
          onClick={() => {
            setActiveQuiz(null)
            setQuestions([])
            setAnswers({})
            setResult(null)
            setMessage('')
          }}
          style={{
            border: 'none',
            background: 'transparent',
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            padding: 0,
            marginBottom: '18px',
            cursor: 'pointer',
            color: '#6b35c0',
            fontWeight: '700'
          }}
        >
          <ArrowLeft size={18} />
          Back to Homework
        </button>

        <DashboardHeader
          title={activeQuiz.title}
          subtitle={
            activeQuiz.due_date
              ? `Due ${activeQuiz.due_date}`
              : `Bible Study Week: ${activeQuiz.bible_study_date}`
          }
        />

        {message && (
          <div
            style={{
              marginTop: '20px',
              padding: '12px 14px',
              borderRadius: '12px',
              background: message.includes('successfully')
                ? '#ecfdf3'
                : '#fef3f2',
              color: message.includes('successfully')
                ? '#087257'
                : '#b42318',
              fontWeight: '600'
            }}
          >
            {message}
          </div>
        )}

        {loadingQuiz ? (
          <section className="dashboard-card">
            <p>Loading homework...</p>
          </section>
        ) : result ? (
          <section className="dashboard-card">
            <h2>Homework Complete 🎉</h2>

            <div className="stats-grid">
              <StatCard
                icon={<CheckCircle2 />}
                label="Score"
                value={`${result.score}/${result.total_questions}`}
                helper="Questions correct"
              />

              <StatCard
                icon={<Trophy />}
                label="Grade"
                value={`${Math.round(Number(result.percentage) || 0)}%`}
                helper="Final score"
              />
            </div>

            <p
              style={{
                marginTop: '18px',
                color: '#6b7280'
              }}
            >
              This homework has already been submitted.
            </p>
          </section>
        ) : (
          <section className="dashboard-card">
            <h2>Questions</h2>

            {questions.map((question, index) =>
              renderQuestion(question, index)
            )}

            {!questions.length && (
              <p>No questions were found for this quiz.</p>
            )}

            {!!questions.length && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginTop: '20px'
                }}
              >
                <button
                  className="primary-button small-button"
                  type="button"
                  onClick={submitQuiz}
                  disabled={submitting}
                  style={{ width: 'auto' }}
                >
                  {submitting
                    ? 'Submitting...'
                    : 'Submit Homework'}
                </button>
              </div>
            )}
          </section>
        )}
      </>
    )
  }

  return (
    <>
      <DashboardHeader
        title="Homework"
        subtitle="Complete your weekly Bible Study quizzes."
      />

      {message && (
        <section className="dashboard-card">
          <p>{message}</p>
        </section>
      )}

      {loading ? (
        <section className="dashboard-card">
          <p>Loading homework...</p>
        </section>
      ) : (
        <section
          className="dashboard-card"
          style={{ marginTop: '24px' }}
        >
          <h2>My Homework</h2>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Bible Study Week</th>
                  <th>Quiz</th>
                  <th>Due</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {quizzes.map((quiz) => {
                  const submission =
                    submissionForQuiz(quiz.id)

                  return (
                    <tr key={quiz.id}>
                      <td>{quiz.bible_study_date}</td>
                      <td>
                        <strong>{quiz.title}</strong>
                      </td>
                      <td>{quiz.due_date || '—'}</td>
                      <td>
                        {submission ? (
                          <span
                            style={{
                              color: '#087257',
                              fontWeight: '700'
                            }}
                          >
                            Completed •{' '}
                            {Math.round(
                              Number(submission.percentage) || 0
                            )}
                            %
                          </span>
                        ) : (
                          <span
                            style={{
                              color: '#8a5a00',
                              fontWeight: '700'
                            }}
                          >
                            Not completed
                          </span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          type="button"
                          onClick={() => openQuiz(quiz)}
                          style={{
                            border: 'none',
                            background: 'transparent',
                            color: '#6b35c0',
                            fontWeight: '700',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          {submission ? 'View Score' : 'Take Quiz'}
                          <ChevronRight size={17} />
                        </button>
                      </td>
                    </tr>
                  )
                })}

                {!quizzes.length && (
                  <tr>
                    <td colSpan="5">
                      No homework has been assigned yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </>
  )
}



function StudentMemoryVerses({ profile }) {
  const today = new Date().toISOString().slice(0, 10)

  const [classId, setClassId] = useState(null)
  const [assignments, setAssignments] = useState([])
  const [completionRecords, setCompletionRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadMemoryVerses()
  }, [])

  async function loadMemoryVerses() {
    setLoading(true)
    setMessage('')

    const { data: membership, error: membershipError } =
      await supabase
        .from('class_members')
        .select('class_id')
        .eq('student_id', profile.id)
        .limit(1)
        .maybeSingle()

    if (membershipError) {
      setMessage(membershipError.message)
      setLoading(false)
      return
    }

    if (!membership) {
      setMessage('You are not assigned to a Bible Study class yet.')
      setLoading(false)
      return
    }

    setClassId(membership.class_id)

    const [assignmentResult, completionResult] = await Promise.all([
      supabase
        .from('memory_verse_assignments')
        .select(
          'id, class_id, bible_study_date, verse_reference, verse_text, notes, created_at'
        )
        .eq('class_id', membership.class_id)
        .order('bible_study_date', { ascending: true }),

      supabase
        .from('memory_verses')
        .select(
          'id, student_id, class_id, bible_study_date, completed, recorded_by'
        )
        .eq('student_id', profile.id)
        .eq('class_id', membership.class_id)
        .order('bible_study_date', { ascending: false })
    ])

    if (assignmentResult.error || completionResult.error) {
      setMessage(
        assignmentResult.error?.message ||
        completionResult.error?.message
      )
      setLoading(false)
      return
    }

    setAssignments(assignmentResult.data || [])
    setCompletionRecords(completionResult.data || [])
    setLoading(false)
  }

  function isCompleted(date) {
    return completionRecords.some(
      (record) =>
        record.bible_study_date === date &&
        record.completed === true
    )
  }

  function prettyDate(dateString) {
    if (!dateString) return ''

    return new Date(`${dateString}T12:00:00`).toLocaleDateString(
      'en-US',
      {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      }
    )
  }

  const upcomingAssignments = assignments
    .filter((item) => item.bible_study_date >= today)
    .sort((a, b) =>
      a.bible_study_date.localeCompare(b.bible_study_date)
    )

  const pastAssignments = assignments
    .filter((item) => item.bible_study_date < today)
    .sort((a, b) =>
      b.bible_study_date.localeCompare(a.bible_study_date)
    )

  const currentAssignment =
    upcomingAssignments[0] || pastAssignments[0] || null

  const history = assignments
    .filter(
      (item) =>
        !currentAssignment ||
        item.id !== currentAssignment.id
    )
    .sort((a, b) =>
      b.bible_study_date.localeCompare(a.bible_study_date)
    )

  const completedCount = assignments.filter((item) =>
    isCompleted(item.bible_study_date)
  ).length

  return (
    <>
      <DashboardHeader
        title="Memory Verses"
        subtitle="Hide God's Word in your heart, one verse at a time."
      />

      {message && (
        <section className="dashboard-card">
          <p>{message}</p>
        </section>
      )}

      {loading ? (
        <section className="dashboard-card">
          <p>Loading memory verses...</p>
        </section>
      ) : (
        <>
          <div className="stats-grid">
            <StatCard
              icon={<GraduationCap />}
              label="Verses Assigned"
              value={assignments.length}
              helper="Total verses"
            />

            <StatCard
              icon={<CheckCircle2 />}
              label="Recited"
              value={completedCount}
              helper="Marked by your servant"
            />

            <StatCard
              icon={<Star />}
              label="Current Status"
              value={
                currentAssignment &&
                isCompleted(currentAssignment.bible_study_date)
                  ? 'Recited ✓'
                  : 'Not Yet'
              }
              helper={
                currentAssignment
                  ? currentAssignment.verse_reference
                  : 'No verse assigned'
              }
            />
          </div>

          <section className="dashboard-card">
            <h2>This Week's Memory Verse</h2>

            {currentAssignment ? (
              <div
                style={{
                  marginTop: '16px',
                  padding: '24px',
                  borderRadius: '18px',
                  border: '1px solid #e8e3f3',
                  background: '#faf8ff'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '16px',
                    flexWrap: 'wrap'
                  }}
                >
                  <div>
                    <div
                      style={{
                        color: '#6b35c0',
                        fontWeight: '800',
                        fontSize: '14px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em'
                      }}
                    >
                      {prettyDate(
                        currentAssignment.bible_study_date
                      )}
                    </div>

                    <h2
                      style={{
                        margin: '8px 0 0',
                        fontSize: '28px'
                      }}
                    >
                      {currentAssignment.verse_reference}
                    </h2>
                  </div>

                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '7px',
                      padding: '9px 13px',
                      borderRadius: '999px',
                      fontWeight: '800',
                      background: isCompleted(
                        currentAssignment.bible_study_date
                      )
                        ? '#ecfdf3'
                        : '#fff7e6',
                      color: isCompleted(
                        currentAssignment.bible_study_date
                      )
                        ? '#087257'
                        : '#8a5a00'
                    }}
                  >
                    {isCompleted(
                      currentAssignment.bible_study_date
                    )
                      ? '✓ Recited'
                      : 'Not Recited Yet'}
                  </span>
                </div>

                {currentAssignment.verse_text && (
                  <blockquote
                    style={{
                      margin: '24px 0 0',
                      padding: '18px 20px',
                      borderLeft: '4px solid #6b35c0',
                      background: 'white',
                      borderRadius: '0 14px 14px 0',
                      fontSize: '20px',
                      lineHeight: 1.6,
                      color: '#242938'
                    }}
                  >
                    “{currentAssignment.verse_text}”
                  </blockquote>
                )}

                {currentAssignment.notes && (
                  <div
                    style={{
                      marginTop: '18px',
                      padding: '14px 16px',
                      borderRadius: '12px',
                      background: 'white',
                      border: '1px solid #ececf2'
                    }}
                  >
                    <strong>Servant Note</strong>
                    <p
                      style={{
                        marginBottom: 0,
                        color: '#606575'
                      }}
                    >
                      {currentAssignment.notes}
                    </p>
                  </div>
                )}

                {!isCompleted(
                  currentAssignment.bible_study_date
                ) && (
                  <p
                    style={{
                      marginTop: '18px',
                      marginBottom: 0,
                      color: '#6b7280',
                      fontSize: '14px'
                    }}
                  >
                    When you recite this verse to your servant,
                    they will mark it complete for you.
                  </p>
                )}
              </div>
            ) : (
              <div
                style={{
                  marginTop: '16px',
                  padding: '20px',
                  borderRadius: '14px',
                  border: '1px solid #ececf2'
                }}
              >
                <strong>
                  No memory verse has been assigned yet.
                </strong>
                <p
                  style={{
                    marginBottom: 0,
                    color: '#6b7280'
                  }}
                >
                  Check back after your servant assigns this week's
                  verse.
                </p>
              </div>
            )}
          </section>

          <section className="dashboard-card">
            <h2>Previous Memory Verses</h2>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Bible Study Week</th>
                    <th>Verse</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {history.map((item) => (
                    <tr key={item.id}>
                      <td>{prettyDate(item.bible_study_date)}</td>

                      <td>
                        <strong>{item.verse_reference}</strong>

                        {item.verse_text && (
                          <div
                            style={{
                              color: '#6b7280',
                              fontSize: '14px',
                              marginTop: '4px',
                              maxWidth: '620px'
                            }}
                          >
                            {item.verse_text}
                          </div>
                        )}
                      </td>

                      <td>
                        {isCompleted(item.bible_study_date) ? (
                          <span
                            style={{
                              color: '#087257',
                              fontWeight: '800'
                            }}
                          >
                            ✓ Recited
                          </span>
                        ) : (
                          <span
                            style={{
                              color: '#8a8f9c',
                              fontWeight: '700'
                            }}
                          >
                            Not Recited
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}

                  {!history.length && (
                    <tr>
                      <td colSpan="3">
                        No previous memory verses yet.
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



function StudentAchievements({ profile }) {
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [summary, setSummary] = useState({
    points: 0,
    attendanceCount: 0,
    readingCount: 0,
    readingStreak: 0,
    homeworkCount: 0,
    perfectHomeworkCount: 0,
    verseCount: 0,
    bibleCount: 0
  })

  useEffect(() => {
    loadAchievements()
  }, [])

  function calculateReadingStreak(records) {
    const completedDates = new Set(
      records
        .filter((record) => record.completed === true)
        .map((record) => record.reading_date)
    )

    let streak = 0
    const cursor = new Date()
    cursor.setHours(12, 0, 0, 0)

    const today = cursor.toISOString().slice(0, 10)

    if (!completedDates.has(today)) {
      cursor.setDate(cursor.getDate() - 1)
    }

    while (completedDates.has(cursor.toISOString().slice(0, 10))) {
      streak += 1
      cursor.setDate(cursor.getDate() - 1)
    }

    return streak
  }

  async function loadAchievements() {
    setLoading(true)
    setMessage('')

    const studentId = profile.id

    const [
      attendanceResult,
      readingResult,
      homeworkResult,
      submissionResult,
      versesResult,
      bibleResult,
      participationResult,
      bonusResult,
      rulesResult
    ] = await Promise.all([
      supabase
        .from('attendance')
        .select('present')
        .eq('student_id', studentId),

      supabase
        .from('daily_reading')
        .select('reading_date, completed')
        .eq('student_id', studentId)
        .order('reading_date', { ascending: false }),

      supabase
        .from('homework')
        .select('completed')
        .eq('student_id', studentId),

      supabase
        .from('homework_submissions')
        .select('percentage')
        .eq('student_id', studentId),

      supabase
        .from('memory_verses')
        .select('completed')
        .eq('student_id', studentId),

      supabase
        .from('physical_bible')
        .select('brought_bible')
        .eq('student_id', studentId),

      supabase
        .from('participation')
        .select('points')
        .eq('student_id', studentId),

      supabase
        .from('bonus_points')
        .select('points')
        .eq('student_id', studentId),

      supabase
        .from('point_rules')
        .select('category, points')
    ])

    const results = [
      attendanceResult,
      readingResult,
      homeworkResult,
      submissionResult,
      versesResult,
      bibleResult,
      participationResult,
      bonusResult,
      rulesResult
    ]

    const firstError =
      results.find((result) => result.error)?.error

    if (firstError) {
      setMessage(firstError.message)
      setLoading(false)
      return
    }

    const attendance = attendanceResult.data || []
    const reading = readingResult.data || []
    const homework = homeworkResult.data || []
    const submissions = submissionResult.data || []
    const verses = versesResult.data || []
    const bibles = bibleResult.data || []
    const participation = participationResult.data || []
    const bonus = bonusResult.data || []

    const countTrue = (items, field) =>
      items.filter((item) => item[field] === true).length

    const attendanceCount = countTrue(attendance, 'present')
    const readingCount = countTrue(reading, 'completed')
    const homeworkCount = countTrue(homework, 'completed')
    const verseCount = countTrue(verses, 'completed')
    const bibleCount = countTrue(bibles, 'brought_bible')

    const perfectHomeworkCount = submissions.filter(
      (submission) => Number(submission.percentage) >= 100
    ).length

    const participationPoints = participation.reduce(
      (sum, record) => sum + (Number(record.points) || 0),
      0
    )

    const bonusPoints = bonus.reduce(
      (sum, record) => sum + (Number(record.points) || 0),
      0
    )

    const rules = {}
    ;(rulesResult.data || []).forEach((rule) => {
      rules[rule.category] = Number(rule.points) || 0
    })

    const points =
      attendanceCount * (rules.attendance || 0) +
      readingCount * (rules.daily_reading || 0) +
      homeworkCount * (rules.homework || 0) +
      verseCount * (rules.memory_verse || 0) +
      bibleCount * (rules.physical_bible || 0) +
      participationPoints +
      bonusPoints

    setSummary({
      points,
      attendanceCount,
      readingCount,
      readingStreak: calculateReadingStreak(reading),
      homeworkCount,
      perfectHomeworkCount,
      verseCount,
      bibleCount
    })

    setLoading(false)
  }

  const tracks = [
    {
      id: 'reader',
      emoji: '💎',
      title: 'Bible Reader',
      value: summary.readingCount,
      unit: 'readings',
      levels: [
        { goal: 1, name: 'First Gem' },
        { goal: 10, name: 'Gem Finder' },
        { goal: 25, name: 'Gem Collector' },
        { goal: 50, name: 'Gem Hunter' },
        { goal: 100, name: 'Treasure Keeper' }
      ]
    },
    {
      id: 'streak',
      emoji: '🔥',
      title: 'Reading Streak',
      value: summary.readingStreak,
      unit: 'days',
      levels: [
        { goal: 3, name: 'Spark' },
        { goal: 7, name: 'Flame' },
        { goal: 14, name: 'Fire' },
        { goal: 30, name: 'Torch' },
        { goal: 50, name: 'Beacon' }
      ]
    },
    {
      id: 'homework',
      emoji: '✏️',
      title: 'Homework Hero',
      value: summary.homeworkCount,
      unit: 'homework assignments',
      levels: [
        { goal: 1, name: 'Starter' },
        { goal: 5, name: 'Learner' },
        { goal: 10, name: 'Scholar' },
        { goal: 20, name: 'Homework Hero' },
        { goal: 30, name: 'Homework Champion' }
      ]
    },
    {
      id: 'quiz',
      emoji: '🏆',
      title: 'Quiz Master',
      value: summary.perfectHomeworkCount,
      unit: 'perfect scores',
      levels: [
        { goal: 1, name: 'Sharp Mind' },
        { goal: 3, name: 'Quiz Whiz' },
        { goal: 5, name: 'Bible Brain' },
        { goal: 10, name: 'Quiz Master' },
        { goal: 20, name: 'Perfect Scholar' }
      ]
    },
    {
      id: 'verse',
      emoji: '🧠',
      title: 'Word in My Heart',
      value: summary.verseCount,
      unit: 'verses',
      levels: [
        { goal: 1, name: 'First Verse' },
        { goal: 5, name: 'Verse Keeper' },
        { goal: 10, name: 'Word Bearer' },
        { goal: 20, name: 'Scripture Keeper' },
        { goal: 30, name: 'Word in My Heart' }
      ]
    },
    {
      id: 'attendance',
      emoji: '⛪',
      title: 'Faithful Friday',
      value: summary.attendanceCount,
      unit: 'Fridays',
      levels: [
        { goal: 1, name: 'I Showed Up!' },
        { goal: 5, name: 'Faithful Friend' },
        { goal: 10, name: 'Friday Regular' },
        { goal: 20, name: 'Faithful Friday' },
        { goal: 30, name: 'Steadfast Servant' }
      ]
    },
    {
      id: 'bible',
      emoji: '📕',
      title: 'Bible Ready',
      value: summary.bibleCount,
      unit: 'times',
      levels: [
        { goal: 1, name: 'Bible in Hand' },
        { goal: 5, name: 'Bible Ready' },
        { goal: 10, name: 'Always Prepared' },
        { goal: 20, name: 'Word Ready' },
        { goal: 30, name: 'Equipped' }
      ]
    },
    {
      id: 'points',
      emoji: '⭐',
      title: 'Points Champion',
      value: summary.points,
      unit: 'points',
      levels: [
        { goal: 25, name: 'Rising Star' },
        { goal: 50, name: 'Bright Star' },
        { goal: 100, name: 'Century Club' },
        { goal: 250, name: 'Superstar' },
        { goal: 500, name: 'Points Champion' }
      ]
    }
  ]

  function trackStatus(track) {
    let earnedIndex = -1

    track.levels.forEach((level, index) => {
      if (track.value >= level.goal) {
        earnedIndex = index
      }
    })

    const currentLevel =
      earnedIndex >= 0 ? track.levels[earnedIndex] : null

    const nextLevel =
      earnedIndex < track.levels.length - 1
        ? track.levels[earnedIndex + 1]
        : null

    const previousGoal =
      earnedIndex >= 0 ? track.levels[earnedIndex].goal : 0

    const nextGoal = nextLevel?.goal || previousGoal

    const progress = nextLevel
      ? Math.min(
          100,
          Math.round(
            ((track.value - previousGoal) /
              Math.max(1, nextGoal - previousGoal)) *
              100
          )
        )
      : 100

    return {
      earnedIndex,
      currentLevel,
      nextLevel,
      progress
    }
  }

  const totalLevels = tracks.reduce(
    (sum, track) => sum + track.levels.length,
    0
  )

  const unlockedLevels = tracks.reduce((sum, track) => {
    return (
      sum +
      track.levels.filter(
        (level) => track.value >= level.goal
      ).length
    )
  }, 0)

  function TrackCard({ track }) {
    const status = trackStatus(track)

    return (
      <div
        style={{
          border: '1px solid #e7e3ef',
          borderRadius: '18px',
          padding: '20px',
          background: 'white'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '14px'
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: '13px',
              alignItems: 'center'
            }}
          >
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '16px',
                background: '#f1ebff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '29px'
              }}
            >
              {track.emoji}
            </div>

            <div>
              <h3 style={{ margin: 0 }}>
                {track.title}
              </h3>

              <div
                style={{
                  color: '#6b7280',
                  marginTop: '3px',
                  fontSize: '14px'
                }}
              >
                {track.value} {track.unit}
              </div>
            </div>
          </div>

          <span
            style={{
              padding: '7px 10px',
              borderRadius: '999px',
              background: status.currentLevel
                ? '#ecfdf3'
                : '#f4f4f7',
              color: status.currentLevel
                ? '#087257'
                : '#6b7280',
              fontWeight: '800',
              fontSize: '12px'
            }}
          >
            {status.currentLevel
              ? `LEVEL ${status.earnedIndex + 1}`
              : 'START HERE'}
          </span>
        </div>

        <div
          style={{
            marginTop: '20px',
            padding: '16px',
            borderRadius: '14px',
            background: '#faf8ff'
          }}
        >
          {status.currentLevel ? (
            <>
              <div
                style={{
                  fontSize: '12px',
                  color: '#6b35c0',
                  fontWeight: '800',
                  textTransform: 'uppercase'
                }}
              >
                Current Badge
              </div>
              <div
                style={{
                  fontSize: '20px',
                  fontWeight: '800',
                  marginTop: '3px'
                }}
              >
                {status.currentLevel.name}
              </div>
            </>
          ) : (
            <>
              <div
                style={{
                  fontSize: '12px',
                  color: '#6b35c0',
                  fontWeight: '800',
                  textTransform: 'uppercase'
                }}
              >
                First Badge
              </div>
              <div
                style={{
                  fontSize: '20px',
                  fontWeight: '800',
                  marginTop: '3px'
                }}
              >
                {track.levels[0].name}
              </div>
            </>
          )}
        </div>

        {status.nextLevel ? (
          <>
            <div
              style={{
                marginTop: '17px',
                display: 'flex',
                justifyContent: 'space-between',
                gap: '10px',
                fontSize: '13px'
              }}
            >
              <strong>
                Next: {status.nextLevel.name}
              </strong>
              <span style={{ color: '#6b7280' }}>
                {track.value}/{status.nextLevel.goal}
              </span>
            </div>

            <div
              style={{
                height: '9px',
                borderRadius: '999px',
                background: '#ececf2',
                overflow: 'hidden',
                marginTop: '8px'
              }}
            >
              <div
                style={{
                  width: `${status.progress}%`,
                  height: '100%',
                  background: 'var(--accent)',
                  borderRadius: '999px'
                }}
              />
            </div>

            <p
              style={{
                marginBottom: 0,
                marginTop: '9px',
                color: '#6b7280',
                fontSize: '13px'
              }}
            >
              {Math.max(
                0,
                status.nextLevel.goal - track.value
              )}{' '}
              more {track.unit} until{' '}
              <strong>{status.nextLevel.name}</strong>.
            </p>
          </>
        ) : (
          <div
            style={{
              marginTop: '17px',
              padding: '12px',
              borderRadius: '12px',
              background: '#ecfdf3',
              color: '#087257',
              fontWeight: '800',
              textAlign: 'center'
            }}
          >
            👑 Highest level unlocked!
          </div>
        )}

        <div
          style={{
            display: 'flex',
            gap: '7px',
            flexWrap: 'wrap',
            marginTop: '18px'
          }}
        >
          {track.levels.map((level, index) => {
            const earned = track.value >= level.goal

            return (
              <div
                key={level.name}
                title={`${level.name}: ${level.goal} ${track.unit}`}
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: '800',
                  background: earned
                    ? '#6b35c0'
                    : '#f0f0f4',
                  color: earned ? 'white' : '#8a8f9c',
                  border: earned
                    ? '2px solid #6b35c0'
                    : '2px solid #e2e2e8'
                }}
              >
                {earned ? '✓' : index + 1}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <>
      <DashboardHeader
        title="Achievements"
        subtitle="Keep growing, level up your badges, and celebrate your progress."
      />

      {message && (
        <section className="dashboard-card">
          <p>{message}</p>
        </section>
      )}

      {loading ? (
        <section className="dashboard-card">
          <p>Loading your achievements...</p>
        </section>
      ) : (
        <>
          <div className="stats-grid">
            <StatCard
              icon={<Trophy />}
              label="Levels Unlocked"
              value={`${unlockedLevels}/${totalLevels}`}
              helper="Across all achievement tracks"
            />

            <StatCard
              icon={<Star />}
              label="Total Points"
              value={summary.points}
              helper="Bible Study points"
            />

            <StatCard
              icon={<Flame />}
              label="Reading Streak"
              value={summary.readingStreak}
              helper="Current streak"
            />

            <StatCard
              icon={<BookOpen />}
              label="Readings"
              value={summary.readingCount}
              helper="Days completed"
            />
          </div>

          <section className="dashboard-card">
            <div>
              <h2 style={{ marginBottom: '5px' }}>
                Your Achievement Tracks
              </h2>
              <p
                style={{
                  color: '#6b7280',
                  marginTop: 0
                }}
              >
                Every track has five levels. Keep going to unlock
                the next badge!
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit, minmax(290px, 1fr))',
                gap: '16px',
                marginTop: '20px'
              }}
            >
              {tracks.map((track) => (
                <TrackCard
                  key={track.id}
                  track={track}
                />
              ))}
            </div>
          </section>
        </>
      )}
    </>
  )
}



function StudentPhysicalBible({ profile }) {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadPhysicalBible()
  }, [])

  async function loadPhysicalBible() {
    setLoading(true)
    setMessage('')

    const { data, error } = await supabase
      .from('physical_bible')
      .select(
        'id, student_id, class_id, bible_study_date, brought_bible, recorded_by, created_at'
      )
      .eq('student_id', profile.id)
      .order('bible_study_date', { ascending: false })

    if (error) {
      setMessage(error.message)
      setLoading(false)
      return
    }

    setRecords(data || [])
    setLoading(false)
  }

  function prettyDate(dateString) {
    if (!dateString) return '—'

    return new Date(`${dateString}T12:00:00`).toLocaleDateString(
      'en-US',
      {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }
    )
  }

  const broughtCount = records.filter(
    (record) => record.brought_bible === true
  ).length

  const totalCount = records.length

  const percentage = totalCount
    ? Math.round((broughtCount / totalCount) * 100)
    : 0

  const currentRecord = records[0] || null

  return (
    <>
      <DashboardHeader
        title="Physical Bible"
        subtitle="Bring your Bible, follow along, and stay ready for Bible Study."
      />

      {message && (
        <section className="dashboard-card">
          <p>{message}</p>
        </section>
      )}

      {loading ? (
        <section className="dashboard-card">
          <p>Loading your Bible record...</p>
        </section>
      ) : (
        <>
          <div className="stats-grid">
            <StatCard
              icon={<BookOpen />}
              label="Brought Bible"
              value={broughtCount}
              helper="Bible Study Fridays"
            />

            <StatCard
              icon={<BarChart3 />}
              label="Consistency"
              value={`${percentage}%`}
              helper="Times Bible was brought"
            />

            <StatCard
              icon={<CheckCircle2 />}
              label="Latest Friday"
              value={
                currentRecord?.brought_bible
                  ? 'Brought ✓'
                  : currentRecord
                    ? 'Not Brought'
                    : '—'
              }
              helper={
                currentRecord
                  ? currentRecord.bible_study_date
                  : 'No record yet'
              }
            />
          </div>

          <section className="dashboard-card">
            <h2>Latest Bible Study</h2>

            {currentRecord ? (
              <div
                style={{
                  marginTop: '16px',
                  padding: '22px',
                  borderRadius: '16px',
                  border: currentRecord.brought_bible
                    ? '1px solid #b7ead5'
                    : '1px solid #ececf2',
                  background: currentRecord.brought_bible
                    ? '#ecfdf3'
                    : '#fafafa'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '14px',
                    alignItems: 'center',
                    flexWrap: 'wrap'
                  }}
                >
                  <div>
                    <div
                      style={{
                        color: '#6b7280',
                        fontSize: '14px',
                        marginBottom: '5px'
                      }}
                    >
                      {prettyDate(
                        currentRecord.bible_study_date
                      )}
                    </div>

                    <h3
                      style={{
                        margin: 0,
                        fontSize: '24px'
                      }}
                    >
                      {currentRecord.brought_bible
                        ? '📕 Bible Ready!'
                        : 'Remember Your Bible Next Time'}
                    </h3>
                  </div>

                  <span
                    style={{
                      padding: '9px 13px',
                      borderRadius: '999px',
                      fontWeight: '800',
                      background: currentRecord.brought_bible
                        ? 'white'
                        : '#f2f2f5',
                      color: currentRecord.brought_bible
                        ? '#087257'
                        : '#6b7280'
                    }}
                  >
                    {currentRecord.brought_bible
                      ? '✓ Brought Bible'
                      : 'Not Brought'}
                  </span>
                </div>

                <p
                  style={{
                    marginBottom: 0,
                    marginTop: '14px',
                    color: currentRecord.brought_bible
                      ? '#356859'
                      : '#6b7280'
                  }}
                >
                  {currentRecord.brought_bible
                    ? 'Your servant marked that you brought your physical Bible to Bible Study.'
                    : 'Your servant marked that a physical Bible was not brought for this Bible Study.'}
                </p>
              </div>
            ) : (
              <div
                style={{
                  marginTop: '16px',
                  padding: '22px',
                  border: '1px solid #ececf2',
                  borderRadius: '14px'
                }}
              >
                <strong>No Bible records yet.</strong>
                <p
                  style={{
                    marginBottom: 0,
                    color: '#6b7280'
                  }}
                >
                  Your servant will record this during Bible Study.
                </p>
              </div>
            )}
          </section>

          <section className="dashboard-card">
            <h2>Physical Bible History</h2>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Bible Study Date</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {records.map((record) => (
                    <tr key={record.id}>
                      <td>
                        {prettyDate(record.bible_study_date)}
                      </td>

                      <td>
                        {record.brought_bible ? (
                          <span
                            style={{
                              color: '#087257',
                              fontWeight: '800'
                            }}
                          >
                            ✓ Brought Bible
                          </span>
                        ) : (
                          <span
                            style={{
                              color: '#8a8f9c',
                              fontWeight: '700'
                            }}
                          >
                            Not Brought
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}

                  {!records.length && (
                    <tr>
                      <td colSpan="2">
                        No physical Bible records yet.
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



function StudentAttendance({ profile }) {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadAttendance()
  }, [])

  async function loadAttendance() {
    setLoading(true)
    setMessage('')

    const { data, error } = await supabase
      .from('attendance')
      .select(
        'id, student_id, class_id, bible_study_date, present, recorded_by, created_at'
      )
      .eq('student_id', profile.id)
      .order('bible_study_date', { ascending: false })

    if (error) {
      setMessage(error.message)
      setLoading(false)
      return
    }

    setRecords(data || [])
    setLoading(false)
  }

  function prettyDate(dateString) {
    if (!dateString) return '—'

    return new Date(`${dateString}T12:00:00`).toLocaleDateString(
      'en-US',
      {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }
    )
  }

  const presentCount = records.filter(
    (record) => record.present === true
  ).length

  const totalCount = records.length
  const absentCount = Math.max(0, totalCount - presentCount)

  const percentage = totalCount
    ? Math.round((presentCount / totalCount) * 100)
    : 0

  const latestRecord = records[0] || null

  return (
    <>
      <DashboardHeader
        title="Attendance"
        subtitle="Keep showing up, learning together, and growing in God's Word."
      />

      {message && (
        <section className="dashboard-card">
          <p>{message}</p>
        </section>
      )}

      {loading ? (
        <section className="dashboard-card">
          <p>Loading your attendance...</p>
        </section>
      ) : (
        <>
          <div className="stats-grid">
            <StatCard
              icon={<CheckCircle2 />}
              label="Present"
              value={presentCount}
              helper="Bible Study Fridays"
            />

            <StatCard
              icon={<BarChart3 />}
              label="Attendance"
              value={`${percentage}%`}
              helper={`${presentCount} of ${totalCount} recorded`}
            />

            <StatCard
              icon={<CalendarDays />}
              label="Latest Friday"
              value={
                latestRecord
                  ? latestRecord.present
                    ? 'Present ✓'
                    : 'Absent'
                  : '—'
              }
              helper={
                latestRecord
                  ? latestRecord.bible_study_date
                  : 'No record yet'
              }
            />

            <StatCard
              icon={<Clock />}
              label="Absences"
              value={absentCount}
              helper="Recorded absences"
            />
          </div>

          <section className="dashboard-card">
            <h2>Latest Bible Study</h2>

            {latestRecord ? (
              <div
                style={{
                  marginTop: '16px',
                  padding: '22px',
                  borderRadius: '16px',
                  border: latestRecord.present
                    ? '1px solid #b7ead5'
                    : '1px solid #ececf2',
                  background: latestRecord.present
                    ? '#ecfdf3'
                    : '#fafafa'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '14px',
                    alignItems: 'center',
                    flexWrap: 'wrap'
                  }}
                >
                  <div>
                    <div
                      style={{
                        color: '#6b7280',
                        fontSize: '14px',
                        marginBottom: '5px'
                      }}
                    >
                      {prettyDate(latestRecord.bible_study_date)}
                    </div>

                    <h3
                      style={{
                        margin: 0,
                        fontSize: '24px'
                      }}
                    >
                      {latestRecord.present
                        ? '⛪ You Were Here!'
                        : 'We Missed You!'}
                    </h3>
                  </div>

                  <span
                    style={{
                      padding: '9px 13px',
                      borderRadius: '999px',
                      fontWeight: '800',
                      background: latestRecord.present
                        ? 'white'
                        : '#f2f2f5',
                      color: latestRecord.present
                        ? '#087257'
                        : '#6b7280'
                    }}
                  >
                    {latestRecord.present
                      ? '✓ Present'
                      : 'Absent'}
                  </span>
                </div>
              </div>
            ) : (
              <div
                style={{
                  marginTop: '16px',
                  padding: '22px',
                  border: '1px solid #ececf2',
                  borderRadius: '14px'
                }}
              >
                <strong>No attendance records yet.</strong>
                <p
                  style={{
                    marginBottom: 0,
                    color: '#6b7280'
                  }}
                >
                  Your servant will record attendance during Bible
                  Study.
                </p>
              </div>
            )}
          </section>

          <section className="dashboard-card">
            <h2>Attendance History</h2>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Bible Study Date</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {records.map((record) => (
                    <tr key={record.id}>
                      <td>{prettyDate(record.bible_study_date)}</td>
                      <td>
                        {record.present ? (
                          <span
                            style={{
                              color: '#087257',
                              fontWeight: '800'
                            }}
                          >
                            ✓ Present
                          </span>
                        ) : (
                          <span
                            style={{
                              color: '#8a8f9c',
                              fontWeight: '700'
                            }}
                          >
                            Absent
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}

                  {!records.length && (
                    <tr>
                      <td colSpan="2">
                        No attendance records yet.
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



function StudentProfile({ profile }) {
  const [email, setEmail] = useState('')
  const [className, setClassName] = useState('Unassigned')
  const [firstName, setFirstName] = useState(profile.first_name || '')
  const [lastName, setLastName] = useState(profile.last_name || '')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(true)
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [profileMessage, setProfileMessage] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')

  useEffect(() => {
    loadStudentProfile()
  }, [])

  async function loadStudentProfile() {
    setLoading(true)

    const [userResult, membershipResult] = await Promise.all([
      supabase.auth.getUser(),
      supabase
        .from('class_members')
        .select('class_id')
        .eq('student_id', profile.id)
        .limit(1)
        .maybeSingle()
    ])

    setEmail(userResult.data?.user?.email || '')

    if (membershipResult.data?.class_id) {
      const { data: classRecord } = await supabase
        .from('classes')
        .select('name')
        .eq('id', membershipResult.data.class_id)
        .single()

      if (classRecord?.name) {
        setClassName(classRecord.name)
      }
    }

    setLoading(false)
  }

  async function saveProfile(event) {
    event.preventDefault()
    setSavingProfile(true)
    setProfileMessage('')

    if (!firstName.trim() || !lastName.trim()) {
      setProfileMessage('First name and last name are required.')
      setSavingProfile(false)
      return
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        first_name: firstName.trim(),
        last_name: lastName.trim()
      })
      .eq('id', profile.id)

    if (error) {
      setProfileMessage(error.message)
      setSavingProfile(false)
      return
    }

    setProfileMessage(
      'Profile updated successfully. Your sidebar name will refresh the next time you sign in.'
    )
    setSavingProfile(false)
  }

  async function changePassword(event) {
    event.preventDefault()
    setSavingPassword(true)
    setPasswordMessage('')

    if (newPassword.length < 6) {
      setPasswordMessage(
        'Your new password must be at least 6 characters.'
      )
      setSavingPassword(false)
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage('The passwords do not match.')
      setSavingPassword(false)
      return
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (error) {
      setPasswordMessage(error.message)
      setSavingPassword(false)
      return
    }

    setNewPassword('')
    setConfirmPassword('')
    setPasswordMessage('Password changed successfully.')
    setSavingPassword(false)
  }

  return (
    <>
      <DashboardHeader
        title="Profile"
        subtitle="Your Bible Study Academy account."
      />

      {loading ? (
        <section className="dashboard-card">
          <p>Loading your profile...</p>
        </section>
      ) : (
        <>
          <section className="dashboard-card">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '18px',
                flexWrap: 'wrap'
              }}
            >
              <div
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  background: '#efe8ff',
                  color: '#6b35c0',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: '30px',
                  fontWeight: '800'
                }}
              >
                {firstName?.charAt(0) || '?'}
              </div>

              <div>
                <h2 style={{ marginBottom: '4px' }}>
                  {firstName} {lastName}
                </h2>

                <p
                  style={{
                    margin: 0,
                    color: '#6b7280'
                  }}
                >
                  {profile.grade
                    ? `${profile.grade} Grade • `
                    : ''}
                  {className}
                </p>
              </div>
            </div>
          </section>

          <section className="dashboard-card">
            <h2>Account Information</h2>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '16px',
                marginTop: '18px'
              }}
            >
              <div>
                <label>Email</label>
                <input
                  value={email}
                  disabled
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label>Grade</label>
                <input
                  value={profile.grade || '—'}
                  disabled
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label>Bible Study Class</label>
                <input
                  value={className}
                  disabled
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          </section>

          <section className="dashboard-card">
            <h2>Edit Your Name</h2>

            <form onSubmit={saveProfile}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '16px',
                  marginTop: '18px'
                }}
              >
                <div>
                  <label>First Name</label>
                  <input
                    value={firstName}
                    onChange={(event) => {
                      setFirstName(event.target.value)
                      setProfileMessage('')
                    }}
                    required
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label>Last Name</label>
                  <input
                    value={lastName}
                    onChange={(event) => {
                      setLastName(event.target.value)
                      setProfileMessage('')
                    }}
                    required
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              {profileMessage && (
                <div
                  style={{
                    marginTop: '16px',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    background: profileMessage.includes('successfully')
                      ? '#ecfdf3'
                      : '#fef3f2',
                    color: profileMessage.includes('successfully')
                      ? '#087257'
                      : '#b42318',
                    fontWeight: '600'
                  }}
                >
                  {profileMessage}
                </div>
              )}

              <button
                className="primary-button small-button"
                type="submit"
                disabled={savingProfile}
                style={{
                  width: 'auto',
                  marginTop: '20px'
                }}
              >
                {savingProfile ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </section>

          <section className="dashboard-card">
            <h2>Change Password</h2>

            <form onSubmit={changePassword}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '16px',
                  marginTop: '18px'
                }}
              >
                <div>
                  <label>New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(event) => {
                      setNewPassword(event.target.value)
                      setPasswordMessage('')
                    }}
                    minLength="6"
                    required
                    disabled={savingPassword}
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => {
                      setConfirmPassword(event.target.value)
                      setPasswordMessage('')
                    }}
                    minLength="6"
                    required
                    disabled={savingPassword}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              {passwordMessage && (
                <div
                  style={{
                    marginTop: '16px',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    background: passwordMessage.includes('successfully')
                      ? '#ecfdf3'
                      : '#fef3f2',
                    color: passwordMessage.includes('successfully')
                      ? '#087257'
                      : '#b42318',
                    fontWeight: '600'
                  }}
                >
                  {passwordMessage}
                </div>
              )}

              <button
                className="primary-button small-button"
                type="submit"
                disabled={savingPassword}
                style={{
                  width: 'auto',
                  marginTop: '20px'
                }}
              >
                {savingPassword
                  ? 'Changing...'
                  : 'Change Password'}
              </button>
            </form>
          </section>
        </>
      )}
    </>
  )
}


function ServantDashboard({ profile }) {
  const today = new Date().toISOString().slice(0, 10)

  const [classId, setClassId] = useState(null)
  const [className, setClassName] =
    useState('My Bible Study Class')
  const [students, setStudents] = useState([])
  const [latestFriday, setLatestFriday] = useState(null)
  const [attendanceRecords, setAttendanceRecords] = useState([])
  const [weeklyPoints, setWeeklyPoints] = useState(0)
  const [currentVerse, setCurrentVerse] = useState(null)
  const [nextHomework, setNextHomework] = useState(null)
  const [homeworkSubmissions, setHomeworkSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadDashboard()
  }, [])

  async function loadDashboard() {
    setLoading(true)
    setMessage('')

    const { data: assignment, error: assignmentError } =
      await supabase
        .from('servant_classes')
        .select('class_id')
        .eq('servant_id', profile.id)
        .limit(1)
        .maybeSingle()

    if (assignmentError) {
      setMessage(assignmentError.message)
      setLoading(false)
      return
    }

    if (!assignment) {
      setMessage('You are not assigned to a class yet.')
      setLoading(false)
      return
    }

    const assignedClassId = assignment.class_id
    setClassId(assignedClassId)

    const [classResult, membershipsResult] = await Promise.all([
      supabase
        .from('classes')
        .select('id, name')
        .eq('id', assignedClassId)
        .single(),

      supabase
        .from('class_members')
        .select('student_id')
        .eq('class_id', assignedClassId)
    ])

    if (classResult.error || membershipsResult.error) {
      setMessage(
        classResult.error?.message ||
        membershipsResult.error?.message
      )
      setLoading(false)
      return
    }

    setClassName(classResult.data?.name || 'My Bible Study Class')

    const studentIds =
      membershipsResult.data?.map((item) => item.student_id) || []

    if (!studentIds.length) {
      setStudents([])
      setLoading(false)
      return
    }

    const studentsResult = await supabase
      .from('profiles')
      .select('id, first_name, last_name, grade')
      .in('id', studentIds)
      .eq('active', true)
      .order('first_name')

    if (studentsResult.error) {
      setMessage(studentsResult.error.message)
      setLoading(false)
      return
    }

    const roster = studentsResult.data || []
    setStudents(roster)

    const ids = roster.map((student) => student.id)

    const latestAttendanceDateResult = await supabase
      .from('attendance')
      .select('bible_study_date')
      .eq('class_id', assignedClassId)
      .order('bible_study_date', { ascending: false })
      .limit(1)
      .maybeSingle()

    const latestDate =
      latestAttendanceDateResult.data?.bible_study_date || null

    setLatestFriday(latestDate)

    const [
      attendanceResult,
      verseResult,
      homeworkResult,
      participationResult,
      bonusResult,
      rulesResult
    ] = await Promise.all([
      latestDate
        ? supabase
            .from('attendance')
            .select('student_id, present')
            .eq('class_id', assignedClassId)
            .eq('bible_study_date', latestDate)
            .in('student_id', ids)
        : Promise.resolve({ data: [], error: null }),

      supabase
        .from('memory_verse_assignments')
        .select(
          'id, bible_study_date, verse_reference, verse_text'
        )
        .eq('class_id', assignedClassId)
        .gte('bible_study_date', today)
        .order('bible_study_date', { ascending: true })
        .limit(1)
        .maybeSingle(),

      supabase
        .from('homework_quizzes')
        .select(
          'id, title, bible_study_date, due_date'
        )
        .eq('class_id', assignedClassId)
        .gte('due_date', today)
        .order('due_date', { ascending: true })
        .limit(1)
        .maybeSingle(),

      supabase
        .from('participation')
        .select('student_id, points, bible_study_date')
        .eq('class_id', assignedClassId)
        .in('student_id', ids),

      supabase
        .from('bonus_points')
        .select('student_id, points, bible_study_date')
        .eq('class_id', assignedClassId)
        .in('student_id', ids),

      supabase
        .from('point_rules')
        .select('category, points')
    ])

    const firstError = [
      attendanceResult,
      verseResult,
      homeworkResult,
      participationResult,
      bonusResult,
      rulesResult
    ].find((result) => result?.error)?.error

    if (firstError) {
      setMessage(firstError.message)
      setLoading(false)
      return
    }

    setAttendanceRecords(attendanceResult.data || [])
    setCurrentVerse(verseResult.data || null)
    setNextHomework(homeworkResult.data || null)

    const pointRules = {}
    ;(rulesResult.data || []).forEach((rule) => {
      pointRules[rule.category] = Number(rule.points) || 0
    })

    let thisWeekPoints = 0

    if (latestDate) {
      const [attendancePointsResult, homeworkPointsResult, versePointsResult, biblePointsResult] =
        await Promise.all([
          supabase
            .from('attendance')
            .select('present')
            .eq('class_id', assignedClassId)
            .eq('bible_study_date', latestDate)
            .in('student_id', ids),

          supabase
            .from('homework')
            .select('completed')
            .eq('class_id', assignedClassId)
            .eq('bible_study_date', latestDate)
            .in('student_id', ids),

          supabase
            .from('memory_verses')
            .select('completed')
            .eq('class_id', assignedClassId)
            .eq('bible_study_date', latestDate)
            .in('student_id', ids),

          supabase
            .from('physical_bible')
            .select('brought_bible')
            .eq('class_id', assignedClassId)
            .eq('bible_study_date', latestDate)
            .in('student_id', ids)
        ])

      const countTrue = (rows, field) =>
        (rows || []).filter((row) => row[field] === true).length

      thisWeekPoints +=
        countTrue(attendancePointsResult.data, 'present') *
        (pointRules.attendance || 0)

      thisWeekPoints +=
        countTrue(homeworkPointsResult.data, 'completed') *
        (pointRules.homework || 0)

      thisWeekPoints +=
        countTrue(versePointsResult.data, 'completed') *
        (pointRules.memory_verse || 0)

      thisWeekPoints +=
        countTrue(biblePointsResult.data, 'brought_bible') *
        (pointRules.physical_bible || 0)

      thisWeekPoints +=
        (participationResult.data || [])
          .filter((row) => row.bible_study_date === latestDate)
          .reduce(
            (sum, row) => sum + (Number(row.points) || 0),
            0
          )

      thisWeekPoints +=
        (bonusResult.data || [])
          .filter((row) => row.bible_study_date === latestDate)
          .reduce(
            (sum, row) => sum + (Number(row.points) || 0),
            0
          )
    }

    setWeeklyPoints(thisWeekPoints)

    if (homeworkResult.data?.id) {
      const submissionsResult = await supabase
        .from('homework_submissions')
        .select('student_id, quiz_id')
        .eq('quiz_id', homeworkResult.data.id)
        .in('student_id', ids)

      if (!submissionsResult.error) {
        setHomeworkSubmissions(submissionsResult.data || [])
      }
    } else {
      setHomeworkSubmissions([])
    }

    setLoading(false)
  }

  const presentCount = attendanceRecords.filter(
    (record) => record.present === true
  ).length

  const attendancePercent = attendanceRecords.length
    ? Math.round(
        (presentCount / attendanceRecords.length) * 100
      )
    : 0

  const submittedIds = new Set(
    homeworkSubmissions.map((item) => item.student_id)
  )

  const missingHomework = nextHomework
    ? students.filter((student) => !submittedIds.has(student.id))
    : []

  function prettyDate(dateString) {
    if (!dateString) return '—'

    return new Date(`${dateString}T12:00:00`).toLocaleDateString(
      'en-US',
      {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }
    )
  }

  return (
    <>
      <DashboardHeader
        title="Servant Dashboard"
        subtitle={`${className} • ${students.length} students`}
      />

      {message && (
        <section className="dashboard-card">
          <p>{message}</p>
        </section>
      )}

      {loading ? (
        <section className="dashboard-card">
          <p>Loading class dashboard...</p>
        </section>
      ) : (
        <>
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
              value={
                latestFriday
                  ? `${presentCount}/${students.length}`
                  : '—'
              }
              helper={
                latestFriday
                  ? `Latest Friday • ${prettyDate(latestFriday)}`
                  : 'No attendance yet'
              }
            />

            <StatCard
              icon={<BarChart3 />}
              label="Attendance"
              value={
                latestFriday
                  ? `${attendancePercent}%`
                  : '—'
              }
              helper="Latest recorded Friday"
            />

            <StatCard
              icon={<Star />}
              label="Points Awarded"
              value={weeklyPoints}
              helper={
                latestFriday
                  ? `For ${prettyDate(latestFriday)}`
                  : 'No Friday recorded yet'
              }
            />
          </div>

          <section className="dashboard-card">
            <h2>This Week</h2>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit, minmax(230px, 1fr))',
                gap: '16px',
                marginTop: '18px'
              }}
            >
              <div
                style={{
                  border: '1px solid #ececf2',
                  borderRadius: '16px',
                  padding: '18px'
                }}
              >
                <GraduationCap size={22} />
                <h3 style={{ marginBottom: '6px' }}>
                  Memory Verse
                </h3>
                <strong style={{ color: '#6b35c0' }}>
                  {currentVerse?.verse_reference ||
                    'No upcoming verse'}
                </strong>
                {currentVerse?.bible_study_date && (
                  <p
                    style={{
                      color: '#6b7280',
                      marginBottom: 0
                    }}
                  >
                    For {prettyDate(currentVerse.bible_study_date)}
                  </p>
                )}
              </div>

              <div
                style={{
                  border: '1px solid #ececf2',
                  borderRadius: '16px',
                  padding: '18px'
                }}
              >
                <ClipboardCheck size={22} />
                <h3 style={{ marginBottom: '6px' }}>
                  Upcoming Homework
                </h3>
                <strong style={{ color: '#6b35c0' }}>
                  {nextHomework?.title || 'No upcoming homework'}
                </strong>
                {nextHomework?.due_date && (
                  <p
                    style={{
                      color: '#6b7280',
                      marginBottom: 0
                    }}
                  >
                    Due {prettyDate(nextHomework.due_date)}
                  </p>
                )}
              </div>

              <div
                style={{
                  border: '1px solid #ececf2',
                  borderRadius: '16px',
                  padding: '18px'
                }}
              >
                <Users size={22} />
                <h3 style={{ marginBottom: '6px' }}>
                  Homework Submitted
                </h3>
                <strong style={{ color: '#6b35c0' }}>
                  {nextHomework
                    ? `${homeworkSubmissions.length}/${students.length}`
                    : '—'}
                </strong>
                <p
                  style={{
                    color: '#6b7280',
                    marginBottom: 0
                  }}
                >
                  {nextHomework
                    ? 'For the next homework quiz'
                    : 'No upcoming homework'}
                </p>
              </div>
            </div>
          </section>

          <section className="dashboard-card">
            <h2>Needs Attention</h2>

            {!nextHomework ? (
              <p style={{ color: '#6b7280' }}>
                No upcoming homework is assigned.
              </p>
            ) : missingHomework.length ? (
              <div
                style={{
                  marginTop: '16px',
                  border: '1px solid #f1dfb8',
                  borderRadius: '14px',
                  background: '#fffaf0',
                  padding: '16px'
                }}
              >
                <strong>
                  {missingHomework.length} student
                  {missingHomework.length === 1 ? '' : 's'} still
                  need to submit {nextHomework.title}.
                </strong>

                <p
                  style={{
                    marginBottom: 0,
                    color: '#6b7280',
                    marginTop: '8px'
                  }}
                >
                  {missingHomework
                    .map(
                      (student) =>
                        `${student.first_name} ${student.last_name}`
                    )
                    .join(', ')}
                </p>
              </div>
            ) : (
              <div
                style={{
                  marginTop: '16px',
                  border: '1px solid #b7ead5',
                  borderRadius: '14px',
                  background: '#ecfdf3',
                  padding: '16px',
                  color: '#087257',
                  fontWeight: '700'
                }}
              >
                ✓ Everyone has submitted the upcoming homework!
              </div>
            )}
          </section>

          <section className="dashboard-card">
            <h2>Class Roster</h2>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Grade</th>
                    <th>Latest Attendance</th>
                    <th>Upcoming Homework</th>
                  </tr>
                </thead>

                <tbody>
                  {students.map((student) => {
                    const attendanceRecord =
                      attendanceRecords.find(
                        (record) =>
                          record.student_id === student.id
                      )

                    return (
                      <tr key={student.id}>
                        <td>
                          <strong>
                            {student.first_name}{' '}
                            {student.last_name}
                          </strong>
                        </td>

                        <td>{student.grade || '—'}</td>

                        <td>
                          {!latestFriday
                            ? '—'
                            : attendanceRecord?.present
                              ? '✓ Present'
                              : 'Absent'}
                        </td>

                        <td>
                          {!nextHomework
                            ? '—'
                            : submittedIds.has(student.id)
                              ? '✓ Submitted'
                              : 'Not submitted'}
                        </td>
                      </tr>
                    )
                  })}

                  {!students.length && (
                    <tr>
                      <td colSpan="4">
                        No students are assigned to this class yet.
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


function ServantMyClass({ profile }) {
  const [classInfo, setClassInfo] = useState(null)
  const [students, setStudents] = useState([])
  const [studentStats, setStudentStats] = useState({})
  const [studentActivity, setStudentActivity] = useState({})
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadMyClass()
  }, [])

  async function loadMyClass() {
    setLoading(true)
    setMessage('')

    const { data: assignment, error: assignmentError } =
      await supabase
        .from('servant_classes')
        .select('class_id')
        .eq('servant_id', profile.id)
        .limit(1)
        .maybeSingle()

    if (assignmentError) {
      setMessage(assignmentError.message)
      setLoading(false)
      return
    }

    if (!assignment) {
      setMessage('You are not assigned to a class yet.')
      setLoading(false)
      return
    }

    const [classResult, membershipsResult] = await Promise.all([
      supabase
        .from('classes')
        .select('*')
        .eq('id', assignment.class_id)
        .single(),

      supabase
        .from('class_members')
        .select('student_id')
        .eq('class_id', assignment.class_id)
    ])

    if (classResult.error || membershipsResult.error) {
      setMessage(
        classResult.error?.message ||
        membershipsResult.error?.message
      )
      setLoading(false)
      return
    }

    setClassInfo(classResult.data)

    const studentIds =
      membershipsResult.data?.map((item) => item.student_id) || []

    if (!studentIds.length) {
      setStudents([])
      setStudentStats({})
      setStudentActivity({})
      setLoading(false)
      return
    }

    const { data: roster, error: rosterError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, grade, active')
      .in('id', studentIds)
      .eq('active', true)
      .order('first_name')

    if (rosterError) {
      setMessage(rosterError.message)
      setLoading(false)
      return
    }

    const activeStudents = roster || []
    setStudents(activeStudents)

    const ids = activeStudents.map((student) => student.id)

    const [
      attendanceResult,
      readingResult,
      homeworkResult,
      verseResult,
      bibleResult,
      participationResult,
      bonusResult,
      rulesResult,
      submissionResult
    ] = await Promise.all([
      supabase
        .from('attendance')
        .select('student_id, bible_study_date, present')
        .eq('class_id', assignment.class_id)
        .in('student_id', ids),

      supabase
        .from('daily_reading')
        .select('student_id, reading_date, completed')
        .in('student_id', ids),

      supabase
        .from('homework')
        .select('student_id, bible_study_date, completed')
        .eq('class_id', assignment.class_id)
        .in('student_id', ids),

      supabase
        .from('memory_verses')
        .select('student_id, bible_study_date, completed')
        .eq('class_id', assignment.class_id)
        .in('student_id', ids),

      supabase
        .from('physical_bible')
        .select('student_id, bible_study_date, brought_bible')
        .eq('class_id', assignment.class_id)
        .in('student_id', ids),

      supabase
        .from('participation')
        .select('student_id, bible_study_date, points')
        .eq('class_id', assignment.class_id)
        .in('student_id', ids),

      supabase
        .from('bonus_points')
        .select('student_id, bible_study_date, points, reason')
        .eq('class_id', assignment.class_id)
        .in('student_id', ids),

      supabase
        .from('point_rules')
        .select('category, points'),

      supabase
        .from('homework_submissions')
        .select(
          'id, student_id, quiz_id, score, total_questions, percentage, submitted_at'
        )
        .in('student_id', ids)
        .order('submitted_at', { ascending: false })
    ])

    const results = [
      attendanceResult,
      readingResult,
      homeworkResult,
      verseResult,
      bibleResult,
      participationResult,
      bonusResult,
      rulesResult,
      submissionResult
    ]

    const firstError =
      results.find((result) => result.error)?.error

    if (firstError) {
      setMessage(firstError.message)
      setLoading(false)
      return
    }

    const rules = {}
    ;(rulesResult.data || []).forEach((rule) => {
      rules[rule.category] = Number(rule.points) || 0
    })

    const stats = {}
    const activity = {}

    activeStudents.forEach((student) => {
      const filter = (result) =>
        (result.data || []).filter(
          (record) => record.student_id === student.id
        )

      const attendance = filter(attendanceResult)
      const reading = filter(readingResult)
      const homework = filter(homeworkResult)
      const verses = filter(verseResult)
      const bibles = filter(bibleResult)
      const participation = filter(participationResult)
      const bonuses = filter(bonusResult)
      const submissions = filter(submissionResult)

      const countTrue = (items, field) =>
        items.filter((item) => item[field] === true).length

      const percent = (items, field) =>
        items.length
          ? Math.round(
              (countTrue(items, field) / items.length) * 100
            )
          : 0

      const attendanceDone = countTrue(attendance, 'present')
      const readingDone = countTrue(reading, 'completed')
      const homeworkDone = countTrue(homework, 'completed')
      const verseDone = countTrue(verses, 'completed')
      const bibleDone = countTrue(bibles, 'brought_bible')

      const participationPoints = participation.reduce(
        (sum, record) =>
          sum + (Number(record.points) || 0),
        0
      )

      const bonusPoints = bonuses.reduce(
        (sum, record) =>
          sum + (Number(record.points) || 0),
        0
      )

      const perfectScores = submissions.filter(
        (submission) =>
          Number(submission.percentage) >= 100
      ).length

      const totalPoints =
        attendanceDone * (rules.attendance || 0) +
        readingDone * (rules.daily_reading || 0) +
        homeworkDone * (rules.homework || 0) +
        verseDone * (rules.memory_verse || 0) +
        bibleDone * (rules.physical_bible || 0) +
        participationPoints +
        bonusPoints

      stats[student.id] = {
        attendance: percent(attendance, 'present'),
        reading: percent(reading, 'completed'),
        homework: percent(homework, 'completed'),
        verse: percent(verses, 'completed'),
        physicalBible: percent(bibles, 'brought_bible'),
        points: totalPoints,
        attendanceDone,
        attendanceTotal: attendance.length,
        readingDone,
        readingTotal: reading.length,
        homeworkDone,
        homeworkTotal: homework.length,
        verseDone,
        verseTotal: verses.length,
        bibleDone,
        bibleTotal: bibles.length,
        participationPoints,
        bonusPoints,
        perfectScores,
        quizCount: submissions.length
      }

      const events = []

      attendance.forEach((record) => {
        events.push({
          date: record.bible_study_date,
          type: 'Attendance',
          icon: '⛪',
          text: record.present ? 'Present' : 'Absent',
          success: record.present === true
        })
      })

      reading.forEach((record) => {
        if (record.completed) {
          events.push({
            date: record.reading_date,
            type: 'Daily Reading',
            icon: '📖',
            text: 'Completed daily reading',
            success: true
          })
        }
      })

      homework.forEach((record) => {
        events.push({
          date: record.bible_study_date,
          type: 'Homework',
          icon: '✏️',
          text: record.completed
            ? 'Homework completed'
            : 'Homework not completed',
          success: record.completed === true
        })
      })

      verses.forEach((record) => {
        events.push({
          date: record.bible_study_date,
          type: 'Memory Verse',
          icon: '🧠',
          text: record.completed
            ? 'Memory verse recited'
            : 'Memory verse not recited',
          success: record.completed === true
        })
      })

      bibles.forEach((record) => {
        events.push({
          date: record.bible_study_date,
          type: 'Physical Bible',
          icon: '📕',
          text: record.brought_bible
            ? 'Brought physical Bible'
            : 'Did not bring physical Bible',
          success: record.brought_bible === true
        })
      })

      submissions.forEach((record) => {
        events.push({
          date: record.submitted_at
            ? record.submitted_at.slice(0, 10)
            : '',
          type: 'Quiz',
          icon: '🏆',
          text: `Quiz score: ${Math.round(
            Number(record.percentage) || 0
          )}%`,
          success: Number(record.percentage) >= 70
        })
      })

      bonuses.forEach((record) => {
        events.push({
          date: record.bible_study_date,
          type: 'Bonus',
          icon: '⭐',
          text: `+${Number(record.points) || 0} bonus points${
            record.reason ? ` • ${record.reason}` : ''
          }`,
          success: true
        })
      })

      activity[student.id] = events
        .filter((event) => event.date)
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 12)
    })

    setStudentStats(stats)
    setStudentActivity(activity)
    setLoading(false)
  }

  const average = (field) =>
    students.length
      ? Math.round(
          students.reduce(
            (sum, student) =>
              sum +
              (studentStats[student.id]?.[field] || 0),
            0
          ) / students.length
        )
      : 0

  const classAttendance = average('attendance')
  const classReading = average('reading')
  const classHomework = average('homework')

  const totalPoints = students.reduce(
    (sum, student) =>
      sum + (studentStats[student.id]?.points || 0),
    0
  )

  function prettyDate(dateString) {
    if (!dateString) return '—'

    return new Date(`${dateString}T12:00:00`).toLocaleDateString(
      'en-US',
      {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }
    )
  }

  function getAchievementLevel(value, goals) {
    let level = 0

    goals.forEach((goal, index) => {
      if (value >= goal) level = index + 1
    })

    return level
  }

  if (selectedStudent) {
    const stats = studentStats[selectedStudent.id] || {}
    const activities =
      studentActivity[selectedStudent.id] || []

    const achievementTracks = [
      {
        emoji: '💎',
        label: 'Bible Reader',
        value: stats.readingDone || 0,
        goals: [1, 10, 25, 50, 100]
      },
      {
        emoji: '✏️',
        label: 'Homework Hero',
        value: stats.homeworkDone || 0,
        goals: [1, 5, 10, 20, 30]
      },
      {
        emoji: '🏆',
        label: 'Quiz Master',
        value: stats.perfectScores || 0,
        goals: [1, 3, 5, 10, 20]
      },
      {
        emoji: '🧠',
        label: 'Word in My Heart',
        value: stats.verseDone || 0,
        goals: [1, 5, 10, 20, 30]
      },
      {
        emoji: '⛪',
        label: 'Faithful Friday',
        value: stats.attendanceDone || 0,
        goals: [1, 5, 10, 20, 30]
      },
      {
        emoji: '📕',
        label: 'Bible Ready',
        value: stats.bibleDone || 0,
        goals: [1, 5, 10, 20, 30]
      },
      {
        emoji: '⭐',
        label: 'Points Champion',
        value: stats.points || 0,
        goals: [25, 50, 100, 250, 500]
      }
    ]

    return (
      <>
        <button
          type="button"
          onClick={() => setSelectedStudent(null)}
          style={{
            border: 'none',
            background: 'transparent',
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            padding: 0,
            marginBottom: '18px',
            cursor: 'pointer',
            color: '#6b35c0',
            fontWeight: '700'
          }}
        >
          <ArrowLeft size={18} />
          Back to My Class
        </button>

        <DashboardHeader
          title={`${selectedStudent.first_name} ${selectedStudent.last_name}`}
          subtitle={`${selectedStudent.grade || ''}${
            selectedStudent.grade ? ' • ' : ''
          }${classInfo?.name || 'Bible Study Class'}`}
        />

        <div className="stats-grid">
          <StatCard
            icon={<Trophy />}
            label="Total Points"
            value={stats.points || 0}
            helper="All points earned"
          />

          <StatCard
            icon={<CheckCircle2 />}
            label="Attendance"
            value={`${stats.attendance || 0}%`}
            helper={`${stats.attendanceDone || 0}/${
              stats.attendanceTotal || 0
            } present`}
          />

          <StatCard
            icon={<BookOpen />}
            label="Daily Reading"
            value={`${stats.reading || 0}%`}
            helper={`${stats.readingDone || 0} completed`}
          />

          <StatCard
            icon={<ClipboardCheck />}
            label="Homework"
            value={`${stats.homework || 0}%`}
            helper={`${stats.homeworkDone || 0}/${
              stats.homeworkTotal || 0
            } completed`}
          />
        </div>

        <section className="dashboard-card">
          <h2>Progress Overview</h2>

          <div className="progress-grid">
            <ProgressCircle
              label="Attendance"
              value={stats.attendance || 0}
              emoji="⛪"
            />
            <ProgressCircle
              label="Daily Reading"
              value={stats.reading || 0}
              emoji="📖"
            />
            <ProgressCircle
              label="Homework"
              value={stats.homework || 0}
              emoji="✏️"
            />
            <ProgressCircle
              label="Memory Verse"
              value={stats.verse || 0}
              emoji="🧠"
            />
            <ProgressCircle
              label="Physical Bible"
              value={stats.physicalBible || 0}
              emoji="📕"
            />
          </div>
        </section>

        <section className="dashboard-card">
          <h2>Achievements</h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fit, minmax(210px, 1fr))',
              gap: '14px',
              marginTop: '18px'
            }}
          >
            {achievementTracks.map((track) => {
              const level = getAchievementLevel(
                track.value,
                track.goals
              )

              const nextGoal =
                level < track.goals.length
                  ? track.goals[level]
                  : null

              return (
                <div
                  key={track.label}
                  style={{
                    border: '1px solid #ececf2',
                    borderRadius: '14px',
                    padding: '16px',
                    background:
                      level > 0 ? '#faf8ff' : 'white'
                  }}
                >
                  <div
                    style={{
                      fontSize: '28px',
                      marginBottom: '8px'
                    }}
                  >
                    {track.emoji}
                  </div>

                  <strong>{track.label}</strong>

                  <div
                    style={{
                      marginTop: '5px',
                      color: '#6b35c0',
                      fontWeight: '800'
                    }}
                  >
                    {level > 0
                      ? `Level ${level}`
                      : 'Not unlocked yet'}
                  </div>

                  <div
                    style={{
                      marginTop: '5px',
                      color: '#6b7280',
                      fontSize: '13px'
                    }}
                  >
                    {nextGoal
                      ? `${track.value}/${nextGoal} toward next level`
                      : 'Highest level unlocked'}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <section className="dashboard-card">
          <h2>Points Breakdown</h2>

          <div className="table-wrapper">
            <table>
              <tbody>
                <tr>
                  <td>Participation</td>
                  <td>
                    <strong>
                      {stats.participationPoints || 0} pts
                    </strong>
                  </td>
                </tr>
                <tr>
                  <td>Bonus</td>
                  <td>
                    <strong>
                      {stats.bonusPoints || 0} pts
                    </strong>
                  </td>
                </tr>
                <tr>
                  <td>Perfect Quiz Scores</td>
                  <td>
                    <strong>
                      {stats.perfectScores || 0}
                    </strong>
                  </td>
                </tr>
                <tr>
                  <td>Quizzes Submitted</td>
                  <td>
                    <strong>{stats.quizCount || 0}</strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="dashboard-card">
          <h2>Recent Activity</h2>

          {activities.length ? (
            <div
              style={{
                display: 'grid',
                gap: '10px',
                marginTop: '16px'
              }}
            >
              {activities.map((activity, index) => (
                <div
                  key={`${activity.date}-${activity.type}-${index}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    border: '1px solid #ececf2',
                    borderRadius: '12px',
                    padding: '12px 14px'
                  }}
                >
                  <span style={{ fontSize: '22px' }}>
                    {activity.icon}
                  </span>

                  <div style={{ flex: 1 }}>
                    <strong>{activity.type}</strong>
                    <div
                      style={{
                        color: '#6b7280',
                        fontSize: '13px',
                        marginTop: '2px'
                      }}
                    >
                      {activity.text}
                    </div>
                  </div>

                  <span
                    style={{
                      color: '#8a8f9c',
                      fontSize: '12px'
                    }}
                  >
                    {prettyDate(activity.date)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#6b7280' }}>
              No recent activity yet.
            </p>
          )}
        </section>
      </>
    )
  }

  return (
    <>
      <DashboardHeader
        title={classInfo?.name || 'My Class'}
        subtitle={
          classInfo?.grade_group
            ? `${classInfo.grade_group} • Class overview`
            : 'Your Bible Study class overview'
        }
      />

      {message && (
        <section className="dashboard-card">
          <p>{message}</p>
        </section>
      )}

      {loading ? (
        <section className="dashboard-card">
          <p>Loading your class...</p>
        </section>
      ) : classInfo ? (
        <>
          <div className="stats-grid">
            <StatCard
              icon={<Users />}
              label="Students"
              value={students.length}
              helper="Active students"
            />

            <StatCard
              icon={<CheckCircle2 />}
              label="Attendance"
              value={`${classAttendance}%`}
              helper="Class average"
            />

            <StatCard
              icon={<BookOpen />}
              label="Daily Reading"
              value={`${classReading}%`}
              helper="Class average"
            />

            <StatCard
              icon={<Trophy />}
              label="Class Points"
              value={totalPoints}
              helper="Total earned"
            />
          </div>

          <section className="dashboard-card">
            <h2>Class Progress</h2>

            <div className="progress-grid">
              <ProgressCircle
                label="Attendance"
                value={classAttendance}
                emoji="⛪"
              />
              <ProgressCircle
                label="Daily Reading"
                value={classReading}
                emoji="📖"
              />
              <ProgressCircle
                label="Homework"
                value={classHomework}
                emoji="✏️"
              />
            </div>
          </section>

          <section className="dashboard-card">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'end',
                gap: '16px',
                flexWrap: 'wrap'
              }}
            >
              <div>
                <h2 style={{ marginBottom: '4px' }}>
                  Students
                </h2>
                <p
                  style={{
                    margin: 0,
                    color: '#6b7280'
                  }}
                >
                  Click a student to open their full progress
                  profile.
                </p>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '14px',
                marginTop: '20px'
              }}
            >
              {students.map((student) => {
                const stats = studentStats[student.id] || {}

                return (
                  <button
                    key={student.id}
                    type="button"
                    onClick={() => setSelectedStudent(student)}
                    style={{
                      border: '1px solid #e7e7ef',
                      background: 'white',
                      borderRadius: '16px',
                      padding: '17px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      font: 'inherit'
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: '12px',
                        alignItems: 'center'
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          gap: '11px',
                          alignItems: 'center'
                        }}
                      >
                        <div
                          style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: '#efe8ff',
                            color: '#6b35c0',
                            fontWeight: '800'
                          }}
                        >
                          {student.first_name?.charAt(0) || '?'}
                        </div>

                        <div>
                          <strong>
                            {student.first_name}{' '}
                            {student.last_name}
                          </strong>
                          <div
                            style={{
                              color: '#6b7280',
                              fontSize: '13px',
                              marginTop: '2px'
                            }}
                          >
                            {student.grade || 'Grade not set'}
                          </div>
                        </div>
                      </div>

                      <ChevronRight
                        size={19}
                        color="#6b35c0"
                      />
                    </div>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '9px',
                        marginTop: '16px'
                      }}
                    >
                      <div
                        style={{
                          padding: '9px',
                          borderRadius: '10px',
                          background: '#fafafa'
                        }}
                      >
                        <div
                          style={{
                            fontSize: '11px',
                            color: '#8a8f9c'
                          }}
                        >
                          POINTS
                        </div>
                        <strong>{stats.points || 0}</strong>
                      </div>

                      <div
                        style={{
                          padding: '9px',
                          borderRadius: '10px',
                          background: '#fafafa'
                        }}
                      >
                        <div
                          style={{
                            fontSize: '11px',
                            color: '#8a8f9c'
                          }}
                        >
                          ATTENDANCE
                        </div>
                        <strong>
                          {stats.attendance || 0}%
                        </strong>
                      </div>

                      <div
                        style={{
                          padding: '9px',
                          borderRadius: '10px',
                          background: '#fafafa'
                        }}
                      >
                        <div
                          style={{
                            fontSize: '11px',
                            color: '#8a8f9c'
                          }}
                        >
                          READING
                        </div>
                        <strong>
                          {stats.reading || 0}%
                        </strong>
                      </div>

                      <div
                        style={{
                          padding: '9px',
                          borderRadius: '10px',
                          background: '#fafafa'
                        }}
                      >
                        <div
                          style={{
                            fontSize: '11px',
                            color: '#8a8f9c'
                          }}
                        >
                          HOMEWORK
                        </div>
                        <strong>
                          {stats.homework || 0}%
                        </strong>
                      </div>
                    </div>
                  </button>
                )
              })}

              {!students.length && (
                <div
                  style={{
                    border: '1px solid #ececf2',
                    borderRadius: '14px',
                    padding: '20px',
                    color: '#6b7280'
                  }}
                >
                  No students are assigned to this class yet.
                </div>
              )}
            </div>
          </section>
        </>
      ) : null}
    </>
  )
}


function ServantWeeklyManagement({ profile }) {
  const [section, setSection] = useState('readings')

  const tabs = [
    {
      id: 'readings',
      label: 'Daily Readings',
      icon: BookOpen,
      description: 'Assign the Bible reading for each day.'
    },
    {
      id: 'assignments',
      label: 'Weekly Assignments',
      icon: ClipboardCheck,
      description: 'Set the memory verse and build the homework quiz.'
    },
    {
      id: 'quick-entry',
      label: 'Friday Quick Entry',
      icon: CheckCircle2,
      description: 'Record attendance, verse recitation, Bible, points, and more.'
    },
    {
      id: 'attendance',
      label: 'Attendance',
      icon: Users,
      description: 'Open the dedicated attendance editor when needed.'
    }
  ]

  return (
    <>
      <DashboardHeader
        title="Weekly Management"
        subtitle="Plan the week and record Friday progress from one place."
      />

      <section
        className="dashboard-card"
        style={{ marginTop: '24px' }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(210px, 1fr))',
            gap: '12px'
          }}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon
            const active = section === tab.id

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSection(tab.id)}
                style={{
                  border: active
                    ? '2px solid #6b35c0'
                    : '1px solid #e6e6ee',
                  background: active ? '#f7f2ff' : 'white',
                  borderRadius: '16px',
                  padding: '16px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  font: 'inherit'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '8px'
                  }}
                >
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: active ? '#eadeff' : '#f3f3f7',
                      color: active ? '#6b35c0' : '#596070'
                    }}
                  >
                    <Icon size={19} />
                  </div>

                  <strong>{tab.label}</strong>
                </div>

                <span
                  style={{
                    color: '#6b7280',
                    fontSize: '13px',
                    lineHeight: 1.45
                  }}
                >
                  {tab.description}
                </span>
              </button>
            )
          })}
        </div>
      </section>

      <div style={{ marginTop: '18px' }}>
        {section === 'readings' && (
          <ServantDailyReadings profile={profile} />
        )}

        {section === 'assignments' && (
          <ServantWeeklyAssignments profile={profile} />
        )}

        {section === 'quick-entry' && (
          <ServantQuickEntry profile={profile} />
        )}

        {section === 'attendance' && (
          <ServantAttendance profile={profile} />
        )}
      </div>
    </>
  )
}

function ServantDailyReadings({ profile }) {
  const today = new Date().toISOString().slice(0, 10)

  const [classId, setClassId] = useState(null)
  const [className, setClassName] = useState('My Bible Study Class')
  const [readingDate, setReadingDate] = useState(today)
  const [title, setTitle] = useState('')
  const [passage, setPassage] = useState('')
  const [notes, setNotes] = useState('')
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadAssignedClass()
  }, [])

  useEffect(() => {
    if (classId) {
      loadAssignments()
    }
  }, [classId])

  async function loadAssignedClass() {
    setLoading(true)
    setMessage('')

    const { data: assignment, error: assignmentError } =
      await supabase
        .from('servant_classes')
        .select('class_id')
        .eq('servant_id', profile.id)
        .limit(1)
        .maybeSingle()

    if (assignmentError) {
      setMessage(assignmentError.message)
      setLoading(false)
      return
    }

    if (!assignment) {
      setMessage('You are not assigned to a class yet.')
      setLoading(false)
      return
    }

    setClassId(assignment.class_id)

    const { data: classRecord, error: classError } =
      await supabase
        .from('classes')
        .select('name')
        .eq('id', assignment.class_id)
        .single()

    if (classError) {
      setMessage(classError.message)
      setLoading(false)
      return
    }

    setClassName(classRecord?.name || 'My Bible Study Class')
    setLoading(false)
  }

  async function loadAssignments() {
    const { data, error } = await supabase
      .from('reading_assignments')
      .select(
        'id, class_id, reading_date, title, passage, notes, created_by, created_at'
      )
      .eq('class_id', classId)
      .order('reading_date', { ascending: true })

    if (error) {
      setMessage(error.message)
      return
    }

    setAssignments(data || [])
  }

  function clearForm() {
    setTitle('')
    setPassage('')
    setNotes('')
  }

  async function saveAssignment(event) {
    event.preventDefault()
    setSaving(true)
    setMessage('')

    if (!readingDate || !passage.trim()) {
      setMessage('Please choose a date and enter the Bible passage.')
      setSaving(false)
      return
    }

    const { error: deleteError } = await supabase
      .from('reading_assignments')
      .delete()
      .eq('class_id', classId)
      .eq('reading_date', readingDate)

    if (deleteError) {
      setMessage(deleteError.message)
      setSaving(false)
      return
    }

    const { error: insertError } = await supabase
      .from('reading_assignments')
      .insert({
        class_id: classId,
        reading_date: readingDate,
        title: title.trim() || null,
        passage: passage.trim(),
        notes: notes.trim() || null,
        created_by: profile.id
      })

    if (insertError) {
      setMessage(insertError.message)
      setSaving(false)
      return
    }

    setMessage('Daily reading assigned successfully.')
    clearForm()
    await loadAssignments()
    setSaving(false)
  }

  function editAssignment(assignment) {
    setReadingDate(assignment.reading_date)
    setTitle(assignment.title || '')
    setPassage(assignment.passage || '')
    setNotes(assignment.notes || '')
    setMessage('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function deleteAssignment(assignmentId) {
    const confirmed = window.confirm(
      'Delete this daily reading assignment?'
    )

    if (!confirmed) return

    const { error } = await supabase
      .from('reading_assignments')
      .delete()
      .eq('id', assignmentId)
      .eq('class_id', classId)

    if (error) {
      setMessage(error.message)
      return
    }

    setMessage('Daily reading deleted.')
    await loadAssignments()
  }

  const upcomingAssignments = assignments.filter(
    (assignment) => assignment.reading_date >= today
  )

  const pastAssignments = assignments
    .filter(
      (assignment) => assignment.reading_date < today
    )
    .sort((a, b) =>
      b.reading_date.localeCompare(a.reading_date)
    )

  return (
    <>
      <DashboardHeader
        title="Daily Readings"
        subtitle={`${className} • Assign Bible readings to your students`}
      />

      {message && (
        <div
          style={{
            marginTop: '20px',
            padding: '12px 14px',
            borderRadius: '12px',
            background: message.includes('successfully')
              ? '#ecfdf3'
              : '#fef3f2',
            color: message.includes('successfully')
              ? '#087257'
              : '#b42318',
            fontWeight: '600'
          }}
        >
          {message}
        </div>
      )}

      {loading ? (
        <section className="dashboard-card">
          <p>Loading your class...</p>
        </section>
      ) : (
        <>
          <section
            className="dashboard-card"
            style={{ marginTop: '24px' }}
          >
            <h2>Assign a Reading</h2>

            <p
              style={{
                color: '#6b7280',
                marginTop: '-8px',
                marginBottom: '22px'
              }}
            >
              Assign one Bible reading per day. Saving the same
              date again will update that day's assignment.
            </p>

            <form onSubmit={saveAssignment}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '16px'
                }}
              >
                <div>
                  <label>Reading Date</label>
                  <input
                    type="date"
                    value={readingDate}
                    onChange={(event) =>
                      setReadingDate(event.target.value)
                    }
                    required
                    disabled={saving}
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label>Title / Theme</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(event) =>
                      setTitle(event.target.value)
                    }
                    placeholder="Example: God Creates the World"
                    disabled={saving}
                    style={{ width: '100%' }}
                  />
                </div>

                <div
                  style={{
                    gridColumn: '1 / -1'
                  }}
                >
                  <label>Bible Passage</label>
                  <input
                    type="text"
                    value={passage}
                    onChange={(event) =>
                      setPassage(event.target.value)
                    }
                    placeholder="Example: Genesis 1:1-31"
                    required
                    disabled={saving}
                    style={{ width: '100%' }}
                  />
                </div>

                <div
                  style={{
                    gridColumn: '1 / -1'
                  }}
                >
                  <label>Notes for Students</label>
                  <textarea
                    value={notes}
                    onChange={(event) =>
                      setNotes(event.target.value)
                    }
                    placeholder="Optional instructions, focus question, or reminder..."
                    rows="4"
                    disabled={saving}
                    style={{
                      width: '100%',
                      resize: 'vertical',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: '1px solid #dfe2ea',
                      font: 'inherit'
                    }}
                  />
                </div>
              </div>

              <button
                className="primary-button small-button"
                type="submit"
                disabled={saving || !classId}
                style={{
                  width: 'auto',
                  marginTop: '22px'
                }}
              >
                {saving
                  ? 'Saving...'
                  : 'Assign Daily Reading'}
              </button>
            </form>
          </section>

          <section className="dashboard-card">
            <h2>Upcoming Readings</h2>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Title</th>
                    <th>Passage</th>
                    <th>Notes</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {upcomingAssignments.map(
                    (assignment) => (
                      <tr key={assignment.id}>
                        <td>{assignment.reading_date}</td>
                        <td>{assignment.title || '—'}</td>
                        <td>
                          <strong>
                            {assignment.passage}
                          </strong>
                        </td>
                        <td>{assignment.notes || '—'}</td>
                        <td>
                          <div
                            style={{
                              display: 'flex',
                              gap: '8px',
                              justifyContent: 'flex-end'
                            }}
                          >
                            <button
                              type="button"
                              onClick={() =>
                                editAssignment(assignment)
                              }
                              style={{
                                border: 'none',
                                background: 'transparent',
                                color: '#6b35c0',
                                fontWeight: '700',
                                cursor: 'pointer'
                              }}
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                deleteAssignment(
                                  assignment.id
                                )
                              }
                              style={{
                                border: 'none',
                                background: 'transparent',
                                color: '#b42318',
                                fontWeight: '700',
                                cursor: 'pointer'
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )}

                  {!upcomingAssignments.length && (
                    <tr>
                      <td colSpan="5">
                        No upcoming readings assigned yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="dashboard-card">
            <h2>Past Readings</h2>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Title</th>
                    <th>Passage</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {pastAssignments.map((assignment) => (
                    <tr key={assignment.id}>
                      <td>{assignment.reading_date}</td>
                      <td>{assignment.title || '—'}</td>
                      <td>{assignment.passage}</td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          type="button"
                          onClick={() =>
                            editAssignment(assignment)
                          }
                          style={{
                            border: 'none',
                            background: 'transparent',
                            color: '#6b35c0',
                            fontWeight: '700',
                            cursor: 'pointer'
                          }}
                        >
                          Reuse / Edit
                        </button>
                      </td>
                    </tr>
                  ))}

                  {!pastAssignments.length && (
                    <tr>
                      <td colSpan="4">
                        No past readings yet.
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



function ServantWeeklyAssignments({ profile }) {
  const today = new Date().toISOString().slice(0, 10)

  const emptyQuestion = (type = 'multiple_choice') => ({
    question_type: type,
    question_text: '',
    choices: ['', '', '', ''],
    correct_answer: type === 'true_false' ? 'true' : '',
    matching_pairs: [
      { left: '', right: '' },
      { left: '', right: '' }
    ]
  })

  const [classId, setClassId] = useState(null)
  const [className, setClassName] = useState('My Bible Study Class')
  const [weekDate, setWeekDate] = useState(today)

  const [quizTitle, setQuizTitle] = useState('')
  const [quizDueDate, setQuizDueDate] = useState('')
  const [questions, setQuestions] = useState([emptyQuestion()])
  const [editingQuizId, setEditingQuizId] = useState(null)

  const [verseReference, setVerseReference] = useState('')
  const [verseText, setVerseText] = useState('')
  const [verseNotes, setVerseNotes] = useState('')

  const [quizAssignments, setQuizAssignments] = useState([])
  const [memoryAssignments, setMemoryAssignments] = useState([])

  const [loading, setLoading] = useState(true)
  const [savingQuiz, setSavingQuiz] = useState(false)
  const [savingVerse, setSavingVerse] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadAssignedClass()
  }, [])

  useEffect(() => {
    if (classId) {
      loadAssignments()
    }
  }, [classId])

  async function loadAssignedClass() {
    setLoading(true)
    setMessage('')

    const { data: assignment, error: assignmentError } =
      await supabase
        .from('servant_classes')
        .select('class_id')
        .eq('servant_id', profile.id)
        .limit(1)
        .maybeSingle()

    if (assignmentError) {
      setMessage(assignmentError.message)
      setLoading(false)
      return
    }

    if (!assignment) {
      setMessage('You are not assigned to a class yet.')
      setLoading(false)
      return
    }

    setClassId(assignment.class_id)

    const { data: classRecord, error: classError } =
      await supabase
        .from('classes')
        .select('name')
        .eq('id', assignment.class_id)
        .single()

    if (classError) {
      setMessage(classError.message)
      setLoading(false)
      return
    }

    setClassName(classRecord?.name || 'My Bible Study Class')
    setLoading(false)
  }

  async function loadAssignments() {
    const [quizResult, memoryResult] = await Promise.all([
      supabase
        .from('homework_quizzes')
        .select(
          'id, class_id, bible_study_date, title, due_date, created_by, created_at'
        )
        .eq('class_id', classId)
        .order('bible_study_date', { ascending: false }),

      supabase
        .from('memory_verse_assignments')
        .select(
          'id, class_id, bible_study_date, verse_reference, verse_text, notes, created_by, created_at'
        )
        .eq('class_id', classId)
        .order('bible_study_date', { ascending: false })
    ])

    if (quizResult.error || memoryResult.error) {
      setMessage(
        quizResult.error?.message ||
        memoryResult.error?.message
      )
      return
    }

    setQuizAssignments(quizResult.data || [])
    setMemoryAssignments(memoryResult.data || [])
  }

  function updateQuestion(index, field, value) {
    setQuestions((current) =>
      current.map((question, questionIndex) =>
        questionIndex === index
          ? { ...question, [field]: value }
          : question
      )
    )
    setMessage('')
  }

  function changeQuestionType(index, type) {
    setQuestions((current) =>
      current.map((question, questionIndex) => {
        if (questionIndex !== index) return question

        return {
          ...emptyQuestion(type),
          question_text: question.question_text
        }
      })
    )
    setMessage('')
  }

  function updateChoice(questionIndex, choiceIndex, value) {
    setQuestions((current) =>
      current.map((question, index) => {
        if (index !== questionIndex) return question

        const nextChoices = [...question.choices]
        nextChoices[choiceIndex] = value

        return {
          ...question,
          choices: nextChoices
        }
      })
    )
    setMessage('')
  }

  function updateMatchingPair(questionIndex, pairIndex, field, value) {
    setQuestions((current) =>
      current.map((question, index) => {
        if (index !== questionIndex) return question

        const nextPairs = question.matching_pairs.map((pair, i) =>
          i === pairIndex ? { ...pair, [field]: value } : pair
        )

        return {
          ...question,
          matching_pairs: nextPairs
        }
      })
    )
    setMessage('')
  }

  function addMatchingPair(questionIndex) {
    setQuestions((current) =>
      current.map((question, index) =>
        index === questionIndex
          ? {
              ...question,
              matching_pairs: [
                ...question.matching_pairs,
                { left: '', right: '' }
              ]
            }
          : question
      )
    )
  }

  function removeMatchingPair(questionIndex, pairIndex) {
    setQuestions((current) =>
      current.map((question, index) => {
        if (index !== questionIndex) return question

        if (question.matching_pairs.length <= 2) {
          return question
        }

        return {
          ...question,
          matching_pairs: question.matching_pairs.filter(
            (_, i) => i !== pairIndex
          )
        }
      })
    )
  }

  function addQuestion() {
    setQuestions((current) => [
      ...current,
      emptyQuestion()
    ])
  }

  function removeQuestion(index) {
    setQuestions((current) => {
      if (current.length === 1) return current
      return current.filter((_, i) => i !== index)
    })
  }

  function resetQuizForm() {
    setQuizTitle('')
    setQuizDueDate('')
    setQuestions([emptyQuestion()])
    setEditingQuizId(null)
  }

  function questionIsComplete(question) {
    if (!question.question_text.trim()) return false

    if (question.question_type === 'multiple_choice') {
      return (
        question.choices.every((choice) => choice.trim()) &&
        ['A', 'B', 'C', 'D'].includes(question.correct_answer)
      )
    }

    if (question.question_type === 'true_false') {
      return ['true', 'false'].includes(question.correct_answer)
    }

    if (question.question_type === 'fill_blank') {
      return question.correct_answer.trim().length > 0
    }

    if (question.question_type === 'matching') {
      return (
        question.matching_pairs.length >= 2 &&
        question.matching_pairs.every(
          (pair) => pair.left.trim() && pair.right.trim()
        )
      )
    }

    return false
  }

  function buildQuestionData(question) {
    if (question.question_type === 'multiple_choice') {
      return {
        choices: question.choices,
        correct_answer: question.correct_answer
      }
    }

    if (question.question_type === 'true_false') {
      return {
        correct_answer: question.correct_answer
      }
    }

    if (question.question_type === 'fill_blank') {
      return {
        accepted_answers: [question.correct_answer.trim()]
      }
    }

    if (question.question_type === 'matching') {
      return {
        pairs: question.matching_pairs.map((pair) => ({
          left: pair.left.trim(),
          right: pair.right.trim()
        }))
      }
    }

    return {}
  }

  async function saveQuiz(event) {
    event.preventDefault()
    setSavingQuiz(true)
    setMessage('')

    if (!weekDate || !quizTitle.trim()) {
      setMessage('Choose the Bible Study date and enter a quiz title.')
      setSavingQuiz(false)
      return
    }

    if (!questions.every(questionIsComplete)) {
      setMessage(
        'Please finish every question and its correct answer before saving.'
      )
      setSavingQuiz(false)
      return
    }

    try {
      let quizId = editingQuizId

      if (!quizId) {
        const { data: existingQuiz } = await supabase
          .from('homework_quizzes')
          .select('id')
          .eq('class_id', classId)
          .eq('bible_study_date', weekDate)
          .maybeSingle()

        quizId = existingQuiz?.id || null
      }

      if (quizId) {
        const { error: updateError } = await supabase
          .from('homework_quizzes')
          .update({
            bible_study_date: weekDate,
            title: quizTitle.trim(),
            due_date: quizDueDate || null
          })
          .eq('id', quizId)
          .eq('class_id', classId)

        if (updateError) throw updateError

        const { error: deleteQuestionsError } = await supabase
          .from('homework_questions')
          .delete()
          .eq('quiz_id', quizId)

        if (deleteQuestionsError) throw deleteQuestionsError
      } else {
        const { data: quizData, error: quizError } = await supabase
          .from('homework_quizzes')
          .insert({
            class_id: classId,
            bible_study_date: weekDate,
            title: quizTitle.trim(),
            due_date: quizDueDate || null,
            created_by: profile.id
          })
          .select('id')
          .single()

        if (quizError) throw quizError
        quizId = quizData.id
      }

      const questionRows = questions.map((question, index) => ({
        quiz_id: quizId,
        question_order: index + 1,
        question_type: question.question_type,
        question_text: question.question_text.trim(),
        question_data: buildQuestionData(question)
      }))

      const { error: questionError } = await supabase
        .from('homework_questions')
        .insert(questionRows)

      if (questionError) throw questionError

      setMessage('Homework quiz saved successfully.')
      resetQuizForm()
      await loadAssignments()
    } catch (error) {
      console.error('Homework quiz save error:', error)
      setMessage(
        error?.message || 'Could not save the homework quiz.'
      )
    }

    setSavingQuiz(false)
  }

  function normalizeLoadedQuestion(row) {
    const type = row.question_type || 'multiple_choice'
    const data = row.question_data || {}

    if (type === 'multiple_choice') {
      return {
        question_type: type,
        question_text: row.question_text || '',
        choices: Array.isArray(data.choices)
          ? [...data.choices, '', '', '', ''].slice(0, 4)
          : ['', '', '', ''],
        correct_answer: data.correct_answer || 'A',
        matching_pairs: [
          { left: '', right: '' },
          { left: '', right: '' }
        ]
      }
    }

    if (type === 'true_false') {
      return {
        ...emptyQuestion(type),
        question_text: row.question_text || '',
        correct_answer: data.correct_answer || 'true'
      }
    }

    if (type === 'fill_blank') {
      return {
        ...emptyQuestion(type),
        question_text: row.question_text || '',
        correct_answer:
          data.accepted_answers?.[0] || ''
      }
    }

    if (type === 'matching') {
      return {
        ...emptyQuestion(type),
        question_text: row.question_text || '',
        matching_pairs:
          Array.isArray(data.pairs) && data.pairs.length
            ? data.pairs.map((pair) => ({
                left: pair.left || '',
                right: pair.right || ''
              }))
            : [
                { left: '', right: '' },
                { left: '', right: '' }
              ]
      }
    }

    return emptyQuestion()
  }

  async function editQuiz(quiz) {
    setMessage('')

    const { data: quizQuestions, error } = await supabase
      .from('homework_questions')
      .select(
        'id, question_order, question_type, question_text, question_data'
      )
      .eq('quiz_id', quiz.id)
      .order('question_order', { ascending: true })

    if (error) {
      setMessage(error.message)
      return
    }

    setEditingQuizId(quiz.id)
    setWeekDate(quiz.bible_study_date)
    setQuizTitle(quiz.title || '')
    setQuizDueDate(quiz.due_date || '')
    setQuestions(
      (quizQuestions || []).length
        ? quizQuestions.map(normalizeLoadedQuestion)
        : [emptyQuestion()]
    )

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function deleteQuiz(id) {
    const confirmed = window.confirm(
      'Delete this homework quiz and all of its questions?'
    )

    if (!confirmed) return

    const { error } = await supabase
      .from('homework_quizzes')
      .delete()
      .eq('id', id)
      .eq('class_id', classId)

    if (error) {
      setMessage(error.message)
      return
    }

    if (editingQuizId === id) {
      resetQuizForm()
    }

    setMessage('Homework quiz deleted.')
    await loadAssignments()
  }

  async function saveMemoryVerse(event) {
    event.preventDefault()
    setSavingVerse(true)
    setMessage('')

    if (!weekDate || !verseReference.trim()) {
      setMessage(
        'Choose the Bible Study date and enter the memory verse reference.'
      )
      setSavingVerse(false)
      return
    }

    const { error: deleteError } = await supabase
      .from('memory_verse_assignments')
      .delete()
      .eq('class_id', classId)
      .eq('bible_study_date', weekDate)

    if (deleteError) {
      setMessage(deleteError.message)
      setSavingVerse(false)
      return
    }

    const { error: insertError } = await supabase
      .from('memory_verse_assignments')
      .insert({
        class_id: classId,
        bible_study_date: weekDate,
        verse_reference: verseReference.trim(),
        verse_text: verseText.trim() || null,
        notes: verseNotes.trim() || null,
        created_by: profile.id
      })

    if (insertError) {
      setMessage(insertError.message)
      setSavingVerse(false)
      return
    }

    setVerseReference('')
    setVerseText('')
    setVerseNotes('')
    setMessage('Memory verse assigned successfully.')
    await loadAssignments()
    setSavingVerse(false)
  }

  function editMemoryVerse(item) {
    setWeekDate(item.bible_study_date)
    setVerseReference(item.verse_reference || '')
    setVerseText(item.verse_text || '')
    setVerseNotes(item.notes || '')
    setMessage('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function deleteMemoryVerse(id) {
    const confirmed = window.confirm(
      'Delete this memory verse assignment?'
    )
    if (!confirmed) return

    const { error } = await supabase
      .from('memory_verse_assignments')
      .delete()
      .eq('id', id)
      .eq('class_id', classId)

    if (error) {
      setMessage(error.message)
      return
    }

    setMessage('Memory verse assignment deleted.')
    await loadAssignments()
  }

  return (
    <>
      <DashboardHeader
        title="Weekly Assignments"
        subtitle={`${className} • Build the weekly homework quiz and assign the memory verse`}
      />

      {message && (
        <div
          style={{
            marginTop: '20px',
            padding: '12px 14px',
            borderRadius: '12px',
            background: message.includes('successfully')
              ? '#ecfdf3'
              : '#fef3f2',
            color: message.includes('successfully')
              ? '#087257'
              : '#b42318',
            fontWeight: '600'
          }}
        >
          {message}
        </div>
      )}

      {loading ? (
        <section className="dashboard-card">
          <p>Loading your class...</p>
        </section>
      ) : (
        <>
          <section
            className="dashboard-card"
            style={{ marginTop: '24px' }}
          >
            <h2>Week</h2>
            <div style={{ maxWidth: '260px' }}>
              <label>Bible Study Date</label>
              <input
                type="date"
                value={weekDate}
                onChange={(event) =>
                  setWeekDate(event.target.value)
                }
                style={{ width: '100%' }}
              />
            </div>
          </section>

          <section className="dashboard-card">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: '12px',
                alignItems: 'center',
                flexWrap: 'wrap'
              }}
            >
              <div>
                <h2 style={{ marginBottom: '4px' }}>
                  Homework Quiz
                </h2>
                <p style={{ color: '#6b7280', margin: 0 }}>
                  Mix multiple choice, true/false, fill in the blank,
                  and matching questions.
                </p>
              </div>

              {editingQuizId && (
                <button
                  type="button"
                  onClick={resetQuizForm}
                  style={{
                    border: '1px solid #dfe2ea',
                    background: 'white',
                    padding: '9px 12px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontWeight: '700'
                  }}
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <form onSubmit={saveQuiz}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '16px',
                  marginTop: '20px'
                }}
              >
                <div>
                  <label>Quiz Title</label>
                  <input
                    type="text"
                    value={quizTitle}
                    onChange={(event) =>
                      setQuizTitle(event.target.value)
                    }
                    placeholder="Example: Week 1 — Creation"
                    required
                    disabled={savingQuiz}
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label>Due Date</label>
                  <input
                    type="date"
                    value={quizDueDate}
                    onChange={(event) =>
                      setQuizDueDate(event.target.value)
                    }
                    disabled={savingQuiz}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ marginTop: '24px' }}>
                {questions.map((question, index) => (
                  <div
                    key={index}
                    style={{
                      border: '1px solid #e7e7ef',
                      borderRadius: '16px',
                      padding: '18px',
                      marginBottom: '16px'
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: '12px',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        marginBottom: '14px'
                      }}
                    >
                      <strong>Question {index + 1}</strong>

                      <div
                        style={{
                          display: 'flex',
                          gap: '8px',
                          alignItems: 'center',
                          flexWrap: 'wrap'
                        }}
                      >
                        <select
                          value={question.question_type}
                          onChange={(event) =>
                            changeQuestionType(
                              index,
                              event.target.value
                            )
                          }
                          disabled={savingQuiz}
                        >
                          <option value="multiple_choice">
                            Multiple Choice
                          </option>
                          <option value="true_false">
                            True / False
                          </option>
                          <option value="fill_blank">
                            Fill in the Blank
                          </option>
                          <option value="matching">
                            Matching
                          </option>
                        </select>

                        {questions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeQuestion(index)}
                            disabled={savingQuiz}
                            style={{
                              border: 'none',
                              background: 'transparent',
                              color: '#b42318',
                              fontWeight: '700',
                              cursor: 'pointer'
                            }}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>

                    <div>
                      <label>
                        {question.question_type === 'fill_blank'
                          ? 'Sentence / Question'
                          : question.question_type === 'matching'
                            ? 'Matching Instructions'
                            : 'Question'}
                      </label>

                      <textarea
                        value={question.question_text}
                        onChange={(event) =>
                          updateQuestion(
                            index,
                            'question_text',
                            event.target.value
                          )
                        }
                        rows="3"
                        required
                        disabled={savingQuiz}
                        placeholder={
                          question.question_type === 'fill_blank'
                            ? 'Example: Jesus was born in ________.'
                            : question.question_type === 'matching'
                              ? 'Example: Match each person with the correct event.'
                              : 'Type the question...'
                        }
                        style={{
                          width: '100%',
                          resize: 'vertical',
                          padding: '10px 12px',
                          borderRadius: '10px',
                          border: '1px solid #dfe2ea',
                          font: 'inherit'
                        }}
                      />
                    </div>

                    {question.question_type === 'multiple_choice' && (
                      <>
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns:
                              'repeat(auto-fit, minmax(220px, 1fr))',
                            gap: '12px',
                            marginTop: '14px'
                          }}
                        >
                          {['A', 'B', 'C', 'D'].map(
                            (letter, choiceIndex) => (
                              <div key={letter}>
                                <label>Choice {letter}</label>
                                <input
                                  type="text"
                                  value={
                                    question.choices[choiceIndex]
                                  }
                                  onChange={(event) =>
                                    updateChoice(
                                      index,
                                      choiceIndex,
                                      event.target.value
                                    )
                                  }
                                  required
                                  disabled={savingQuiz}
                                  style={{ width: '100%' }}
                                />
                              </div>
                            )
                          )}
                        </div>

                        <div
                          style={{
                            maxWidth: '260px',
                            marginTop: '14px'
                          }}
                        >
                          <label>Correct Answer</label>
                          <select
                            value={question.correct_answer}
                            onChange={(event) =>
                              updateQuestion(
                                index,
                                'correct_answer',
                                event.target.value
                              )
                            }
                            required
                            disabled={savingQuiz}
                            style={{ width: '100%' }}
                          >
                            <option value="">
                              Select answer
                            </option>
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                            <option value="D">D</option>
                          </select>
                        </div>
                      </>
                    )}

                    {question.question_type === 'true_false' && (
                      <div style={{ marginTop: '16px' }}>
                        <label>Answer Choices</label>

                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns:
                              'repeat(auto-fit, minmax(180px, 1fr))',
                            gap: '12px',
                            marginTop: '10px',
                            maxWidth: '520px'
                          }}
                        >
                          {[
                            ['true', 'True'],
                            ['false', 'False']
                          ].map(([value, label]) => (
                            <label
                              key={value}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '14px 16px',
                                border:
                                  question.correct_answer === value
                                    ? '2px solid #6b35c0'
                                    : '1px solid #dfe2ea',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                background:
                                  question.correct_answer === value
                                    ? '#f7f2ff'
                                    : 'white',
                                fontWeight: '700'
                              }}
                            >
                              <input
                                type="radio"
                                name={`true-false-${index}`}
                                value={value}
                                checked={
                                  question.correct_answer === value
                                }
                                onChange={(event) =>
                                  updateQuestion(
                                    index,
                                    'correct_answer',
                                    event.target.value
                                  )
                                }
                                disabled={savingQuiz}
                              />
                              {label}
                            </label>
                          ))}
                        </div>

                        <p
                          style={{
                            marginTop: '8px',
                            marginBottom: 0,
                            color: '#6b7280',
                            fontSize: '14px'
                          }}
                        >
                          Select the answer that is correct.
                        </p>
                      </div>
                    )}

                    {question.question_type === 'fill_blank' && (
                      <div style={{ marginTop: '16px' }}>
                        <label>Answer to Fill in the Blank</label>

                        <div
                          style={{
                            marginTop: '10px',
                            padding: '16px',
                            border: '1px solid #e7e7ef',
                            borderRadius: '12px',
                            background: '#fafafa',
                            maxWidth: '620px'
                          }}
                        >
                          <p
                            style={{
                              marginTop: 0,
                              marginBottom: '10px',
                              color: '#6b7280',
                              fontSize: '14px'
                            }}
                          >
                            Type the answer that belongs in the blank.
                          </p>

                          <input
                            type="text"
                            value={question.correct_answer}
                            onChange={(event) =>
                              updateQuestion(
                                index,
                                'correct_answer',
                                event.target.value
                              )
                            }
                            placeholder="Type the answer here..."
                            required
                            disabled={savingQuiz}
                            style={{ width: '100%' }}
                          />
                        </div>
                      </div>
                    )}

                    {question.question_type === 'matching' && (
                      <div style={{ marginTop: '16px' }}>
                        <label>Matching Pairs</label>

                        {question.matching_pairs.map(
                          (pair, pairIndex) => (
                            <div
                              key={pairIndex}
                              style={{
                                display: 'grid',
                                gridTemplateColumns:
                                  '1fr auto 1fr auto',
                                gap: '10px',
                                alignItems: 'center',
                                marginTop: '10px'
                              }}
                            >
                              <input
                                type="text"
                                value={pair.left}
                                onChange={(event) =>
                                  updateMatchingPair(
                                    index,
                                    pairIndex,
                                    'left',
                                    event.target.value
                                  )
                                }
                                placeholder="Left item"
                                required
                                disabled={savingQuiz}
                              />

                              <strong>→</strong>

                              <input
                                type="text"
                                value={pair.right}
                                onChange={(event) =>
                                  updateMatchingPair(
                                    index,
                                    pairIndex,
                                    'right',
                                    event.target.value
                                  )
                                }
                                placeholder="Correct match"
                                required
                                disabled={savingQuiz}
                              />

                              <button
                                type="button"
                                onClick={() =>
                                  removeMatchingPair(
                                    index,
                                    pairIndex
                                  )
                                }
                                disabled={
                                  savingQuiz ||
                                  question.matching_pairs.length <= 2
                                }
                                style={{
                                  border: 'none',
                                  background: 'transparent',
                                  color: '#b42318',
                                  fontWeight: '700',
                                  cursor: 'pointer'
                                }}
                              >
                                ×
                              </button>
                            </div>
                          )
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            addMatchingPair(index)
                          }
                          disabled={savingQuiz}
                          style={{
                            marginTop: '12px',
                            border: '1px solid #dfe2ea',
                            background: 'white',
                            padding: '8px 11px',
                            borderRadius: '9px',
                            cursor: 'pointer',
                            fontWeight: '700'
                          }}
                        >
                          + Add Matching Pair
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  flexWrap: 'wrap'
                }}
              >
                <button
                  type="button"
                  onClick={addQuestion}
                  disabled={savingQuiz}
                  style={{
                    border: '1px solid #dfe2ea',
                    background: 'white',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontWeight: '700'
                  }}
                >
                  + Add Question
                </button>

                <button
                  className="primary-button small-button"
                  type="submit"
                  disabled={savingQuiz || !classId}
                  style={{ width: 'auto' }}
                >
                  {savingQuiz
                    ? 'Saving...'
                    : editingQuizId
                      ? 'Save Quiz Changes'
                      : 'Assign Homework Quiz'}
                </button>
              </div>
            </form>
          </section>

          <section className="dashboard-card">
            <h2>Assign Memory Verse</h2>

            <form onSubmit={saveMemoryVerse}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '16px'
                }}
              >
                <div>
                  <label>Verse Reference</label>
                  <input
                    type="text"
                    value={verseReference}
                    onChange={(event) =>
                      setVerseReference(event.target.value)
                    }
                    placeholder="Example: Psalm 119:11"
                    required
                    disabled={savingVerse}
                    style={{ width: '100%' }}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label>Verse Text</label>
                  <textarea
                    value={verseText}
                    onChange={(event) =>
                      setVerseText(event.target.value)
                    }
                    placeholder="Optional: type the full verse here"
                    rows="3"
                    disabled={savingVerse}
                    style={{
                      width: '100%',
                      resize: 'vertical',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: '1px solid #dfe2ea',
                      font: 'inherit'
                    }}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label>Notes</label>
                  <textarea
                    value={verseNotes}
                    onChange={(event) =>
                      setVerseNotes(event.target.value)
                    }
                    placeholder="Optional reminder or instructions"
                    rows="3"
                    disabled={savingVerse}
                    style={{
                      width: '100%',
                      resize: 'vertical',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: '1px solid #dfe2ea',
                      font: 'inherit'
                    }}
                  />
                </div>
              </div>

              <button
                className="primary-button small-button"
                type="submit"
                disabled={savingVerse || !classId}
                style={{ width: 'auto', marginTop: '20px' }}
              >
                {savingVerse ? 'Saving...' : 'Assign Memory Verse'}
              </button>
            </form>
          </section>

          <section className="dashboard-card">
            <h2>Homework Quiz History</h2>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Bible Study Date</th>
                    <th>Quiz</th>
                    <th>Due</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {quizAssignments.map((quiz) => (
                    <tr key={quiz.id}>
                      <td>{quiz.bible_study_date}</td>
                      <td>
                        <strong>{quiz.title}</strong>
                      </td>
                      <td>{quiz.due_date || '—'}</td>
                      <td>
                        <div
                          style={{
                            display: 'flex',
                            gap: '8px',
                            justifyContent: 'flex-end'
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => editQuiz(quiz)}
                            style={{
                              border: 'none',
                              background: 'transparent',
                              color: '#6b35c0',
                              fontWeight: '700',
                              cursor: 'pointer'
                            }}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteQuiz(quiz.id)}
                            style={{
                              border: 'none',
                              background: 'transparent',
                              color: '#b42318',
                              fontWeight: '700',
                              cursor: 'pointer'
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {!quizAssignments.length && (
                    <tr>
                      <td colSpan="4">
                        No homework quizzes yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="dashboard-card">
            <h2>Memory Verse History</h2>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Bible Study Date</th>
                    <th>Reference</th>
                    <th>Verse</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {memoryAssignments.map((item) => (
                    <tr key={item.id}>
                      <td>{item.bible_study_date}</td>
                      <td>
                        <strong>{item.verse_reference}</strong>
                      </td>
                      <td>{item.verse_text || '—'}</td>
                      <td>
                        <div
                          style={{
                            display: 'flex',
                            gap: '8px',
                            justifyContent: 'flex-end'
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => editMemoryVerse(item)}
                            style={{
                              border: 'none',
                              background: 'transparent',
                              color: '#6b35c0',
                              fontWeight: '700',
                              cursor: 'pointer'
                            }}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              deleteMemoryVerse(item.id)
                            }
                            style={{
                              border: 'none',
                              background: 'transparent',
                              color: '#b42318',
                              fontWeight: '700',
                              cursor: 'pointer'
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {!memoryAssignments.length && (
                    <tr>
                      <td colSpan="4">
                        No memory verses assigned yet.
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


function ServantAttendance({ profile }) {
  const today = new Date().toISOString().slice(0, 10)

  const [classId, setClassId] = useState(null)
  const [className, setClassName] = useState('My Bible Study Class')
  const [students, setStudents] = useState([])
  const [date, setDate] = useState(today)
  const [attendance, setAttendance] = useState({})
  const [loading, setLoading] = useState(true)
  const [loadingRecords, setLoadingRecords] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadAssignedClass()
  }, [])

  useEffect(() => {
    if (classId && students.length && date) {
      loadAttendance()
    }
  }, [classId, students.length, date])

  async function loadAssignedClass() {
    setLoading(true)
    setMessage('')

    const { data: assignment, error: assignmentError } =
      await supabase
        .from('servant_classes')
        .select('class_id')
        .eq('servant_id', profile.id)
        .limit(1)
        .maybeSingle()

    if (assignmentError) {
      setMessage(assignmentError.message)
      setLoading(false)
      return
    }

    if (!assignment) {
      setMessage('You are not assigned to a class yet.')
      setLoading(false)
      return
    }

    setClassId(assignment.class_id)

    const [classResult, membershipResult] = await Promise.all([
      supabase
        .from('classes')
        .select('id, name')
        .eq('id', assignment.class_id)
        .single(),

      supabase
        .from('class_members')
        .select('student_id')
        .eq('class_id', assignment.class_id)
    ])

    if (classResult.data) {
      setClassName(classResult.data.name)
    }

    if (membershipResult.error) {
      setMessage(membershipResult.error.message)
      setLoading(false)
      return
    }

    const studentIds =
      membershipResult.data?.map((item) => item.student_id) || []

    if (!studentIds.length) {
      setStudents([])
      setAttendance({})
      setLoading(false)
      return
    }

    const { data: roster, error: rosterError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, grade')
      .in('id', studentIds)
      .eq('active', true)
      .order('first_name')

    if (rosterError) {
      setMessage(rosterError.message)
      setLoading(false)
      return
    }

    const activeStudents = roster || []
    setStudents(activeStudents)

    const initial = {}
    activeStudents.forEach((student) => {
      initial[student.id] = false
    })
    setAttendance(initial)

    setLoading(false)
  }

  async function loadAttendance() {
    setLoadingRecords(true)
    setMessage('')

    const studentIds = students.map((student) => student.id)

    const { data, error } = await supabase
      .from('attendance')
      .select('student_id, present')
      .eq('class_id', classId)
      .eq('bible_study_date', date)
      .in('student_id', studentIds)

    if (error) {
      setMessage(error.message)
      setLoadingRecords(false)
      return
    }

    const next = {}
    students.forEach((student) => {
      next[student.id] = false
    })

    ;(data || []).forEach((record) => {
      if (record.student_id in next) {
        next[record.student_id] = record.present === true
      }
    })

    setAttendance(next)
    setLoadingRecords(false)
  }

  function setStudentAttendance(studentId, present) {
    setAttendance((current) => ({
      ...current,
      [studentId]: present
    }))
    setMessage('')
  }

  function markAll(present) {
    const next = {}
    students.forEach((student) => {
      next[student.id] = present
    })
    setAttendance(next)
    setMessage('')
  }

  async function saveAttendance() {
    if (!classId || !students.length) return

    setSaving(true)
    setMessage('')

    try {
      for (const student of students) {
        const { error: deleteError } = await supabase
          .from('attendance')
          .delete()
          .eq('student_id', student.id)
          .eq('class_id', classId)
          .eq('bible_study_date', date)

        if (deleteError) throw deleteError

        const { error: insertError } = await supabase
          .from('attendance')
          .insert({
            student_id: student.id,
            class_id: classId,
            bible_study_date: date,
            present: attendance[student.id] === true,
            recorded_by: profile.id
          })

        if (insertError) throw insertError
      }

      setMessage('Attendance saved successfully.')
      await loadAttendance()
    } catch (error) {
      console.error('Attendance save error:', error)
      setMessage(
        error?.message ||
          'Could not save attendance. Please try again.'
      )
    }

    setSaving(false)
  }

  const presentCount = students.filter(
    (student) => attendance[student.id] === true
  ).length

  const absentCount = Math.max(
    0,
    students.length - presentCount
  )

  const attendancePercent = students.length
    ? Math.round((presentCount / students.length) * 100)
    : 0

  return (
    <>
      <DashboardHeader
        title="Attendance"
        subtitle={`${className} • Record and edit Bible Study attendance`}
      />

      <div className="stats-grid">
        <StatCard
          icon={<Users />}
          label="Students"
          value={students.length}
          helper="Active roster"
        />

        <StatCard
          icon={<CheckCircle2 />}
          label="Present"
          value={presentCount}
          helper="Selected date"
        />

        <StatCard
          icon={<UserRound />}
          label="Absent"
          value={absentCount}
          helper="Selected date"
        />

        <StatCard
          icon={<BarChart3 />}
          label="Attendance"
          value={`${attendancePercent}%`}
          helper="Selected date"
        />
      </div>

      <section className="dashboard-card">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'end',
            gap: '16px',
            flexWrap: 'wrap'
          }}
        >
          <div>
            <label>Bible Study Date</label>
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              disabled={saving}
              style={{ minWidth: '190px' }}
            />
          </div>

          <div
            style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap'
            }}
          >
            <button
              type="button"
              onClick={() => markAll(true)}
              disabled={saving || !students.length}
              style={{
                border: '1px solid #dfe2ea',
                background: 'white',
                padding: '9px 12px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: '700'
              }}
            >
              Mark All Present
            </button>

            <button
              type="button"
              onClick={() => markAll(false)}
              disabled={saving || !students.length}
              style={{
                border: '1px solid #dfe2ea',
                background: 'white',
                padding: '9px 12px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: '700'
              }}
            >
              Mark All Absent
            </button>
          </div>
        </div>

        {message && (
          <div
            style={{
              marginTop: '16px',
              padding: '12px 14px',
              borderRadius: '12px',
              background: message.includes('successfully')
                ? '#ecfdf3'
                : '#fef3f2',
              color: message.includes('successfully')
                ? '#087257'
                : '#b42318',
              fontWeight: '600'
            }}
          >
            {message}
          </div>
        )}
      </section>

      <section className="dashboard-card">
        <h2>Class Attendance</h2>

        {loading || loadingRecords ? (
          <p>Loading attendance...</p>
        ) : !students.length ? (
          <p>No students are assigned to this class yet.</p>
        ) : (
          <>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Grade</th>
                    <th>Status</th>
                    <th>Present</th>
                    <th>Absent</th>
                  </tr>
                </thead>

                <tbody>
                  {students.map((student) => {
                    const isPresent =
                      attendance[student.id] === true

                    return (
                      <tr key={student.id}>
                        <td>
                          <strong>
                            {student.first_name}{' '}
                            {student.last_name}
                          </strong>
                        </td>

                        <td>{student.grade || '—'}</td>

                        <td>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '5px 9px',
                              borderRadius: '999px',
                              fontWeight: '700',
                              fontSize: '12px',
                              background: isPresent
                                ? '#ecfdf3'
                                : '#fef3f2',
                              color: isPresent
                                ? '#087257'
                                : '#b42318'
                            }}
                          >
                            {isPresent ? 'Present' : 'Absent'}
                          </span>
                        </td>

                        <td>
                          <input
                            type="radio"
                            name={`attendance-${student.id}`}
                            checked={isPresent}
                            onChange={() =>
                              setStudentAttendance(
                                student.id,
                                true
                              )
                            }
                            disabled={saving}
                            style={{
                              width: '19px',
                              height: '19px',
                              cursor: 'pointer'
                            }}
                          />
                        </td>

                        <td>
                          <input
                            type="radio"
                            name={`attendance-${student.id}`}
                            checked={!isPresent}
                            onChange={() =>
                              setStudentAttendance(
                                student.id,
                                false
                              )
                            }
                            disabled={saving}
                            style={{
                              width: '19px',
                              height: '19px',
                              cursor: 'pointer'
                            }}
                          />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginTop: '20px'
              }}
            >
              <button
                className="primary-button small-button"
                type="button"
                onClick={saveAttendance}
                disabled={saving || loadingRecords}
                style={{ width: 'auto' }}
              >
                {saving
                  ? 'Saving...'
                  : 'Save Attendance'}
              </button>
            </div>
          </>
        )}
      </section>
    </>
  )
}



function ServantStudents({ profile }) {
  const [classId, setClassId] = useState(null)
  const [className, setClassName] = useState('My Bible Study Class')
  const [students, setStudents] = useState([])
  const [stats, setStats] = useState({})
  const [search, setSearch] = useState('')
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [showAddStudent, setShowAddStudent] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    grade: ''
  })

  useEffect(() => {
    loadStudents()
  }, [])

  async function loadStudents() {
    setLoading(true)
    setMessage('')

    const { data: assignment, error: assignmentError } =
      await supabase
        .from('servant_classes')
        .select('class_id')
        .eq('servant_id', profile.id)
        .limit(1)
        .maybeSingle()

    if (assignmentError) {
      setMessage(assignmentError.message)
      setLoading(false)
      return
    }

    if (!assignment) {
      setMessage('You are not assigned to a class yet.')
      setLoading(false)
      return
    }

    setClassId(assignment.class_id)

    const [classResult, membershipsResult] = await Promise.all([
      supabase
        .from('classes')
        .select('id, name')
        .eq('id', assignment.class_id)
        .single(),
      supabase
        .from('class_members')
        .select('student_id')
        .eq('class_id', assignment.class_id)
    ])

    if (classResult.data) {
      setClassName(classResult.data.name)
    }

    if (membershipsResult.error) {
      setMessage(membershipsResult.error.message)
      setLoading(false)
      return
    }

    const studentIds =
      membershipsResult.data?.map((item) => item.student_id) || []

    if (!studentIds.length) {
      setStudents([])
      setStats({})
      setLoading(false)
      return
    }

    const { data: roster, error: rosterError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, grade, active')
      .in('id', studentIds)
      .eq('active', true)
      .order('first_name')

    if (rosterError) {
      setMessage(rosterError.message)
      setLoading(false)
      return
    }

    const activeStudents = roster || []
    setStudents(activeStudents)

    const ids = activeStudents.map((student) => student.id)

    const [
      attendanceResult,
      readingResult,
      homeworkResult,
      verseResult,
      bibleResult,
      participationResult,
      bonusResult,
      rulesResult
    ] = await Promise.all([
      supabase
        .from('attendance')
        .select('student_id, present')
        .eq('class_id', assignment.class_id)
        .in('student_id', ids),
      supabase
        .from('daily_reading')
        .select('student_id, completed')
        .in('student_id', ids),
      supabase
        .from('homework')
        .select('student_id, completed')
        .eq('class_id', assignment.class_id)
        .in('student_id', ids),
      supabase
        .from('memory_verses')
        .select('student_id, completed')
        .eq('class_id', assignment.class_id)
        .in('student_id', ids),
      supabase
        .from('physical_bible')
        .select('student_id, brought_bible')
        .eq('class_id', assignment.class_id)
        .in('student_id', ids),
      supabase
        .from('participation')
        .select('student_id, points')
        .eq('class_id', assignment.class_id)
        .in('student_id', ids),
      supabase
        .from('bonus_points')
        .select('student_id, points')
        .eq('class_id', assignment.class_id)
        .in('student_id', ids),
      supabase
        .from('point_rules')
        .select('category, points')
    ])

    const allResults = [
      attendanceResult,
      readingResult,
      homeworkResult,
      verseResult,
      bibleResult,
      participationResult,
      bonusResult,
      rulesResult
    ]

    const firstError =
      allResults.find((result) => result.error)?.error

    if (firstError) {
      setMessage(firstError.message)
      setLoading(false)
      return
    }

    const pointRules = {}
    ;(rulesResult.data || []).forEach((rule) => {
      pointRules[rule.category] = Number(rule.points) || 0
    })

    const nextStats = {}

    activeStudents.forEach((student) => {
      const filterStudent = (result) =>
        (result.data || []).filter(
          (record) => record.student_id === student.id
        )

      const attendance = filterStudent(attendanceResult)
      const reading = filterStudent(readingResult)
      const homework = filterStudent(homeworkResult)
      const verses = filterStudent(verseResult)
      const bibles = filterStudent(bibleResult)
      const participation = filterStudent(participationResult)
      const bonus = filterStudent(bonusResult)

      const countTrue = (items, field) =>
        items.filter((item) => item[field] === true).length

      const percentage = (items, field) =>
        items.length
          ? Math.round(
              (countTrue(items, field) / items.length) * 100
            )
          : 0

      const attendanceDone =
        countTrue(attendance, 'present')
      const readingDone =
        countTrue(reading, 'completed')
      const homeworkDone =
        countTrue(homework, 'completed')
      const verseDone =
        countTrue(verses, 'completed')
      const bibleDone =
        countTrue(bibles, 'brought_bible')

      const participationPoints = participation.reduce(
        (sum, record) =>
          sum + (Number(record.points) || 0),
        0
      )

      const bonusPoints = bonus.reduce(
        (sum, record) =>
          sum + (Number(record.points) || 0),
        0
      )

      nextStats[student.id] = {
        attendance: percentage(attendance, 'present'),
        reading: percentage(reading, 'completed'),
        homework: percentage(homework, 'completed'),
        verse: percentage(verses, 'completed'),
        physicalBible: percentage(
          bibles,
          'brought_bible'
        ),
        points:
          attendanceDone *
            (pointRules.attendance || 0) +
          readingDone *
            (pointRules.daily_reading || 0) +
          homeworkDone *
            (pointRules.homework || 0) +
          verseDone *
            (pointRules.memory_verse || 0) +
          bibleDone *
            (pointRules.physical_bible || 0) +
          participationPoints +
          bonusPoints
      }
    })

    setStats(nextStats)
    setLoading(false)
  }

  function updateForm(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value
    }))
    setMessage('')
  }

  async function createStudent(event) {
    event.preventDefault()
    setSaving(true)
    setMessage('')

    if (
      !form.first_name.trim() ||
      !form.last_name.trim() ||
      !form.email.trim() ||
      !form.password ||
      !form.grade.trim()
    ) {
      setMessage('Please complete every field.')
      setSaving(false)
      return
    }

    if (form.password.length < 6) {
      setMessage(
        'The temporary password must be at least 6 characters.'
      )
      setSaving(false)
      return
    }

    const { data, error } = await supabase.functions.invoke(
      'create-user',
      {
        body: {
          email: form.email.trim().toLowerCase(),
          password: form.password,
          first_name: form.first_name.trim(),
          last_name: form.last_name.trim(),
          role: 'student',
          grade: form.grade.trim(),
          class_id: classId
        }
      }
    )

    if (error) {
      console.error('Servant create student error:', error)

      let detail = error.message

      try {
        if (error.context) {
          const body = await error.context.json()
          detail = body?.error || detail
        }
      } catch {
        // Keep the original error message.
      }

      setMessage(detail || 'Could not create the student.')
      setSaving(false)
      return
    }

    if (data?.error) {
      setMessage(data.error)
      setSaving(false)
      return
    }

    setMessage('Student created successfully.')
    setForm({
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      grade: ''
    })

    await loadStudents()
    setShowAddStudent(false)
    setSaving(false)
  }

  const visibleStudents = students.filter((student) => {
    const text =
      `${student.first_name || ''} ${student.last_name || ''} ${student.grade || ''}`
        .toLowerCase()

    return text.includes(search.toLowerCase())
  })

  if (showAddStudent) {
    return (
      <>
        <button
          onClick={() => {
            if (!saving) {
              setShowAddStudent(false)
              setMessage('')
            }
          }}
          disabled={saving}
          style={{
            border: 'none',
            background: 'transparent',
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            padding: 0,
            marginBottom: '18px',
            cursor: saving ? 'default' : 'pointer',
            color: '#6b35c0',
            fontWeight: '700'
          }}
        >
          <ArrowLeft size={18} />
          Back to Students
        </button>

        <DashboardHeader
          title="Add Student"
          subtitle={`Create a student for ${className}`}
        />

        <section
          className="dashboard-card"
          style={{
            marginTop: '24px',
            maxWidth: '760px'
          }}
        >
          <h2>Student Account</h2>

          <p
            style={{
              color: '#6b7280',
              marginTop: '-8px',
              marginBottom: '22px'
            }}
          >
            This student will automatically be assigned to
            {` ${className}`}.
          </p>

          <form onSubmit={createStudent}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '16px'
              }}
            >
              <div>
                <label>First Name</label>
                <input
                  type="text"
                  value={form.first_name}
                  onChange={(event) =>
                    updateForm(
                      'first_name',
                      event.target.value
                    )
                  }
                  required
                  disabled={saving}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label>Last Name</label>
                <input
                  type="text"
                  value={form.last_name}
                  onChange={(event) =>
                    updateForm(
                      'last_name',
                      event.target.value
                    )
                  }
                  required
                  disabled={saving}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label>Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    updateForm('email', event.target.value)
                  }
                  required
                  disabled={saving}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label>Temporary Password</label>
                <input
                  type="text"
                  value={form.password}
                  onChange={(event) =>
                    updateForm(
                      'password',
                      event.target.value
                    )
                  }
                  minLength="6"
                  required
                  disabled={saving}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label>Grade</label>
                <input
                  type="text"
                  value={form.grade}
                  onChange={(event) =>
                    updateForm('grade', event.target.value)
                  }
                  placeholder="Example: 3rd"
                  required
                  disabled={saving}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label>Bible Study Class</label>
                <input
                  type="text"
                  value={className}
                  disabled
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            {message && (
              <div
                style={{
                  marginTop: '18px',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  background: message.includes(
                    'successfully'
                  )
                    ? '#ecfdf3'
                    : '#fef3f2',
                  color: message.includes('successfully')
                    ? '#087257'
                    : '#b42318',
                  fontWeight: '600'
                }}
              >
                {message}
              </div>
            )}

            <button
              className="primary-button small-button"
              type="submit"
              disabled={saving}
              style={{
                width: 'auto',
                marginTop: '22px'
              }}
            >
              {saving ? 'Creating...' : 'Create Student'}
            </button>
          </form>
        </section>
      </>
    )
  }

  if (selectedStudent) {
    const studentStats = stats[selectedStudent.id] || {}

    return (
      <>
        <button
          onClick={() => setSelectedStudent(null)}
          style={{
            border: 'none',
            background: 'transparent',
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            padding: 0,
            marginBottom: '18px',
            cursor: 'pointer',
            color: '#6b35c0',
            fontWeight: '700'
          }}
        >
          <ArrowLeft size={18} />
          Back to Students
        </button>

        <DashboardHeader
          title={`${selectedStudent.first_name} ${selectedStudent.last_name}`}
          subtitle={`${className} • Student profile`}
        />

        <div className="stats-grid">
          <StatCard
            icon={<BookOpen />}
            label="Grade"
            value={selectedStudent.grade || '—'}
            helper="Student grade"
          />
          <StatCard
            icon={<CheckCircle2 />}
            label="Attendance"
            value={`${studentStats.attendance || 0}%`}
            helper="Bible Study"
          />
          <StatCard
            icon={<BookOpen />}
            label="Daily Reading"
            value={`${studentStats.reading || 0}%`}
            helper="Student submitted"
          />
          <StatCard
            icon={<Trophy />}
            label="Points"
            value={studentStats.points || 0}
            helper="Total earned"
          />
        </div>

        <section className="dashboard-card">
          <h2>Progress Snapshot</h2>

          <div className="progress-grid">
            <ProgressCircle
              label="Attendance"
              value={studentStats.attendance || 0}
              emoji="⛪"
            />
            <ProgressCircle
              label="Daily Reading"
              value={studentStats.reading || 0}
              emoji="📖"
            />
            <ProgressCircle
              label="Homework"
              value={studentStats.homework || 0}
              emoji="✏️"
            />
            <ProgressCircle
              label="Memory Verse"
              value={studentStats.verse || 0}
              emoji="🧠"
            />
            <ProgressCircle
              label="Physical Bible"
              value={
                studentStats.physicalBible || 0
              }
              emoji="📕"
            />
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      <DashboardHeader
        title="Students"
        subtitle={`${className} • Manage your class roster`}
      />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: '12px',
          alignItems: 'center',
          flexWrap: 'wrap',
          marginTop: '24px',
          marginBottom: '18px'
        }}
      >
        <input
          type="search"
          placeholder="Search students..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          style={{
            minWidth: '260px',
            flex: 1,
            padding: '12px 14px',
            borderRadius: '12px',
            border: '1px solid #dfe2ea',
            background: 'white'
          }}
        />

        <button
          className="primary-button small-button"
          type="button"
          onClick={() => {
            setMessage('')
            setShowAddStudent(true)
          }}
          disabled={!classId}
          style={{ width: 'auto' }}
        >
          Add Student
        </button>
      </div>

      {message && (
        <section className="dashboard-card">
          <p>{message}</p>
        </section>
      )}

      <section className="dashboard-card">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '12px',
            alignItems: 'center',
            marginBottom: '16px'
          }}
        >
          <h2 style={{ margin: 0 }}>Class Roster</h2>

          <span
            style={{
              color: '#6b7280',
              fontSize: '13px'
            }}
          >
            {visibleStudents.length}{' '}
            {visibleStudents.length === 1
              ? 'student'
              : 'students'}
          </span>
        </div>

        {loading ? (
          <p>Loading students...</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Grade</th>
                  <th>Attendance</th>
                  <th>Reading</th>
                  <th>Points</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {visibleStudents.map((student) => {
                  const studentStats =
                    stats[student.id] || {}

                  return (
                    <tr key={student.id}>
                      <td>
                        <strong>
                          {student.first_name}{' '}
                          {student.last_name}
                        </strong>
                      </td>
                      <td>{student.grade || '—'}</td>
                      <td>
                        {studentStats.attendance || 0}%
                      </td>
                      <td>
                        {studentStats.reading || 0}%
                      </td>
                      <td>
                        <strong>
                          {studentStats.points || 0}
                        </strong>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={() =>
                            setSelectedStudent(student)
                          }
                          style={{
                            border: 'none',
                            background: 'transparent',
                            color: '#6b35c0',
                            fontWeight: '700',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          View
                          <ChevronRight size={17} />
                        </button>
                      </td>
                    </tr>
                  )
                })}

                {!visibleStudents.length && (
                  <tr>
                    <td colSpan="6">
                      No students match this search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  )
}



function ServantReports({ profile }) {
  const [className, setClassName] = useState('My Bible Study Class')
  const [students, setStudents] = useState([])
  const [attendance, setAttendance] = useState([])
  const [reading, setReading] = useState([])
  const [homework, setHomework] = useState([])
  const [verses, setVerses] = useState([])
  const [bibles, setBibles] = useState([])
  const [participation, setParticipation] = useState([])
  const [bonus, setBonus] = useState([])
  const [rules, setRules] = useState([])
  const [quizzes, setQuizzes] = useState([])
  const [quizSubmissions, setQuizSubmissions] = useState([])

  const [selectedQuizId, setSelectedQuizId] = useState('')
  const [selectedSubmission, setSelectedSubmission] = useState(null)
  const [reviewQuestions, setReviewQuestions] = useState([])
  const [reviewAnswers, setReviewAnswers] = useState([])
  const [reviewLoading, setReviewLoading] = useState(false)

  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadReports()
  }, [])

  async function loadReports() {
    setLoading(true)
    setMessage('')

    const { data: assignment, error: assignmentError } =
      await supabase
        .from('servant_classes')
        .select('class_id')
        .eq('servant_id', profile.id)
        .limit(1)
        .maybeSingle()

    if (assignmentError) {
      setMessage(assignmentError.message)
      setLoading(false)
      return
    }

    if (!assignment) {
      setMessage('You are not assigned to a class yet.')
      setLoading(false)
      return
    }

    const classId = assignment.class_id

    const [classResult, membershipsResult, quizzesResult] =
      await Promise.all([
        supabase
          .from('classes')
          .select('id, name')
          .eq('id', classId)
          .single(),

        supabase
          .from('class_members')
          .select('student_id')
          .eq('class_id', classId),

        supabase
          .from('homework_quizzes')
          .select(
            'id, class_id, bible_study_date, title, due_date, created_at'
          )
          .eq('class_id', classId)
          .order('bible_study_date', { ascending: false })
      ])

    if (classResult.data?.name) {
      setClassName(classResult.data.name)
    }

    if (membershipsResult.error || quizzesResult.error) {
      setMessage(
        membershipsResult.error?.message ||
        quizzesResult.error?.message
      )
      setLoading(false)
      return
    }

    const quizRows = quizzesResult.data || []
    setQuizzes(quizRows)

    if (quizRows.length) {
      setSelectedQuizId((current) =>
        current || String(quizRows[0].id)
      )
    }

    const studentIds =
      membershipsResult.data?.map((item) => item.student_id) || []

    if (!studentIds.length) {
      setStudents([])
      setQuizSubmissions([])
      setLoading(false)
      return
    }

    const studentsResult = await supabase
      .from('profiles')
      .select('id, first_name, last_name, grade')
      .in('id', studentIds)
      .eq('active', true)
      .order('first_name')

    if (studentsResult.error) {
      setMessage(studentsResult.error.message)
      setLoading(false)
      return
    }

    const roster = studentsResult.data || []
    setStudents(roster)

    const ids = roster.map((student) => student.id)
    const quizIds = quizRows.map((quiz) => quiz.id)

    const reportPromises = [
      supabase
        .from('attendance')
        .select('student_id, bible_study_date, present')
        .eq('class_id', classId)
        .in('student_id', ids),

      supabase
        .from('daily_reading')
        .select('student_id, reading_date, completed')
        .in('student_id', ids),

      supabase
        .from('homework')
        .select('student_id, bible_study_date, completed')
        .eq('class_id', classId)
        .in('student_id', ids),

      supabase
        .from('memory_verses')
        .select('student_id, bible_study_date, completed')
        .eq('class_id', classId)
        .in('student_id', ids),

      supabase
        .from('physical_bible')
        .select('student_id, bible_study_date, brought_bible')
        .eq('class_id', classId)
        .in('student_id', ids),

      supabase
        .from('participation')
        .select('student_id, bible_study_date, points')
        .eq('class_id', classId)
        .in('student_id', ids),

      supabase
        .from('bonus_points')
        .select('student_id, bible_study_date, points')
        .eq('class_id', classId)
        .in('student_id', ids),

      supabase
        .from('point_rules')
        .select('category, points')
    ]

    if (quizIds.length) {
      reportPromises.push(
        supabase
          .from('homework_submissions')
          .select(
            'id, quiz_id, student_id, score, total_questions, percentage, submitted_at'
          )
          .in('quiz_id', quizIds)
          .in('student_id', ids)
          .order('submitted_at', { ascending: false })
      )
    }

    const results = await Promise.all(reportPromises)

    const firstError =
      results.find((result) => result.error)?.error

    if (firstError) {
      setMessage(firstError.message)
      setLoading(false)
      return
    }

    setAttendance(results[0].data || [])
    setReading(results[1].data || [])
    setHomework(results[2].data || [])
    setVerses(results[3].data || [])
    setBibles(results[4].data || [])
    setParticipation(results[5].data || [])
    setBonus(results[6].data || [])
    setRules(results[7].data || [])
    setQuizSubmissions(quizIds.length ? results[8].data || [] : [])

    setLoading(false)
  }

  function studentName(studentId) {
    const student = students.find((item) => item.id === studentId)

    return student
      ? `${student.first_name} ${student.last_name}`
      : 'Student'
  }

  function countTrue(records, field) {
    return records.filter((record) => record[field] === true).length
  }

  function percent(done, total) {
    return total ? Math.round((done / total) * 100) : 0
  }

  function prettyDate(dateString) {
    if (!dateString) return '—'

    return new Date(`${dateString}T12:00:00`).toLocaleDateString(
      'en-US',
      {
        month: 'short',
        day: 'numeric'
      }
    )
  }

  const pointRules = {}
  rules.forEach((rule) => {
    pointRules[rule.category] = Number(rule.points) || 0
  })

  const attendanceDone = countTrue(attendance, 'present')
  const readingDone = countTrue(reading, 'completed')
  const homeworkDone = countTrue(homework, 'completed')
  const verseDone = countTrue(verses, 'completed')
  const bibleDone = countTrue(bibles, 'brought_bible')

  const classAttendance = percent(
    attendanceDone,
    attendance.length
  )

  const classReading = percent(
    readingDone,
    reading.length
  )

  const classHomework = percent(
    homeworkDone,
    homework.length
  )

  const classVerse = percent(
    verseDone,
    verses.length
  )

  const classBible = percent(
    bibleDone,
    bibles.length
  )

  const participationPoints = participation.reduce(
    (sum, item) => sum + (Number(item.points) || 0),
    0
  )

  const bonusPoints = bonus.reduce(
    (sum, item) => sum + (Number(item.points) || 0),
    0
  )

  const totalPoints =
    attendanceDone * (pointRules.attendance || 0) +
    readingDone * (pointRules.daily_reading || 0) +
    homeworkDone * (pointRules.homework || 0) +
    verseDone * (pointRules.memory_verse || 0) +
    bibleDone * (pointRules.physical_bible || 0) +
    participationPoints +
    bonusPoints

  const overallAverage = Math.round(
    (
      classAttendance +
      classReading +
      classHomework +
      classVerse +
      classBible
    ) / 5
  )

  const selectedQuiz =
    quizzes.find(
      (quiz) => String(quiz.id) === String(selectedQuizId)
    ) || null

  const selectedQuizSubmissions = selectedQuiz
    ? quizSubmissions.filter(
        (submission) =>
          String(submission.quiz_id) === String(selectedQuiz.id)
      )
    : []

  const submittedStudentIds = new Set(
    selectedQuizSubmissions.map((submission) => submission.student_id)
  )

  const notSubmittedStudents = students.filter(
    (student) => !submittedStudentIds.has(student.id)
  )

  const selectedQuizAverage = selectedQuizSubmissions.length
    ? Math.round(
        selectedQuizSubmissions.reduce(
          (sum, submission) =>
            sum + (Number(submission.percentage) || 0),
          0
        ) / selectedQuizSubmissions.length
      )
    : 0

  const quizAverages = quizzes
    .map((quiz) => {
      const submissions = quizSubmissions.filter(
        (submission) =>
          String(submission.quiz_id) === String(quiz.id)
      )

      const average = submissions.length
        ? Math.round(
            submissions.reduce(
              (sum, submission) =>
                sum + (Number(submission.percentage) || 0),
              0
            ) / submissions.length
          )
        : 0

      return {
        ...quiz,
        average,
        submitted: submissions.length
      }
    })
    .slice(0, 6)

  const attendanceByDate = Array.from(
    new Set(
      attendance
        .map((record) => record.bible_study_date)
        .filter(Boolean)
    )
  )
    .sort((a, b) => b.localeCompare(a))
    .slice(0, 8)
    .reverse()
    .map((date) => {
      const rows = attendance.filter(
        (record) => record.bible_study_date === date
      )

      return {
        date,
        percent: percent(
          countTrue(rows, 'present'),
          rows.length
        )
      }
    })

  const studentRows = students.map((student) => {
    const byStudent = (records) =>
      records.filter(
        (record) => record.student_id === student.id
      )

    const studentAttendance = byStudent(attendance)
    const studentReading = byStudent(reading)
    const studentHomework = byStudent(homework)
    const studentVerses = byStudent(verses)
    const studentBibles = byStudent(bibles)
    const studentParticipation = byStudent(participation)
    const studentBonus = byStudent(bonus)

    const attendanceCount = countTrue(
      studentAttendance,
      'present'
    )

    const readingCount = countTrue(
      studentReading,
      'completed'
    )

    const homeworkCount = countTrue(
      studentHomework,
      'completed'
    )

    const verseCount = countTrue(
      studentVerses,
      'completed'
    )

    const bibleCount = countTrue(
      studentBibles,
      'brought_bible'
    )

    const participationTotal = studentParticipation.reduce(
      (sum, item) => sum + (Number(item.points) || 0),
      0
    )

    const bonusTotal = studentBonus.reduce(
      (sum, item) => sum + (Number(item.points) || 0),
      0
    )

    const points =
      attendanceCount * (pointRules.attendance || 0) +
      readingCount * (pointRules.daily_reading || 0) +
      homeworkCount * (pointRules.homework || 0) +
      verseCount * (pointRules.memory_verse || 0) +
      bibleCount * (pointRules.physical_bible || 0) +
      participationTotal +
      bonusTotal

    const quizRows = quizSubmissions.filter(
      (submission) => submission.student_id === student.id
    )

    const quizAverage = quizRows.length
      ? Math.round(
          quizRows.reduce(
            (sum, submission) =>
              sum + (Number(submission.percentage) || 0),
            0
          ) / quizRows.length
        )
      : null

    return {
      ...student,
      attendance: percent(
        attendanceCount,
        studentAttendance.length
      ),
      reading: percent(
        readingCount,
        studentReading.length
      ),
      homework: percent(
        homeworkCount,
        studentHomework.length
      ),
      verse: percent(
        verseCount,
        studentVerses.length
      ),
      bible: percent(
        bibleCount,
        studentBibles.length
      ),
      points,
      quizAverage
    }
  })

  const sortedByPoints = [...studentRows].sort(
    (a, b) => b.points - a.points
  )

  async function openSubmissionReview(submission) {
    setReviewLoading(true)
    setMessage('')
    setSelectedSubmission(submission)
    setReviewQuestions([])
    setReviewAnswers([])

    const [questionsResult, answersResult] = await Promise.all([
      supabase
        .from('homework_questions')
        .select(
          'id, question_order, question_type, question_text, question_data'
        )
        .eq('quiz_id', submission.quiz_id)
        .order('question_order', { ascending: true }),

      supabase
        .from('homework_answers')
        .select(
          'id, submission_id, question_id, selected_answer, is_correct'
        )
        .eq('submission_id', submission.id)
    ])

    if (questionsResult.error || answersResult.error) {
      setMessage(
        questionsResult.error?.message ||
        answersResult.error?.message
      )
      setReviewLoading(false)
      return
    }

    setReviewQuestions(questionsResult.data || [])
    setReviewAnswers(answersResult.data || [])
    setReviewLoading(false)
  }

  function answerForQuestion(questionId) {
    return reviewAnswers.find(
      (answer) => Number(answer.question_id) === Number(questionId)
    )
  }

  function displayStudentAnswer(question, answer) {
    if (!answer) return 'No answer'

    if (question.question_type === 'multiple_choice') {
      const letter = String(answer.selected_answer || '').toUpperCase()
      const choices = question.question_data?.choices || []
      const choiceIndex = ['A', 'B', 'C', 'D'].indexOf(letter)

      return choiceIndex >= 0 && choices[choiceIndex]
        ? `${letter}. ${choices[choiceIndex]}`
        : letter
    }

    if (question.question_type === 'true_false') {
      const value = String(answer.selected_answer || '')
      return value === 'true'
        ? 'True'
        : value === 'false'
          ? 'False'
          : value
    }

    if (question.question_type === 'matching') {
      try {
        const selected = JSON.parse(answer.selected_answer || '{}')
        const pairs = question.question_data?.pairs || []

        return pairs
          .map(
            (pair, index) =>
              `${pair.left} → ${selected[String(index)] || '—'}`
          )
          .join(' • ')
      } catch {
        return answer.selected_answer || '—'
      }
    }

    return answer.selected_answer || '—'
  }

  function displayCorrectAnswer(question) {
    const data = question.question_data || {}

    if (question.question_type === 'multiple_choice') {
      const letter = String(data.correct_answer || '').toUpperCase()
      const choices = data.choices || []
      const choiceIndex = ['A', 'B', 'C', 'D'].indexOf(letter)

      return choiceIndex >= 0 && choices[choiceIndex]
        ? `${letter}. ${choices[choiceIndex]}`
        : letter || '—'
    }

    if (question.question_type === 'true_false') {
      return data.correct_answer === 'true' ? 'True' : 'False'
    }

    if (question.question_type === 'fill_blank') {
      return (data.accepted_answers || []).join(' / ') || '—'
    }

    if (question.question_type === 'matching') {
      return (data.pairs || [])
        .map((pair) => `${pair.left} → ${pair.right}`)
        .join(' • ')
    }

    return '—'
  }

  if (selectedSubmission) {
    const reviewQuiz = quizzes.find(
      (quiz) =>
        String(quiz.id) === String(selectedSubmission.quiz_id)
    )

    return (
      <>
        <button
          type="button"
          onClick={() => {
            setSelectedSubmission(null)
            setReviewQuestions([])
            setReviewAnswers([])
            setMessage('')
          }}
          style={{
            border: 'none',
            background: 'transparent',
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            padding: 0,
            marginBottom: '18px',
            cursor: 'pointer',
            color: '#6b35c0',
            fontWeight: '700'
          }}
        >
          <ArrowLeft size={18} />
          Back to Reports
        </button>

        <DashboardHeader
          title={`${studentName(
            selectedSubmission.student_id
          )} — Homework Review`}
          subtitle={reviewQuiz?.title || 'Homework submission'}
        />

        {reviewLoading ? (
          <section className="dashboard-card">
            <p>Loading answers...</p>
          </section>
        ) : (
          <>
            <div className="stats-grid">
              <StatCard
                icon={<CheckCircle2 />}
                label="Score"
                value={`${selectedSubmission.score}/${selectedSubmission.total_questions}`}
                helper="Questions correct"
              />

              <StatCard
                icon={<Trophy />}
                label="Grade"
                value={`${Math.round(
                  Number(selectedSubmission.percentage) || 0
                )}%`}
                helper="Final score"
              />
            </div>

            <section className="dashboard-card">
              <h2>Student Answers</h2>

              {reviewQuestions.map((question, index) => {
                const answer = answerForQuestion(question.id)

                return (
                  <div
                    key={question.id}
                    style={{
                      border: '1px solid #e7e7ef',
                      borderRadius: '14px',
                      padding: '16px',
                      marginBottom: '14px'
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: '12px',
                        alignItems: 'flex-start'
                      }}
                    >
                      <strong>
                        {index + 1}. {question.question_text}
                      </strong>

                      <span
                        style={{
                          fontWeight: '800',
                          color: answer?.is_correct
                            ? '#087257'
                            : '#b42318'
                        }}
                      >
                        {answer?.is_correct ? '✓ Correct' : '✕ Incorrect'}
                      </span>
                    </div>

                    <div
                      style={{
                        marginTop: '12px',
                        display: 'grid',
                        gap: '8px'
                      }}
                    >
                      <div>
                        <strong>Student answer: </strong>
                        {displayStudentAnswer(question, answer)}
                      </div>

                      <div>
                        <strong>Correct answer: </strong>
                        {displayCorrectAnswer(question)}
                      </div>
                    </div>
                  </div>
                )
              })}

              {!reviewQuestions.length && (
                <p>No question details were found.</p>
              )}
            </section>
          </>
        )}
      </>
    )
  }

  return (
    <>
      <DashboardHeader
        title="Reports"
        subtitle={`${className} • Class trends, quiz performance, and student comparison`}
      />

      {message && (
        <section className="dashboard-card">
          <p>{message}</p>
        </section>
      )}

      {loading ? (
        <section className="dashboard-card">
          <p>Loading reports...</p>
        </section>
      ) : (
        <>
          <div className="stats-grid">
            <StatCard
              icon={<BarChart3 />}
              label="Overall Progress"
              value={`${overallAverage}%`}
              helper="Across 5 core categories"
            />

            <StatCard
              icon={<CheckCircle2 />}
              label="Attendance"
              value={`${classAttendance}%`}
              helper="Class average"
            />

            <StatCard
              icon={<BookOpen />}
              label="Daily Reading"
              value={`${classReading}%`}
              helper="Class completion"
            />

            <StatCard
              icon={<Trophy />}
              label="Points Earned"
              value={totalPoints}
              helper="Class total"
            />
          </div>

          <section className="dashboard-card">
            <h2>Class Progress Snapshot</h2>

            <div
              style={{
                display: 'grid',
                gap: '14px',
                marginTop: '18px'
              }}
            >
              {[
                ['Attendance', classAttendance, '⛪'],
                ['Daily Reading', classReading, '📖'],
                ['Homework', classHomework, '✏️'],
                ['Memory Verse', classVerse, '🧠'],
                ['Physical Bible', classBible, '📕']
              ].map(([label, value, emoji]) => (
                <div key={label}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '6px'
                    }}
                  >
                    <strong>
                      {emoji} {label}
                    </strong>
                    <strong>{value}%</strong>
                  </div>

                  <div
                    style={{
                      height: '10px',
                      background: '#ececf2',
                      borderRadius: '999px',
                      overflow: 'hidden'
                    }}
                  >
                    <div
                      style={{
                        width: `${value}%`,
                        height: '100%',
                        background: 'var(--accent)',
                        borderRadius: '999px'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="dashboard-card">
            <h2>Attendance Trend</h2>

            {attendanceByDate.length ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'end',
                  gap: '14px',
                  minHeight: '230px',
                  overflowX: 'auto',
                  marginTop: '22px',
                  paddingBottom: '8px'
                }}
              >
                {attendanceByDate.map((item) => (
                  <div
                    key={item.date}
                    style={{
                      minWidth: '68px',
                      flex: '1 0 68px',
                      textAlign: 'center'
                    }}
                  >
                    <div
                      style={{
                        height: '170px',
                        display: 'flex',
                        alignItems: 'end',
                        justifyContent: 'center'
                      }}
                    >
                      <div
                        style={{
                          width: '38px',
                          height: `${Math.max(
                            5,
                            item.percent * 1.6
                          )}px`,
                          maxHeight: '160px',
                          background: 'var(--accent)',
                          borderRadius: '9px 9px 3px 3px'
                        }}
                      />
                    </div>

                    <strong
                      style={{
                        display: 'block',
                        marginTop: '7px',
                        fontSize: '13px'
                      }}
                    >
                      {item.percent}%
                    </strong>

                    <span
                      style={{
                        display: 'block',
                        marginTop: '3px',
                        color: '#8a8f9c',
                        fontSize: '11px'
                      }}
                    >
                      {prettyDate(item.date)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#6b7280' }}>
                No attendance trend data yet.
              </p>
            )}
          </section>

          <section className="dashboard-card">
            <h2>Quiz Performance</h2>

            {!quizzes.length ? (
              <p>No homework quizzes have been assigned yet.</p>
            ) : (
              <>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns:
                      'repeat(auto-fit, minmax(190px, 1fr))',
                    gap: '12px',
                    marginTop: '18px'
                  }}
                >
                  {quizAverages.map((quiz) => (
                    <div
                      key={quiz.id}
                      style={{
                        border: '1px solid #ececf2',
                        borderRadius: '14px',
                        padding: '15px'
                      }}
                    >
                      <strong>{quiz.title}</strong>

                      <div
                        style={{
                          fontSize: '28px',
                          fontWeight: '800',
                          color: '#6b35c0',
                          marginTop: '10px'
                        }}
                      >
                        {quiz.submitted ? `${quiz.average}%` : '—'}
                      </div>

                      <div
                        style={{
                          color: '#6b7280',
                          fontSize: '12px',
                          marginTop: '4px'
                        }}
                      >
                        {quiz.submitted}/{students.length} submitted
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    maxWidth: '520px',
                    marginTop: '26px'
                  }}
                >
                  <label>Review a Homework Quiz</label>
                  <select
                    value={selectedQuizId}
                    onChange={(event) => {
                      setSelectedQuizId(event.target.value)
                      setSelectedSubmission(null)
                    }}
                    style={{ width: '100%' }}
                  >
                    {quizzes.map((quiz) => (
                      <option key={quiz.id} value={quiz.id}>
                        {quiz.title} — {quiz.bible_study_date}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedQuiz && (
                  <>
                    <div
                      className="stats-grid"
                      style={{ marginTop: '22px' }}
                    >
                      <StatCard
                        icon={<CheckCircle2 />}
                        label="Submitted"
                        value={`${selectedQuizSubmissions.length}/${students.length}`}
                        helper="Students completed"
                      />

                      <StatCard
                        icon={<BarChart3 />}
                        label="Class Average"
                        value={`${selectedQuizAverage}%`}
                        helper="Submitted students"
                      />

                      <StatCard
                        icon={<Users />}
                        label="Missing"
                        value={notSubmittedStudents.length}
                        helper="Not submitted"
                      />
                    </div>

                    <div className="table-wrapper">
                      <table>
                        <thead>
                          <tr>
                            <th>Student</th>
                            <th>Score</th>
                            <th>Grade</th>
                            <th>Submitted</th>
                            <th></th>
                          </tr>
                        </thead>

                        <tbody>
                          {selectedQuizSubmissions.map(
                            (submission) => (
                              <tr key={submission.id}>
                                <td>
                                  <strong>
                                    {studentName(
                                      submission.student_id
                                    )}
                                  </strong>
                                </td>

                                <td>
                                  {submission.score}/
                                  {submission.total_questions}
                                </td>

                                <td>
                                  <strong>
                                    {Math.round(
                                      Number(
                                        submission.percentage
                                      ) || 0
                                    )}
                                    %
                                  </strong>
                                </td>

                                <td>
                                  {submission.submitted_at
                                    ? new Date(
                                        submission.submitted_at
                                      ).toLocaleString()
                                    : '—'}
                                </td>

                                <td style={{ textAlign: 'right' }}>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      openSubmissionReview(
                                        submission
                                      )
                                    }
                                    style={{
                                      border: 'none',
                                      background: 'transparent',
                                      color: '#6b35c0',
                                      fontWeight: '700',
                                      cursor: 'pointer',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '4px'
                                    }}
                                  >
                                    View Answers
                                    <ChevronRight size={17} />
                                  </button>
                                </td>
                              </tr>
                            )
                          )}

                          {!selectedQuizSubmissions.length && (
                            <tr>
                              <td colSpan="5">
                                No students have submitted this
                                homework yet.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {!!notSubmittedStudents.length && (
                      <div
                        style={{
                          marginTop: '18px',
                          padding: '15px',
                          borderRadius: '14px',
                          background: '#fffaf0',
                          border: '1px solid #f1dfb8'
                        }}
                      >
                        <strong>Still Missing:</strong>
                        <div
                          style={{
                            marginTop: '7px',
                            color: '#6b7280'
                          }}
                        >
                          {notSubmittedStudents
                            .map(
                              (student) =>
                                `${student.first_name} ${student.last_name}`
                            )
                            .join(', ')}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </section>

          <section className="dashboard-card">
            <h2>Student Comparison</h2>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Attendance</th>
                    <th>Reading</th>
                    <th>Homework</th>
                    <th>Memory Verse</th>
                    <th>Quiz Avg.</th>
                    <th>Points</th>
                  </tr>
                </thead>

                <tbody>
                  {sortedByPoints.map((student) => (
                    <tr key={student.id}>
                      <td>
                        <strong>
                          {student.first_name}{' '}
                          {student.last_name}
                        </strong>
                      </td>
                      <td>{student.attendance}%</td>
                      <td>{student.reading}%</td>
                      <td>{student.homework}%</td>
                      <td>{student.verse}%</td>
                      <td>
                        {student.quizAverage === null
                          ? '—'
                          : `${student.quizAverage}%`}
                      </td>
                      <td>
                        <strong>{student.points}</strong>
                      </td>
                    </tr>
                  ))}

                  {!students.length && (
                    <tr>
                      <td colSpan="7">
                        No student data yet.
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


function ServantProfile({ profile }) {
  const [className, setClassName] = useState('Unassigned')
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState(
    profile.first_name || ''
  )
  const [lastName, setLastName] = useState(
    profile.last_name || ''
  )
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] =
    useState('')
  const [loading, setLoading] = useState(true)
  const [savingProfile, setSavingProfile] =
    useState(false)
  const [savingPassword, setSavingPassword] =
    useState(false)
  const [profileMessage, setProfileMessage] =
    useState('')
  const [passwordMessage, setPasswordMessage] =
    useState('')

  useEffect(() => {
    loadProfileDetails()
  }, [])

  async function loadProfileDetails() {
    setLoading(true)

    const [
      userResult,
      assignmentResult
    ] = await Promise.all([
      supabase.auth.getUser(),
      supabase
        .from('servant_classes')
        .select('class_id')
        .eq('servant_id', profile.id)
        .limit(1)
        .maybeSingle()
    ])

    setEmail(userResult.data?.user?.email || '')

    if (assignmentResult.data?.class_id) {
      const { data: classRecord } = await supabase
        .from('classes')
        .select('name')
        .eq('id', assignmentResult.data.class_id)
        .single()

      if (classRecord?.name) {
        setClassName(classRecord.name)
      }
    }

    setLoading(false)
  }

  async function saveProfile(event) {
    event.preventDefault()
    setSavingProfile(true)
    setProfileMessage('')

    if (!firstName.trim() || !lastName.trim()) {
      setProfileMessage(
        'First name and last name are required.'
      )
      setSavingProfile(false)
      return
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        first_name: firstName.trim(),
        last_name: lastName.trim()
      })
      .eq('id', profile.id)

    if (error) {
      setProfileMessage(error.message)
      setSavingProfile(false)
      return
    }

    setProfileMessage(
      'Profile updated successfully. Your sidebar name will refresh the next time you sign in.'
    )
    setSavingProfile(false)
  }

  async function changePassword(event) {
    event.preventDefault()
    setSavingPassword(true)
    setPasswordMessage('')

    if (newPassword.length < 6) {
      setPasswordMessage(
        'Your new password must be at least 6 characters.'
      )
      setSavingPassword(false)
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage('The passwords do not match.')
      setSavingPassword(false)
      return
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (error) {
      setPasswordMessage(error.message)
      setSavingPassword(false)
      return
    }

    setNewPassword('')
    setConfirmPassword('')
    setPasswordMessage(
      'Password changed successfully.'
    )
    setSavingPassword(false)
  }

  return (
    <>
      <DashboardHeader
        title="Profile"
        subtitle="Manage your servant account"
      />

      <div className="stats-grid">
        <StatCard
          icon={<UserRound />}
          label="Role"
          value="Servant"
          helper="Account type"
        />

        <StatCard
          icon={<Users />}
          label="Assigned Class"
          value={loading ? 'Loading...' : className}
          helper="Bible Study group"
        />

        <StatCard
          icon={<BookOpen />}
          label="Email"
          value={loading ? 'Loading...' : email || '—'}
          helper="Login email"
        />
      </div>

      <section
        className="dashboard-card"
        style={{ maxWidth: '760px' }}
      >
        <h2>Personal Information</h2>

        <p
          style={{
            color: '#6b7280',
            marginTop: '-8px',
            marginBottom: '22px'
          }}
        >
          Update the name shown on your Bible Study Academy account.
        </p>

        <form onSubmit={saveProfile}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '16px'
            }}
          >
            <div>
              <label>First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(event) => {
                  setFirstName(event.target.value)
                  setProfileMessage('')
                }}
                required
                disabled={savingProfile}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label>Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(event) => {
                  setLastName(event.target.value)
                  setProfileMessage('')
                }}
                required
                disabled={savingProfile}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label>Email</label>
              <input
                type="email"
                value={email}
                disabled
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label>Assigned Class</label>
              <input
                type="text"
                value={className}
                disabled
                style={{ width: '100%' }}
              />
            </div>
          </div>

          {profileMessage && (
            <div
              style={{
                marginTop: '18px',
                padding: '12px 14px',
                borderRadius: '12px',
                background: profileMessage.includes(
                  'successfully'
                )
                  ? '#ecfdf3'
                  : '#fef3f2',
                color: profileMessage.includes(
                  'successfully'
                )
                  ? '#087257'
                  : '#b42318',
                fontWeight: '600'
              }}
            >
              {profileMessage}
            </div>
          )}

          <button
            className="primary-button small-button"
            type="submit"
            disabled={savingProfile}
            style={{
              width: 'auto',
              marginTop: '22px'
            }}
          >
            {savingProfile
              ? 'Saving...'
              : 'Save Profile'}
          </button>
        </form>
      </section>

      <section
        className="dashboard-card"
        style={{ maxWidth: '760px' }}
      >
        <h2>Change Password</h2>

        <p
          style={{
            color: '#6b7280',
            marginTop: '-8px',
            marginBottom: '22px'
          }}
        >
          Choose a new password for your account.
        </p>

        <form onSubmit={changePassword}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '16px'
            }}
          >
            <div>
              <label>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(event) => {
                  setNewPassword(event.target.value)
                  setPasswordMessage('')
                }}
                minLength="6"
                required
                disabled={savingPassword}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label>Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => {
                  setConfirmPassword(event.target.value)
                  setPasswordMessage('')
                }}
                minLength="6"
                required
                disabled={savingPassword}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          {passwordMessage && (
            <div
              style={{
                marginTop: '18px',
                padding: '12px 14px',
                borderRadius: '12px',
                background: passwordMessage.includes(
                  'successfully'
                )
                  ? '#ecfdf3'
                  : '#fef3f2',
                color: passwordMessage.includes(
                  'successfully'
                )
                  ? '#087257'
                  : '#b42318',
                fontWeight: '600'
              }}
            >
              {passwordMessage}
            </div>
          )}

          <button
            className="primary-button small-button"
            type="submit"
            disabled={savingPassword}
            style={{
              width: 'auto',
              marginTop: '22px'
            }}
          >
            {savingPassword
              ? 'Changing...'
              : 'Change Password'}
          </button>
        </form>
      </section>
    </>
  )
}


function ServantQuickEntry({ profile }) {
  const today = new Date().toISOString().slice(0, 10)

  const [classId, setClassId] = useState(null)
  const [className, setClassName] = useState('My Bible Study Class')
  const [students, setStudents] = useState([])
  const [date, setDate] = useState(today)
  const [entries, setEntries] = useState({})
  const [loading, setLoading] = useState(true)
  const [loadingRecords, setLoadingRecords] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadAssignedClass()
  }, [])

  useEffect(() => {
    if (classId && students.length && date) {
      loadExistingRecords()
    }
  }, [classId, students.length, date])

  function blankEntry() {
    return {
      present: false,
      homework: false,
      memoryVerse: false,
      physicalBible: false,
      participation: 0,
      bonusPoints: 0,
      bonusReason: ''
    }
  }

  async function loadAssignedClass() {
    setLoading(true)
    setMessage('')

    const { data: assignment, error: assignmentError } =
      await supabase
        .from('servant_classes')
        .select('class_id')
        .eq('servant_id', profile.id)
        .limit(1)
        .maybeSingle()

    if (assignmentError) {
      console.error('Quick Entry assignment error:', assignmentError)
      setMessage(assignmentError.message)
      setLoading(false)
      return
    }

    if (!assignment) {
      setMessage('You are not assigned to a class yet.')
      setLoading(false)
      return
    }

    setClassId(assignment.class_id)

    const [classResult, membershipResult] = await Promise.all([
      supabase
        .from('classes')
        .select('id, name')
        .eq('id', assignment.class_id)
        .single(),

      supabase
        .from('class_members')
        .select('student_id')
        .eq('class_id', assignment.class_id)
    ])

    if (classResult.data) {
      setClassName(classResult.data.name)
    }

    if (membershipResult.error) {
      console.error(
        'Quick Entry memberships error:',
        membershipResult.error
      )
      setMessage(membershipResult.error.message)
      setLoading(false)
      return
    }

    const studentIds =
      membershipResult.data?.map((item) => item.student_id) || []

    if (!studentIds.length) {
      setStudents([])
      setEntries({})
      setLoading(false)
      return
    }

    const { data: studentProfiles, error: studentsError } =
      await supabase
        .from('profiles')
        .select('id, first_name, last_name, grade')
        .in('id', studentIds)
        .eq('active', true)
        .order('first_name')

    if (studentsError) {
      console.error('Quick Entry students error:', studentsError)
      setMessage(studentsError.message)
      setLoading(false)
      return
    }

    const roster = studentProfiles || []
    setStudents(roster)

    const initialEntries = {}
    roster.forEach((student) => {
      initialEntries[student.id] = blankEntry()
    })
    setEntries(initialEntries)

    setLoading(false)
  }

  async function loadExistingRecords() {
    setLoadingRecords(true)
    setMessage('')

    const studentIds = students.map((student) => student.id)

    if (!studentIds.length) {
      setLoadingRecords(false)
      return
    }

    const [
      attendanceResult,
      homeworkResult,
      verseResult,
      bibleResult,
      participationResult,
      bonusResult
    ] = await Promise.all([
      supabase
        .from('attendance')
        .select('student_id, present')
        .eq('class_id', classId)
        .eq('bible_study_date', date)
        .in('student_id', studentIds),

      supabase
        .from('homework')
        .select('student_id, completed')
        .eq('class_id', classId)
        .eq('bible_study_date', date)
        .in('student_id', studentIds),

      supabase
        .from('memory_verses')
        .select('student_id, completed')
        .eq('class_id', classId)
        .eq('bible_study_date', date)
        .in('student_id', studentIds),

      supabase
        .from('physical_bible')
        .select('student_id, brought_bible')
        .eq('class_id', classId)
        .eq('bible_study_date', date)
        .in('student_id', studentIds),

      supabase
        .from('participation')
        .select('student_id, points')
        .eq('class_id', classId)
        .eq('bible_study_date', date)
        .in('student_id', studentIds),

      supabase
        .from('bonus_points')
        .select('student_id, points, reason')
        .eq('class_id', classId)
        .eq('bible_study_date', date)
        .in('student_id', studentIds)
    ])

    const results = [
      attendanceResult,
      homeworkResult,
      verseResult,
      bibleResult,
      participationResult,
      bonusResult
    ]

    const firstError = results.find((result) => result.error)?.error
    if (firstError) {
      console.error('Quick Entry load records error:', firstError)
      setMessage(firstError.message)
      setLoadingRecords(false)
      return
    }

    const next = {}
    students.forEach((student) => {
      next[student.id] = blankEntry()
    })

    attendanceResult.data?.forEach((record) => {
      if (next[record.student_id]) {
        next[record.student_id].present = record.present === true
      }
    })

    homeworkResult.data?.forEach((record) => {
      if (next[record.student_id]) {
        next[record.student_id].homework =
          record.completed === true
      }
    })

    verseResult.data?.forEach((record) => {
      if (next[record.student_id]) {
        next[record.student_id].memoryVerse =
          record.completed === true
      }
    })

    bibleResult.data?.forEach((record) => {
      if (next[record.student_id]) {
        next[record.student_id].physicalBible =
          record.brought_bible === true
      }
    })

    participationResult.data?.forEach((record) => {
      if (next[record.student_id]) {
        next[record.student_id].participation =
          Number(record.points) || 0
      }
    })

    bonusResult.data?.forEach((record) => {
      if (next[record.student_id]) {
        next[record.student_id].bonusPoints =
          Number(record.points) || 0
        next[record.student_id].bonusReason =
          record.reason || ''
      }
    })

    setEntries(next)
    setLoadingRecords(false)
  }

  function updateEntry(studentId, field, value) {
    setEntries((current) => ({
      ...current,
      [studentId]: {
        ...(current[studentId] || blankEntry()),
        [field]: value
      }
    }))
    setMessage('')
  }

  function markEveryone(field, value) {
    setEntries((current) => {
      const next = { ...current }

      students.forEach((student) => {
        next[student.id] = {
          ...(next[student.id] || blankEntry()),
          [field]: value
        }
      })

      return next
    })
    setMessage('')
  }

  async function replaceRecord(table, studentId, payload) {
    const { error: deleteError } = await supabase
      .from(table)
      .delete()
      .eq('student_id', studentId)
      .eq('class_id', classId)
      .eq('bible_study_date', date)

    if (deleteError) throw deleteError

    const { error: insertError } = await supabase
      .from(table)
      .insert({
        student_id: studentId,
        class_id: classId,
        bible_study_date: date,
        recorded_by: profile.id,
        ...payload
      })

    if (insertError) throw insertError
  }

  async function saveAll() {
    if (!classId || !students.length) return

    setSaving(true)
    setMessage('')

    try {
      for (const student of students) {
        const entry = entries[student.id] || blankEntry()

        await replaceRecord('attendance', student.id, {
          present: entry.present
        })

        await replaceRecord('homework', student.id, {
          completed: entry.homework
        })

        await replaceRecord('memory_verses', student.id, {
          completed: entry.memoryVerse
        })

        await replaceRecord('physical_bible', student.id, {
          brought_bible: entry.physicalBible
        })

        await replaceRecord('participation', student.id, {
          points: Number(entry.participation) || 0
        })

        // Keep at most one Quick Entry bonus record per student/date.
        const { error: bonusDeleteError } = await supabase
          .from('bonus_points')
          .delete()
          .eq('student_id', student.id)
          .eq('class_id', classId)
          .eq('bible_study_date', date)

        if (bonusDeleteError) throw bonusDeleteError

        const bonusPoints = Number(entry.bonusPoints) || 0
        const bonusReason = entry.bonusReason.trim()

        if (bonusPoints !== 0 || bonusReason) {
          const { error: bonusInsertError } = await supabase
            .from('bonus_points')
            .insert({
              student_id: student.id,
              class_id: classId,
              bible_study_date: date,
              points: bonusPoints,
              reason: bonusReason || 'Bonus',
              recorded_by: profile.id
            })

          if (bonusInsertError) throw bonusInsertError
        }
      }

      setMessage('Quick Entry saved successfully.')
      await loadExistingRecords()
    } catch (error) {
      console.error('Quick Entry save error:', error)
      setMessage(
        error?.message ||
          'Could not save Quick Entry. Please try again.'
      )
    }

    setSaving(false)
  }

  const checkboxStyle = {
    width: '20px',
    height: '20px',
    cursor: 'pointer'
  }

  const numberInputStyle = {
    width: '76px',
    padding: '8px 9px',
    borderRadius: '9px',
    border: '1px solid #dfe2ea'
  }

  return (
    <>
      <DashboardHeader
        title="Quick Entry"
        subtitle={`${className} • Record Friday progress in one place`}
      />

      <section
        className="dashboard-card"
        style={{ marginTop: '24px' }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '16px',
            alignItems: 'end',
            flexWrap: 'wrap'
          }}
        >
          <div>
            <label>Bible Study Date</label>
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              disabled={saving}
              style={{ minWidth: '190px' }}
            />
          </div>

          <div
            style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap'
            }}
          >
            <button
              type="button"
              onClick={() => markEveryone('present', true)}
              disabled={saving || !students.length}
              style={{
                border: '1px solid #dfe2ea',
                background: 'white',
                padding: '9px 12px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: '700'
              }}
            >
              Everyone Present
            </button>

            <button
              type="button"
              onClick={() => markEveryone('homework', true)}
              disabled={saving || !students.length}
              style={{
                border: '1px solid #dfe2ea',
                background: 'white',
                padding: '9px 12px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: '700'
              }}
            >
              All Homework
            </button>
          </div>
        </div>

        {message && (
          <div
            style={{
              marginTop: '16px',
              padding: '12px 14px',
              borderRadius: '12px',
              background: message.includes('successfully')
                ? '#ecfdf3'
                : '#fef3f2',
              color: message.includes('successfully')
                ? '#087257'
                : '#b42318',
              fontWeight: '600'
            }}
          >
            {message}
          </div>
        )}
      </section>

      <section className="dashboard-card">
        <h2>Friday Entry</h2>

        {loading || loadingRecords ? (
          <p>Loading class records...</p>
        ) : !students.length ? (
          <p>No students are assigned to this class yet.</p>
        ) : (
          <>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Present</th>
                    <th>Homework</th>
                    <th>Memory Verse</th>
                    <th>Physical Bible</th>
                    <th>Participation</th>
                    <th>Bonus</th>
                    <th>Bonus Reason</th>
                  </tr>
                </thead>

                <tbody>
                  {students.map((student) => {
                    const entry =
                      entries[student.id] || blankEntry()

                    return (
                      <tr key={student.id}>
                        <td>
                          <strong>
                            {student.first_name}{' '}
                            {student.last_name}
                          </strong>
                          <div
                            style={{
                              color: '#8a8f9c',
                              fontSize: '12px',
                              marginTop: '3px'
                            }}
                          >
                            {student.grade || '—'}
                          </div>
                        </td>

                        <td>
                          <input
                            type="checkbox"
                            checked={entry.present}
                            onChange={(event) =>
                              updateEntry(
                                student.id,
                                'present',
                                event.target.checked
                              )
                            }
                            disabled={saving}
                            style={checkboxStyle}
                          />
                        </td>

                        <td>
                          <input
                            type="checkbox"
                            checked={entry.homework}
                            onChange={(event) =>
                              updateEntry(
                                student.id,
                                'homework',
                                event.target.checked
                              )
                            }
                            disabled={saving}
                            style={checkboxStyle}
                          />
                        </td>

                        <td>
                          <input
                            type="checkbox"
                            checked={entry.memoryVerse}
                            onChange={(event) =>
                              updateEntry(
                                student.id,
                                'memoryVerse',
                                event.target.checked
                              )
                            }
                            disabled={saving}
                            style={checkboxStyle}
                          />
                        </td>

                        <td>
                          <input
                            type="checkbox"
                            checked={entry.physicalBible}
                            onChange={(event) =>
                              updateEntry(
                                student.id,
                                'physicalBible',
                                event.target.checked
                              )
                            }
                            disabled={saving}
                            style={checkboxStyle}
                          />
                        </td>

                        <td>
                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={entry.participation}
                            onChange={(event) =>
                              updateEntry(
                                student.id,
                                'participation',
                                event.target.value
                              )
                            }
                            disabled={saving}
                            style={numberInputStyle}
                          />
                        </td>

                        <td>
                          <input
                            type="number"
                            step="1"
                            value={entry.bonusPoints}
                            onChange={(event) =>
                              updateEntry(
                                student.id,
                                'bonusPoints',
                                event.target.value
                              )
                            }
                            disabled={saving}
                            style={numberInputStyle}
                          />
                        </td>

                        <td>
                          <input
                            type="text"
                            value={entry.bonusReason}
                            onChange={(event) =>
                              updateEntry(
                                student.id,
                                'bonusReason',
                                event.target.value
                              )
                            }
                            placeholder="Optional"
                            disabled={saving}
                            style={{
                              minWidth: '160px',
                              padding: '8px 9px'
                            }}
                          />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginTop: '20px'
              }}
            >
              <button
                className="primary-button small-button"
                type="button"
                onClick={saveAll}
                disabled={saving || loadingRecords}
                style={{ width: 'auto' }}
              >
                {saving ? 'Saving...' : 'Save All'}
              </button>
            </div>
          </>
        )}
      </section>
    </>
  )
}


function AdminDashboard() {
  const [classes, setClasses] = useState([])
  const [students, setStudents] = useState([])
  const [servants, setServants] = useState([])
  const [attendance, setAttendance] = useState([])
  const [reading, setReading] = useState([])
  const [homework, setHomework] = useState([])
  const [verses, setVerses] = useState([])
  const [bibles, setBibles] = useState([])
  const [participation, setParticipation] = useState([])
  const [bonus, setBonus] = useState([])
  const [rules, setRules] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadAdminDashboard()
  }, [])

  async function loadAdminDashboard() {
    setLoading(true)
    setMessage('')

    const [
      classesResult,
      studentsResult,
      servantsResult,
      attendanceResult,
      readingResult,
      homeworkResult,
      versesResult,
      biblesResult,
      participationResult,
      bonusResult,
      rulesResult
    ] = await Promise.all([
      supabase
        .from('classes')
        .select('id, name, grade_group, active')
        .eq('active', true)
        .order('id'),

      supabase
        .from('profiles')
        .select('id, first_name, last_name, grade, active')
        .eq('role', 'student')
        .eq('active', true),

      supabase
        .from('profiles')
        .select('id, first_name, last_name, active')
        .eq('role', 'servant')
        .eq('active', true),

      supabase
        .from('attendance')
        .select('student_id, class_id, bible_study_date, present'),

      supabase
        .from('daily_reading')
        .select('student_id, reading_date, completed'),

      supabase
        .from('homework')
        .select('student_id, class_id, bible_study_date, completed'),

      supabase
        .from('memory_verses')
        .select('student_id, class_id, bible_study_date, completed'),

      supabase
        .from('physical_bible')
        .select('student_id, class_id, bible_study_date, brought_bible'),

      supabase
        .from('participation')
        .select('student_id, class_id, bible_study_date, points'),

      supabase
        .from('bonus_points')
        .select('student_id, class_id, bible_study_date, points'),

      supabase
        .from('point_rules')
        .select('category, points')
    ])

    const results = [
      classesResult,
      studentsResult,
      servantsResult,
      attendanceResult,
      readingResult,
      homeworkResult,
      versesResult,
      biblesResult,
      participationResult,
      bonusResult,
      rulesResult
    ]

    const firstError = results.find((result) => result.error)?.error

    if (firstError) {
      setMessage(firstError.message)
      setLoading(false)
      return
    }

    setClasses(classesResult.data || [])
    setStudents(studentsResult.data || [])
    setServants(servantsResult.data || [])
    setAttendance(attendanceResult.data || [])
    setReading(readingResult.data || [])
    setHomework(homeworkResult.data || [])
    setVerses(versesResult.data || [])
    setBibles(biblesResult.data || [])
    setParticipation(participationResult.data || [])
    setBonus(bonusResult.data || [])
    setRules(rulesResult.data || [])

    setLoading(false)
  }

  function countTrue(records, field) {
    return records.filter((record) => record[field] === true).length
  }

  function percent(done, total) {
    return total ? Math.round((done / total) * 100) : 0
  }

  const pointRules = {}
  rules.forEach((rule) => {
    pointRules[rule.category] = Number(rule.points) || 0
  })

  const attendanceDone = countTrue(attendance, 'present')
  const readingDone = countTrue(reading, 'completed')
  const homeworkDone = countTrue(homework, 'completed')
  const verseDone = countTrue(verses, 'completed')
  const bibleDone = countTrue(bibles, 'brought_bible')

  const attendancePercent = percent(
    attendanceDone,
    attendance.length
  )

  const readingPercent = percent(readingDone, reading.length)

  const homeworkPercent = percent(homeworkDone, homework.length)

  const versePercent = percent(verseDone, verses.length)

  const biblePercent = percent(bibleDone, bibles.length)

  const participationPoints = participation.reduce(
    (sum, item) => sum + (Number(item.points) || 0),
    0
  )

  const bonusPoints = bonus.reduce(
    (sum, item) => sum + (Number(item.points) || 0),
    0
  )

  const totalPoints =
    attendanceDone * (pointRules.attendance || 0) +
    readingDone * (pointRules.daily_reading || 0) +
    homeworkDone * (pointRules.homework || 0) +
    verseDone * (pointRules.memory_verse || 0) +
    bibleDone * (pointRules.physical_bible || 0) +
    participationPoints +
    bonusPoints

  const overallProgress = Math.round(
    (
      attendancePercent +
      readingPercent +
      homeworkPercent +
      versePercent +
      biblePercent
    ) / 5
  )

  const classRows = classes.map((classItem) => {
    const classAttendance = attendance.filter(
      (record) => Number(record.class_id) === Number(classItem.id)
    )

    const classHomework = homework.filter(
      (record) => Number(record.class_id) === Number(classItem.id)
    )

    const classVerses = verses.filter(
      (record) => Number(record.class_id) === Number(classItem.id)
    )

    const classBibles = bibles.filter(
      (record) => Number(record.class_id) === Number(classItem.id)
    )

    const classParticipation = participation.filter(
      (record) => Number(record.class_id) === Number(classItem.id)
    )

    const classBonus = bonus.filter(
      (record) => Number(record.class_id) === Number(classItem.id)
    )

    const attendanceCount = countTrue(classAttendance, 'present')
    const homeworkCount = countTrue(classHomework, 'completed')
    const verseCount = countTrue(classVerses, 'completed')
    const bibleCount = countTrue(classBibles, 'brought_bible')

    const points =
      attendanceCount * (pointRules.attendance || 0) +
      homeworkCount * (pointRules.homework || 0) +
      verseCount * (pointRules.memory_verse || 0) +
      bibleCount * (pointRules.physical_bible || 0) +
      classParticipation.reduce(
        (sum, row) => sum + (Number(row.points) || 0),
        0
      ) +
      classBonus.reduce(
        (sum, row) => sum + (Number(row.points) || 0),
        0
      )

    return {
      ...classItem,
      attendance: percent(
        attendanceCount,
        classAttendance.length
      ),
      homework: percent(
        homeworkCount,
        classHomework.length
      ),
      verse: percent(
        verseCount,
        classVerses.length
      ),
      bible: percent(
        bibleCount,
        classBibles.length
      ),
      points
    }
  })

  const latestAttendanceDate =
    attendance
      .map((record) => record.bible_study_date)
      .filter(Boolean)
      .sort()
      .at(-1) || null

  const latestAttendanceRows = latestAttendanceDate
    ? attendance.filter(
        (record) =>
          record.bible_study_date === latestAttendanceDate
      )
    : []

  const latestPresent = countTrue(
    latestAttendanceRows,
    'present'
  )

  return (
    <>
      <DashboardHeader
        title="Admin Dashboard"
        subtitle="Bible Study Academy overview"
      />

      {message && (
        <section className="dashboard-card">
          <p>{message}</p>
        </section>
      )}

      {loading ? (
        <section className="dashboard-card">
          <p>Loading academy dashboard...</p>
        </section>
      ) : (
        <>
          <div className="stats-grid">
            <StatCard
              icon={<BookOpen />}
              label="Classes"
              value={classes.length}
              helper="Active classes"
            />

            <StatCard
              icon={<Users />}
              label="Students"
              value={students.length}
              helper="Active students"
            />

            <StatCard
              icon={<UserRound />}
              label="Servants"
              value={servants.length}
              helper="Active servants"
            />

            <StatCard
              icon={<Trophy />}
              label="Points Awarded"
              value={totalPoints}
              helper="Academy total"
            />
          </div>

          <section className="dashboard-card">
            <h2>Academy Progress</h2>

            <div className="progress-grid">
              <ProgressCircle
                label="Attendance"
                value={attendancePercent}
                emoji="⛪"
              />
              <ProgressCircle
                label="Daily Reading"
                value={readingPercent}
                emoji="📖"
              />
              <ProgressCircle
                label="Homework"
                value={homeworkPercent}
                emoji="✏️"
              />
              <ProgressCircle
                label="Memory Verse"
                value={versePercent}
                emoji="🧠"
              />
              <ProgressCircle
                label="Physical Bible"
                value={biblePercent}
                emoji="📕"
              />
            </div>
          </section>

          <section className="dashboard-card">
            <h2>Latest Friday Snapshot</h2>

            <div className="stats-grid">
              <StatCard
                icon={<CalendarDays />}
                label="Latest Date"
                value={latestAttendanceDate || '—'}
                helper="Most recent attendance"
              />

              <StatCard
                icon={<CheckCircle2 />}
                label="Present"
                value={
                  latestAttendanceDate
                    ? `${latestPresent}/${latestAttendanceRows.length}`
                    : '—'
                }
                helper="Across all classes"
              />

              <StatCard
                icon={<BarChart3 />}
                label="Attendance"
                value={
                  latestAttendanceRows.length
                    ? `${percent(
                        latestPresent,
                        latestAttendanceRows.length
                      )}%`
                    : '—'
                }
                helper="Latest Friday"
              />

              <StatCard
                icon={<Star />}
                label="Overall Progress"
                value={`${overallProgress}%`}
                helper="Across core categories"
              />
            </div>
          </section>

          <section className="dashboard-card">
            <h2>Classes Overview</h2>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Class</th>
                    <th>Grade Group</th>
                    <th>Attendance</th>
                    <th>Homework</th>
                    <th>Memory Verse</th>
                    <th>Physical Bible</th>
                    <th>Points</th>
                  </tr>
                </thead>

                <tbody>
                  {classRows.map((classItem) => (
                    <tr key={classItem.id}>
                      <td>
                        <strong>{classItem.name}</strong>
                      </td>
                      <td>{classItem.grade_group || '—'}</td>
                      <td>{classItem.attendance}%</td>
                      <td>{classItem.homework}%</td>
                      <td>{classItem.verse}%</td>
                      <td>{classItem.bible}%</td>
                      <td>
                        <strong>{classItem.points}</strong>
                      </td>
                    </tr>
                  ))}

                  {!classRows.length && (
                    <tr>
                      <td colSpan="7">
                        No active classes yet.
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


function AdminClasses() {
  const [classes, setClasses] = useState([])
  const [classCounts, setClassCounts] = useState({})
  const [selectedClass, setSelectedClass] = useState(null)
  const [students, setStudents] = useState([])
  const [servants, setServants] = useState([])
  const [classStats, setClassStats] = useState({
    attendance: 0,
    reading: 0,
    homework: 0,
    verse: 0,
    bible: 0,
    points: 0
  })
  const [loading, setLoading] = useState(true)
  const [detailLoading, setDetailLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadClasses()
  }, [])

  async function loadClasses() {
    setLoading(true)
    setMessage('')

    const [classesResult, membersResult, servantsResult] =
      await Promise.all([
        supabase
          .from('classes')
          .select('*')
          .eq('active', true)
          .order('id'),

        supabase
          .from('class_members')
          .select('class_id, student_id'),

        supabase
          .from('servant_classes')
          .select('class_id, servant_id')
      ])

    const firstError =
      classesResult.error ||
      membersResult.error ||
      servantsResult.error

    if (firstError) {
      setMessage(firstError.message)
      setLoading(false)
      return
    }

    const rows = classesResult.data || []
    setClasses(rows)

    const counts = {}

    rows.forEach((classItem) => {
      counts[classItem.id] = {
        students: (membersResult.data || []).filter(
          (row) => Number(row.class_id) === Number(classItem.id)
        ).length,
        servants: (servantsResult.data || []).filter(
          (row) => Number(row.class_id) === Number(classItem.id)
        ).length
      }
    })

    setClassCounts(counts)
    setLoading(false)
  }

  function countTrue(records, field) {
    return records.filter((record) => record[field] === true).length
  }

  function percent(done, total) {
    return total ? Math.round((done / total) * 100) : 0
  }

  async function openClass(classItem) {
    setSelectedClass(classItem)
    setDetailLoading(true)
    setMessage('')
    setStudents([])
    setServants([])
    setClassStats({
      attendance: 0,
      reading: 0,
      homework: 0,
      verse: 0,
      bible: 0,
      points: 0
    })

    const [
      studentMembershipsResult,
      servantMembershipsResult,
      rulesResult
    ] = await Promise.all([
      supabase
        .from('class_members')
        .select('student_id')
        .eq('class_id', classItem.id),

      supabase
        .from('servant_classes')
        .select('servant_id')
        .eq('class_id', classItem.id),

      supabase
        .from('point_rules')
        .select('category, points')
    ])

    const firstError =
      studentMembershipsResult.error ||
      servantMembershipsResult.error ||
      rulesResult.error

    if (firstError) {
      setMessage(firstError.message)
      setDetailLoading(false)
      return
    }

    const studentIds =
      studentMembershipsResult.data?.map(
        (record) => record.student_id
      ) || []

    const servantIds =
      servantMembershipsResult.data?.map(
        (record) => record.servant_id
      ) || []

    let studentProfiles = []
    let servantProfiles = []

    if (studentIds.length) {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, grade, active')
        .in('id', studentIds)
        .order('first_name')

      if (error) {
        setMessage(error.message)
        setDetailLoading(false)
        return
      }

      studentProfiles = data || []
    }

    if (servantIds.length) {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, active')
        .in('id', servantIds)
        .order('first_name')

      if (error) {
        setMessage(error.message)
        setDetailLoading(false)
        return
      }

      servantProfiles = data || []
    }

    setStudents(studentProfiles)
    setServants(servantProfiles)

    if (!studentIds.length) {
      setDetailLoading(false)
      return
    }

    const [
      attendanceResult,
      readingResult,
      homeworkResult,
      versesResult,
      biblesResult,
      participationResult,
      bonusResult
    ] = await Promise.all([
      supabase
        .from('attendance')
        .select('student_id, present')
        .eq('class_id', classItem.id)
        .in('student_id', studentIds),

      supabase
        .from('daily_reading')
        .select('student_id, completed')
        .in('student_id', studentIds),

      supabase
        .from('homework')
        .select('student_id, completed')
        .eq('class_id', classItem.id)
        .in('student_id', studentIds),

      supabase
        .from('memory_verses')
        .select('student_id, completed')
        .eq('class_id', classItem.id)
        .in('student_id', studentIds),

      supabase
        .from('physical_bible')
        .select('student_id, brought_bible')
        .eq('class_id', classItem.id)
        .in('student_id', studentIds),

      supabase
        .from('participation')
        .select('student_id, points')
        .eq('class_id', classItem.id)
        .in('student_id', studentIds),

      supabase
        .from('bonus_points')
        .select('student_id, points')
        .eq('class_id', classItem.id)
        .in('student_id', studentIds)
    ])

    const results = [
      attendanceResult,
      readingResult,
      homeworkResult,
      versesResult,
      biblesResult,
      participationResult,
      bonusResult
    ]

    const statsError =
      results.find((result) => result.error)?.error

    if (statsError) {
      setMessage(statsError.message)
      setDetailLoading(false)
      return
    }

    const attendance = attendanceResult.data || []
    const reading = readingResult.data || []
    const homework = homeworkResult.data || []
    const verses = versesResult.data || []
    const bibles = biblesResult.data || []
    const participation = participationResult.data || []
    const bonus = bonusResult.data || []

    const attendanceDone = countTrue(attendance, 'present')
    const readingDone = countTrue(reading, 'completed')
    const homeworkDone = countTrue(homework, 'completed')
    const verseDone = countTrue(verses, 'completed')
    const bibleDone = countTrue(bibles, 'brought_bible')

    const rules = {}
    ;(rulesResult.data || []).forEach((rule) => {
      rules[rule.category] = Number(rule.points) || 0
    })

    const participationPoints = participation.reduce(
      (sum, row) => sum + (Number(row.points) || 0),
      0
    )

    const bonusPoints = bonus.reduce(
      (sum, row) => sum + (Number(row.points) || 0),
      0
    )

    const points =
      attendanceDone * (rules.attendance || 0) +
      readingDone * (rules.daily_reading || 0) +
      homeworkDone * (rules.homework || 0) +
      verseDone * (rules.memory_verse || 0) +
      bibleDone * (rules.physical_bible || 0) +
      participationPoints +
      bonusPoints

    setClassStats({
      attendance: percent(attendanceDone, attendance.length),
      reading: percent(readingDone, reading.length),
      homework: percent(homeworkDone, homework.length),
      verse: percent(verseDone, verses.length),
      bible: percent(bibleDone, bibles.length),
      points
    })

    setDetailLoading(false)
  }

  if (selectedClass) {
    return (
      <>
        <button
          type="button"
          onClick={() => {
            setSelectedClass(null)
            setStudents([])
            setServants([])
            setMessage('')
          }}
          style={{
            border: 'none',
            background: 'transparent',
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            padding: 0,
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

        {message && (
          <section className="dashboard-card">
            <p>{message}</p>
          </section>
        )}

        {detailLoading ? (
          <section className="dashboard-card">
            <p>Loading class...</p>
          </section>
        ) : (
          <>
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
                value={`${classStats.attendance}%`}
                helper="Class average"
              />

              <StatCard
                icon={<Trophy />}
                label="Class Points"
                value={classStats.points}
                helper="Total earned"
              />
            </div>

            <section className="dashboard-card">
              <h2>Class Progress</h2>

              <div className="progress-grid">
                <ProgressCircle
                  label="Attendance"
                  value={classStats.attendance}
                  emoji="⛪"
                />

                <ProgressCircle
                  label="Daily Reading"
                  value={classStats.reading}
                  emoji="📖"
                />

                <ProgressCircle
                  label="Homework"
                  value={classStats.homework}
                  emoji="✏️"
                />

                <ProgressCircle
                  label="Memory Verse"
                  value={classStats.verse}
                  emoji="🧠"
                />

                <ProgressCircle
                  label="Physical Bible"
                  value={classStats.bible}
                  emoji="📕"
                />
              </div>
            </section>

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

                        <td>{student.grade || '—'}</td>

                        <td>
                          {student.active
                            ? '✓ Active'
                            : 'Inactive'}
                        </td>
                      </tr>
                    ))}

                    {!students.length && (
                      <tr>
                        <td colSpan="3">
                          No students are assigned to this class yet.
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
                            ? '✓ Active'
                            : 'Inactive'}
                        </td>
                      </tr>
                    ))}

                    {!servants.length && (
                      <tr>
                        <td colSpan="2">
                          No servants are assigned to this class yet.
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
        subtitle="View Bible Study groups, rosters, and class progress"
      />

      {message && (
        <section className="dashboard-card">
          <p>{message}</p>
        </section>
      )}

      {loading ? (
        <section className="dashboard-card">
          <p>Loading classes...</p>
        </section>
      ) : (
        <>
          <div className="stats-grid">
            <StatCard
              icon={<BookOpen />}
              label="Active Classes"
              value={classes.length}
              helper="Bible Study groups"
            />

            <StatCard
              icon={<Users />}
              label="Students"
              value={Object.values(classCounts).reduce(
                (sum, row) => sum + (row.students || 0),
                0
              )}
              helper="Assigned across classes"
            />

            <StatCard
              icon={<UserRound />}
              label="Servants"
              value={Object.values(classCounts).reduce(
                (sum, row) => sum + (row.servants || 0),
                0
              )}
              helper="Class assignments"
            />
          </div>

          <section className="dashboard-card">
            <h2>Class Directory</h2>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '16px',
                marginTop: '20px'
              }}
            >
              {classes.map((classItem) => {
                const counts = classCounts[classItem.id] || {
                  students: 0,
                  servants: 0
                }

                return (
                  <button
                    key={classItem.id}
                    type="button"
                    onClick={() => openClass(classItem)}
                    style={{
                      border: '1px solid #e7e7ef',
                      background: 'white',
                      borderRadius: '16px',
                      padding: '18px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      font: 'inherit'
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: '12px',
                        alignItems: 'center'
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          gap: '12px',
                          alignItems: 'center'
                        }}
                      >
                        <div
                          style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '13px',
                            background: '#efe8ff',
                            color: '#6b35c0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <BookOpen size={22} />
                        </div>

                        <div>
                          <strong
                            style={{
                              display: 'block',
                              fontSize: '16px'
                            }}
                          >
                            {classItem.name}
                          </strong>

                          <span
                            style={{
                              display: 'block',
                              color: '#6b7280',
                              fontSize: '13px',
                              marginTop: '3px'
                            }}
                          >
                            {classItem.grade_group || 'Grade group not set'}
                          </span>
                        </div>
                      </div>

                      <ChevronRight
                        size={19}
                        color="#6b35c0"
                      />
                    </div>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '10px',
                        marginTop: '17px'
                      }}
                    >
                      <div
                        style={{
                          background: '#fafafa',
                          borderRadius: '10px',
                          padding: '10px'
                        }}
                      >
                        <div
                          style={{
                            color: '#8a8f9c',
                            fontSize: '11px'
                          }}
                        >
                          STUDENTS
                        </div>
                        <strong>{counts.students}</strong>
                      </div>

                      <div
                        style={{
                          background: '#fafafa',
                          borderRadius: '10px',
                          padding: '10px'
                        }}
                      >
                        <div
                          style={{
                            color: '#8a8f9c',
                            fontSize: '11px'
                          }}
                        >
                          SERVANTS
                        </div>
                        <strong>{counts.servants}</strong>
                      </div>
                    </div>
                  </button>
                )
              })}

              {!classes.length && (
                <div
                  style={{
                    border: '1px solid #ececf2',
                    borderRadius: '14px',
                    padding: '20px',
                    color: '#6b7280'
                  }}
                >
                  No active classes yet.
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </>
  )
}


function AdminStudents() {
  const [students, setStudents] = useState([])
  const [classes, setClasses] = useState([])
  const [memberships, setMemberships] = useState([])
  const [search, setSearch] = useState('')
  const [classFilter, setClassFilter] = useState('all')
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadStudentsPage()
  }, [])

  async function loadStudentsPage() {
    setLoading(true)
    setMessage('')

    const [
      studentsResult,
      classesResult,
      membershipsResult
    ] = await Promise.all([
      supabase
        .from('profiles')
        .select('id, first_name, last_name, grade, active')
        .eq('role', 'student')
        .order('first_name'),

      supabase
        .from('classes')
        .select('*')
        .eq('active', true)
        .order('id'),

      supabase
        .from('class_members')
        .select('student_id, class_id')
    ])

    if (studentsResult.error) {
      console.error(
        'Students error:',
        studentsResult.error
      )
    }

    if (classesResult.error) {
      console.error(
        'Classes error:',
        classesResult.error
      )
    }

    if (membershipsResult.error) {
      console.error(
        'Memberships error:',
        membershipsResult.error
      )
    }

    setStudents(studentsResult.data || [])
    setClasses(classesResult.data || [])
    setMemberships(membershipsResult.data || [])
    setLoading(false)
  }

  function getStudentClass(studentId) {
    const membership = memberships.find(
      (item) => item.student_id === studentId
    )

    if (!membership) return null

    return (
      classes.find(
        (classItem) =>
          classItem.id === membership.class_id
      ) || null
    )
  }

  async function moveStudent(
    studentId,
    newClassId
  ) {
    setSaving(true)
    setMessage('')

    const { error: deleteError } = await supabase
      .from('class_members')
      .delete()
      .eq('student_id', studentId)

    if (deleteError) {
      console.error(
        'Remove class error:',
        deleteError
      )

      setMessage(
        'I could not update the class assignment.'
      )

      setSaving(false)
      return
    }

    if (newClassId !== 'none') {
      const { error: insertError } = await supabase
        .from('class_members')
        .insert({
          student_id: studentId,
          class_id: Number(newClassId)
        })

      if (insertError) {
        console.error(
          'Assign class error:',
          insertError
        )

        setMessage(
          'The old class was removed, but the new class could not be assigned.'
        )

        setSaving(false)
        await loadStudentsPage()
        return
      }
    }

    setMessage('Class assignment updated.')
    await loadStudentsPage()

    if (selectedStudent?.id === studentId) {
      setSelectedStudent((current) => ({
        ...current
      }))
    }

    setSaving(false)
  }

  const visibleStudents = students.filter(
    (student) => {
      const fullName =
        `${student.first_name || ''} ${student.last_name || ''}`
          .toLowerCase()

      const matchesSearch =
        fullName.includes(search.toLowerCase()) ||
        (student.grade || '')
          .toLowerCase()
          .includes(search.toLowerCase())

      const studentClass =
        getStudentClass(student.id)

      const matchesClass =
        classFilter === 'all' ||
        String(studentClass?.id || '') ===
          classFilter

      return matchesSearch && matchesClass
    }
  )

  if (selectedStudent) {
    const studentClass =
      getStudentClass(selectedStudent.id)

    return (
      <>
        <button
          onClick={() => {
            setSelectedStudent(null)
            setMessage('')
          }}
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
          Back to Students
        </button>

        <DashboardHeader
          title={`${selectedStudent.first_name} ${selectedStudent.last_name}`}
          subtitle="Student profile"
        />

        <div className="stats-grid">
          <StatCard
            icon={<GraduationCap />}
            label="Class"
            value={
              studentClass?.name || 'Unassigned'
            }
            helper="Bible Study group"
          />

          <StatCard
            icon={<BookOpen />}
            label="Grade"
            value={selectedStudent.grade || '—'}
            helper="Student grade"
          />

          <StatCard
            icon={<CheckCircle2 />}
            label="Status"
            value={
              selectedStudent.active
                ? 'Active'
                : 'Inactive'
            }
            helper="Account status"
          />

          <StatCard
            icon={<Trophy />}
            label="Points"
            value="—"
            helper="Detailed points coming next"
          />
        </div>

        <section className="dashboard-card">
          <h2>Class Assignment</h2>

          <p
            style={{
              color: '#6b7280',
              marginTop: '-8px'
            }}
          >
            Move this student to a different Bible
            Study group.
          </p>

          <div
            style={{
              display: 'flex',
              gap: '12px',
              alignItems: 'center',
              flexWrap: 'wrap'
            }}
          >
            <select
              value={
                studentClass
                  ? String(studentClass.id)
                  : 'none'
              }
              disabled={saving}
              onChange={(event) =>
                moveStudent(
                  selectedStudent.id,
                  event.target.value
                )
              }
              style={{
                minWidth: '240px',
                padding: '12px 14px',
                borderRadius: '12px',
                border: '1px solid #dfe2ea',
                background: 'white'
              }}
            >
              <option value="none">
                Unassigned
              </option>

              {classes.map((classItem) => (
                <option
                  key={classItem.id}
                  value={classItem.id}
                >
                  {classItem.name}
                </option>
              ))}
            </select>

            {saving && (
              <span style={{ color: '#6b7280' }}>
                Saving...
              </span>
            )}
          </div>

          {message && (
            <p
              style={{
                marginTop: '14px',
                color: message.includes('updated')
                  ? '#087257'
                  : '#b42318',
                fontWeight: '600'
              }}
            >
              {message}
            </p>
          )}
        </section>

        <section className="dashboard-card">
          <h2>Progress Snapshot</h2>

          <div className="progress-grid">
            <ProgressCircle
              label="Daily Reading"
              value={0}
              emoji="📖"
            />

            <ProgressCircle
              label="Attendance"
              value={0}
              emoji="⛪"
            />

            <ProgressCircle
              label="Homework"
              value={0}
              emoji="✏️"
            />

            <ProgressCircle
              label="Memory Verse"
              value={0}
              emoji="🧠"
            />

            <ProgressCircle
              label="Physical Bible"
              value={0}
              emoji="📕"
            />

            <ProgressCircle
              label="Participation"
              value={0}
              emoji="⭐"
            />
          </div>

          <p
            style={{
              marginTop: '20px',
              marginBottom: 0,
              color: '#6b7280',
              fontSize: '13px'
            }}
          >
            We will connect these percentages to
            each student's real records when we
            build the progress and points pages.
          </p>
        </section>
      </>
    )
  }

  return (
    <>
      <DashboardHeader
        title="Students"
        subtitle="View and manage Bible Study students"
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'minmax(220px, 1fr) minmax(180px, 260px)',
          gap: '12px',
          marginTop: '24px',
          marginBottom: '18px'
        }}
      >
        <input
          type="search"
          placeholder="Search students..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          style={{
            width: '100%',
            padding: '12px 14px',
            borderRadius: '12px',
            border: '1px solid #dfe2ea',
            background: 'white',
            outline: 'none'
          }}
        />

        <select
          value={classFilter}
          onChange={(event) =>
            setClassFilter(event.target.value)
          }
          style={{
            width: '100%',
            padding: '12px 14px',
            borderRadius: '12px',
            border: '1px solid #dfe2ea',
            background: 'white'
          }}
        >
          <option value="all">
            All Classes
          </option>

          {classes.map((classItem) => (
            <option
              key={classItem.id}
              value={classItem.id}
            >
              {classItem.name}
            </option>
          ))}
        </select>
      </div>

      <section className="dashboard-card">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '16px'
          }}
        >
          <h2 style={{ margin: 0 }}>
            Student Directory
          </h2>

          <span
            style={{
              color: '#6b7280',
              fontSize: '13px'
            }}
          >
            {visibleStudents.length}{' '}
            {visibleStudents.length === 1
              ? 'student'
              : 'students'}
          </span>
        </div>

        {loading ? (
          <p>Loading students...</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Class</th>
                  <th>Grade</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {visibleStudents.map((student) => {
                  const studentClass =
                    getStudentClass(student.id)

                  return (
                    <tr key={student.id}>
                      <td>
                        <strong>
                          {student.first_name}{' '}
                          {student.last_name}
                        </strong>
                      </td>

                      <td>
                        {studentClass?.name ||
                          'Unassigned'}
                      </td>

                      <td>
                        {student.grade || '—'}
                      </td>

                      <td>
                        {student.active
                          ? 'Active'
                          : 'Inactive'}
                      </td>

                      <td
                        style={{
                          textAlign: 'right'
                        }}
                      >
                        <button
                          onClick={() =>
                            setSelectedStudent(
                              student
                            )
                          }
                          style={{
                            border: 'none',
                            background:
                              'transparent',
                            color: '#6b35c0',
                            fontWeight: '700',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          View
                          <ChevronRight
                            size={17}
                          />
                        </button>
                      </td>
                    </tr>
                  )
                })}

                {!visibleStudents.length && (
                  <tr>
                    <td colSpan="5">
                      No students match these
                      filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  )
}


function AdminServants() {
  const [servants, setServants] = useState([])
  const [classes, setClasses] = useState([])
  const [assignments, setAssignments] = useState([])
  const [selectedServant, setSelectedServant] = useState(null)
  const [search, setSearch] = useState('')
  const [classFilter, setClassFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadServants()
  }, [])

  async function loadServants() {
    setLoading(true)

    const [servantsResult, classesResult, assignmentsResult] =
      await Promise.all([
        supabase
          .from('profiles')
          .select('id, first_name, last_name, active')
          .eq('role', 'servant')
          .order('first_name'),

        supabase
          .from('classes')
          .select('id, name, grade_group, active')
          .eq('active', true)
          .order('id'),

        supabase
          .from('servant_classes')
          .select('servant_id, class_id')
      ])

    if (servantsResult.error) {
      console.error('Servants error:', servantsResult.error)
    }

    if (classesResult.error) {
      console.error('Classes error:', classesResult.error)
    }

    if (assignmentsResult.error) {
      console.error(
        'Servant assignments error:',
        assignmentsResult.error
      )
    }

    setServants(servantsResult.data || [])
    setClasses(classesResult.data || [])
    setAssignments(assignmentsResult.data || [])
    setLoading(false)
  }

  function getAssignedClass(servantId) {
    const assignment = assignments.find(
      (item) => item.servant_id === servantId
    )

    if (!assignment) return null

    return (
      classes.find(
        (classItem) => classItem.id === assignment.class_id
      ) || null
    )
  }

  async function changeServantClass(servantId, newClassId) {
    setSaving(true)
    setMessage('')

    const { error: removeError } = await supabase
      .from('servant_classes')
      .delete()
      .eq('servant_id', servantId)

    if (removeError) {
      console.error('Remove servant class error:', removeError)
      setMessage('Could not change the class assignment.')
      setSaving(false)
      return
    }

    if (newClassId !== 'none') {
      const { error: addError } = await supabase
        .from('servant_classes')
        .insert({
          servant_id: servantId,
          class_id: Number(newClassId)
        })

      if (addError) {
        console.error('Assign servant class error:', addError)
        setMessage(
          'The old assignment was removed, but the new class could not be saved.'
        )
        await loadServants()
        setSaving(false)
        return
      }
    }

    await loadServants()
    setMessage('Class assignment updated.')
    setSaving(false)
  }

  const visibleServants = servants.filter((servant) => {
    const name =
      `${servant.first_name || ''} ${servant.last_name || ''}`
        .toLowerCase()

    const matchesSearch =
      name.includes(search.toLowerCase())

    const assignedClass = getAssignedClass(servant.id)

    const matchesClass =
      classFilter === 'all' ||
      (classFilter === 'unassigned' && !assignedClass) ||
      String(assignedClass?.id || '') === classFilter

    return matchesSearch && matchesClass
  })

  if (selectedServant) {
    const assignedClass = getAssignedClass(selectedServant.id)

    return (
      <>
        <button
          onClick={() => {
            setSelectedServant(null)
            setMessage('')
          }}
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
          Back to Servants
        </button>

        <DashboardHeader
          title={`${selectedServant.first_name} ${selectedServant.last_name}`}
          subtitle="Servant profile"
        />

        <div className="stats-grid">
          <StatCard
            icon={<Users />}
            label="Assigned Class"
            value={assignedClass?.name || 'Unassigned'}
            helper="Bible Study group"
          />

          <StatCard
            icon={<CheckCircle2 />}
            label="Status"
            value={selectedServant.active ? 'Active' : 'Inactive'}
            helper="Account status"
          />
        </div>

        <section className="dashboard-card">
          <h2>Class Assignment</h2>

          <p
            style={{
              color: '#6b7280',
              marginTop: '-8px'
            }}
          >
            Choose the Bible Study group this servant serves.
          </p>

          <select
            value={
              assignedClass
                ? String(assignedClass.id)
                : 'none'
            }
            disabled={saving}
            onChange={(event) =>
              changeServantClass(
                selectedServant.id,
                event.target.value
              )
            }
            style={{
              minWidth: '260px',
              padding: '12px 14px',
              borderRadius: '12px',
              border: '1px solid #dfe2ea',
              background: 'white'
            }}
          >
            <option value="none">Unassigned</option>

            {classes.map((classItem) => (
              <option
                key={classItem.id}
                value={classItem.id}
              >
                {classItem.name}
              </option>
            ))}
          </select>

          {saving && (
            <p style={{ color: '#6b7280' }}>
              Saving...
            </p>
          )}

          {message && (
            <p
              style={{
                color: message.includes('updated')
                  ? '#087257'
                  : '#b42318',
                fontWeight: '600'
              }}
            >
              {message}
            </p>
          )}
        </section>
      </>
    )
  }

  return (
    <>
      <DashboardHeader
        title="Servants"
        subtitle="View and manage Bible Study servants"
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'minmax(220px, 1fr) minmax(180px, 260px)',
          gap: '12px',
          marginTop: '24px',
          marginBottom: '18px'
        }}
      >
        <input
          type="search"
          placeholder="Search servants..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          style={{
            width: '100%',
            padding: '12px 14px',
            borderRadius: '12px',
            border: '1px solid #dfe2ea',
            background: 'white',
            outline: 'none'
          }}
        />

        <select
          value={classFilter}
          onChange={(event) =>
            setClassFilter(event.target.value)
          }
          style={{
            width: '100%',
            padding: '12px 14px',
            borderRadius: '12px',
            border: '1px solid #dfe2ea',
            background: 'white'
          }}
        >
          <option value="all">All Classes</option>
          <option value="unassigned">Unassigned</option>

          {classes.map((classItem) => (
            <option
              key={classItem.id}
              value={classItem.id}
            >
              {classItem.name}
            </option>
          ))}
        </select>
      </div>

      <section className="dashboard-card">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '16px'
          }}
        >
          <h2 style={{ margin: 0 }}>
            Servant Directory
          </h2>

          <span
            style={{
              color: '#6b7280',
              fontSize: '13px'
            }}
          >
            {visibleServants.length}{' '}
            {visibleServants.length === 1
              ? 'servant'
              : 'servants'}
          </span>
        </div>

        {loading ? (
          <p>Loading servants...</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Assigned Class</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {visibleServants.map((servant) => {
                  const assignedClass =
                    getAssignedClass(servant.id)

                  return (
                    <tr key={servant.id}>
                      <td>
                        <strong>
                          {servant.first_name}{' '}
                          {servant.last_name}
                        </strong>
                      </td>

                      <td>
                        {assignedClass?.name || 'Unassigned'}
                      </td>

                      <td>
                        {servant.active ? 'Active' : 'Inactive'}
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => {
                            setSelectedServant(servant)
                            setMessage('')
                          }}
                          style={{
                            border: 'none',
                            background: 'transparent',
                            color: '#6b35c0',
                            fontWeight: '700',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          View
                          <ChevronRight size={17} />
                        </button>
                      </td>
                    </tr>
                  )
                })}

                {!visibleServants.length && (
                  <tr>
                    <td colSpan="4">
                      No servants match these filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  )
}


function AdminPointsSystem() {
  const [rules, setRules] = useState([])
  const [draftPoints, setDraftPoints] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const ruleDetails = {
    daily_reading: {
      label: 'Daily Bible Reading',
      description: 'Awarded for completing the assigned daily Bible reading.',
      icon: '📖'
    },
    attendance: {
      label: 'Bible Study Attendance',
      description: 'Awarded when a student attends Friday Bible Study.',
      icon: '⛪'
    },
    homework: {
      label: 'Homework',
      description: 'Awarded for completing the weekly Bible Study homework.',
      icon: '✏️'
    },
    memory_verse: {
      label: 'Memory Verse',
      description: 'Awarded for completing the assigned memory verse.',
      icon: '🧠'
    },
    physical_bible: {
      label: 'Physical Bible',
      description: 'Awarded for bringing a physical Bible to Bible Study.',
      icon: '📕'
    },
    participation: {
      label: 'Behavior & Participation',
      description: 'Used as the guide for weekly participation points.',
      icon: '⭐'
    }
  }

  const preferredOrder = [
    'daily_reading',
    'attendance',
    'homework',
    'memory_verse',
    'physical_bible',
    'participation'
  ]

  useEffect(() => {
    loadPointRules()
  }, [])

  async function loadPointRules() {
    setLoading(true)
    setMessage('')

    const { data, error } = await supabase
      .from('point_rules')
      .select('*')

    if (error) {
      console.error('Point rules error:', error)
      setRules([])
      setDraftPoints({})
      setMessage('Could not load the point rules.')
      setLoading(false)
      return
    }

    const loadedRules = data || []

    loadedRules.sort((a, b) => {
      const aIndex = preferredOrder.indexOf(a.category)
      const bIndex = preferredOrder.indexOf(b.category)

      if (aIndex === -1 && bIndex === -1) {
        return String(a.category).localeCompare(String(b.category))
      }

      if (aIndex === -1) return 1
      if (bIndex === -1) return -1

      return aIndex - bIndex
    })

    const nextDraft = {}

    loadedRules.forEach((rule) => {
      nextDraft[rule.category] = rule.points ?? 0
    })

    setRules(loadedRules)
    setDraftPoints(nextDraft)
    setLoading(false)
  }

  function updateDraft(category, value) {
    const numericValue =
      value === '' ? '' : Math.max(0, Number(value))

    setDraftPoints((current) => ({
      ...current,
      [category]: numericValue
    }))

    setMessage('')
  }

  async function savePointRules() {
    setSaving(true)
    setMessage('')

    for (const rule of rules) {
      const nextPoints = Number(draftPoints[rule.category])

      if (
        draftPoints[rule.category] === '' ||
        Number.isNaN(nextPoints) ||
        nextPoints < 0
      ) {
        setMessage('Every point value must be 0 or higher.')
        setSaving(false)
        return
      }

      const { error } = await supabase
        .from('point_rules')
        .update({ points: nextPoints })
        .eq('category', rule.category)

      if (error) {
        console.error(
          `Point rule update error for ${rule.category}:`,
          error
        )
        setMessage(
          'Could not save the point values. Please try again.'
        )
        setSaving(false)
        return
      }
    }

    await loadPointRules()
    setMessage('Point values saved successfully.')
    setSaving(false)
  }

  const totalStandardPoints = rules.reduce(
    (sum, rule) =>
      sum + (Number(draftPoints[rule.category]) || 0),
    0
  )

  return (
    <>
      <DashboardHeader
        title="Points System"
        subtitle="Manage how students earn points in Bible Study Academy"
      />

      <div className="stats-grid">
        <StatCard
          icon={<Trophy />}
          label="Point Categories"
          value={rules.length}
          helper="Active point rules"
        />

        <StatCard
          icon={<Star />}
          label="Standard Total"
          value={totalStandardPoints}
          helper="If every category is earned once"
        />

        <StatCard
          icon={<ClipboardCheck />}
          label="Bonus Points"
          value="Manual"
          helper="Awarded separately"
        />
      </div>

      <section className="dashboard-card">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '18px',
            flexWrap: 'wrap',
            marginBottom: '22px'
          }}
        >
          <div>
            <h2 style={{ marginBottom: '6px' }}>
              Point Values
            </h2>

            <p
              style={{
                color: '#6b7280',
                margin: 0,
                maxWidth: '620px'
              }}
            >
              Change the value for any category below. These
              values are used when student total points are
              calculated.
            </p>
          </div>

          <button
            className="primary-button small-button"
            onClick={savePointRules}
            disabled={saving || loading || !rules.length}
            style={{ width: 'auto' }}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {loading ? (
          <p>Loading point rules...</p>
        ) : !rules.length ? (
          <p>No point rules were found.</p>
        ) : (
          <div
            style={{
              display: 'grid',
              gap: '14px'
            }}
          >
            {rules.map((rule) => {
              const details =
                ruleDetails[rule.category] || {
                  label: rule.category
                    .replaceAll('_', ' ')
                    .replace(/\b\w/g, (letter) =>
                      letter.toUpperCase()
                    ),
                  description: 'Bible Study point category.',
                  icon: '🏆'
                }

              return (
                <div
                  key={rule.category}
                  style={{
                    display: 'grid',
                    gridTemplateColumns:
                      '52px minmax(0, 1fr) 120px',
                    gap: '14px',
                    alignItems: 'center',
                    padding: '16px',
                    border: '1px solid #ececf2',
                    borderRadius: '14px',
                    background: '#fff'
                  }}
                >
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      display: 'grid',
                      placeItems: 'center',
                      background: '#f5efff',
                      fontSize: '23px'
                    }}
                  >
                    {details.icon}
                  </div>

                  <div>
                    <strong
                      style={{
                        display: 'block',
                        marginBottom: '4px'
                      }}
                    >
                      {details.label}
                    </strong>

                    <span
                      style={{
                        color: '#6b7280',
                        fontSize: '13px'
                      }}
                    >
                      {details.description}
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={draftPoints[rule.category] ?? ''}
                      onChange={(event) =>
                        updateDraft(
                          rule.category,
                          event.target.value
                        )
                      }
                      style={{
                        width: '76px',
                        padding: '10px 10px',
                        borderRadius: '10px',
                        border: '1px solid #dfe2ea',
                        textAlign: 'center',
                        fontWeight: '700'
                      }}
                    />

                    <span
                      style={{
                        color: '#6b7280',
                        fontSize: '13px'
                      }}
                    >
                      pts
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {message && (
          <p
            style={{
              marginTop: '18px',
              marginBottom: 0,
              color: message.includes('successfully')
                ? '#087257'
                : '#b42318',
              fontWeight: '600'
            }}
          >
            {message}
          </p>
        )}
      </section>

      <section className="dashboard-card">
        <h2>Bonus Points</h2>

        <p
          style={{
            color: '#6b7280',
            marginBottom: 0
          }}
        >
          Bonus points stay flexible instead of having one fixed
          value. Admins and servants will be able to enter the
          amount and reason when we connect Bonus Points to Quick
          Entry.
        </p>
      </section>
    </>
  )
}


function AdminReports() {
  const [classes, setClasses] = useState([])
  const [students, setStudents] = useState([])
  const [memberships, setMemberships] = useState([])
  const [attendance, setAttendance] = useState([])
  const [reading, setReading] = useState([])
  const [homework, setHomework] = useState([])
  const [verses, setVerses] = useState([])
  const [bibles, setBibles] = useState([])
  const [participation, setParticipation] = useState([])
  const [bonus, setBonus] = useState([])
  const [rules, setRules] = useState([])
  const [classFilter, setClassFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadReports()
  }, [])

  async function loadReports() {
    setLoading(true)

    const results = await Promise.all([
      supabase.from('classes').select('id, name').eq('active', true).order('id'),
      supabase.from('profiles').select('id, first_name, last_name').eq('role', 'student').eq('active', true),
      supabase.from('class_members').select('student_id, class_id'),
      supabase.from('attendance').select('*'),
      supabase.from('daily_reading').select('*'),
      supabase.from('homework').select('*'),
      supabase.from('memory_verses').select('*'),
      supabase.from('physical_bible').select('*'),
      supabase.from('participation').select('*'),
      supabase.from('bonus_points').select('*'),
      supabase.from('point_rules').select('*')
    ])

    setClasses(results[0].data || [])
    setStudents(results[1].data || [])
    setMemberships(results[2].data || [])
    setAttendance(results[3].data || [])
    setReading(results[4].data || [])
    setHomework(results[5].data || [])
    setVerses(results[6].data || [])
    setBibles(results[7].data || [])
    setParticipation(results[8].data || [])
    setBonus(results[9].data || [])
    setRules(results[10].data || [])
    setLoading(false)
  }

  const studentIds =
    classFilter === 'all'
      ? students.map((student) => student.id)
      : memberships
          .filter((item) => String(item.class_id) === classFilter)
          .map((item) => item.student_id)

  const filteredStudents = students.filter((student) =>
    studentIds.includes(student.id)
  )

  const onlyStudents = (records) =>
    records.filter((record) => studentIds.includes(record.student_id))

  const percentage = (records, field) => {
    const filtered = onlyStudents(records)
    if (!filtered.length) return 0
    const complete = filtered.filter((record) => record[field] === true).length
    return Math.round((complete / filtered.length) * 100)
  }

  const pointRules = {}
  rules.forEach((rule) => {
    pointRules[rule.category] = Number(rule.points) || 0
  })

  function studentPoints(studentId) {
    const countTrue = (records, field) =>
      records.filter(
        (record) =>
          record.student_id === studentId &&
          record[field] === true
      ).length

    return (
      countTrue(attendance, 'present') * (pointRules.attendance || 0) +
      countTrue(reading, 'completed') * (pointRules.daily_reading || 0) +
      countTrue(homework, 'completed') * (pointRules.homework || 0) +
      countTrue(verses, 'completed') * (pointRules.memory_verse || 0) +
      countTrue(bibles, 'brought_bible') * (pointRules.physical_bible || 0) +
      participation
        .filter((record) => record.student_id === studentId)
        .reduce((sum, record) => sum + (Number(record.points) || 0), 0) +
      bonus
        .filter((record) => record.student_id === studentId)
        .reduce((sum, record) => sum + (Number(record.points) || 0), 0)
    )
  }

  const leaderboard = filteredStudents
    .map((student) => ({
      ...student,
      points: studentPoints(student.id)
    }))
    .sort((a, b) => b.points - a.points)

  const totalPoints = leaderboard.reduce(
    (sum, student) => sum + student.points,
    0
  )

  return (
    <>
      <DashboardHeader
        title="Reports"
        subtitle="See Bible Study progress across the academy"
      />

      <div style={{ marginTop: '24px', marginBottom: '18px' }}>
        <select
          value={classFilter}
          onChange={(event) => setClassFilter(event.target.value)}
          style={{
            minWidth: '260px',
            padding: '12px 14px',
            borderRadius: '12px',
            border: '1px solid #dfe2ea',
            background: 'white'
          }}
        >
          <option value="all">All Classes</option>
          {classes.map((classItem) => (
            <option key={classItem.id} value={classItem.id}>
              {classItem.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <section className="dashboard-card">
          <p>Loading reports...</p>
        </section>
      ) : (
        <>
          <div className="stats-grid">
            <StatCard
              icon={<Users />}
              label="Students"
              value={filteredStudents.length}
              helper="In this report"
            />
            <StatCard
              icon={<CheckCircle2 />}
              label="Attendance"
              value={`${percentage(attendance, 'present')}%`}
              helper="Overall completion"
            />
            <StatCard
              icon={<BookOpen />}
              label="Daily Reading"
              value={`${percentage(reading, 'completed')}%`}
              helper="Overall completion"
            />
            <StatCard
              icon={<Trophy />}
              label="Points Awarded"
              value={totalPoints}
              helper="All recorded points"
            />
          </div>

          <section className="dashboard-card">
            <h2>Academy Progress</h2>
            <div className="progress-grid">
              <ProgressCircle
                label="Daily Reading"
                value={percentage(reading, 'completed')}
                emoji="📖"
              />
              <ProgressCircle
                label="Attendance"
                value={percentage(attendance, 'present')}
                emoji="⛪"
              />
              <ProgressCircle
                label="Homework"
                value={percentage(homework, 'completed')}
                emoji="✏️"
              />
              <ProgressCircle
                label="Memory Verse"
                value={percentage(verses, 'completed')}
                emoji="🧠"
              />
              <ProgressCircle
                label="Physical Bible"
                value={percentage(bibles, 'brought_bible')}
                emoji="📕"
              />
            </div>
          </section>

          <section className="dashboard-card">
            <h2>Points Leaderboard</h2>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Student</th>
                    <th>Points</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((student, index) => (
                    <tr key={student.id}>
                      <td>#{index + 1}</td>
                      <td>
                        <strong>
                          {student.first_name} {student.last_name}
                        </strong>
                      </td>
                      <td>{student.points}</td>
                    </tr>
                  ))}
                  {!leaderboard.length && (
                    <tr>
                      <td colSpan="3">No students found for this report.</td>
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


function AdminSettings() {
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [accountType, setAccountType] = useState(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    grade: '',
    class_id: ''
  })

  useEffect(() => {
    loadSettings()
  }, [])

  async function loadSettings() {
    setLoading(true)

    const { data, error } = await supabase
      .from('classes')
      .select('id, name, grade_group, active')
      .order('id')

    if (error) {
      console.error('Settings classes error:', error)
    }

    setClasses(data || [])
    setLoading(false)
  }

  function openAccountForm(type) {
    setAccountType(type)
    setMessage('')
    setForm({
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      grade: '',
      class_id: ''
    })
  }

  function closeAccountForm() {
    if (saving) return
    setAccountType(null)
    setMessage('')
  }

  function updateForm(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value
    }))
    setMessage('')
  }

  async function createAccount(event) {
    event.preventDefault()
    setSaving(true)
    setMessage('')

    const role = accountType

    if (!role) {
      setSaving(false)
      return
    }

    if (
      !form.first_name.trim() ||
      !form.last_name.trim() ||
      !form.email.trim() ||
      !form.password ||
      !form.class_id
    ) {
      setMessage('Please complete all required fields.')
      setSaving(false)
      return
    }

    if (role === 'student' && !form.grade.trim()) {
      setMessage('Please enter the student grade.')
      setSaving(false)
      return
    }

    if (form.password.length < 6) {
      setMessage('The temporary password must be at least 6 characters.')
      setSaving(false)
      return
    }

    const { data, error } = await supabase.functions.invoke(
      'create-user',
      {
        body: {
          email: form.email.trim().toLowerCase(),
          password: form.password,
          first_name: form.first_name.trim(),
          last_name: form.last_name.trim(),
          role,
          grade:
            role === 'student'
              ? form.grade.trim()
              : null,
          class_id: Number(form.class_id)
        }
      }
    )

    if (error) {
      console.error('Create account function error:', error)

      let detail = error.message

      try {
        if (error.context) {
          const body = await error.context.json()
          detail = body?.error || detail
        }
      } catch {
        // Keep the original function error message.
      }

      setMessage(detail || 'Could not create the account.')
      setSaving(false)
      return
    }

    if (data?.error) {
      setMessage(data.error)
      setSaving(false)
      return
    }

    setMessage(
      role === 'student'
        ? 'Student created successfully.'
        : 'Servant created successfully.'
    )

    setForm({
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      grade: '',
      class_id: ''
    })

    setSaving(false)
  }

  if (accountType) {
    const isStudent = accountType === 'student'

    return (
      <>
        <button
          onClick={closeAccountForm}
          disabled={saving}
          style={{
            border: 'none',
            background: 'transparent',
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            padding: '0',
            marginBottom: '18px',
            cursor: saving ? 'default' : 'pointer',
            color: '#6b35c0',
            fontWeight: '700'
          }}
        >
          <ArrowLeft size={18} />
          Back to Settings
        </button>

        <DashboardHeader
          title={isStudent ? 'Add Student' : 'Add Servant'}
          subtitle={
            isStudent
              ? 'Create a student login and assign a Bible Study class'
              : 'Create a servant login and assign a Bible Study class'
          }
        />

        <section
          className="dashboard-card"
          style={{
            marginTop: '24px',
            maxWidth: '760px'
          }}
        >
          <h2>
            {isStudent ? 'Student Account' : 'Servant Account'}
          </h2>

          <p
            style={{
              color: '#6b7280',
              marginTop: '-8px',
              marginBottom: '22px'
            }}
          >
            The email and temporary password will be used to log in
            to Bible Study Academy.
          </p>

          <form onSubmit={createAccount}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '16px'
              }}
            >
              <div>
                <label>First Name</label>
                <input
                  type="text"
                  value={form.first_name}
                  onChange={(event) =>
                    updateForm('first_name', event.target.value)
                  }
                  placeholder="First name"
                  required
                  disabled={saving}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label>Last Name</label>
                <input
                  type="text"
                  value={form.last_name}
                  onChange={(event) =>
                    updateForm('last_name', event.target.value)
                  }
                  placeholder="Last name"
                  required
                  disabled={saving}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label>Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    updateForm('email', event.target.value)
                  }
                  placeholder="student@example.com"
                  required
                  disabled={saving}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label>Temporary Password</label>
                <input
                  type="text"
                  value={form.password}
                  onChange={(event) =>
                    updateForm('password', event.target.value)
                  }
                  placeholder="At least 6 characters"
                  minLength="6"
                  required
                  disabled={saving}
                  style={{ width: '100%' }}
                />
              </div>

              {isStudent && (
                <div>
                  <label>Grade</label>
                  <input
                    type="text"
                    value={form.grade}
                    onChange={(event) =>
                      updateForm('grade', event.target.value)
                    }
                    placeholder="Example: 3rd"
                    required
                    disabled={saving}
                    style={{ width: '100%' }}
                  />
                </div>
              )}

              <div>
                <label>Bible Study Class</label>
                <select
                  value={form.class_id}
                  onChange={(event) =>
                    updateForm('class_id', event.target.value)
                  }
                  required
                  disabled={saving || loading}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    border: '1px solid #dfe2ea',
                    background: 'white'
                  }}
                >
                  <option value="">
                    Select a class
                  </option>

                  {classes
                    .filter((classItem) => classItem.active)
                    .map((classItem) => (
                      <option
                        key={classItem.id}
                        value={classItem.id}
                      >
                        {classItem.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {message && (
              <div
                style={{
                  marginTop: '18px',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  background: message.includes('successfully')
                    ? '#ecfdf3'
                    : '#fef3f2',
                  color: message.includes('successfully')
                    ? '#087257'
                    : '#b42318',
                  fontWeight: '600'
                }}
              >
                {message}
              </div>
            )}

            <div
              style={{
                display: 'flex',
                gap: '10px',
                marginTop: '22px',
                flexWrap: 'wrap'
              }}
            >
              <button
                className="primary-button small-button"
                type="submit"
                disabled={saving || loading}
                style={{ width: 'auto' }}
              >
                {saving
                  ? 'Creating...'
                  : isStudent
                    ? 'Create Student'
                    : 'Create Servant'}
              </button>

              <button
                type="button"
                onClick={closeAccountForm}
                disabled={saving}
                style={{
                  border: '1px solid #dfe2ea',
                  background: 'white',
                  padding: '10px 16px',
                  borderRadius: '10px',
                  cursor: saving ? 'default' : 'pointer',
                  fontWeight: '700'
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      </>
    )
  }

  return (
    <>
      <DashboardHeader
        title="Settings"
        subtitle="Manage Bible Study Academy"
      />

      <section className="dashboard-card" style={{ marginTop: '24px' }}>
        <h2>Academy</h2>

        <div
          style={{
            display: 'grid',
            gap: '14px',
            maxWidth: '620px'
          }}
        >
          <div
            style={{
              padding: '16px',
              border: '1px solid #ececf2',
              borderRadius: '14px'
            }}
          >
            <strong>Bible Study Academy</strong>
            <p
              style={{
                margin: '5px 0 0',
                color: '#6b7280',
                fontSize: '13px'
              }}
            >
              General academy settings will live here as we add
              school-year, leaderboard, achievement, and reading controls.
            </p>
          </div>
        </div>
      </section>

      <section className="dashboard-card">
        <h2>Class Management</h2>

        {loading ? (
          <p>Loading classes...</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Class</th>
                  <th>Grade Group</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {classes.map((classItem) => (
                  <tr key={classItem.id}>
                    <td>
                      <strong>{classItem.name}</strong>
                    </td>
                    <td>{classItem.grade_group || '—'}</td>
                    <td>
                      {classItem.active ? 'Active' : 'Inactive'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="dashboard-card">
        <h2>Account Management</h2>

        <p style={{ color: '#6b7280', marginBottom: '14px' }}>
          Create a login, profile, and class assignment together.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '14px'
          }}
        >
          <button
            type="button"
            onClick={() => openAccountForm('student')}
            style={{
              padding: '18px',
              border: '1px solid #ececf2',
              borderRadius: '14px',
              background: 'white',
              textAlign: 'left',
              cursor: 'pointer',
              font: 'inherit'
            }}
          >
            <GraduationCap size={24} />
            <h3 style={{ marginBottom: '6px' }}>
              Add Student
            </h3>
            <p
              style={{
                color: '#6b7280',
                fontSize: '13px',
                marginBottom: 0
              }}
            >
              Create a student login, choose their grade, and
              assign them to a Bible Study class.
            </p>
          </button>

          <button
            type="button"
            onClick={() => openAccountForm('servant')}
            style={{
              padding: '18px',
              border: '1px solid #ececf2',
              borderRadius: '14px',
              background: 'white',
              textAlign: 'left',
              cursor: 'pointer',
              font: 'inherit'
            }}
          >
            <UserRound size={24} />
            <h3 style={{ marginBottom: '6px' }}>
              Add Servant
            </h3>
            <p
              style={{
                color: '#6b7280',
                fontSize: '13px',
                marginBottom: 0
              }}
            >
              Create a servant login and assign them to their
              Bible Study class.
            </p>
          </button>
        </div>
      </section>
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
