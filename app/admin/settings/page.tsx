'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

interface Setting {
    id: string;
    key: string;
    value: string;
    description?: string;
    updatedAt: string;
}

const SETTING_TEMPLATES = [
    { key: 'HOTLINE', label: 'Hotline', type: 'text', placeholder: '0973.644.837' },
    { key: 'EMAIL', label: 'Email', type: 'email', placeholder: 'info@nowtrip.vn' },
    { key: 'SLOGAN', label: 'Slogan', type: 'text', placeholder: 'Go now. Be free' },
    { key: 'ADDRESS', label: 'Địa chỉ', type: 'text', placeholder: 'Hà Nội, Việt Nam' },
    { key: 'FACEBOOK', label: 'Facebook URL', type: 'url', placeholder: 'https://facebook.com/nowtrip' },
    { key: 'INSTAGRAM', label: 'Instagram URL', type: 'url', placeholder: 'https://instagram.com/nowtrip' },
    { key: 'CANCELLATION_POLICY', label: 'Chính sách hủy tour', type: 'textarea', placeholder: 'Nhập chính sách hủy tour...' },
    { key: 'SECURITY_REGULATIONS', label: 'Quy định an toàn', type: 'textarea', placeholder: 'Nhập quy định an toàn...' },
    { key: 'SMTP_HOST', label: 'SMTP Host', type: 'text', placeholder: 'smtp.gmail.com' },
    { key: 'SMTP_PORT', label: 'SMTP Port', type: 'number', placeholder: '587' },
    { key: 'SMTP_USER', label: 'SMTP User', type: 'email', placeholder: 'your-email@gmail.com' },
    { key: 'SMTP_PASSWORD', label: 'SMTP Password', type: 'password', placeholder: '••••••••' },
];

export default function SettingsPage() {
    const [settings, setSettings] = useState<Setting[]>([]);
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('basic');

    // Lấy danh sách cài đặt
    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/admin/settings');
            if (!res.ok) throw new Error('Lỗi tải cài đặt');
            const data = await res.json();
            setSettings(data);

            // Khởi tạo form data
            const initialData: Record<string, string> = {};
            data.forEach((setting: Setting) => {
                initialData[setting.key] = setting.value;
            });
            setFormData(initialData);
        } catch (error) {
            toast.error('Lỗi tải cài đặt');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (key: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleSave = async (key: string) => {
        setSaving(true);
        try {
            const template = SETTING_TEMPLATES.find(t => t.key === key);
            const res = await fetch('/api/admin/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    key,
                    value: formData[key],
                    description: template?.label
                })
            });

            if (!res.ok) throw new Error('Lỗi cập nhật');
            toast.success(`Cập nhật ${template?.label} thành công`);
            fetchSettings();
        } catch (error) {
            toast.error('Lỗi cập nhật cài đặt');
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    const basicSettings = SETTING_TEMPLATES.filter(t => ['HOTLINE', 'EMAIL', 'SLOGAN', 'ADDRESS', 'FACEBOOK', 'INSTAGRAM'].includes(t.key));
    const contentSettings = SETTING_TEMPLATES.filter(t => ['CANCELLATION_POLICY', 'SECURITY_REGULATIONS'].includes(t.key));
    const emailSettings = SETTING_TEMPLATES.filter(t => ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASSWORD'].includes(t.key));

    if (loading) {
        return (
            <div className="p-6 flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải cài đặt...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">⚙️ Cài đặt Hệ thống</h1>
                <p className="text-gray-600">Quản lý các thông tin cấu hình của NowTrip</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-gray-200 overflow-x-auto">
                <button
                    onClick={() => setActiveTab('basic')}
                    className={`px-4 py-3 font-medium whitespace-nowrap transition-colors ${activeTab === 'basic'
                        ? 'text-green-600 border-b-2 border-green-600'
                        : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    Thông tin cơ bản
                </button>
                <button
                    onClick={() => setActiveTab('content')}
                    className={`px-4 py-3 font-medium whitespace-nowrap transition-colors ${activeTab === 'content'
                        ? 'text-green-600 border-b-2 border-green-600'
                        : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    Nội dung dài
                </button>
                <button
                    onClick={() => setActiveTab('email')}
                    className={`px-4 py-3 font-medium whitespace-nowrap transition-colors ${activeTab === 'email'
                        ? 'text-green-600 border-b-2 border-green-600'
                        : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    Email SMTP
                </button>
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
                {activeTab === 'basic' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {basicSettings.map(template => (
                            <div key={template.key} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    {template.label}
                                </label>
                                <input
                                    type={template.type}
                                    value={formData[template.key] || ''}
                                    onChange={(e) => handleChange(template.key, e.target.value)}
                                    placeholder={template.placeholder}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 mb-3"
                                />
                                <button
                                    onClick={() => handleSave(template.key)}
                                    disabled={saving}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition disabled:opacity-50"
                                >
                                    {saving ? 'Đang lưu...' : 'Lưu'}
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'content' && (
                    <div className="space-y-6">
                        {contentSettings.map(template => (
                            <div key={template.key} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    {template.label}
                                </label>
                                <textarea
                                    value={formData[template.key] || ''}
                                    onChange={(e) => handleChange(template.key, e.target.value)}
                                    placeholder={template.placeholder}
                                    rows={6}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 mb-3 font-mono text-sm"
                                />
                                <button
                                    onClick={() => handleSave(template.key)}
                                    disabled={saving}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition disabled:opacity-50"
                                >
                                    {saving ? 'Đang lưu...' : 'Lưu'}
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'email' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {emailSettings.map(template => (
                            <div key={template.key} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    {template.label}
                                </label>
                                <input
                                    type={template.type}
                                    value={formData[template.key] || ''}
                                    onChange={(e) => handleChange(template.key, e.target.value)}
                                    placeholder={template.placeholder}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 mb-3"
                                />
                                <button
                                    onClick={() => handleSave(template.key)}
                                    disabled={saving}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition disabled:opacity-50"
                                >
                                    {saving ? 'Đang lưu...' : 'Lưu'}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Info Box */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                    💡 <strong>Lưu ý:</strong> Các thay đổi sẽ được áp dụng ngay lập tức trên toàn bộ hệ thống. Mật khẩu SMTP sẽ được mã hóa trước khi lưu.
                </p>
            </div>
        </div>
    );
}