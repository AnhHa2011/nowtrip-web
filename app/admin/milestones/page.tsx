'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

interface Milestone {
    id: string;
    year: number;
    title: string;
    description?: string;
    icon?: string;
    createdAt: string;
}

export default function MilestonesPage() {
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        year: new Date().getFullYear(),
        title: '',
        description: '',
        icon: '🎯'
    });

    useEffect(() => {
        fetchMilestones();
    }, []);

    const fetchMilestones = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/admin/milestones');
            if (!res.ok) throw new Error('Lỗi tải mốc thời gian');
            const data = await res.json();
            setMilestones(data);
        } catch (error) {
            toast.error('Lỗi tải mốc thời gian');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.year) {
            toast.error('Vui lòng điền tất cả các trường bắt buộc');
            return;
        }

        try {
            const method = editingId ? 'PUT' : 'POST';
            const body = editingId ? { id: editingId, ...formData } : formData;

            const res = await fetch('/api/admin/milestones', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (!res.ok) throw new Error('Lỗi lưu');
            toast.success(editingId ? 'Cập nhật thành công' : 'Tạo thành công');
            fetchMilestones();
            handleCancel();
        } catch (error) {
            toast.error('Lỗi lưu mốc thời gian');
            console.error(error);
        }
    };

    const handleEdit = (milestone: Milestone) => {
        setEditingId(milestone.id);
        setFormData({
            year: milestone.year,
            title: milestone.title,
            description: milestone.description || '',
            icon: milestone.icon || '🎯'
        });
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc chắn muốn xóa mốc thời gian này?')) return;

        try {
            const res = await fetch(`/api/admin/milestones?id=${id}`, {
                method: 'DELETE'
            });

            if (!res.ok) throw new Error('Lỗi xóa');
            toast.success('Xóa thành công');
            fetchMilestones();
        } catch (error) {
            toast.error('Lỗi xóa mốc thời gian');
            console.error(error);
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingId(null);
        setFormData({
            year: new Date().getFullYear(),
            title: '',
            description: '',
            icon: '🎯'
        });
    };

    const sortedMilestones = [...milestones].sort((a, b) => b.year - a.year);

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">📅 Mốc thời gian công ty</h1>
                    <p className="text-gray-600">Quản lý lịch sử phát triển của NowTrip</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition shadow-md"
                >
                    {showForm ? '✕ Đóng' : '➕ Thêm mốc thời gian'}
                </button>
            </div>

            {/* Form */}
            {showForm && (
                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">
                        {editingId ? 'Chỉnh sửa mốc thời gian' : 'Tạo mốc thời gian mới'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Năm *</label>
                                <input
                                    type="number"
                                    value={formData.year}
                                    onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Biểu tượng</label>
                                <input
                                    type="text"
                                    value={formData.icon}
                                    onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                                    maxLength={2}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-center text-2xl"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Tiêu đề *</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="Nhập tiêu đề mốc thời gian"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Mô tả</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Nhập mô tả chi tiết"
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="submit"
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg transition"
                            >
                                💾 Lưu
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 rounded-lg transition"
                            >
                                Hủy
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Timeline */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải mốc thời gian...</p>
                </div>
            ) : sortedMilestones.length === 0 ? (
                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                    <p className="text-gray-500 text-lg">Chưa có mốc thời gian nào</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {sortedMilestones.map((milestone, index) => (
                        <div key={milestone.id} className="flex gap-6">
                            {/* Timeline Line */}
                            <div className="flex flex-col items-center">
                                <div className="text-4xl mb-2">{milestone.icon}</div>
                                {index < sortedMilestones.length - 1 && (
                                    <div className="w-1 h-20 bg-gradient-to-b from-green-400 to-green-200"></div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
                                <div className="flex justify-between items-start gap-4">
                                    <div>
                                        <h3 className="text-2xl font-black text-gray-900 mb-2">{milestone.year}</h3>
                                        <h4 className="text-lg font-bold text-green-600 mb-2">{milestone.title}</h4>
                                        {milestone.description && (
                                            <p className="text-gray-600 leading-relaxed">{milestone.description}</p>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(milestone)}
                                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition"
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            onClick={() => handleDelete(milestone.id)}
                                            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded transition"
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}