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
