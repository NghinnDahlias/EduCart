"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Upload, ChevronDown } from "lucide-react";
import HomeNavbar from "@/components/HomeNavbar";
import HomeFooter from "@/components/HomeFooter";

const categories = [
    "Khoa Học Máy Tính",
    "Toán Học",
    "Vật Lý",
    "Hóa Học",
    "Sinh Học",
    "Kinh Tế",
    "Kinh Doanh",
    "Tâm Lý",
    "Lịch Sử",
    "Ngôn Ngữ",
    "Triết Học"
];

const itemConditions = [
    { id: "new", label: "Mới", description: "CHƯA MỞ" },
    { id: "good", label: "Tốt", description: "CÓ SỬ DỤNG NHẸ" },
    { id: "old", label: "Cũ", description: "CÓ HỎNG HÓC" }
];

export default function PostBookPage() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        productName: "",
        courseCode: "",
        category: "",
        condition: "good",
        yourPrice: "",
        saleType: "sell",
        deliveryMethod: "onCampus",
        availableSlots: [] as string[]
    });

    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    const [customSlots, setCustomSlots] = useState<string[]>([]);
    const [showAddSlotInput, setShowAddSlotInput] = useState(false);
    const [newSlotInput, setNewSlotInput] = useState("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            Array.from(files).forEach(file => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    setUploadedImages(prev => [...prev, event.target?.result as string]);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const handleSlotToggle = (slot: string) => {
        setFormData(prev => ({
            ...prev,
            availableSlots: prev.availableSlots.includes(slot)
                ? prev.availableSlots.filter(s => s !== slot)
                : [...prev.availableSlots, slot]
        }));
    };

    const handleAddCustomSlot = () => {
        if (newSlotInput.trim()) {
            setCustomSlots([...customSlots, newSlotInput]);
            setFormData(prev => ({
                ...prev,
                availableSlots: [...prev.availableSlots, newSlotInput]
            }));
            setNewSlotInput("");
            setShowAddSlotInput(false);
        }
    };

    const isStep1Valid = formData.productName && formData.courseCode && formData.category;
    const isStep2Valid = uploadedImages.length > 0 && formData.condition;
    const isStep3Valid = formData.yourPrice;
    const isStep4Valid = formData.deliveryMethod && formData.availableSlots.length > 0;

    return (
        <main className="bg-gray-50">
            <HomeNavbar />

            <section className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <div className="mb-8 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <Link href="/" className="hover:text-blue-600">Trang chủ</Link>
                            <span>/</span>
                            <span className="text-gray-900 font-medium">Đăng bán sản phẩm</span>
                        </div>
                    </div>

                    {/* Header */}
                    <div className="mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Đăng bán sản phẩm của bạn</h1>
                        <p className="text-gray-600">Biến các sách giáo khoa đã sử dụng của bạn thành tài sản học tập cho những người khác.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="space-y-4 sticky top-24">
                                {[1, 2, 3, 4].map((s) => (
                                    <div
                                        key={s}
                                        className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition ${step === s
                                            ? "bg-blue-50 border-2 border-blue-600"
                                            : step > s
                                                ? "bg-green-50 border-2 border-green-600"
                                                : "bg-gray-100 border-2 border-gray-300"
                                            }`}
                                        onClick={() => setStep(s)}
                                    >
                                        <div
                                            className={`flex h-8 w-8 items-center justify-center rounded-full font-bold text-white ${step >= s ? "bg-blue-600" : "bg-gray-400"
                                                }`}
                                        >
                                            {step > s ? <Check className="h-5 w-5" /> : s}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">
                                                {s === 1 && "Thông tin sản phẩm"}
                                                {s === 2 && "Hình ảnh"}
                                                {s === 3 && "Định giá"}
                                                {s === 4 && "Giao hàng"}
                                            </p>
                                            {step > s && <p className="text-xs text-green-600">Hoàn thành</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-3">
                            {/* Step 1: Book Details */}
                            {step === 1 && (
                                <div className="bg-white rounded-2xl p-8 shadow-sm">
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white font-bold">
                                            1
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900">THÔNG TIN SÁCH</h2>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                TÊN SẢN PHẨM (ISBN HOẶC TIÊU ĐỀ)
                                            </label>
                                            <input
                                                type="text"
                                                name="productName"
                                                value={formData.productName}
                                                onChange={handleInputChange}
                                                placeholder="Ví dụ: Campbell Biology Phiên Bản 12"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    MÃ HỌC PHẦN
                                                </label>
                                                <input
                                                    type="text"
                                                    name="courseCode"
                                                    value={formData.courseCode}
                                                    onChange={handleInputChange}
                                                    placeholder="Ví dụ: CS50, BIO101"
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    DANH MỤC
                                                </label>
                                                <select
                                                    name="category"
                                                    value={formData.category}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                                                >
                                                    <option value="">Chọn Danh Mục</option>
                                                    {categories.map(cat => (
                                                        <option key={cat} value={cat}>{cat}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => isStep1Valid && setStep(2)}
                                            disabled={!isStep1Valid}
                                            className={`w-full py-3 rounded-lg font-semibold transition ${isStep1Valid
                                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                }`}
                                        >
                                            Bước Tiếp Theo
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Appearance & Condition */}
                            {step === 2 && (
                                <div className="bg-white rounded-2xl p-8 shadow-sm">
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white font-bold">
                                            2
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900">GIAO DIỆN VÀ TÌNH TRẠNG</h2>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-4">
                                                TẢI ẢNH (TỐI ĐA 5)
                                            </label>
                                            <div className="flex gap-2 mb-4 flex-wrap">
                                                {uploadedImages.map((img, idx) => (
                                                    <div key={idx} className="relative w-24 h-24">
                                                        <img src={img} alt={`Upload ${idx}`} className="w-full h-full object-cover rounded-lg" />
                                                        <button
                                                            onClick={() => setUploadedImages(prev => prev.filter((_, i) => i !== idx))}
                                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                ))}
                                                {uploadedImages.length < 5 && (
                                                    <label className="w-24 h-24 border-2 border-dashed border-blue-400 rounded-lg flex items-center justify-center cursor-pointer hover:bg-blue-50 transition">
                                                        <Upload className="h-6 w-6 text-blue-600" />
                                                        <input
                                                            type="file"
                                                            multiple
                                                            accept="image/*"
                                                            onChange={handleImageUpload}
                                                            className="hidden"
                                                        />
                                                    </label>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-4">
                                                TÌNH TRẠNG SẢN PHẨM
                                            </label>
                                            <div className="grid grid-cols-3 gap-4">
                                                {itemConditions.map(condition => (
                                                    <button
                                                        key={condition.id}
                                                        onClick={() => setFormData(prev => ({ ...prev, condition: condition.id }))}
                                                        className={`p-4 rounded-lg border-2 transition text-center ${formData.condition === condition.id
                                                            ? "border-blue-600 bg-blue-50"
                                                            : "border-gray-300 hover:border-blue-600"
                                                            }`}
                                                    >
                                                        <p className="font-bold text-gray-900">{condition.label}</p>
                                                        <p className="text-xs text-gray-600">{condition.description}</p>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex gap-4">
                                            <button
                                                onClick={() => setStep(1)}
                                                className="flex-1 py-3 rounded-lg font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                                            >
                                                Quay Lại
                                            </button>
                                            <button
                                                onClick={() => isStep2Valid && setStep(3)}
                                                disabled={!isStep2Valid}
                                                className={`flex-1 py-3 rounded-lg font-semibold transition ${isStep2Valid
                                                    ? "bg-blue-600 text-white hover:bg-blue-700"
                                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                    }`}
                                            >
                                                Bước Tiếp Theo
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Pricing */}
                            {step === 3 && (
                                <div className="bg-white rounded-2xl p-8 shadow-sm">
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white font-bold">
                                            3
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900">CÔNG CỤ GỢI Ý GIÁ</h2>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    GIÁ CỦA BẠN (VNĐ)
                                                </label>
                                                <input
                                                    type="number"
                                                    name="yourPrice"
                                                    value={formData.yourPrice}
                                                    onChange={handleInputChange}
                                                    placeholder="150.000"
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                                                />
                                            </div>
                                        </div>

                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="h-5 w-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                                                    📊
                                                </div>
                                                <p className="font-semibold text-gray-900">PHÂN TÍCH THỊ TRƯỜNG</p>
                                            </div>
                                            <p className="text-sm text-gray-700">
                                                Các mục tương tự đang được bán với giá <strong>125.000đ</strong>. Giá của bạn cao hơn <strong>20%</strong> so với trung bình. Giá cạnh tranh bán nhanh gấp 3 lần!
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-4">
                                                LOẠI BÁN
                                            </label>
                                            <div className="grid grid-cols-2 gap-4">
                                                <button
                                                    onClick={() => setFormData(prev => ({ ...prev, saleType: "sell" }))}
                                                    className={`p-4 rounded-lg border-2 transition ${formData.saleType === "sell"
                                                        ? "border-blue-600 bg-blue-50"
                                                        : "border-gray-300 hover:border-blue-600"
                                                        }`}
                                                >
                                                    <p className="font-bold text-gray-900">BÁN</p>
                                                </button>
                                                <button
                                                    onClick={() => setFormData(prev => ({ ...prev, saleType: "rent" }))}
                                                    className={`p-4 rounded-lg border-2 transition ${formData.saleType === "rent"
                                                        ? "border-blue-600 bg-blue-50"
                                                        : "border-gray-300 hover:border-blue-600"
                                                        }`}
                                                >
                                                    <p className="font-bold text-gray-900">THUÊ</p>
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex gap-4">
                                            <button
                                                onClick={() => setStep(2)}
                                                className="flex-1 py-3 rounded-lg font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                                            >
                                                Quay Lại
                                            </button>
                                            <button
                                                onClick={() => isStep3Valid && setStep(4)}
                                                disabled={!isStep3Valid}
                                                className={`flex-1 py-3 rounded-lg font-semibold transition ${isStep3Valid
                                                    ? "bg-blue-600 text-white hover:bg-blue-700"
                                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                    }`}
                                            >
                                                Bước Tiếp Theo
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 4: Delivery & Meeting */}
                            {step === 4 && (
                                <div className="bg-white rounded-2xl p-8 shadow-sm">
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white font-bold">
                                            4
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900">GIAO HÀNG VÀ GẶP HÀNG</h2>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-4">
                                                PHƯƠNG THỨC GIAO HÀNG
                                            </label>
                                            <div className="space-y-3">
                                                <label className="flex items-center gap-3 p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-blue-600 transition"
                                                    style={{ borderColor: formData.deliveryMethod === 'onCampus' ? '#0066cc' : undefined }}>
                                                    <input
                                                        type="radio"
                                                        name="deliveryMethod"
                                                        value="onCampus"
                                                        checked={formData.deliveryMethod === "onCampus"}
                                                        onChange={handleInputChange}
                                                        className="w-4 h-4"
                                                    />
                                                    <div>
                                                        <p className="font-semibold text-gray-900">Giao Hàng Tại Trường</p>
                                                        <p className="text-xs text-gray-600">KHÔNG PHÍ • NHANH CHÓNG</p>
                                                    </div>
                                                </label>
                                                <label className="flex items-center gap-3 p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-blue-600 transition"
                                                    style={{ borderColor: formData.deliveryMethod === 'cod' ? '#0066cc' : undefined }}>
                                                    <input
                                                        type="radio"
                                                        name="deliveryMethod"
                                                        value="cod"
                                                        checked={formData.deliveryMethod === "cod"}
                                                        onChange={handleInputChange}
                                                        className="w-4 h-4"
                                                    />
                                                    <div>
                                                        <p className="font-semibold text-gray-900">Giao Đến Địa Chỉ (COD)</p>
                                                        <p className="text-xs text-gray-600">NGƯỜI MUA TRẢ PHÍ • 2-3 NGÀY</p>
                                                    </div>
                                                </label>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-4">
                                                KHO THỜI GIAN KHẢ DỤNG
                                            </label>
                                            <div className="grid grid-cols-2 gap-3">
                                                {["Thứ Hai, 10:00 - 12:00", "Thứ Ba, 14:00 - 18:00", "Thứ Tư, 08:00 - 10:00"].concat(customSlots).map((slot, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => handleSlotToggle(slot)}
                                                        className={`p-3 rounded-lg border-2 transition text-sm font-semibold ${formData.availableSlots.includes(slot)
                                                                ? "border-blue-600 bg-blue-50 text-blue-600"
                                                                : "border-gray-300 text-gray-700 hover:border-blue-600"
                                                            }`}
                                                    >
                                                        {slot}
                                                    </button>
                                                ))}
                                                {!showAddSlotInput && (
                                                    <button
                                                        onClick={() => setShowAddSlotInput(true)}
                                                        className="p-3 rounded-lg border-2 border-gray-300 text-blue-600 hover:bg-blue-50 transition text-sm font-semibold"
                                                    >
                                                        + Thêm Khoảng Thời Gian
                                                    </button>
                                                )}
                                            </div>
                                            {showAddSlotInput && (
                                                <div className="mt-4 flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={newSlotInput}
                                                        onChange={(e) => setNewSlotInput(e.target.value)}
                                                        placeholder="Ví dụ: Thứ Năm, 14:00 - 16:00"
                                                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                                                        onKeyPress={(e) => {
                                                            if (e.key === 'Enter') {
                                                                handleAddCustomSlot();
                                                            }
                                                        }}
                                                    />
                                                    <button
                                                        onClick={handleAddCustomSlot}
                                                        className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                                                    >
                                                        Thêm
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setShowAddSlotInput(false);
                                                            setNewSlotInput("");
                                                        }}
                                                        className="px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
                                                    >
                                                        Hủy
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex gap-4">
                                            <button
                                                onClick={() => setStep(3)}
                                                className="flex-1 py-3 rounded-lg font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                                            >
                                                Quay Lại
                                            </button>
                                            <button
                                                onClick={() => isStep4Valid && alert("Bài Đăng Đã Được Công Bố!")}
                                                disabled={!isStep4Valid}
                                                className={`flex-1 py-3 rounded-lg font-semibold transition ${isStep4Valid
                                                    ? "bg-blue-600 text-white hover:bg-blue-700"
                                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                    }`}
                                            >
                                                🚀 CÔNG BỐ BÀI ĐĂNG
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <HomeFooter />
        </main>
    );
}
