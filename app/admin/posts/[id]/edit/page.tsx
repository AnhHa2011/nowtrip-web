'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import dynamic from 'next/dynamic';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import 'react-quill-new/lib/styles.css';

interface Post {
    id: string;
    title: string;
    slug: string;
    category: string;
    content: string;
    thumbnail?: string;
    isActive: boolean;
}

const CATEGORIES = [
    { value: 'TREKKING_EXPERIENCES', label: '🥾 Kinh nghiệm Trekking' },
    { value: 'NEWS', label: '📰 Tin tức' },
    { value: 'ABOUT_US', label: '🏢 Về chúng tôi' }
];

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        category: 'NEWS',
        content: '',
        thumbnail: '',
        isActive: true
    });

    useEffect(() => {
        fetchPost();
    }, [id]);

    const fetchPost = async () => {
        try {
            const res = await fetch(`/api/admin/posts?id=${id}`);
            if (!res.ok) throw new Error('Lỗi tải bài viết');
            const data = await res.json();
            const postData = Array.isArray(data) ? data[0] : data;
            setPost(postData);
            setFormData({
                title: postData.title,
                slug: postData.slug,
                category: postData.category,
                content: postData.content,
                thumbnail: postData.thumbnail || '',
                isActive: postData.isActive
            });
        } catch (error) {
            toast.error('Lỗi tải bài viết');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        setFormData(prev => ({
            ...prev,
            title,
            slug: generateSlug(title)
        }));
    };

    const handleSave = async () => {
        if (!formData.title || !formData.slug || !formData.category || !formData.content) {
            toast.error('Vui lòng điền tất cả các trường bắt buộc');
            return;
        }

        setSaving(true);
        try {
            const res = await fetch('/api/admin/posts', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id,
                    ...formData
                })
            });

            if (!res.ok) throw new Error('Lỗi cập nhật');
            toast.success('Cập nhật bài viết thành công');
            router.push('/admin/posts');
        } catch (error) {
            toast.error('Lỗi cập nhật bài viết');
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="p-6 flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải bài viết...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto">
            <div className="mb-8">
                <Link href="/admin/posts" className="text-green-600 hover:text-green-700 font-medium mb-4 inline-block">
                    ← Quay lại
                </Link>
                <h1 className="text-3xl md:text-4xl font-black text-gray-900">Chỉnh sửa bài viết</h1>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-6">
                {/* Tiêu đề */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Tiêu đề *</label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={handleTitleChange}
                        placeholder="Nhập tiêu đề bài viết..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>

                {/* Slug */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Slug (URL) *</label>
                    <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                        placeholder="slug-bai-viet"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 font-mono text-sm"
                    />
                    <p className="text-xs text-gray-500 mt-1">💡 Slug được tạo tự động từ tiêu đề, bạn có thể chỉnh sửa</p>
                </div>

                {/* Danh mục */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Danh mục *</label>
                    <select
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        {CATEGORIES.map(cat => (
                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                    </select>
                </div>

                {/* Thumbnail */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Ảnh đại diện</label>
                    <input
                        type="url"
                        value={formData.thumbnail}
                        onChange={(e) => setFormData(prev => ({ ...prev, thumbnail: e.target.value }))}
                        placeholder="https://example.com/image.jpg"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    {formData.thumbnail && (
                        <div className="mt-3 relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                            <img src={formData.thumbnail} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                    )}
                </div>

                {/* Nội dung */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nội dung *</label>
                    <ReactQuill
                        value={formData.content}
                        onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                        theme="snow"
                        modules={{
                            toolbar: [
                                [{ 'header': [1, 2, 3, false] }],
                                ['bold', 'italic', 'underline', 'strike'],
                                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                ['blockquote', 'code-block'],
                                ['link', 'image'],
                                ['clean']
                            ]
                        }}
                        placeholder="Nhập nội dung bài viết..."
                    />
                </div>

                {/* Trạng thái */}
                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        id="isActive"
                        checked={formData.isActive}
                        onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                        className="w-4 h-4 text-green-600 rounded"
                    />
                    <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                        Hiển thị bài viết này
                    </label>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-6 border-t border-gray-200">
                    <Link
                        href="/admin/posts"
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition text-center"
                    >
                        Hủy
                    </Link>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition disabled:opacity-50"
                    >
                        {saving ? 'Đang lưu...' : '💾 Lưu bài viết'}
                    </button>
                </div>
            </div>
        </div>
    );
}