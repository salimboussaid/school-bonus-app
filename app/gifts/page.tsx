'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

// Types
interface Gift {
  id: number
  name: string
  price: number
  stock: number
  images: string[]
  category: string
}

// Mock data
const mockGifts: Gift[] = [
  {
    id: 1,
    name: 'Фирменая худи с логотипом вуза',
    price: 100,
    stock: 5,
    images: ['/gifts/a.jpg', '/gifts/aa.jpg', '/gifts/aaa.jpg', '/gifts/a.jpg'],
    category: 'Фирменая худи с логотипом вуза',
  },
  {
    id: 2,
    name: 'Фирменая худи с логотипом вуза',
    price: 100,
    stock: 3,
    images: ['/gifts/a.jpg', '/gifts/aa.jpg', '/gifts/aaa.jpg', '/gifts/a.jpg'],
    category: 'Фирменая худи с логотипом вуза',
  },
  {
    id: 3,
    name: 'Фирменая худи с логотипом вуза',
    price: 100,
    stock: 8,
    images: ['/gifts/a.jpg', '/gifts/aa.jpg', '/gifts/aaa.jpg', '/gifts/a.jpg'],
    category: 'Фирменая худи с логотипом вуза',
  },
  {
    id: 4,
    name: 'Ручка',
    price: 25,
    stock: 15,
    images: ['/gifts/a.jpg'],
    category: 'Ручка',
  },
  {
    id: 5,
    name: 'Футболка',
    price: 50,
    stock: 20,
    images: ['/gifts/aa.jpg'],
    category: 'Футболка',
  },
]

export default function GiftsPage() {
  const router = useRouter()
  const [gifts, setGifts] = useState<Gift[]>(mockGifts)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(mockGifts[0]?.category || null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null)

  // Form states
  const [giftName, setGiftName] = useState('')
  const [giftPrice, setGiftPrice] = useState('')
  const [giftStock, setGiftStock] = useState('')
  const [giftImages, setGiftImages] = useState<string[]>([])
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  // Get unique categories
  const categories = Array.from(new Set(gifts.map((g) => g.category)))

  // Filter gifts by category
  const filteredGifts = selectedCategory
    ? gifts.filter((g) => g.category === selectedCategory)
    : gifts

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const validExtensions = ['image/jpeg', 'image/png', 'image/heic', 'image/heif', 'image/webp']
    const newImages: string[] = []

    Array.from(files).forEach((file) => {
      if (!validExtensions.includes(file.type)) {
        setErrors({ ...errors, images: 'Разрешены только JPEG, PNG, HEIC, HEIF, WebP' })
        return
      }

      if (giftImages.length + newImages.length >= 8) {
        setErrors({ ...errors, images: 'Максимум 8 изображений' })
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        newImages.push(reader.result as string)
        if (newImages.length === Math.min(files.length, 8 - giftImages.length)) {
          setGiftImages([...giftImages, ...newImages])
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setGiftImages(giftImages.filter((_, i) => i !== index))
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!giftName.trim()) {
      newErrors.name = 'Название обязательно'
    }

    const price = parseInt(giftPrice)
    if (!giftPrice || isNaN(price) || price < 1 || price > 9999) {
      newErrors.price = 'Цена должна быть от 1 до 9999'
    }

    const stock = parseInt(giftStock)
    if (!giftStock || isNaN(stock) || stock < 1 || stock > 999) {
      newErrors.stock = 'Количество должно быть от 1 до 999'
    }

    if (giftImages.length === 0) {
      newErrors.images = 'Загрузите хотя бы одно изображение'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCreateGift = () => {
    if (!validateForm()) return

    const newGift: Gift = {
      id: gifts.length + 1,
      name: giftName,
      price: parseInt(giftPrice),
      stock: parseInt(giftStock),
      images: giftImages,
      category: giftName,
    }

    setGifts([...gifts, newGift])
    setShowCreateModal(false)
    resetForm()
  }

  const handleEditGift = () => {
    if (!selectedGift || !validateForm()) return

    const updatedGifts = gifts.map((g) =>
      g.id === selectedGift.id
        ? {
            ...g,
            name: giftName,
            price: parseInt(giftPrice),
            stock: parseInt(giftStock),
            images: giftImages,
            category: giftName,
          }
        : g
    )

    setGifts(updatedGifts)
    setShowEditModal(false)
    resetForm()
  }

  const handleDeleteGift = () => {
    if (!selectedGift) return
    setGifts(gifts.filter((g) => g.id !== selectedGift.id))
    setShowDeleteModal(false)
    setSelectedGift(null)
  }

  const resetForm = () => {
    setGiftName('')
    setGiftPrice('')
    setGiftStock('')
    setGiftImages([])
    setErrors({})
  }

  const openCreateModal = () => {
    resetForm()
    setShowCreateModal(true)
  }

  const openEditModal = (gift: Gift) => {
    setSelectedGift(gift)
    setGiftName(gift.name)
    setGiftPrice(gift.price.toString())
    setGiftStock(gift.stock.toString())
    setGiftImages([...gift.images])
    setErrors({})
    setShowEditModal(true)
  }

  const openDeleteModal = (gift: Gift) => {
    setSelectedGift(gift)
    setShowDeleteModal(true)
  }

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

          <button
            onClick={() => router.push('/groups')}
            className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24" />
            </svg>
            <span>Группы</span>
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 text-left bg-[#132440]/10 text-[#132440] font-medium rounded-xl border-l-4 border-[#132440]">
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
            <h1 className="text-3xl font-bold text-gray-800">Подарки</h1>
            <button
              onClick={openCreateModal}
              className="bg-[#132440] text-white px-6 py-3 rounded-xl hover:bg-[#0d1a2e] transition-colors flex items-center gap-2 shadow-sm"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" />
              </svg>
              <span className="font-medium">Создать подарок</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-10">
          {/* Categories Filter */}
          <div className="mb-8">
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-5 py-2.5 rounded-xl font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-[#132440] text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Gifts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGifts.map((gift) => (
              <div key={gift.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow relative">
                <div className="relative">
                  {/* Main Image */}
                  <div className="aspect-square bg-gray-100 overflow-hidden">
                    {gift.images[0] ? (
                      <Image
                        src={gift.images[0]}
                        alt={gift.name}
                        width={400}
                        height={400}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">Нет фото</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Action buttons on image */}
                  <div className="absolute top-3 right-3 flex gap-2">
                    <button
                      onClick={() => openEditModal(gift)}
                      className="p-2.5 bg-white rounded-lg shadow-md hover:bg-gray-50 border border-gray-200"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => openDeleteModal(gift)}
                      className="p-2.5 bg-white rounded-lg shadow-md hover:bg-gray-50 text-red-600 border border-gray-200"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </div>

                  {/* Thumbnail row */}
                  {gift.images.length > 1 && (
                    <div className="absolute bottom-3 left-3 right-3 flex gap-2">
                      {gift.images.slice(0, 4).map((img, idx) => (
                        <div key={idx} className="w-14 h-14 bg-white rounded-lg flex-shrink-0 overflow-hidden shadow-md border border-gray-200">
                          <Image
                            src={img}
                            alt={`${gift.name} ${idx + 1}`}
                            width={56}
                            height={56}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Gift info */}
                <div className="p-4">
                  <h3 className="font-semibold mb-3 text-base">{gift.name}</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Цена:</span> {gift.price} алгокоинов
                    </div>
                    <div>
                      <span className="font-medium">Кол-во в наличии:</span> {gift.stock}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Create Gift Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4 my-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Создать подарок</h2>
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
                <label className="block text-sm mb-2">Загрузите фото подарка*</label>
                <div className="grid grid-cols-4 gap-2">
                  {giftImages.map((img, idx) => (
                    <div key={idx} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={img}
                        alt={`Gift ${idx + 1}`}
                        width={100}
                        height={100}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {giftImages.length < 8 && (
                    <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50">
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.heic,.heif,.webp"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path d="M21 15l-5-5L5 21" />
                      </svg>
                    </label>
                  )}
                </div>
                {errors.images && <p className="text-red-500 text-xs mt-1">{errors.images}</p>}
                <p className="text-xs text-gray-500 mt-1">JPEG, PNG, HEIC, HEIF, WebP. Максимум 8 фото.</p>
              </div>

              <div>
                <label className="block text-sm mb-2">Название подарка*</label>
                <input
                  type="text"
                  value={giftName}
                  onChange={(e) => setGiftName(e.target.value)}
                  placeholder="Название"
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2">Цена*</label>
                  <input
                    type="number"
                    min="1"
                    max="9999"
                    value={giftPrice}
                    onChange={(e) => setGiftPrice(e.target.value)}
                    placeholder="Кол-во алгокоинов"
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.price ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                  {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                  <p className="text-xs text-gray-500 mt-1">От 1 до 9999</p>
                </div>

                <div>
                  <label className="block text-sm mb-2">Наличие*</label>
                  <input
                    type="number"
                    min="1"
                    max="999"
                    value={giftStock}
                    onChange={(e) => setGiftStock(e.target.value)}
                    placeholder="Кол-во в наличии"
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.stock ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                  {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
                  <p className="text-xs text-gray-500 mt-1">От 1 до 999</p>
                </div>
              </div>

              <button
                onClick={handleCreateGift}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg mt-4"
              >
                Создать
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Gift Modal */}
      {showEditModal && selectedGift && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4 my-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Редактировать подарок</h2>
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
                <label className="block text-sm mb-2">Загрузите фото подарка*</label>
                <div className="grid grid-cols-4 gap-2">
                  {giftImages.map((img, idx) => (
                    <div key={idx} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={img}
                        alt={`Gift ${idx + 1}`}
                        width={100}
                        height={100}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {giftImages.length < 8 && (
                    <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50">
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.heic,.heif,.webp"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path d="M21 15l-5-5L5 21" />
                      </svg>
                    </label>
                  )}
                </div>
                {errors.images && <p className="text-red-500 text-xs mt-1">{errors.images}</p>}
                <p className="text-xs text-gray-500 mt-1">JPEG, PNG, HEIC, HEIF, WebP. Максимум 8 фото.</p>
              </div>

              <div>
                <label className="block text-sm mb-2">Название подарка*</label>
                <input
                  type="text"
                  value={giftName}
                  onChange={(e) => setGiftName(e.target.value)}
                  placeholder="Название"
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2">Цена*</label>
                  <input
                    type="number"
                    min="1"
                    max="9999"
                    value={giftPrice}
                    onChange={(e) => setGiftPrice(e.target.value)}
                    placeholder="Кол-во алгокоинов"
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.price ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                  {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                  <p className="text-xs text-gray-500 mt-1">От 1 до 9999</p>
                </div>

                <div>
                  <label className="block text-sm mb-2">Наличие*</label>
                  <input
                    type="number"
                    min="1"
                    max="999"
                    value={giftStock}
                    onChange={(e) => setGiftStock(e.target.value)}
                    placeholder="Кол-во в наличии"
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.stock ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                  {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
                  <p className="text-xs text-gray-500 mt-1">От 1 до 999</p>
                </div>
              </div>

              <button
                onClick={handleEditGift}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg mt-4"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Gift Modal */}
      {showDeleteModal && selectedGift && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Удалить подарок</h2>
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setSelectedGift(null)
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="text-gray-600 mb-6">
              Подарок будет удален навсегда. Вы точно хотите его удалить?
            </p>

            <button
              onClick={handleDeleteGift}
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
