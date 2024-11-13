'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

// Types
interface Teacher {
  id: number
  fullName: string
}

interface Student {
  id: number
  fullName: string
  login: string
}

interface Group {
  id: number
  name: string
  teacher: Teacher
  participants: Student[]
}

// Mock data
const mockTeachers: Teacher[] = [
  { id: 1, fullName: 'Иванов Иван Иванович' },
  { id: 2, fullName: 'Петров Петр Петрович' },
  { id: 3, fullName: 'Сидоров Сидор Сидорович' },
]

const mockStudents: Student[] = [
  { id: 1, fullName: 'Коссе Иван Николаевич', login: 'kosseivan' },
  { id: 2, fullName: 'Иванов Артём Дмитриевич', login: 'ivanov' },
  { id: 3, fullName: 'Кузнецов Даниил Сергеевич', login: 'kuznetsov' },
  { id: 4, fullName: 'Ковалёва Полина Антоновна', login: 'kovaleva' },
  { id: 5, fullName: 'Соколов Михаил Ильич', login: 'sokolov' },
  { id: 6, fullName: 'буссаид мохаммед салим', login: 'davydov' },
  { id: 7, fullName: 'Козлов Егор Павлович', login: 'kozlov' },
  { id: 8, fullName: 'Морозов Кирилл Алексеевич', login: 'morozov' },
  { id: 9, fullName: 'Волков Александр Денисович', login: 'volkov' },
  { id: 10, fullName: 'Смирнова Анастасия Максимовна', login: 'smirnova' },
]

const initialGroups: Group[] = [
  {
    id: 1,
    name: 'Вечерняя группа',
    teacher: mockTeachers[0],
    participants: mockStudents.slice(0, 15),
  },
  {
    id: 2,
    name: 'Группа 1',
    teacher: mockTeachers[0],
    participants: mockStudents.slice(0, 15),
  },
  {
    id: 3,
    name: 'Группа утро суббота',
    teacher: mockTeachers[0],
    participants: mockStudents.slice(0, 6),
  },
]

export default function GroupsPage() {
  const router = useRouter()
  const [groups, setGroups] = useState<Group[]>(initialGroups)
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(initialGroups[0])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  // Form states for Create/Edit Group
  const [groupName, setGroupName] = useState('')
  const [selectedTeacherId, setSelectedTeacherId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedParticipants, setSelectedParticipants] = useState<Student[]>([])
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  // Filter students based on search (minimum 3 characters)
  const filteredStudents = searchQuery.length >= 3
    ? mockStudents.filter(
        (s) =>
          s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !selectedParticipants.some((p) => p.id === s.id)
      )
    : []

  const handleCreateGroup = () => {
    const newErrors: { [key: string]: string } = {}

    if (!groupName.trim()) {
      newErrors.name = 'Название группы обязательно'
    }

    if (!selectedTeacherId) {
      newErrors.teacher = 'Выберите преподавателя'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const teacher = mockTeachers.find((t) => t.id === selectedTeacherId)
    if (!teacher) return

    const newGroup: Group = {
      id: groups.length + 1,
      name: groupName,
      teacher,
      participants: selectedParticipants,
    }

    setGroups([...groups, newGroup])
    setShowCreateModal(false)
    resetForm()
    // Обновляем страницу после создания
    window.location.reload()
  }

  const handleEditGroup = () => {
    if (!selectedGroup) return

    const newErrors: { [key: string]: string } = {}

    if (!groupName.trim()) {
      newErrors.name = 'Название группы обязательно'
    }

    if (!selectedTeacherId) {
      newErrors.teacher = 'Выберите преподавателя'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const teacher = mockTeachers.find((t) => t.id === selectedTeacherId)
    if (!teacher) return

    const updatedGroups = groups.map((g) =>
      g.id === selectedGroup.id
        ? {
            ...g,
            name: groupName,
            teacher,
            participants: selectedParticipants,
          }
        : g
    )

    setGroups(updatedGroups)
    const updatedGroup = updatedGroups.find((g) => g.id === selectedGroup.id)
    if (updatedGroup) {
      setSelectedGroup(updatedGroup)
    }
    setShowEditModal(false)
    resetForm()
    // Обновляем страницу после редактирования
    window.location.reload()
  }

  const handleDeleteGroup = () => {
    if (!selectedGroup) return
    const updatedGroups = groups.filter((g) => g.id !== selectedGroup.id)
    setGroups(updatedGroups)
    setSelectedGroup(updatedGroups[0] || null)
    setShowDeleteModal(false)
    // Обновляем страницу после удаления
    window.location.reload()
  }

  const resetForm = () => {
    setGroupName('')
    setSelectedTeacherId(null)
    setSearchQuery('')
    setSelectedParticipants([])
    setErrors({})
  }

  const openCreateModal = () => {
    resetForm()
    setShowCreateModal(true)
  }

  const openEditModal = () => {
    if (!selectedGroup) return
    setGroupName(selectedGroup.name)
    setSelectedTeacherId(selectedGroup.teacher.id)
    setSelectedParticipants([...selectedGroup.participants])
    setSearchQuery('')
    setErrors({})
    setShowEditModal(true)
  }

  const openDeleteModal = () => {
    setShowDeleteModal(true)
  }

  const addParticipant = (student: Student) => {
    setSelectedParticipants([...selectedParticipants, student])
    setSearchQuery('')
  }

  const removeParticipant = (studentId: number) => {
    setSelectedParticipants(selectedParticipants.filter((p) => p.id !== studentId))
  }

  // Sort groups: A-Z, then numbers
  const sortedGroups = [...groups].sort((a, b) => {
    const aStartsWithNumber = /^\d/.test(a.name)
    const bStartsWithNumber = /^\d/.test(b.name)

    if (aStartsWithNumber && !bStartsWithNumber) return 1
    if (!aStartsWithNumber && bStartsWithNumber) return -1

    return a.name.localeCompare(b.name, 'ru', { numeric: true })
  })

  // Sort participants by last name
  const sortedParticipants = selectedGroup
    ? [...selectedGroup.participants].sort((a, b) =>
        a.fullName.localeCompare(b.fullName, 'ru')
      )
    : []

  return (
    <div className="flex h-screen w-full bg-[#f4f9fd]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col">
        <nav className="flex-1 px-4 pt-8 space-y-2">
          <button
            onClick={() => router.push('/profile')}
            className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>Профиль</span>
          </button>

          <button
            onClick={() => router.push('/users')}
            className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span>Пользователи</span>
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 text-left bg-[#132440]/10 text-[#132440] font-medium rounded-xl border-l-4 border-[#132440]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24" />
            </svg>
            <span>Группы</span>
          </button>

          <button
            onClick={() => router.push('/gifts')}
            className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            </svg>
            <span>Подарки</span>
          </button>

          <button
            onClick={() => router.push('/orders')}
            className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 2v2m6-2v2M4 6h16M5 10h14v10H5V10z" />
            </svg>
            <span>Заказы</span>
          </button>

          <button
            onClick={() => router.push('/history')}
            className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span>История</span>
          </button>
        </nav>

        <div className="p-6 mt-auto border-t">
          <button
            onClick={() => router.push('/auth')}
            className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
            <span>Выйти</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top Header */}
        <div className="bg-white border-b px-10 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-800">Группы</h1>
            <button
              onClick={openCreateModal}
              className="bg-[#132440] text-white px-6 py-3 rounded-xl hover:bg-[#0d1a2e] transition-colors flex items-center gap-2 shadow-sm"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" />
              </svg>
              <span className="font-medium">Создать группу</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-10">
          <div className="flex gap-6">
            {/* Left Column: Groups List */}
            <div className="w-80 bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <div className="space-y-3">
                {sortedGroups.map((group) => (
                  <button
                    key={group.id}
                    onClick={() => setSelectedGroup(group)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                      selectedGroup?.id === group.id
                        ? 'bg-[#132440]/10 text-[#132440] font-medium shadow-sm'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    {group.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: Group Details */}
            {selectedGroup ? (
              <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                <div className="flex items-start justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">{selectedGroup.name}</h2>
                  <div className="flex gap-3">
                    <button
                      onClick={openEditModal}
                      className="p-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                      title="Редактировать"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                    <button
                      onClick={openDeleteModal}
                      className="p-2.5 border border-gray-300 rounded-xl hover:bg-red-50 text-red-600 transition-colors"
                      title="Удалить"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-sm text-gray-500 font-medium mb-1">Преподаватель:</p>
                  <p className="text-gray-800 font-medium">{selectedGroup.teacher.fullName}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 font-medium mb-3">Участники группы:</p>
                  <ol className="space-y-2">
                    {sortedParticipants.map((participant, index) => (
                      <li key={participant.id} className="text-gray-700">
                        {index + 1}. {participant.fullName}
                      </li>
                    ))}
                  </ol>
                  {sortedParticipants.length === 0 && (
                    <p className="text-gray-400 italic">Нет участников</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm flex items-center justify-center">
                <p className="text-gray-400 text-lg">Выберите группу для просмотра</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Создать группу</h2>
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  resetForm()
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Название*</label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Название группы"
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm mb-2">Закрепить преподавателя за группой*</label>
                <select
                  value={selectedTeacherId || ''}
                  onChange={(e) => setSelectedTeacherId(Number(e.target.value))}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.teacher ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                >
                  <option value="">Выбрать</option>
                  {mockTeachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.fullName}
                    </option>
                  ))}
                </select>
                {errors.teacher && <p className="text-red-500 text-xs mt-1">{errors.teacher}</p>}
              </div>

              <div>
                <label className="block text-sm mb-2">Найти ученика</label>
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Поиск"
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                {searchQuery.length > 0 && searchQuery.length < 3 && (
                  <p className="text-gray-500 text-xs mt-1">Введите минимум 3 символа</p>
                )}
                {filteredStudents.length > 0 && (
                  <div className="mt-2 border rounded-lg max-h-40 overflow-y-auto">
                    {filteredStudents.map((student) => (
                      <button
                        key={student.id}
                        onClick={() => addParticipant(student)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b last:border-b-0"
                      >
                        {student.fullName}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm mb-2">Участники группы</label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedParticipants
                    .sort((a, b) => a.fullName.localeCompare(b.fullName, 'ru'))
                    .map((participant) => (
                      <div
                        key={participant.id}
                        className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-lg"
                      >
                        <span className="text-sm">{participant.fullName}</span>
                        <button
                          onClick={() => removeParticipant(participant.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  {selectedParticipants.length === 0 && (
                    <div className="text-gray-400 text-sm italic px-4 py-2">Нет участников</div>
                  )}
                </div>
              </div>

              <button
                onClick={handleCreateGroup}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg mt-4"
              >
                Создать
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Group Modal */}
      {showEditModal && selectedGroup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Отредактировать группу</h2>
              <button
                onClick={() => {
                  setShowEditModal(false)
                  resetForm()
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Название*</label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Название группы"
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm mb-2">Закрепить преподавателя за группой*</label>
                <select
                  value={selectedTeacherId || ''}
                  onChange={(e) => setSelectedTeacherId(Number(e.target.value))}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.teacher ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                >
                  <option value="">Выбрать</option>
                  {mockTeachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.fullName}
                    </option>
                  ))}
                </select>
                {errors.teacher && <p className="text-red-500 text-xs mt-1">{errors.teacher}</p>}
              </div>

              <div>
                <label className="block text-sm mb-2">Найти ученика</label>
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Поиск"
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                {searchQuery.length > 0 && searchQuery.length < 3 && (
                  <p className="text-gray-500 text-xs mt-1">Введите минимум 3 символа</p>
                )}
                {filteredStudents.length > 0 && (
                  <div className="mt-2 border rounded-lg max-h-40 overflow-y-auto">
                    {filteredStudents.map((student) => (
                      <button
                        key={student.id}
                        onClick={() => addParticipant(student)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b last:border-b-0"
                      >
                        {student.fullName}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm mb-2">Участники группы</label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedParticipants
                    .sort((a, b) => a.fullName.localeCompare(b.fullName, 'ru'))
                    .map((participant) => (
                      <div
                        key={participant.id}
                        className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-lg"
                      >
                        <span className="text-sm">{participant.fullName}</span>
                        <button
                          onClick={() => removeParticipant(participant.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  {selectedParticipants.length === 0 && (
                    <div className="text-gray-400 text-sm italic px-4 py-2">Нет участников</div>
                  )}
                </div>
              </div>

              <button
                onClick={handleEditGroup}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg mt-4"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Group Modal */}
      {showDeleteModal && selectedGroup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Удалить группу</h2>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="text-gray-600 mb-6">
              Группа будет удалена навсегда. Вы точно хотите ее удалить?
            </p>

            <button
              onClick={handleDeleteGroup}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-lg"
            >
              Удалить
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
