"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Heart, ShoppingCart, Star, ChevronLeft, ChevronRight } from "lucide-react";
import HomeNavbar from "@/components/HomeNavbar";
import HomeFooter from "@/components/HomeFooter";

// Mock product database - kết nối với API backend sau
const products: Record<number, any> = {
    1: {
        id: 1,
        title: "Calculus: Early Transcendentals",
        author: "James Stewart",
        price: "125.000₫",
        originalPrice: "250.000₫",
        discount: "-50%",
        rating: 4.5,
        reviews: 128,
        tag: "BÁN",
        category: "CALCULUS",
        images: [
            "https://covers.openlibrary.org/b/isbn/9781285741550-L.jpg",
            "https://covers.openlibrary.org/b/isbn/9780538497817-L.jpg",
            "https://covers.openlibrary.org/b/isbn/9780495011668-L.jpg",
        ],
        description: "Một cuốn sách giáo khoa toán học chuyên sâu về Giải tích. Phù hợp cho sinh viên năm 1 và những người muốn nắm vững nền tảng Giải tích. Cuốn sách được viết một cách rõ ràng và dễ hiểu, kèm theo nhiều bài tập thực hành.",
        specifications: {
            language: "English",
            pages: "1200 trang",
            publisher: "Cengage Learning",
            year: 2023,
            isbn: "978-0357700013"
        },
        inStock: true,
        seller: "EduCart Official",
        canRent: true,
        rentalPrice: "25.000₫"
    },
    2: {
        id: 2,
        title: "Nguyên lý Kinh tế học",
        author: "N. Gregory Mankiw",
        price: "25.000₫",
        originalPrice: "",
        discount: "",
        rating: 4.8,
        reviews: 95,
        tag: "THUÊ",
        category: "ECONOMICS",
        images: [
            "https://covers.openlibrary.org/b/isbn/9781305585126-L.jpg",
            "https://covers.openlibrary.org/b/isbn/9781285165875-L.jpg",
            "https://covers.openlibrary.org/b/isbn/9781337613040-L.jpg",
        ],
        description: "Giáo trình kinh tế học nền tảng được dạy tại hàng trăm đại học trên thế giới. Dễ hiểu, bổ ích và cập nhật với các tình huống kinh tế hiện tại.",
        specifications: {
            language: "Vietnamese",
            pages: "850 trang",
            publisher: "NXB Khoa học Xã hội",
            year: 2022,
            isbn: "978-8014652741"
        },
        inStock: true,
        seller: "EduCart Official",
        canRent: true,
        rentalPrice: "10.000₫"
    },
    3: {
        id: 3,
        title: "Chemistry: A Molecular Approach",
        author: "Nivaldo Jr. Tro",
        price: "180.000₫",
        originalPrice: "",
        discount: "",
        rating: 4.6,
        reviews: 112,
        tag: "BÁN",
        category: "CHEMISTRY",
        images: [
            "https://covers.openlibrary.org/b/isbn/9780321809247-L.jpg",
            "https://covers.openlibrary.org/b/isbn/9780134874371-L.jpg",
            "https://covers.openlibrary.org/b/isbn/9780321706461-L.jpg",
        ],
        description: "Sách hóa học tương tác với phương pháp tiếp cận từ phân tử. Giải thích các khái niệm hóa học phức tạp một cách đơn giản. Phù hợp cho sinh viên ngành khoa học tự nhiên.",
        specifications: {
            language: "English",
            pages: "1050 trang",
            publisher: "Pearson",
            year: 2023,
            isbn: "978-0135204771"
        },
        inStock: true,
        seller: "EduCart Official",
        canRent: true,
        rentalPrice: "30.000₫"
    },
    4: {
        id: 4,
        title: "Triết học Mác - Lênin",
        author: "NXB Lao động",
        price: "15.000₫",
        originalPrice: "30.000₫",
        discount: "-50%",
        rating: 4.2,
        reviews: 67,
        tag: "THUÊ",
        category: "PHILOSOPHY",
        images: [
            "https://covers.openlibrary.org/b/isbn/9780717804405-L.jpg",
            "https://covers.openlibrary.org/b/isbn/9780717800377-L.jpg",
            "https://covers.openlibrary.org/b/isbn/9780717805167-L.jpg",
        ],
        description: "Giáo trình triết học dành cho sinh viên các ngành xã hội. Cung cấp kiến thức cơ bản về chủ nghĩa Mác - Lênin và các lý thuyết triết học.",
        specifications: {
            language: "Vietnamese",
            pages: "620 trang",
            publisher: "NXB Lao động",
            year: 2021,
            isbn: "978-8016284721"
        },
        inStock: true,
        seller: "EduCart Official",
        canRent: true,
        rentalPrice: "8.000₫"
    },
    5: {
        id: 5,
        title: "Introduction to Algorithms",
        author: "Thomas H. Cormen",
        price: "220.000₫",
        originalPrice: "350.000₫",
        discount: "-37%",
        rating: 4.9,
        reviews: 256,
        tag: "BÁN",
        category: "COMPUTER SCIENCE",
        images: [
            "https://covers.openlibrary.org/b/isbn/9780262033848-L.jpg",
            "https://covers.openlibrary.org/b/isbn/9780262046305-L.jpg",
            "https://covers.openlibrary.org/b/isbn/9780262531962-L.jpg",
        ],
        description: "Cuốn sách cơ bản về thuật toán được sử dụng trong hầu hết các trường đại học. Cung cấp kiến thức toàn diện về các thuật toán và cấu trúc dữ liệu.",
        specifications: {
            language: "English",
            pages: "1312 trang",
            publisher: "MIT Press",
            year: 2022,
            isbn: "978-0262046305"
        },
        inStock: true,
        seller: "EduCart Official",
        canRent: true,
        rentalPrice: "35.000₫"
    },
    6: {
        id: 6,
        title: "Vật lý đại cương A1",
        author: "TS. Lê Công C",
        price: "110.000₫",
        originalPrice: "",
        discount: "",
        rating: 4.4,
        reviews: 89,
        tag: "BÁN",
        category: "PHYSICS",
        images: [
            "https://covers.openlibrary.org/b/isbn/9781305952195-L.jpg",
            "https://covers.openlibrary.org/b/isbn/9781337553292-L.jpg",
            "https://covers.openlibrary.org/b/isbn/9781285737027-L.jpg",
        ],
        description: "Giáo trình vật lý đại cương dành cho sinh viên năm thứ nhất. Bao gồm các khái niệm cơ bản về cơ học, động lực học và năng lượng.",
        specifications: {
            language: "Vietnamese",
            pages: "780 trang",
            publisher: "NXB Giáo dục Việt Nam",
            year: 2022,
            isbn: "978-8016548392"
        },
        inStock: true,
        seller: "EduCart Official",
        canRent: true,
        rentalPrice: "18.000₫"
    },
    7: {
        id: 7,
        title: "Linear Algebra and Its Applications",
        author: "David C. Lay",
        price: "195.000₫",
        originalPrice: "290.000₫",
        discount: "-33%",
        rating: 4.7,
        reviews: 143,
        tag: "BÁN",
        category: "MATHEMATICS",
        images: [
            "https://covers.openlibrary.org/b/isbn/9780321982384-L.jpg",
            "https://covers.openlibrary.org/b/isbn/9780136871583-L.jpg",
            "https://covers.openlibrary.org/b/isbn/9780201709704-L.jpg",
        ],
        description: "Sách đại số tuyến tính với ứng dụng thực tế. Dạy các khái niệm vector, ma trận, eigenvalues và các ứng dụng trong khoa học máy tính.",
        specifications: {
            language: "English",
            pages: "560 trang",
            publisher: "Pearson",
            year: 2023,
            isbn: "978-0136871591"
        },
        inStock: true,
        seller: "EduCart Official",
        canRent: true,
        rentalPrice: "28.000₫"
    },
    8: {
        id: 8,
        title: "Sinh học phân tử",
        author: "James D. Watson",
        price: "240.000₫",
        originalPrice: "",
        discount: "",
        rating: 4.8,
        reviews: 178,
        tag: "BÁN",
        category: "BIOLOGY",
        images: [
            "https://covers.openlibrary.org/b/isbn/9780321762436-L.jpg",
            "https://covers.openlibrary.org/b/isbn/9780321948472-L.jpg",
            "https://covers.openlibrary.org/b/isbn/9780805368444-L.jpg",
        ],
        description: "Sách sinh học phân tử nổi tiếng thế giới. Giải thích cấu trúc và chức năng của các phân tử sinh học, DNA, protein và các quá trình sống.",
        specifications: {
            language: "English",
            pages: "950 trang",
            publisher: "Garland Science",
            year: 2023,
            isbn: "978-0815345176"
        },
        inStock: true,
        seller: "EduCart Official",
        canRent: true,
        rentalPrice: "40.000₫"
    },
    9: {
        id: 9,
        title: "Tiếng Anh giao tiếp cơ bản",
        author: "Oxford English",
        price: "85.000₫",
        originalPrice: "150.000₫",
        discount: "-43%",
        rating: 4.5,
        reviews: 203,
        tag: "THUÊ",
        category: "LANGUAGE",
        images: [
            "https://covers.openlibrary.org/b/isbn/9780194579858-L.jpg",
            "https://covers.openlibrary.org/b/isbn/9780194373562-L.jpg",
            "https://covers.openlibrary.org/b/isbn/9780194366090-L.jpg",
        ],
        description: "Giáo trình tiếng Anh giao tiếp cho người mới bắt đầu. Dạy phát âm, từ vựng, ngữ pháp cơ bản và kỹ năng giao tiếp hàng ngày.",
        specifications: {
            language: "Mixed",
            pages: "420 trang",
            publisher: "Oxford University Press",
            year: 2023,
            isbn: "978-0194373562"
        },
        inStock: true,
        seller: "EduCart Official",
        canRent: true,
        rentalPrice: "15.000₫"
    },
    10: {
        id: 10,
        title: "Lịch sử Việt Nam hiện đại",
        author: "TS. Trần Văn Giàu",
        price: "65.000₫",
        originalPrice: "",
        discount: "",
        rating: 4.6,
        reviews: 98,
        tag: "BÁN",
        category: "HISTORY",
        images: [
            "https://covers.openlibrary.org/b/isbn/9780313341960-L.jpg",
            "https://covers.openlibrary.org/b/isbn/9780801428388-L.jpg",
            "https://covers.openlibrary.org/b/isbn/9780813027722-L.jpg",
        ],
        description: "Tác phẩm lịch sử kinh điển về Việt Nam thời kỳ hiện đại. Cung cấp cái nhìn sâu sắc về các giai đoạn lịch sử quan trọng của đất nước.",
        specifications: {
            language: "Vietnamese",
            pages: "680 trang",
            publisher: "NXB Khoa học Xã hội",
            year: 2021,
            isbn: "978-8018273652"
        },
        inStock: true,
        seller: "EduCart Official",
        canRent: true,
        rentalPrice: "12.000₫"
    },
    11: {
        id: 11,
        title: "Data Science Handbook",
        author: "Jake VanderPlas",
        price: "210.000₫",
        originalPrice: "350.000₫",
        discount: "-40%",
        rating: 4.9,
        reviews: 234,
        tag: "BÁN",
        category: "COMPUTER SCIENCE",
        images: [
            "https://covers.openlibrary.org/b/isbn/9781491912058-L.jpg",
            "https://covers.openlibrary.org/b/isbn/9781491910399-L.jpg",
            "https://covers.openlibrary.org/b/isbn/9781491954461-L.jpg",
        ],
        description: "Sách hướng dẫn toàn diện về khoa học dữ liệu sử dụng Python. Bao gồm xử lý dữ liệu, trực quan hóa, machine learning và thống kê.",
        specifications: {
            language: "English",
            pages: "540 trang",
            publisher: "O'Reilly Media",
            year: 2023,
            isbn: "978-1491912059"
        },
        inStock: true,
        seller: "EduCart Official",
        canRent: true,
        rentalPrice: "32.000₫"
    },
    12: {
        id: 12,
        title: "Quản trị Kinh doanh",
        author: "Stephen P. Robbins",
        price: "175.000₫",
        originalPrice: "",
        discount: "",
        rating: 4.5,
        reviews: 156,
        tag: "THUÊ",
        category: "BUSINESS",
        images: [
            "https://covers.openlibrary.org/b/isbn/9780133910292-L.jpg",
            "https://covers.openlibrary.org/b/isbn/9780137618521-L.jpg",
            "https://covers.openlibrary.org/b/isbn/9780134527604-L.jpg",
        ],
        description: "Giáo trình quản trị kinh doanh toàn diện. Dạy các nguyên lý, quy trình và kỹ năng quản lý doanh nghiệp hiện đại.",
        specifications: {
            language: "English",
            pages: "720 trang",
            publisher: "Pearson",
            year: 2022,
            isbn: "978-0137618522"
        },
        inStock: true,
        seller: "EduCart Official",
        canRent: true,
        rentalPrice: "25.000₫"
    },
    13: {
        id: 13,
        title: "Hóa học hữu cơ nâng cao",
        author: "Jonathan Clayden",
        price: "245.000₫",
        originalPrice: "390.000₫",
        discount: "-37%",
        rating: 4.8,
        reviews: 167,
        tag: "BÁN",
        category: "CHEMISTRY",
        images: [
            "https://covers.openlibrary.org/b/isbn/9780199270293-L.jpg",
            "https://covers.openlibrary.org/b/isbn/9780198503460-L.jpg",
            "https://covers.openlibrary.org/b/isbn/9780199270293-M.jpg",
        ],
        description: "Sách hóa học hữu cơ chuyên sâu cho sinh viên cao năm. Bao gồm các cơ chế phản ứng, tổng hợp hữu cơ và các ứng dụng thực tế.",
        specifications: {
            language: "English",
            pages: "1200 trang",
            publisher: "Oxford University Press",
            year: 2023,
            isbn: "978-0199270294"
        },
        inStock: true,
        seller: "EduCart Official",
        canRent: true,
        rentalPrice: "42.000₫"
    },
    14: {
        id: 14,
        title: "Tâm lý học nhân cách",
        author: "Carl Rogers",
        price: "120.000₫",
        originalPrice: "200.000₫",
        discount: "-40%",
        rating: 4.7,
        reviews: 134,
        tag: "THUÊ",
        category: "PSYCHOLOGY",
        images: [
            "https://covers.openlibrary.org/b/isbn/9780395755310-L.jpg",
            "https://covers.openlibrary.org/b/isbn/9780395086544-L.jpg",
            "https://covers.openlibrary.org/b/isbn/9780618652549-L.jpg",
        ],
        description: "Tác phẩm kinh điển về tâm lý học nhân cách của Carl Rogers. Phân tích các lý thuyết về nhân cách, phát triển và tự nhận thức.",
        specifications: {
            language: "English",
            pages: "480 trang",
            publisher: "Houghton Mifflin",
            year: 2022,
            isbn: "978-0618652549"
        },
        inStock: true,
        seller: "EduCart Official",
        canRent: true,
        rentalPrice: "20.000₫"
    },
    15: {
        id: 15,
        title: "Cơ học chất lỏng",
        author: "Frank M. White",
        price: "200.000₫",
        originalPrice: "",
        discount: "",
        rating: 4.6,
        reviews: 121,
        tag: "BÁN",
        category: "PHYSICS",
        images: [
            "https://covers.openlibrary.org/b/isbn/9780073398273-L.jpg",
            "https://covers.openlibrary.org/b/isbn/9780072938449-L.jpg",
            "https://covers.openlibrary.org/b/isbn/9780077422417-L.jpg",
        ],
        description: "Sách cơ học chất lỏng toàn diện. Dạy các nguyên lý về dòng chảy, động lực học chất lỏng, và các ứng dụng trong kỹ thuật.",
        specifications: {
            language: "English",
            pages: "860 trang",
            publisher: "McGraw-Hill",
            year: 2023,
            isbn: "978-0073384702"
        },
        inStock: true,
        seller: "EduCart Official",
        canRent: true,
        rentalPrice: "38.000₫"
    },
    16: {
        id: 16,
        title: "Lập trình Web với React",
        author: "Kyle Simpson",
        price: "185.000₫",
        originalPrice: "300.000₫",
        discount: "-38%",
        rating: 4.9,
        reviews: 267,
        tag: "BÁN",
        category: "COMPUTER SCIENCE",
        images: [
            "https://covers.openlibrary.org/b/isbn/9781492051725-L.jpg",
            "https://covers.openlibrary.org/b/isbn/9781491954614-L.jpg",
            "https://covers.openlibrary.org/b/isbn/9781491931820-L.jpg",
        ],
        description: "Sách hướng dẫn lập trình Web frontend sử dụng React. Bao gồm components, hooks, state management, routing, và best practices.",
        specifications: {
            language: "English",
            pages: "650 trang",
            publisher: "O'Reilly Media",
            year: 2023,
            isbn: "978-1491954615"
        },
        inStock: true,
        seller: "EduCart Official",
        canRent: true,
        rentalPrice: "30.000₫"
    }
};

// Mock reviews database
const getProductReviews = (productId: number) => {
    const reviewsData: Record<number, any[]> = {
        1: [
            { id: 1, userName: "Nguyễn Văn A", rating: 5, date: "15 Thg 10, 2023", comment: "Sách rất hay, nội dung chi tiết và dễ hiểu. Giao hàng nhanh, đóng gói cẩn thận.", helpful: 24 },
            { id: 2, userName: "Trần Thị B", rating: 4, date: "10 Thg 10, 2023", comment: "Sách chất lượng tốt, giá cả hợp lý. Nội dung phù hợp cho sinh viên năm 1.", helpful: 18 },
            { id: 3, userName: "Lê Minh C", rating: 5, date: "05 Thg 10, 2023", comment: "Sách được in rất đẹp, chất giấy tốt. Giáo viên của tôi cũng dùng sách này làm giáo trình.", helpful: 32 }
        ],
        2: [
            { id: 1, userName: "Phạm Quốc D", rating: 5, date: "20 Thg 10, 2023", comment: "Giáo trình kinh tế hay, dễ hiểu và có nhiều ví dụ thực tế rất hữu ích.", helpful: 28 },
            { id: 2, userName: "Vũ Thị E", rating: 4, date: "18 Thg 10, 2023", comment: "Sách tốt nhưng hơi dày, cần nhiều thời gian để đọc hết.", helpful: 15 }
        ]
    };
    return reviewsData[productId] || [];
};

export default function ProductPage() {
    const params = useParams();
    const id = params?.id;

    if (!id || typeof id !== 'string') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900">Sản phẩm không tìm thấy</h1>
                    <Link href="/" className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                        Quay lại trang chủ
                    </Link>
                </div>
            </div>
        );
    }

    const productId = parseInt(id);
    const product = products[productId];
    const [isFavorite, setIsFavorite] = useState(false);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [rentalStartDate, setRentalStartDate] = useState("");
    const [rentalEndDate, setRentalEndDate] = useState("");
    const [rentalDays, setRentalDays] = useState(7);
    const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900">Sản phẩm không tìm thấy</h1>
                    <Link href="/" className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                        Quay lại trang chủ
                    </Link>
                </div>
            </div>
        );
    }

    const handlePrevImage = () => {
        setSelectedImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
    };

    const handleNextImage = () => {
        setSelectedImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
    };

    return (
        <main className="bg-white">
            <HomeNavbar />

            <section className="py-8 bg-gray-50 min-h-screen">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <div className="mb-8 flex items-center gap-2 text-sm text-gray-600">
                        <Link href="/" className="hover:text-blue-600">Trang chủ</Link>
                        <span>/</span>
                        <Link href="/products" className="hover:text-blue-600">Sản phẩm</Link>
                        <span>/</span>
                        <span className="text-gray-900 font-medium">{product.title}</span>
                    </div>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 bg-white rounded-2xl p-8">
                        {/* Left: Image Gallery and Book Info */}
                        <div className="flex flex-col gap-6">
                            {/* Main Image */}
                            <div className="relative overflow-hidden rounded-2xl bg-gray-100 h-[400px]">
                                <img
                                    src={product.images[selectedImage]}
                                    alt={product.title}
                                    className="h-full w-full object-cover"
                                />

                                {/* Image Navigation */}
                                <button
                                    onClick={handlePrevImage}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 hover:bg-white transition"
                                >
                                    <ChevronLeft className="h-6 w-6 text-gray-900" />
                                </button>
                                <button
                                    onClick={handleNextImage}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 hover:bg-white transition"
                                >
                                    <ChevronRight className="h-6 w-6 text-gray-900" />
                                </button>

                                {/* Tags */}
                                <div className="absolute left-4 top-4 flex flex-col gap-2">
                                    {product.tag && (
                                        <div className={`rounded-md px-3 py-1.5 text-xs font-bold text-white text-center ${product.tag === "BÁN" ? "bg-blue-600" : "bg-green-600"}`}>
                                            {product.tag}
                                        </div>
                                    )}
                                    {product.discount && (
                                        <div className="rounded-md bg-orange-500 px-3 py-1.5 text-xs font-bold text-white text-center">
                                            {product.discount}
                                        </div>
                                    )}
                                </div>

                                {/* Wishlist Button */}
                                <button
                                    onClick={() => setIsFavorite(!isFavorite)}
                                    className="absolute right-4 top-4 rounded-full bg-white p-3 shadow-md hover:bg-gray-100 transition"
                                >
                                    <Heart
                                        className={`h-6 w-6 transition ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"}`}
                                    />
                                </button>
                            </div>

                            {/* Thumbnails */}
                            <div className="flex gap-2 overflow-x-auto">
                                {product.images.map((image: string, index: number) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border-2 transition ${selectedImage === index ? "border-blue-600" : "border-gray-200"}`}
                                    >
                                        <img
                                            src={image}
                                            alt={`${product.title} ${index + 1}`}
                                            className="h-full w-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>

                            {/* Lender Info & Book Condition */}
                            <div className="rounded-2xl bg-gray-50 p-6">
                                {/* Lender Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white flex items-center justify-center font-bold text-lg">
                                            {product.seller.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-sm">{product.seller}</h3>
                                            <p className="text-xs text-gray-600">PREMIUM LENDER • MEMBER SINCE 2021</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-blue-600">98</div>
                                        <p className="text-xs font-semibold text-gray-600">TRUST SCORE</p>
                                    </div>
                                </div>

                                {/* Book Condition */}
                                <div className="pt-6 border-t border-gray-200">
                                    <h4 className="font-bold text-gray-900 mb-3 text-sm">BOOK CONDITION</h4>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        Like new condition. No highlighting or marking. Includes access code for online labs (unused). This book was used for one semester at Stanford and kept in a smoke-free environment.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right: Rental Info and Pricing - FOR THUÊ TAG */}
                        {product.tag === "THUÊ" && (
                            <div className="flex flex-col gap-6">
                                {/* Title and Rating */}
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
                                    <p className="text-gray-600 font-medium">Tác giả: {product.author}</p>
                                    <div className="flex items-center gap-2 mt-3">
                                        <div className="flex items-center gap-1">
                                            {Array(5).fill(0).map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-sm text-gray-600">{product.reviews} đánh giá</span>
                                    </div>
                                </div>

                                {/* Rental Price */}
                                <div className="bg-blue-600 text-white rounded-2xl p-6">
                                    <p className="text-sm font-medium opacity-90 mb-1">GIÁ THUÊ TỪ</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-bold">{product.rentalPrice}</span>
                                        <span className="text-lg">/ ngày</span>
                                    </div>
                                    <p className="text-sm mt-3 opacity-90">Khoảng thời gian thuê tối thiểu: 7 ngày</p>
                                </div>

                                {/* Rental Duration Selection */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-3">CHỌN THỜI HẠN THUÊ</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs text-gray-600 mb-1">BẮT ĐẦU THUÊ</label>
                                            <input
                                                type="date"
                                                value={rentalStartDate}
                                                onChange={(e) => setRentalStartDate(e.target.value)}
                                                className="w-full px-3 py-2 border-2 border-blue-600 rounded-lg focus:outline-none text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-600 mb-1">HẾT HẠN</label>
                                            <input
                                                type="date"
                                                value={rentalEndDate}
                                                onChange={(e) => setRentalEndDate(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Price Breakdown */}
                                <div className="bg-gray-50 rounded-2xl p-6">
                                    <h4 className="font-bold text-gray-900 mb-4">CHI TIẾT GIÁ</h4>
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Tiền thuê hàng ngày (52,50 × 7 ngày)</span>
                                            <span className="font-medium">17.50₫</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Tiền bảo mật (có hoàn lại)</span>
                                            <span className="font-medium">50.00₫</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Phí dịch vụ nền tảng</span>
                                            <span className="font-medium">3.20₫</span>
                                        </div>
                                        <div className="border-t border-gray-300 pt-3 flex justify-between">
                                            <span className="font-bold text-gray-900">TỔNG CỘNG</span>
                                            <span className="text-2xl font-bold text-blue-600">70.70₫</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-3">
                                    <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2">
                                        ⚡ THUÊ NGAY
                                    </button>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button className="border-2 border-gray-300 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-50 transition">
                                            💬 CHAT
                                        </button>
                                        <button className="border-2 border-gray-300 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2">
                                            🛒 THÊM VÀO
                                        </button>
                                    </div>
                                </div>

                                {/* Info Badges */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center">
                                        <p className="text-2xl mb-1">🚚</p>
                                        <p className="font-semibold text-sm text-gray-900">GIAO HÀNG NHANH</p>
                                        <p className="text-xs text-gray-600">Trong 24 giờ</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl mb-1">🔒</p>
                                        <p className="font-semibold text-sm text-gray-900">BẢO VỆ TIỀN GỬI</p>
                                        <p className="text-xs text-gray-600">Khoảng cách an toàn</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Right: Purchase Info and Pricing - FOR BÁN TAG */}
                        {product.tag === "BÁN" && (
                            <div className="flex flex-col gap-6">
                                {/* Title and Rating */}
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
                                    <p className="text-gray-600 font-medium">Tác giả: {product.author}</p>
                                    <div className="flex items-center gap-2 mt-3">
                                        <div className="flex items-center gap-1">
                                            {Array(5).fill(0).map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-sm text-gray-600">{product.reviews} đánh giá</span>
                                    </div>
                                </div>

                                {/* Price Section */}
                                <div className="bg-blue-600 text-white rounded-2xl p-6">
                                    <div className="flex items-baseline gap-3 mb-2">
                                        <span className="text-4xl font-bold">{product.price}</span>
                                        {product.originalPrice && (
                                            <span className="text-lg line-through opacity-75">{product.originalPrice}</span>
                                        )}
                                    </div>
                                    {product.discount && (
                                        <p className="text-sm font-semibold opacity-90">Tiết kiệm {product.discount}</p>
                                    )}
                                </div>

                                {/* Quantity Selection */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-3">CHỌN SỐ LƯỢNG</label>
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="w-10 h-10 rounded-lg border-2 border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition"
                                        >
                                            −
                                        </button>
                                        <span className="text-2xl font-bold text-gray-900 min-w-12 text-center">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="w-10 h-10 rounded-lg border-2 border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition"
                                        >
                                            +
                                        </button>
                                        <span className="text-sm text-gray-600 ml-auto">{product.inStock ? "✓ Còn hàng" : "Hết hàng"}</span>
                                    </div>
                                </div>

                                {/* Price Summary */}
                                <div className="bg-gray-50 rounded-2xl p-6">
                                    <h4 className="font-bold text-gray-900 mb-4">CHI TIẾT GIÁ</h4>
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Giá sản phẩm</span>
                                            <span className="font-medium">{product.price}</span>
                                        </div>
                                        {product.discount && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Tiết kiệm</span>
                                                <span className="font-medium text-orange-600">{product.discount}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Phí dịch vụ</span>
                                            <span className="font-medium">Miễn phí</span>
                                        </div>
                                        <div className="border-t border-gray-300 pt-3 flex justify-between">
                                            <span className="font-bold text-gray-900">TỔNG CỘNG</span>
                                            <span className="text-2xl font-bold text-blue-600">{product.price}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-3">
                                    <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2">
                                        {product.tag === "BÁN" ? "🛒 MUA NGAY" : "⚡ THUÊ NGAY"}
                                    </button>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button className="border-2 border-gray-300 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-50 transition">
                                            💬 CHAT
                                        </button>
                                        <button className="border-2 border-gray-300 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2">
                                            {product.tag === "BÁN" ? "❤️ YÊU THÍCH" : "🛒 THÊM VÀO"}
                                        </button>
                                    </div>
                                </div>

                                {/* Info Badges */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center">
                                        <p className="text-2xl mb-1">🚚</p>
                                        <p className="font-semibold text-sm text-gray-900">GIAO HÀNG NHANH</p>
                                        <p className="text-xs text-gray-600">Trong 24 giờ</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl mb-1">✓</p>
                                        <p className="font-semibold text-sm text-gray-900">HÀNG CHÍNH HÃNG</p>
                                        <p className="text-xs text-gray-600">Bảo hành 12 tháng</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Product Details */}
                    <div className="mt-8 bg-white rounded-2xl p-8">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Thông tin chi tiết</h3>
                        <div className="grid grid-cols-3 gap-6">
                            <div className="text-center pb-6 border-b border-gray-200">
                                <p className="text-sm text-gray-600 font-semibold mb-2">TÁC GIẢ</p>
                                <p className="font-bold text-gray-900">{product.author}</p>
                            </div>
                            <div className="text-center pb-6 border-b border-gray-200">
                                <p className="text-sm text-gray-600 font-semibold mb-2">NHÀ XUẤT BẢN</p>
                                <p className="font-bold text-gray-900">{product.specifications.publisher}</p>
                            </div>
                            <div className="text-center pb-6 border-b border-gray-200">
                                <p className="text-sm text-gray-600 font-semibold mb-2">SỐ TRANG</p>
                                <p className="font-bold text-gray-900">{product.specifications.pages}</p>
                            </div>
                        </div>
                    </div>

                    {/* Reviews Section */}
                    <div className="mt-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-8">Đánh giá của khách hàng</h2>
                        <div className="relative">
                            {/* Left Arrow */}
                            <button
                                onClick={() => setCurrentReviewIndex(Math.max(0, currentReviewIndex - 1))}
                                disabled={currentReviewIndex === 0}
                                className="absolute left-0 top-1/2 -translate-y-1/2 -ml-6 z-10 bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 disabled:bg-gray-300 transition"
                            >
                                <ChevronLeft className="h-6 w-6" />
                            </button>

                            {/* Reviews Carousel */}
                            <div className="overflow-hidden">
                                <div className="flex gap-6 transition-transform duration-300" style={{
                                    transform: `translateX(-${currentReviewIndex * 350}px)`
                                }}>
                                    {getProductReviews(productId).map((review: any) => (
                                        <div key={review.id} className="flex-shrink-0 w-80 rounded-lg border border-gray-200 p-6 bg-white">
                                            {/* Review Header */}
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                                                            {review.userName.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-900 text-sm">{review.userName}</p>
                                                            <p className="text-xs text-gray-600">{review.date}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Rating Stars */}
                                            <div className="flex items-center gap-1 mb-4">
                                                {Array(5).fill(0).map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                                    />
                                                ))}
                                            </div>

                                            {/* Review Comment */}
                                            <p className="text-gray-700 mb-4 leading-relaxed text-sm line-clamp-3">{review.comment}</p>

                                            {/* Review Footer */}
                                            <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                                                <button className="text-xs text-gray-600 hover:text-blue-600 transition flex items-center gap-1">
                                                    👍 {review.helpful}
                                                </button>
                                                <button className="text-xs text-gray-600 hover:text-blue-600 transition">
                                                    👎
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right Arrow */}
                            <button
                                onClick={() => setCurrentReviewIndex(Math.min(getProductReviews(productId).length - 1, currentReviewIndex + 1))}
                                disabled={currentReviewIndex >= getProductReviews(productId).length - 1}
                                className="absolute right-0 top-1/2 -translate-y-1/2 -mr-6 z-10 bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 disabled:bg-gray-300 transition"
                            >
                                <ChevronRight className="h-6 w-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <HomeFooter />
        </main >
    );
}
