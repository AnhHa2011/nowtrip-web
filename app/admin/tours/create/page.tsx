'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreateTourPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // 1. STATE LƯU TRỮ THÔNG TIN CƠ BẢN
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        image: '',
        price: '',
        duration: '',
        distance: '',
        difficulty: '',
        badge: '',
        description: '',
    });

    // 2. STATE LƯU TRỮ DỮ LIỆU ĐỘNG (JSON ARRAYS)
    const [itinerary, setItinerary] = useState([{ day: '', content: '' }]);
    const [included, setIncluded] = useState(['']);
    const [excluded, setExcluded] = useState(['']);
    const [checklist, setChecklist] = useState(['']);

    // --- HÀM XỬ LÝ DỮ LIỆU ĐỘNG ---
    const handleAddItinerary = () => setItinerary([...itinerary, { day: '', content: '' }]);
    const handleRemoveItinerary = (index: number) => setItinerary(itinerary.filter((_, i) => i !== index));
    const handleItineraryChange = (index: number, field: 'day' | 'content', value: string) => {
        const newItinerary = [...itinerary];
        newItinerary[index][field] = value;
        setItinerary(newItinerary);
    };

    const handleArrayChange = (setter: any, array: string[], index: number, value: string) => {
        const newArray = [...array];
        newArray[index] = value;
        setter(newArray);
    };
    const handleAddArrayItem = (setter: any, array: string[]) => setter([...array, '']);
    const handleRemoveArrayItem = (setter: any, array: string[], index: number) => {
        setter(array.filter((_: any, i: number) => i !== index));
    };

    // 3. HÀM TẠO SLUG TỰ ĐỘNG TỪ TIÊU ĐỀ (Ví dụ: "Tà Năng" -> "ta-nang")
    const generateSlug = (text: string) => {
        return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    };

    // 4. HÀM SUBMIT GỬI DỮ LIỆU LÊN API
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch('/api/admin/tours', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    itinerary,
                    included: included.filter(item => item.trim() !== ''),
                    excluded: excluded.filter(item => item.trim() !== ''),
                    checklist: checklist.filter(item => item.trim() !== ''),
                }),
            });

            if (res.ok) {
                alert('Đã thêm Tour mới thành công!');
                router.push('/admin/tours');
            } else {
                alert('Có lỗi xảy ra khi lưu Tour!');
            }
        } catch (error) {
            console.error(error);
            alert('Lỗi kết nối máy chủ!');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 sm:p-10 bg-gray-50 min-h-screen">
            <div className="flex items-center justify-between mb-8 max-w-5xl mx-auto">
                <h1 className="text-3xl font-extrabold text-gray-900">Thêm Tour Mới</h1>
                <Link href="/admin/tours">
                    <button className="text-gray-500 hover:text-gray-800 font-semibold border px-4 py-2 rounded-lg bg-white shadow-sm transition">
                        Quay lại
                    </button>
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-8">

                {/* KHỐI 1: THÔNG TIN CƠ BẢN */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-3">1. Thông tin cơ bản</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Tên Tour</label>
                            <input
                                type="text" required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value, slug: generateSlug(e.target.value) })}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none transition"
                                placeholder="VD: Tour Trekking Tà Năng - Phan Dũng"
                            />
                        </div>

                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Đường dẫn (Slug)</label>
                            <input
                                type="text" required
                                value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 outline-none text-gray-500"
                            />
                        </div>

                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Link Ảnh Bìa</label>
                            <input
                                type="text"
                                value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
                                placeholder="https://..."
                            />
                        </div>

                        {/* Các thông số */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Giá Tour</label>
                            <input type="text" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none" placeholder="VD: 2.800.000đ/khách" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Thời gian</label>
                            <input type="text" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} required className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none" placeholder="VD: 2 ngày 1 đêm" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Độ khó</label>
                            <input type="text" value={formData.difficulty} onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })} required className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none" placeholder="VD: 3/10" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Tổng quãng đường</label>
                            <input type="text" value={formData.distance} onChange={(e) => setFormData({ ...formData, distance: e.target.value })} required className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none" placeholder="VD: 30km (Trekking 25km...)" />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Mô tả ngắn</label>
                            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none h-24" placeholder="Cung đường trekking đẹp nhất Việt Nam..." />
                        </div>
                    </div>
                </div>

                {/* KHỐI 2: LỊCH TRÌNH ĐỘNG */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6 border-b pb-3">
                        <h2 className="text-xl font-bold text-gray-800">2. Lịch trình chi tiết</h2>
                        <button type="button" onClick={handleAddItinerary} className="text-sm bg-green-100 text-green-700 font-bold px-3 py-1.5 rounded-lg hover:bg-green-200">+ Thêm Ngày</button>
                    </div>

                    <div className="space-y-6">
                        {itinerary.map((item, index) => (
                            <div key={index} className="flex gap-4 items-start bg-gray-50 p-4 rounded-xl border border-gray-200 relative">
                                <button type="button" onClick={() => handleRemoveItinerary(index)} className="absolute -top-3 -right-3 bg-red-100 text-red-600 rounded-full w-8 h-8 flex items-center justify-center font-bold hover:bg-red-500 hover:text-white transition">X</button>
                                <div className="w-1/4">
                                    <input type="text" value={item.day} onChange={(e) => handleItineraryChange(index, 'day', e.target.value)} placeholder="VD: Ngày 1 (14km)" className="w-full px-3 py-2 rounded border border-gray-300 font-bold" />
                                </div>
                                <div className="w-3/4">
                                    <textarea value={item.content} onChange={(e) => handleItineraryChange(index, 'content', e.target.value)} placeholder="Nhập nội dung lịch trình (Có thể dùng mã HTML <ul><li>...)" className="w-full px-3 py-2 rounded border border-gray-300 h-24 text-sm font-mono" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* KHỐI 3: DỊCH VỤ VÀ CHECKLIST */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Bao gồm */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold text-green-700 mb-4 flex justify-between">✔️ Đã bao gồm <button type="button" onClick={() => handleAddArrayItem(setIncluded, included)} className="text-xl">+</button></h2>
                        {included.map((item, idx) => (
                            <div key={idx} className="flex gap-2 mb-2">
                                <input type="text" value={item} onChange={(e) => handleArrayChange(setIncluded, included, idx, e.target.value)} className="w-full px-3 py-2 rounded border border-gray-300 text-sm" placeholder="VD: Xe giường nằm" />
                                <button type="button" onClick={() => handleRemoveArrayItem(setIncluded, included, idx)} className="text-red-500 font-bold px-2">X</button>
                            </div>
                        ))}
                    </div>

                    {/* Chưa bao gồm */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold text-red-700 mb-4 flex justify-between">➖ Chưa bao gồm <button type="button" onClick={() => handleAddArrayItem(setExcluded, excluded)} className="text-xl">+</button></h2>
                        {excluded.map((item, idx) => (
                            <div key={idx} className="flex gap-2 mb-2">
                                <input type="text" value={item} onChange={(e) => handleArrayChange(setExcluded, excluded, idx, e.target.value)} className="w-full px-3 py-2 rounded border border-gray-300 text-sm" placeholder="VD: VAT 8%" />
                                <button type="button" onClick={() => handleRemoveArrayItem(setExcluded, excluded, idx)} className="text-red-500 font-bold px-2">X</button>
                            </div>
                        ))}
                    </div>

                    {/* Checklist */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold text-orange-600 mb-4 flex justify-between">🎒 Cần chuẩn bị <button type="button" onClick={() => handleAddArrayItem(setChecklist, checklist)} className="text-xl">+</button></h2>
                        {checklist.map((item, idx) => (
                            <div key={idx} className="flex gap-2 mb-2">
                                <input type="text" value={item} onChange={(e) => handleArrayChange(setChecklist, checklist, idx, e.target.value)} className="w-full px-3 py-2 rounded border border-gray-300 text-sm" placeholder="VD: Dép tổ ong" />
                                <button type="button" onClick={() => handleRemoveArrayItem(setChecklist, checklist, idx)} className="text-red-500 font-bold px-2">X</button>
                            </div>
                        ))}
                    </div>

                </div>

                {/* NÚT LƯU */}
                <div className="sticky bottom-4 flex justify-end">
                    <button type="submit" disabled={isLoading} className={`bg-gray-900 hover:bg-black text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl transition transform hover:-translate-y-1 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        {isLoading ? 'Đang lưu dữ liệu...' : '💾 LƯU TOUR MỚI'}
                    </button>
                </div>

            </form>
        </div>
    );
}
