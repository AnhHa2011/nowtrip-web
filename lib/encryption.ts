import crypto from 'crypto';

// Lấy chìa khóa bí mật từ file .env (phải dài đúng 32 ký tự)
const ENCRYPTION_KEY: string = process.env.ENCRYPTION_KEY?.toString() || '';
const IV_LENGTH = 16;

// HÀM MÃ HÓA (Dùng khi Admin lưu mật khẩu vào Database)
export function encrypt(text: string) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

// HÀM GIẢI MÃ (Dùng khi hệ thống lấy mật khẩu ra để gửi mail)
export function decrypt(text: string) {
    try {
        const textParts = text.split(':');
        const iv = Buffer.from(textParts.shift()!, 'hex');
        const encryptedText = Buffer.from(textParts.join(':'), 'hex');
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    } catch (error) {
        console.error("Lỗi giải mã mật khẩu Email:", error);
        return ""; // Trả về rỗng nếu giải mã thất bại
    }
}