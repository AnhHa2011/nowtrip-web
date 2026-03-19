'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

interface Post {
    id: string;
    title: string;
    slug: string;
    category: string;
    thumbnail?: string;
    views: number;
    isActive: boolean;
    createdAt: string;
}

const CATEGORIES = [
    { value: 'TREKKING_EXPERIENCES', label: '🥾 Kinh nghiệm Trekking' },
    { value: 'NEWS', label: '📰 Tin tức' },
    { value: 'ABOUT_US', label: '🏢 Về chúng tôi' }
];

export default function PostsPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [deleteId, setDeleteId] = useState<string | null>(null);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (selectedCategory) params.append('category', selectedCategory);
            if (searchTerm) params.append('search', searchTerm);

            const res = await fetch(`/api/admin/posts?${params}`);
            if (!res.ok) throw new Error('Lỗi tải bài viết');
            const data = await res.json();
            setPosts(data);
        } catch (error) {
            toast.error('Lỗi tải danh sách bài viết');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/admin/posts?id=${id}`, {
                method: 'DELETE'
            });

            if (!res.ok) throw new Error('Lỗi xóa bài viết');
            toast.success('Xóa bài viết thành công');
            fetchPosts();
            setDeleteId(null);
        } catch (error) {
            toast.error('Lỗi xóa bài viết');
            console.error(error);
        }
    };

    const toggleActive = async (id: string, currentStatus: boolean) => {
        try {
            const res = await fetch('/api/admin/posts', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, isActive: !currentStatus })
            });

            if (!res.ok) throw new Error('Lỗi cập nhật');
            toast.success(currentStatus ? 'Ẩn bài viết thành công' : 'Hiển thị bài viết thành công');
            fetchPosts();
        } catch (error) {
            toast.error('Lỗi cập nhật bài viết');
            console.error(error);
        }
    };

    const filteredPosts = posts.filter(post =>
        (selectedCategory === '' || post.category === selectedCategory) &&
        (searchTerm === '' || post.title.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">📝 Quản lý Bài viết</h1>
                    <p className="text-gray-600">Tổng cộng: <span className="font-bold text-green-600">{filteredPosts.length}</span> bài viết</p>
                </div>
                <Link
                    href="/admin/posts/create"
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition shadow-md"
                >
                    ➕ Tạo bài viết mới
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Tìm kiếm</label>
                        <input
                            type="text"
                            placeholder="Tìm theo tiêu đề..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Danh mục</label>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            <option value="">Tất cả danh mục</option>
                            {CATEGORIES.map(cat => (
                                <option key={cat.value} value={cat.value}>{cat.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-end">
                        <button
                            onClick={fetchPosts}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition"
                        >
                            🔄 Làm mới
                        </button>
                    </div>
                </div>
            </div>

            {/* Posts Table */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải bài viết...</p>
                </div>
            ) : filteredPosts.length === 0 ? (
                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                    <p className="text-gray-500 text-lg">Không có bài viết nào</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Tiêu đề</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Danh mục</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Lượt xem</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Trạng thái</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Ngày tạo</th>
                                    <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredPosts.map(post => (
                                    <tr key={post.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900 line-clamp-2">{post.title}</div>
                                            <div className="text-xs text-gray-500">{post.slug}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                                {CATEGORIES.find(c => c.value === post.category)?.label || post.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 font-medium">{post.views}</td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => toggleActive(post.id, post.isActive)}
                                                className={`px-3 py-1 rounded-full text-xs font-medium transition ${post.isActive
                                                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                                    }`}
                                            >
                                                {post.isActive ? '✓ Hiển thị' : '✕ Ẩn'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 text-sm">
                                            {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                                        </td>
                                        <td className="px-6 py-4 text-center space-x-2">
                                            <Link
                                                href={`/admin/posts/${post.id}/edit`}
                                                className="inline-block px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition"
                                            >
                                                Sửa
                                            </Link>
                                            <button
                                                onClick={() => setDeleteId(post.id)}
                                                className="inline-block px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded transition"
                                            >
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteId && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Xác nhận xóa</h3>
                        <p className="text-gray-600 mb-6">Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác.</p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteId(null)}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={() => handleDelete(deleteId)}
                                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition"
                            >
                                Xóa
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}