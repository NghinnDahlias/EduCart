"use client";

import HomeFooter from "@/components/HomeFooter";
import HomeNavbar from "@/components/HomeNavbar";
import { api } from "@/lib/api";
import { Check, Upload } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface University { UniversityID: number; UName: string; }
interface Faculty { FacultyID: number; FacultyName: string; }
interface Subject { SubjectID: number; SubjectCode: string; SubjectName: string; }

const itemConditions = [
    { id: "new", label: "Mới", description: "CHƯA MỞ" },
    { id: "good", label: "Tốt", description: "CÓ SỬ DỤNG NHẸ" },
    { id: "old", label: "Cũ", description: "CÓ HỎNG HÓC" }
];

const conditionMap: Record<string, number> = { new: 100, good: 80, old: 60 };

export default function PostBookPage() {
    const [step, setStep] = useState(1);
    const [editId, setEditId] = useState<string | null>(null);

    // On mount, check editId
    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const id = searchParams.get("editId");
        if (id) {
            setEditId(id);
            // Fetch product details
            api.get<{ ok: boolean; product: any }>(`/products/${id}`)
                .then(res => {
                    if (res.ok && res.product) {
                        const p = res.product;
                        setProductName(p.Title);
                        setYourPrice(p.Price?.toString() || "");
                        setSaleType(p.IsForRent ? "rent" : "sell");
                        setUniversityId(p.UniversityID || "");
                        setFacultyId(p.FacultyID || "");
                        setSubjectId(p.SubjectID || "");
                        
                        // Reverse map condition
                        const mappedCondition = Object.keys(conditionMap).find(k => conditionMap[k] === p.Condition) || "good";
                        setCondition(mappedCondition);
                        
                        if (p.Format) {
                            setDocumentCategories(p.Format.split(",").map((s: string) => s.trim()));
                        }
                        
                        if (p.images && p.images.length > 0) {
                            setUploadedPreviews(p.images.map((img: any) => img.ImageURL));
                        }
                    }
                })
                .catch(() => alert("Không thể tải thông tin sản phẩm"));
        }
    }, []);

    // Lookup data
    const [universities, setUniversities] = useState<University[]>([]);
    const [faculties, setFaculties] = useState<Faculty[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);

    // Form state
    const [productName, setProductName] = useState("");
    const [universityId, setUniversityId] = useState<number | "">("");
    const [facultyId, setFacultyId] = useState<number | "">("");
    const [subjectId, setSubjectId] = useState<number | "">("");
    const [subjectCode, setSubjectCode] = useState("");
    const [condition, setCondition] = useState("good");
    const [yourPrice, setYourPrice] = useState("");
    const [saleType, setSaleType] = useState<"sell" | "rent">("sell");
    const [deliveryMethod, setDeliveryMethod] = useState("onCampus");
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);

    // Image state: keep both File objects and preview URLs in sync
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [uploadedPreviews, setUploadedPreviews] = useState<string[]>([]);

    const [customSlots, setCustomSlots] = useState<string[]>([]);
    const [showAddSlotInput, setShowAddSlotInput] = useState(false);
    const [newSlotInput, setNewSlotInput] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [documentCategories, setDocumentCategories] = useState<string[]>([]);

    const normalizedTitle = productName.trim();
    const normalizedPrice = yourPrice.trim();

    // Load universities on mount
    useEffect(() => {
        api.get<{ ok: boolean; universities: University[] }>("/universities")
            .then(d => setUniversities(d.universities ?? []))
            .catch(() => { });
    }, []);

    // Load faculties when university changes
    useEffect(() => {
        if (!universityId) { setFaculties([]); setFacultyId(""); setSubjects([]); setSubjectId(""); return; }
        api.get<{ ok: boolean; faculties: Faculty[] }>(`/universities/${universityId}/faculties`)
            .then(d => setFaculties(d.faculties ?? []))
            .catch(() => setFaculties([]));
        setFacultyId("");
        setSubjects([]);
        setSubjectId("");
    }, [universityId]);

    // Load subjects when faculty changes
    useEffect(() => {
        if (!facultyId) { setSubjects([]); setSubjectId(""); return; }
        api.get<{ ok: boolean; subjects: Subject[] }>(`/faculties/${facultyId}/subjects`)
            .then(d => setSubjects(d.subjects ?? []))
            .catch(() => setSubjects([]));
        setSubjectId("");
    }, [facultyId]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        const remaining = 5 - uploadedFiles.length;
        const toAdd = Array.from(files).slice(0, remaining);
        toAdd.forEach(file => {
            const reader = new FileReader();
            reader.onload = (event) => {
                setUploadedPreviews(prev => [...prev, event.target?.result as string]);
            };
            reader.readAsDataURL(file);
        });
        setUploadedFiles(prev => [...prev, ...toAdd]);
        e.target.value = "";
    };

    const handleRemoveImage = (idx: number) => {
        setUploadedFiles(prev => prev.filter((_, i) => i !== idx));
        setUploadedPreviews(prev => prev.filter((_, i) => i !== idx));
    };

    const handleSlotToggle = (slot: string) => {
        setAvailableSlots(prev =>
            prev.includes(slot) ? prev.filter(s => s !== slot) : [...prev, slot]
        );
    };

    const handleAddCustomSlot = () => {
        const normalizedSlot = newSlotInput.trim();
        if (!normalizedSlot) return;
        if (customSlots.includes(normalizedSlot) || availableSlots.includes(normalizedSlot)) {
            setNewSlotInput("");
            setShowAddSlotInput(false);
            return;
        }
        setCustomSlots(prev => [...prev, normalizedSlot]);
        setAvailableSlots(prev => [...prev, normalizedSlot]);
        setNewSlotInput("");
        setShowAddSlotInput(false);
    };

    const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = Number(e.target.value);
        setSubjectId(id || "");
        const found = subjects.find(s => s.SubjectID === id);
        setSubjectCode(found?.SubjectCode ?? "");
    };

    const handleSubmit = async () => {
        if (normalizedTitle.length < 3) {
            alert("Tên sản phẩm phải có ít nhất 3 ký tự.");
            setStep(1);
            return;
        }
        if (!normalizedPrice) {
            alert("Vui lòng nhập giá sản phẩm.");
            setStep(3);
            return;
        }
        if (!isStep4Valid) return;
        setIsSubmitting(true);
        try {
            const deliveryMethodLabel =
                deliveryMethod === "cod" ? "Giao đến địa chỉ (COD)" : "Giao hàng tại trường";
            const deliverySlotsText = availableSlots.join(" | ");
            const deliveryDescription = `Phương thức giao hàng: ${deliveryMethodLabel}. Khung thời gian khả dụng: ${deliverySlotsText}.`;

            const formData = new FormData();
            formData.append("title", normalizedTitle);
            formData.append("price", normalizedPrice);
            formData.append("type", saleType === "rent" ? "Rent" : "Sell");
            formData.append("subjectCode", subjectCode || "N/A");
            formData.append("universityId", String(universityId));
            formData.append("facultyId", String(facultyId));
            formData.append("subjectId", String(subjectId));
            formData.append("condition", String(conditionMap[condition] ?? 80));
            formData.append("format", documentCategories.join(", "));
            formData.append("description", deliveryDescription);
            formData.append("termLabel", deliveryMethod === "cod" ? "COD" : "OnCampus");
            if (saleType === "rent") {
                formData.append("rentalPrice", normalizedPrice);
            }
            uploadedFiles.forEach(file => formData.append("images", file));

            if (editId) {
                await api.putForm(`/products/${editId}`, formData, true);
            } else {
                await api.postForm("/products", formData, true);
            }
            // Hiển thị sản phẩm mới sau khi đăng bán
            window.location.href = "/orders";
        } catch (err: any) {
            alert(err?.message ?? "Có lỗi xảy ra. Vui lòng thử lại.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const isStep1Valid = !!(normalizedTitle.length >= 3 && universityId && facultyId && subjectId);
    const isStep2Valid = (uploadedFiles.length > 0 || uploadedPreviews.length > 0) && !!condition;
    const isStep3Valid = !!normalizedPrice;
    const isStep4Valid = !!(deliveryMethod && availableSlots.length > 0);

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
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">{editId ? "Sửa sản phẩm" : "Đăng bán sản phẩm của bạn"}</h1>
                        <p className="text-gray-600">{editId ? "Cập nhật thông tin chi tiết cho sản phẩm của bạn." : "Biến các sách giáo khoa đã sử dụng của bạn thành tài sản học tập cho những người khác."}</p>
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
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white font-bold">1</div>
                                        <h2 className="text-2xl font-bold text-gray-900">THÔNG TIN SÁCH</h2>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">TÊN SẢN PHẨM</label>
                                            <input
                                                type="text"
                                                value={productName}
                                                onChange={e => setProductName(e.target.value)}
                                                placeholder="Ví dụ: Campbell Biology Phiên Bản 12"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">TRƯỜNG ĐẠI HỌC</label>
                                            <select
                                                value={universityId}
                                                onChange={e => setUniversityId(Number(e.target.value) || "")}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                                            >
                                                <option value="">Chọn Trường Đại Học</option>
                                                {universities.map(u => (
                                                    <option key={u.UniversityID} value={u.UniversityID}>{u.UName}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">KHOA / VIỆN</label>
                                                <select
                                                    value={facultyId}
                                                    onChange={e => setFacultyId(Number(e.target.value) || "")}
                                                    disabled={!universityId || faculties.length === 0}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 disabled:bg-gray-100"
                                                >
                                                    <option value="">Chọn Khoa</option>
                                                    {faculties.map(f => (
                                                        <option key={f.FacultyID} value={f.FacultyID}>{f.FacultyName}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">MÔN HỌC</label>
                                                <select
                                                    value={subjectId}
                                                    onChange={handleSubjectChange}
                                                    disabled={!facultyId || subjects.length === 0}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 disabled:bg-gray-100"
                                                >
                                                    <option value="">Chọn Môn Học</option>
                                                    {subjects.map(s => (
                                                        <option key={s.SubjectID} value={s.SubjectID}>
                                                            {s.SubjectCode} – {s.SubjectName}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">LOẠI TÀI LIỆU (Có thể chọn nhiều)</label>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                {["CÔNG NGHỆ THÔNG TIN", "KỸ THUẬT", "KINH TẾ", "DƯỢC", "MỸ THUẬT", "TRUYỀN THÔNG", "SÁCH CHUYÊN NGÀNH", "E-BOOK", "SÁCH CỨNG", "PDF / TÀI LIỆU SỐ", "PPT / PDF", "PDF / SCAN", "FLASHCARD HỌC TẬP", "CHEATSHEET", "ĐỀ THI", "DỤNG CỤ VẼ KỸ THUẬT", "BỘ KIT / BOARD MẠCH", "DỤNG CỤ CHUYÊN DỤNG", "HỌA CỤ MỸ THUẬT", "THIẾT BỊ MEDIA", "TÀI KHOẢN HỌC ONLINE"].map(cat => (
                                                    <label key={cat} className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                                                        <input
                                                            type="checkbox"
                                                            className="w-4 h-4 text-blue-600"
                                                            checked={documentCategories.includes(cat)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    setDocumentCategories(prev => [...prev, cat]);
                                                                } else {
                                                                    setDocumentCategories(prev => prev.filter(c => c !== cat));
                                                                }
                                                            }}
                                                        />
                                                        <span className="text-sm font-medium text-gray-700">{cat}</span>
                                                    </label>
                                                ))}
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
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white font-bold">2</div>
                                        <h2 className="text-2xl font-bold text-gray-900">GIAO DIỆN VÀ TÌNH TRẠNG</h2>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-4">
                                                TẢI ẢNH (TỐI ĐA 5)
                                            </label>
                                            <div className="flex gap-2 mb-4 flex-wrap">
                                                {uploadedPreviews.map((preview, idx) => (
                                                    <div key={idx} className="relative w-24 h-24">
                                                        <img src={preview} alt={`Upload ${idx}`} className="w-full h-full object-cover rounded-lg" />
                                                        <button
                                                            onClick={() => handleRemoveImage(idx)}
                                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                ))}
                                                {uploadedFiles.length < 5 && (
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
                                            {editId && (
                                                <p className="text-xs font-semibold text-amber-600 mt-2 bg-amber-50 p-3 rounded-lg border border-amber-200">
                                                    Lưu ý: Nếu bạn muốn thay đổi hình ảnh, bạn phải tải lên lại TẤT CẢ các hình ảnh cho sản phẩm này. Nếu không tải lên ảnh mới nào, hình ảnh cũ sẽ được giữ nguyên.
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-4">TÌNH TRẠNG SẢN PHẨM</label>
                                            <div className="grid grid-cols-3 gap-4">
                                                {itemConditions.map(c => (
                                                    <button
                                                        key={c.id}
                                                        onClick={() => setCondition(c.id)}
                                                        className={`p-4 rounded-lg border-2 transition text-center ${condition === c.id
                                                            ? "border-blue-600 bg-blue-50"
                                                            : "border-gray-300 hover:border-blue-600"
                                                            }`}
                                                    >
                                                        <p className="font-bold text-gray-900">{c.label}</p>
                                                        <p className="text-xs text-gray-600">{c.description}</p>
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
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white font-bold">3</div>
                                        <h2 className="text-2xl font-bold text-gray-900">ĐỊNH GIÁ</h2>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">GIÁ CỦA BẠN (VNĐ)</label>
                                                <input
                                                    type="text"
                                                    value={yourPrice ? Number(yourPrice).toLocaleString('vi-VN') : ''}
                                                    onChange={e => {
                                                        const rawValue = e.target.value.replace(/\D/g, "");
                                                        setYourPrice(rawValue.slice(0, 10));
                                                    }}
                                                    placeholder="150.000"
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-4">LOẠI BÁN</label>
                                            <div className="grid grid-cols-2 gap-4">
                                                <button
                                                    onClick={() => setSaleType("sell")}
                                                    className={`p-4 rounded-lg border-2 transition ${saleType === "sell"
                                                        ? "border-blue-600 bg-blue-50"
                                                        : "border-gray-300 hover:border-blue-600"
                                                        }`}
                                                >
                                                    <p className="font-bold text-gray-900">BÁN</p>
                                                </button>
                                                <button
                                                    onClick={() => setSaleType("rent")}
                                                    className={`p-4 rounded-lg border-2 transition ${saleType === "rent"
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
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white font-bold">4</div>
                                        <h2 className="text-2xl font-bold text-gray-900">GIAO HÀNG VÀ GẶP HÀNG</h2>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-4">PHƯƠNG THỨC GIAO HÀNG</label>
                                            <div className="space-y-3">
                                                {[
                                                    { value: "onCampus", label: "Giao Hàng Tại Trường", desc: "KHÔNG PHÍ • NHANH CHÓNG" },
                                                    { value: "cod", label: "Giao Đến Địa Chỉ (COD)", desc: "NGƯỜI MUA TRẢ PHÍ • 2-3 NGÀY" },
                                                ].map(opt => (
                                                    <label key={opt.value}
                                                        className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:border-blue-600 transition"
                                                        style={{ borderColor: deliveryMethod === opt.value ? "#0066cc" : undefined }}>
                                                        <input
                                                            type="radio"
                                                            name="deliveryMethod"
                                                            value={opt.value}
                                                            checked={deliveryMethod === opt.value}
                                                            onChange={e => setDeliveryMethod(e.target.value)}
                                                            className="w-4 h-4"
                                                        />
                                                        <div>
                                                            <p className="font-semibold text-gray-900">{opt.label}</p>
                                                            <p className="text-xs text-gray-600">{opt.desc}</p>
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-4">KHUNG THỜI GIAN KHẢ DỤNG</label>
                                            <div className="grid grid-cols-2 gap-3">
                                                {["Thứ Hai, 10:00 - 12:00", "Thứ Ba, 14:00 - 18:00", "Thứ Tư, 08:00 - 10:00", ...customSlots].map((slot, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => handleSlotToggle(slot)}
                                                        className={`p-3 rounded-lg border-2 transition text-sm font-semibold ${availableSlots.includes(slot)
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
                                                        onChange={e => setNewSlotInput(e.target.value)}
                                                        placeholder="Ví dụ: Thứ Năm, 14:00 - 16:00"
                                                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                                                        onKeyDown={e => { if (e.key === "Enter") handleAddCustomSlot(); }}
                                                    />
                                                    <button onClick={handleAddCustomSlot} className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold">Thêm</button>
                                                    <button onClick={() => { setShowAddSlotInput(false); setNewSlotInput(""); }} className="px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold">Hủy</button>
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
                                                onClick={handleSubmit}
                                                disabled={!isStep4Valid || isSubmitting}
                                                className={`flex-1 py-3 rounded-lg font-semibold transition ${isStep4Valid && !isSubmitting
                                                    ? "bg-blue-600 text-white hover:bg-blue-700"
                                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                    }`}
                                            >
                                                {isSubmitting ? "Đang xử lý..." : (editId ? "LƯU THAY ĐỔI" : "CÔNG BỐ BÀI ĐĂNG")}
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
