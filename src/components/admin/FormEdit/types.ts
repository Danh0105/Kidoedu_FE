export type ProductImageItem = {
    id: string;
    file?: File;      // ảnh mới
    url?: string;     // ảnh cũ
    isPrimary: boolean;
};
