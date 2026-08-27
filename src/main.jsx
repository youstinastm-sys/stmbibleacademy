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

      if (activePage === 'Quick Entry') {
        return <ServantQuickEntry profile={profile} />
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



function ServantMyClass({ profile }) {
  const [classInfo, setClassInfo] = useState(null)
  const [students, setStudents] = useState([])
  const [studentStats, setStudentStats] = useState({})
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

    const [attendanceResult, readingResult, homeworkResult, verseResult, bibleResult, participationResult, bonusResult, rulesResult] =
      await Promise.all([
        supabase.from('attendance').select('student_id, present').eq('class_id', assignment.class_id).in('student_id', ids),
        supabase.from('daily_reading').select('student_id, completed').in('student_id', ids),
        supabase.from('homework').select('student_id, completed').eq('class_id', assignment.class_id).in('student_id', ids),
        supabase.from('memory_verses').select('student_id, completed').eq('class_id', assignment.class_id).in('student_id', ids),
        supabase.from('physical_bible').select('student_id, brought_bible').eq('class_id', assignment.class_id).in('student_id', ids),
        supabase.from('participation').select('student_id, points').eq('class_id', assignment.class_id).in('student_id', ids),
        supabase.from('bonus_points').select('student_id, points').eq('class_id', assignment.class_id).in('student_id', ids),
        supabase.from('point_rules').select('category, points')
      ])

    const results = [attendanceResult, readingResult, homeworkResult, verseResult, bibleResult, participationResult, bonusResult, rulesResult]
    const firstError = results.find((result) => result.error)?.error

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
    activeStudents.forEach((student) => {
      const filter = (result) =>
        (result.data || []).filter((r) => r.student_id === student.id)

      const attendance = filter(attendanceResult)
      const reading = filter(readingResult)
      const homework = filter(homeworkResult)
      const verses = filter(verseResult)
      const bibles = filter(bibleResult)
      const participation = filter(participationResult)
      const bonuses = filter(bonusResult)

      const countTrue = (items, field) =>
        items.filter((item) => item[field] === true).length
      const percent = (items, field) =>
        items.length ? Math.round((countTrue(items, field) / items.length) * 100) : 0

      const attendanceDone = countTrue(attendance, 'present')
      const readingDone = countTrue(reading, 'completed')
      const homeworkDone = countTrue(homework, 'completed')
      const verseDone = countTrue(verses, 'completed')
      const bibleDone = countTrue(bibles, 'brought_bible')
      const participationPoints = participation.reduce((sum, r) => sum + (Number(r.points) || 0), 0)
      const bonusPoints = bonuses.reduce((sum, r) => sum + (Number(r.points) || 0), 0)

      stats[student.id] = {
        attendance: percent(attendance, 'present'),
        reading: percent(reading, 'completed'),
        homework: percent(homework, 'completed'),
        verse: percent(verses, 'completed'),
        physicalBible: percent(bibles, 'brought_bible'),
        points:
          attendanceDone * (rules.attendance || 0) +
          readingDone * (rules.daily_reading || 0) +
          homeworkDone * (rules.homework || 0) +
          verseDone * (rules.memory_verse || 0) +
          bibleDone * (rules.physical_bible || 0) +
          participationPoints +
          bonusPoints
      }
    })

    setStudentStats(stats)
    setLoading(false)
  }

  const average = (field) =>
    students.length
      ? Math.round(students.reduce((sum, s) => sum + (studentStats[s.id]?.[field] || 0), 0) / students.length)
      : 0

  const classAttendance = average('attendance')
  const classReading = average('reading')
  const classHomework = average('homework')
  const totalPoints = students.reduce((sum, s) => sum + (studentStats[s.id]?.points || 0), 0)

  return (
    <>
      <DashboardHeader
        title={classInfo?.name || 'My Class'}
        subtitle={classInfo?.grade_group ? `${classInfo.grade_group} • Class overview` : 'Your Bible Study class overview'}
      />

      {message && <section className="dashboard-card"><p>{message}</p></section>}

      {loading ? (
        <section className="dashboard-card"><p>Loading your class...</p></section>
      ) : classInfo ? (
        <>
          <div className="stats-grid">
            <StatCard icon={<Users />} label="Students" value={students.length} helper="Active students" />
            <StatCard icon={<CheckCircle2 />} label="Attendance" value={`${classAttendance}%`} helper="Class average" />
            <StatCard icon={<BookOpen />} label="Daily Reading" value={`${classReading}%`} helper="Class average" />
            <StatCard icon={<Trophy />} label="Class Points" value={totalPoints} helper="Total earned" />
          </div>

          <section className="dashboard-card">
            <h2>Class Progress</h2>
            <div className="progress-grid">
              <ProgressCircle label="Attendance" value={classAttendance} emoji="⛪" />
              <ProgressCircle label="Daily Reading" value={classReading} emoji="📖" />
              <ProgressCircle label="Homework" value={classHomework} emoji="✏️" />
            </div>
          </section>

          <section className="dashboard-card">
            <h2>Class Roster</h2>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Student</th><th>Grade</th><th>Attendance</th><th>Reading</th>
                    <th>Homework</th><th>Memory Verse</th><th>Physical Bible</th><th>Points</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => {
                    const stats = studentStats[student.id] || {}
                    return (
                      <tr key={student.id}>
                        <td><strong>{student.first_name} {student.last_name}</strong></td>
                        <td>{student.grade || '—'}</td>
                        <td>{stats.attendance ?? 0}%</td>
                        <td>{stats.reading ?? 0}%</td>
                        <td>{stats.homework ?? 0}%</td>
                        <td>{stats.verse ?? 0}%</td>
                        <td>{stats.physicalBible ?? 0}%</td>
                        <td><strong>{stats.points ?? 0}</strong></td>
                      </tr>
                    )
                  })}
                  {!students.length && <tr><td colSpan="8">No students are assigned to this class yet.</td></tr>}
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : null}
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
