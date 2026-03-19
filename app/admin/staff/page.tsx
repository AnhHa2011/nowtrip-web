'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

interface StaffProfile {
    id: string;
    fullName: string;
    position: string;
    department: string;
    phone?: string;
    address?: string;
    isActive: boolean;
    createdAt: string;
    user: {
        id: string;
        email: string;
        phone?: string;
        isActive: boolean;
    };
}

const DEPARTMENTS = [
    { value: 'SALES', label: '💼 Bán hàng' },
    { value: 'GUIDE', label: '🥾 Hướng dẫn viên' },
    { value: 'OPERATIONS', label: '⚙️ Vận hành' },
    { value: 'CUSTOMER_SERVICE', label: '📞 Chăm sóc khách hàng' },
    { value: 'FINANCE', label: '💰 Tài chính' },
    { value: 'MARKETING', label: '📢 Marketing' },
];

export default function StaffPage() {
    const [staff, setStaff] = useState<StaffProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<StaffProfile>>({});

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/admin/staff');
            if (!res.ok) throw new Error('Lỗi tải danh sách nhân viên');
            const data = await res.json();
            setStaff(data);
        } catch (error) {
            toast.error('Lỗi tải danh sách nhân viên');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (staffMember: StaffProfile) => {
        setEditingId(staffMember.id);
        setFormData(staffMember);
    };

    const handleSave = async () => {
        if (!editingId) return;

        try {
            const res = await fetch('/api/admin/staff', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: editingId,
                    ...formData
                })
            });

            if (!res.ok) throw new Error('Lỗi cập nhật');
            toast.success('Cập nhật thông tin nhân viên thành công');
            fetchStaff();
            setEditingId(null);
        } catch (error) {
            toast.error('Lỗi cập nhật nhân viên');
            console.error(error);
        }
    };

    const handleCancel = () => {
        setEditingId(null);
        setFormData({});
    };

    const toggleActive = async (staffMember: StaffProfile) => {
        try {
            const res = await fetch('/api/admin/staff', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: staffMember.id,
                    isActive: !staffMember.isActive
                })
            });

            if (!res.ok) throw new Error('Lỗi cập nhật');
            toast.success(staffMember.isActive ? 'Vô hiệu hóa nhân viên' : 'Kích hoạt nhân viên');
            fetchStaff();
        } catch (error) {
            toast.error('Lỗi cập nhật trạng thái');
            console.error(error);
        }
    };

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">👥 Quản lý nhân viên</h1>
                    <p className="text-gray-600">Tổng cộng: <span className="font-bold text-green-600">{staff.length}</span> nhân viên</p>
                </div>
                <Link
                    href="/admin/staff/create"
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition shadow-md"
                >
                    ➕ Thêm nhân viên
                </Link>
            </div>

            {/* Staff Table */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải danh sách...</p>
                </div>
            ) : staff.length === 0 ? (
                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                    <p className="text-gray-500 text-lg">Không có nhân viên nào</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Tên</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Vị trí</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Phòng ban</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Trạng thái</th>
                                    <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {staff.map(staffMember => (
                                    <tr key={staffMember.id} className="hover:bg-gray-50 transition">
                                        {editingId === staffMember.id ? (
                                            <>
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="text"
                                                        value={formData.fullName || ''}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                                                        className="w-full px-2 py-1 border border-gray-300 rounded"
                                                    />
                                                </td>
                                                <td className="px-6 py-4 text-gray-600">{staffMember.user.email}</td>
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="text"
                                                        value={formData.position || ''}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                                                        className="w-full px-2 py-1 border border-gray-300 rounded"
                                                    />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <select
                                                        value={formData.department || ''}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                                                        className="w-full px-2 py-1 border border-gray-300 rounded"
                                                    >
                                                        {DEPARTMENTS.map(dept => (
                                                            <option key={dept.value} value={dept.value}>{dept.label}</option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={formData.isActive || false}
                                                            onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                                                            className="w-4 h-4"
                                                        />
                                                        <span className="text-sm">{formData.isActive ? 'Hoạt động' : 'Vô hiệu'}</span>
                                                    </label>
                                                </td>
                                                <td className="px-6 py-4 text-center space-x-2">
                                                    <button
                                                        onClick={handleSave}
                                                        className="inline-block px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded transition"
                                                    >
                                                        Lưu
                                                    </button>
                                                    <button
                                                        onClick={handleCancel}
                                                        className="inline-block px-3 py-1 bg-gray-400 hover:bg-gray-500 text-white text-xs font-medium rounded transition"
                                                    >
                                                        Hủy
                                                    </button>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className="px-6 py-4 font-medium text-gray-900">{staffMember.fullName}</td>
                                                <td className="px-6 py-4 text-gray-600">{staffMember.user.email}</td>
                                                <td className="px-6 py-4 text-gray-600">{staffMember.position}</td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                                        {DEPARTMENTS.find(d => d.value === staffMember.department)?.label || staffMember.department}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => toggleActive(staffMember)}
                                                        className={`px-3 py-1 rounded-full text-xs font-medium transition ${staffMember.isActive
                                                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                                            }`}
                                                    >
                                                        {staffMember.isActive ? '✓ Hoạt động' : '✕ Vô hiệu'}
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <button
                                                        onClick={() => handleEdit(staffMember)}
                                                        className="inline-block px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition"
                                                    >
                                                        Sửa
                                                    </button>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}