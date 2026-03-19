'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EditTourPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();

    // 1. DÙNG HOOK use() CỦA REACT ĐỂ GIẢI MÃ PARAMS AN TOÀN TRÊN CLIENT
    const resolvedParams = use(params);
    const tourId = resolvedParams.id;

    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    // 2. STATES LƯU TRỮ DỮ LIỆU
    const [formData, setFormData] = useState({
        title: '', slug: '', image: '', price: '', duration: '',
        distance: '', difficulty: '', badge: '', description: '',
    });
    const [itinerary, setItinerary] = useState([{ day: '', content: '' }]);
    const [included, setIncluded] = useState(['']);
    const [excluded, setExcluded] = useState(['']);
    const [checklist, setChecklist] = useState(['']);

    // 3. FETCH DỮ LIỆU TỪ API NGAY KHI CÓ TOUR ID
    useEffect(() => {
        // Nếu chưa có tourId thì không làm gì cả
        if (!tourId) return;

        const fetchTourData = async () => {
            try {
                const res = await fetch(`/api/admin/tours/${tourId}`);
                if (res.ok) {
                    const data = await res.json();
                    // Đổ dữ liệu vào Form
                    setFormData({
                        title: data.title || '', slug: data.slug || '', image: data.image || '',
                        price: data.price || '', duration: data.duration || '', distance: data.distance || '',
                        difficulty: data.difficulty || '', badge: data.badge || '', description: data.description || ''
                    });

                    if (data.itinerary?.length > 0) setItinerary(data.itinerary);
                    if (data.included?.length > 0) setIncluded(data.included);
                    if (data.excluded?.length > 0) setExcluded(data.excluded);
                    if (data.checklist?.length > 0) setChecklist(data.checklist);
                } else {
                    alert('Không tìm thấy dữ liệu tour. Vui lòng kiểm tra lại!');
                }
            } catch (error) {
                console.error("Lỗi lấy dữ liệu:", error);
            } finally {
                setIsFetching(false);
            }
        };

        fetchTourData();
    }, [tourId]); // Cứ mỗi khi tourId sẵn sàng, nó sẽ gọi API

    // 4. CÁC HÀM XỬ LÝ SỰ KIỆN FORM ĐỘNG
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

    const generateSlug = (text: string) => {
        return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    };

    // 5. HÀM SUBMIT PATCH DỮ LIỆU
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch(`/api/admin/tours/${tourId}`, {
                method: 'PATCH',
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
                alert('✅ Đã cập nhật Tour thành công!');
                router.push('/admin/tours');
                router.refresh(); // Tải lại trang danh sách để cập nhật UI ngay
            } else {
                alert('❌ Có lỗi xảy ra khi cập nhật!');
            }
        } catch (error) {
            alert('Lỗi kết nối máy chủ!');
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) return <div className="p-10 font-bold text-blue-600 flex justify-center mt-20 text-xl animate-pulse">⏳ Đang lấy thông tin tour...</div>;

    return (
        <div className="p-6 sm:p-10 bg-gray-50 min-h-screen pb-24">
            <div className="flex items-center justify-between mb-8 max-w-5xl mx-auto">
                <h1 className="text-3xl font-extrabold text-blue-900 line-clamp-1">✏️ Sửa Tour: {formData.title}</h1>
                <Link href="/admin/tours">
                    <button className="text-gray-500 hover:text-gray-800 font-semibold border px-4 py-2 rounded-lg bg-white shadow-sm transition whitespace-nowrap ml-4">
                        Hủy & Quay lại
                    </button>
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-8">

                {/* KHỐI 1: THÔNG TIN CƠ BẢN */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-3">1. Thông tin cơ bản</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Tên Tour</label>
                            <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value, slug: generateSlug(e.target.value) })} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition" />
                        </div>

                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Mô tả ngắn</label>
                            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none h-24" />
                        </div>

                        <div className="col-span-1">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Đường dẫn (Slug)</label>
                            <input type="text" required value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 outline-none text-gray-500" />
                        </div>

                        <div className="col-span-1">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Link Ảnh Bìa</label>
                            <input type="text" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>

                        <div className="col-span-1 md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Giá Tour</label>
                                <input type="text" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Thời gian</label>
                                <input type="text" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} required className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Độ khó</label>
                                <input type="text" value={formData.difficulty} onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })} required className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Khoảng cách</label>
                                <input type="text" value={formData.distance} onChange={(e) => setFormData({ ...formData, distance: e.target.value })} required className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* KHỐI 2: LỊCH TRÌNH ĐỘNG (DẠNG ROWS) */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6 border-b pb-3">
                        <h2 className="text-xl font-bold text-gray-800">2. Lịch trình chi tiết</h2>
                        <button type="button" onClick={handleAddItinerary} className="text-sm bg-blue-100 text-blue-700 font-bold px-4 py-2 rounded-lg hover:bg-blue-200 transition">
                            + Thêm Ngày
                        </button>
                    </div>
                    <div className="space-y-4">
                        {itinerary.map((item, index) => (
                            <div key={index} className="flex flex-col md:flex-row gap-4 items-start bg-gray-50 p-5 rounded-xl border border-gray-200 relative group">
                                <button type="button" onClick={() => handleRemoveItinerary(index)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 font-bold text-xl transition">✕</button>
                                <div className="w-full md:w-1/4">
                                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Tiêu đề</label>
                                    <input type="text" value={item.day} onChange={(e) => handleItineraryChange(index, 'day', e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-300 font-bold focus:ring-2 focus:ring-blue-500 outline-none" placeholder="VD: Ngày 1" />
                                </div>
                                <div className="w-full md:w-3/4">
                                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Nội dung chi tiết</label>
                                    <textarea value={item.content} onChange={(e) => handleItineraryChange(index, 'content', e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-300 h-24 text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none pr-10" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* KHỐI 3: DỊCH VỤ VÀ CHECKLIST */}
                <div className="space-y-8">
                    {/* Đã bao gồm */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-green-100">
                        <div className="flex justify-between items-center mb-4 border-b pb-3 border-green-50">
                            <h2 className="text-lg font-bold text-green-700">✔️ Dịch vụ Đã bao gồm</h2>
                            <button type="button" onClick={() => handleAddArrayItem(setIncluded, included)} className="text-sm bg-green-50 text-green-600 font-bold px-4 py-2 rounded-lg hover:bg-green-100 transition">+ Thêm Dòng</button>
                        </div>
                        <div className="space-y-3">
                            {included.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <span className="text-green-500 font-bold">●</span>
                                    <input type="text" value={item} onChange={(e) => handleArrayChange(setIncluded, included, idx, e.target.value)} className="flex-1 px-4 py-3 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-green-500 outline-none" />
                                    <button type="button" onClick={() => handleRemoveArrayItem(setIncluded, included, idx)} className="text-gray-400 hover:text-red-500 font-bold px-2 text-lg">✕</button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Chưa bao gồm */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-red-100">
                        <div className="flex justify-between items-center mb-4 border-b pb-3 border-red-50">
                            <h2 className="text-lg font-bold text-red-700">➖ Dịch vụ Chưa bao gồm</h2>
                            <button type="button" onClick={() => handleAddArrayItem(setExcluded, excluded)} className="text-sm bg-red-50 text-red-600 font-bold px-4 py-2 rounded-lg hover:bg-red-100 transition">+ Thêm Dòng</button>
                        </div>
                        <div className="space-y-3">
                            {excluded.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <span className="text-red-400 font-bold">●</span>
                                    <input type="text" value={item} onChange={(e) => handleArrayChange(setExcluded, excluded, idx, e.target.value)} className="flex-1 px-4 py-3 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-red-500 outline-none" />
                                    <button type="button" onClick={() => handleRemoveArrayItem(setExcluded, excluded, idx)} className="text-gray-400 hover:text-red-500 font-bold px-2 text-lg">✕</button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Checklist */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-orange-100">
                        <div className="flex justify-between items-center mb-4 border-b pb-3 border-orange-50">
                            <h2 className="text-lg font-bold text-orange-600">🎒 Cần chuẩn bị (Checklist)</h2>
                            <button type="button" onClick={() => handleAddArrayItem(setChecklist, checklist)} className="text-sm bg-orange-50 text-orange-600 font-bold px-4 py-2 rounded-lg hover:bg-orange-100 transition">+ Thêm Vật Dụng</button>
                        </div>
                        <div className="space-y-3">
                            {checklist.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <span className="text-orange-400 font-bold">👉</span>
                                    <input type="text" value={item} onChange={(e) => handleArrayChange(setChecklist, checklist, idx, e.target.value)} className="flex-1 px-4 py-3 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-orange-500 outline-none" />
                                    <button type="button" onClick={() => handleRemoveArrayItem(setChecklist, checklist, idx)} className="text-gray-400 hover:text-red-500 font-bold px-2 text-lg">✕</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* NÚT LƯU CỐ ĐỊNH Ở ĐÁY MÀN HÌNH */}
                <div className="fixed bottom-0 left-0 right-0 md:left-64 bg-white/90 backdrop-blur border-t p-4 flex justify-end z-40 shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.05)]">
                    <button type="submit" disabled={isLoading} className={`bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold text-lg shadow-lg transition transform hover:-translate-y-1 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        {isLoading ? 'Đang cập nhật...' : '💾 LƯU THAY ĐỔI'}
                    </button>
                </div>

            </form>
        </div>
    );
}