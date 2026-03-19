'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

interface ActionHistory {
    id: string;
    action: string;
    entityType: string;
    entityId?: string;
    details?: string;
    createdAt: string;
    admin: {
        email: string;
        customerProfile?: {
            fullName: string;
        };
    };
}

const ACTION_TYPES = [
    { value: 'CREATE', label: '➕ Tạo mới', color: 'bg-green-100 text-green-800' },
    { value: 'UPDATE', label: '✏️ Cập nhật', color: 'bg-blue-100 text-blue-800' },
    { value: 'DELETE', label: '🗑️ Xóa', color: 'bg-red-100 text-red-800' },
    { value: 'PUBLISH', label: '📤 Xuất bản', color: 'bg-purple-100 text-purple-800' },
    { value: 'ARCHIVE', label: '📦 Lưu trữ', color: 'bg-gray-100 text-gray-800' },
];

const ENTITY_TYPES = [
    { value: 'TOUR', label: '⛰️ Tour' },
    { value: 'POST', label: '📝 Bài viết' },
    { value: 'BOOKING', label: '🎫 Đơn đặt' },
    { value: 'USER', label: '👤 Người dùng' },
    { value: 'SETTING', label: '⚙️ Cài đặt' },
];

export default function ActionHistoryPage() {
    const [history, setHistory] = useState<ActionHistory[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedAction, setSelectedAction] = useState('');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [limit] = useState(50);

    useEffect(() => {
        fetchHistory();
    }, [selectedAction, page]);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (selectedAction) params.append('action', selectedAction);
            params.append('page', page.toString());
            params.append('limit', limit.toString());

            const res = await fetch(`/api/admin/action-history?${params}`);
            if (!res.ok) throw new Error('Lỗi tải lịch sử');
            const data = await res.json();
            setHistory(data.data);
            setTotal(data.pagination.total);
        } catch (error) {
            toast.error('Lỗi tải lịch sử hành động');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getActionBadge = (action: string) => {
        const found = ACTION_TYPES.find(a => a.value === action);
        return found || { label: action, color: 'bg-gray-100 text-gray-800' };
    };

    const pages = Math.ceil(total / limit);

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">📋 Lịch sử hành động</h1>
                <p className="text-gray-600">Theo dõi tất cả các thay đổi được thực hiện bởi admin</p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 shadow-sm">
                <div className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Loại hành động</label>
                        <select
                            value={selectedAction}
                            onChange={(e) => {
                                setSelectedAction(e.target.value);
                                setPage(1);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            <option value="">Tất cả hành động</option>
                            {ACTION_TYPES.map(action => (
                                <option key={action.value} value={action.value}>{action.label}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        onClick={() => {
                            setSelectedAction('');
                            setPage(1);
                        }}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
                    >
                        🔄 Làm mới
                    </button>
                </div>
            </div>

            {/* History Table */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải lịch sử...</p>
                </div>
            ) : history.length === 0 ? (
                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                    <p className="text-gray-500 text-lg">Không có hành động nào</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {history.map(record => {
                        const actionBadge = getActionBadge(record.action);
                        return (
                            <div key={record.id} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${actionBadge.color}`}>
                                                {actionBadge.label}
                                            </span>
                                            <span className="inline-block px-3 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
                                                {ENTITY_TYPES.find(e => e.value === record.entityType)?.label || record.entityType}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-2">
                                            <strong>Admin:</strong> {record.admin.customerProfile?.fullName || record.admin.email}
                                        </p>
                                        {record.details && (
                                            <p className="text-sm text-gray-600 mb-2">
                                                <strong>Chi tiết:</strong> {record.details}
                                            </p>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-600">
                                            {new Date(record.createdAt).toLocaleString('vi-VN')}
                                        </p>
                                        {record.entityId && (
                                            <p className="text-xs text-gray-500 mt-1">ID: {record.entityId.slice(0, 8)}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Pagination */}
            {pages > 1 && (
                <div className="mt-8 flex justify-center gap-2">
                    <button
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        ← Trước
                    </button>
                    <div className="flex items-center gap-2">
                        {Array.from({ length: Math.min(5, pages) }, (_, i) => {
                            const pageNum = page > 3 ? page - 2 + i : i + 1;
                            if (pageNum > pages) return null;
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => setPage(pageNum)}
                                    className={`px-3 py-2 rounded-lg font-medium transition ${pageNum === page
                                        ? 'bg-green-600 text-white'
                                        : 'border border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                    </div>
                    <button
                        onClick={() => setPage(Math.min(pages, page + 1))}
                        disabled={page === pages}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        Sau →
                    </button>
                </div>
            )}

            {/* Info Box */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                    💡 <strong>Lưu ý:</strong> Lịch sử hành động giúp bạn theo dõi tất cả các thay đổi được thực hiện bởi các admin. Dữ liệu được lưu trữ trong 90 ngày.
                </p>
            </div>
        </div>
    );
}