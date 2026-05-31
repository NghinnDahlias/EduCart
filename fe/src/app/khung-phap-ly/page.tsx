"use client";

import Link from "next/link";

import HomeFooter from "@/components/HomeFooter";
import HomeNavbar from "@/components/HomeNavbar";
import { useLocale } from "@/components/locale-provider";

const content = {
  vi: {
    title: "Bộ Hồ Sơ Pháp Lý EduCart",
    description:
      "Trang này tổng hợp khung pháp lý và quản trị nền tảng của EduCart, bao gồm điều khoản vận hành sàn TMĐT, bảo mật dữ liệu, thanh toán, khiếu nại, bản quyền học liệu và cơ chế điểm uy tín dành cho người dùng.",
    tocTitle: "Mục lục",
    sections: [
      {
        id: "legal-package",
        heading: "1. Bộ hồ sơ pháp lý của nền tảng",
        items: [
          "EduCart vận hành như một sàn TMĐT học liệu theo mô hình C2C Marketplace, kết nối người mua và người bán trên nguyên tắc tự nguyện, minh bạch, bình đẳng, tuân thủ pháp luật và tôn trọng quyền sở hữu trí tuệ.",
          "Bộ hồ sơ pháp lý của nền tảng gồm: Điều khoản sử dụng, Quy chế hoạt động sàn TMĐT, Chính sách bảo mật dữ liệu cá nhân, Chính sách thanh toán, Chính sách khiếu nại và giải quyết tranh chấp, Chính sách kiểm duyệt học liệu và bản quyền, cùng Chính sách dành cho người bán hoặc tổ chức chuyên nghiệp.",
          "Đối với đồ án EduCart, trang này đóng vai trò là mục khung pháp lý và quản trị nền tảng, thể hiện cách hệ thống kiểm soát rủi ro vận hành chứ không chỉ dừng ở code và CSDL.",
        ],
      },
      {
        id: "marketplace-rules",
        heading: "2. Quy chế hoạt động sàn TMĐT",
        items: [
          "Người dùng đăng ký tài khoản bằng email, số điện thoại hoặc tài khoản trường, sau đó xác thực OTP, cập nhật hồ sơ cá nhân và kích hoạt tài khoản.",
          "Người bán phải cung cấp tên sản phẩm, danh mục môn học, mô tả, giá bán, hình ảnh và tình trạng sản phẩm; EduCart có quyền duyệt, từ chối, chỉnh sửa hoặc gỡ bỏ nội dung không phù hợp.",
          "Đối với sách giấy: người mua đặt hàng, thanh toán, người bán xác nhận, giao hàng và người mua xác nhận đã nhận. Đối với học liệu số: người mua thanh toán, hệ thống xác nhận, cấp quyền truy cập và hoàn tất giao dịch.",
          "Sau giao dịch, người mua có thể đánh giá theo thang 1 đến 5 sao về chất lượng sản phẩm, tốc độ phản hồi và độ chính xác mô tả; EduCart có quyền gỡ đánh giá gian lận, công kích cá nhân hoặc spam.",
        ],
      },
      {
        id: "privacy",
        heading: "3. Chính sách bảo mật dữ liệu cá nhân",
        items: [
          "EduCart có thể thu thập thông tin tài khoản như họ tên, email, số điện thoại, MSSV; thông tin giao dịch như lịch sử mua bán, thanh toán, khiếu nại; và thông tin kỹ thuật như IP, thiết bị, cookie, nhật ký truy cập.",
          "Dữ liệu được sử dụng cho xác thực tài khoản, hỗ trợ giao dịch, phòng chống gian lận, cải thiện hệ thống và cá nhân hóa đề xuất.",
          "EduCart cam kết không bán dữ liệu người dùng, không chia sẻ trái phép, áp dụng mã hóa dữ liệu và kiểm soát truy cập theo vai trò.",
          "Người dùng có quyền xem, chỉnh sửa, yêu cầu xóa dữ liệu cá nhân hoặc rút lại sự đồng ý xử lý dữ liệu theo phạm vi pháp luật cho phép.",
        ],
      },
      {
        id: "payments",
        heading: "4. Chính sách thanh toán và giải ngân",
        items: [
          "EduCart hỗ trợ chuyển khoản ngân hàng, ví điện tử, VNPay, MoMo, ZaloPay và COD đối với sách giấy.",
          "Đơn hàng học liệu số được xem là hoàn tất khi hệ thống ghi nhận thanh toán thành công và cấp quyền truy cập học liệu cho người mua.",
          "Đối với sách giấy, tiền được giải ngân cho người bán sau khi người mua xác nhận nhận hàng hoặc hết thời gian khiếu nại hợp lệ theo quy định của nền tảng.",
          "Trong mô hình escrow của EduCart, hệ thống có quyền tạm giữ doanh thu, khấu trừ nghĩa vụ bồi hoàn hoặc hoàn trả tiền cho người dùng khi phát sinh vi phạm đã được xác minh.",
        ],
      },
      {
        id: "complaints",
        heading: "5. Chính sách khiếu nại, tranh chấp và xử lý report",
        items: [
          "Người dùng có thể khiếu nại khi nhận sai sản phẩm, hàng hư hỏng, thiếu sản phẩm, không nhận được hàng, file lỗi, file không mở được hoặc nội dung không đúng mô tả.",
          "Thời hạn khiếu nại đề xuất: 07 ngày đối với sách giấy và 03 ngày đối với học liệu số.",
          "Quy trình gồm bốn bước: gửi khiếu nại, EduCart tiếp nhận, xác minh chứng cứ và ra quyết định xử lý.",
          "Các hình thức xử lý có thể gồm hoàn tiền, đổi sản phẩm, hủy giao dịch, khóa tài khoản vi phạm hoặc chuyển hồ sơ sang bộ phận xử lý tranh chấp.",
        ],
      },
      {
        id: "copyright",
        heading: "6. Chính sách học liệu và bản quyền",
        items: [
          "Nội dung được phép gồm ghi chú cá nhân, flashcard tự tạo, tóm tắt môn học, đề cương do người dùng biên soạn và tài liệu được chủ sở hữu cho phép phân phối.",
          "Nội dung không được phép gồm scan toàn bộ giáo trình có bản quyền, ebook lậu, PDF lậu, tài liệu mua từ nguồn khác rồi bán lại, đề thi đang được bảo mật và luận văn bán để sao chép.",
          "Chủ sở hữu bản quyền có thể gửi thông tin tác giả, chứng minh quyền sở hữu và link vi phạm; EduCart sẽ xem xét trong 72 giờ, tạm khóa nội dung và thông báo cho người đăng.",
          "Chế tài bản quyền: lần 1 gỡ nội dung, lần 2 khóa đăng tải 30 ngày, lần 3 khóa vĩnh viễn tài khoản.",
        ],
      },
      {
        id: "professional-sellers",
        heading: "7. Chính sách người bán chuyên nghiệp và điều khoản sinh viên",
        items: [
          "Chính sách này áp dụng cho nhà sách, thư viện, CLB học thuật, trung tâm đào tạo và tổ chức giáo dục; các đơn vị tham gia cần cung cấp thông tin liên hệ, đại diện và giấy phép hoạt động nếu có.",
          "Quyền lợi gồm gian hàng xác thực, huy hiệu Verified, ưu tiên hiển thị, báo cáo doanh thu và công cụ phân tích.",
          "Người dùng xác thực bằng email .edu.vn có thể được hưởng ưu đãi thành viên, giảm phí giao dịch và quyền tham gia chương trình Ambassador; EduCart có quyền thu hồi nếu phát hiện mạo danh, thông tin giả hoặc chia sẻ tài khoản trái phép.",
        ],
      },
      {
        id: "trust-score",
        heading: "8. Điều khoản hệ thống Điểm Uy Tín (Trust Score)",
        items: [
          "Mỗi tài khoản có Trust Score khởi tạo là 100 điểm nhằm đánh giá mức độ uy tín, giảm gian lận, bảo vệ cộng đồng người học và khuyến khích hành vi trung thực.",
          "Các hành vi như đăng thông tin sai lệch, không giao hàng đúng cam kết, hủy đơn vô lý, đăng học liệu sai mô tả hoặc spam có thể bị trừ 5 điểm; quấy rối người dùng khác bị trừ 10 điểm; vi phạm bản quyền lần đầu bị trừ 15 điểm; gian lận giao dịch bị trừ 20 điểm.",
          "Mỗi vi phạm được xác nhận sẽ ghi nhận một cảnh báo và trừ điểm tương ứng, đồng thời thông báo qua email, thông báo trong hệ thống và hồ sơ tài khoản.",
          "Khi người dùng tích lũy đủ 10 cảnh báo hợp lệ hoặc Trust Score giảm xuống 50 điểm hoặc thấp hơn, hệ thống có thể tạm khóa tài khoản 07 ngày, ngừng đăng bán, ngừng nhận thanh toán và ngừng đăng tải học liệu mới.",
          "Trước khi được mở lại, người dùng phải hoàn thành nghĩa vụ giao hàng, hoàn trả tiền cho người mua bị ảnh hưởng và bồi hoàn các giao dịch không hợp lệ; EduCart có quyền khấu trừ từ số dư ví hoặc tạm giữ doanh thu.",
          "Nếu sau thời gian mở khóa người dùng nhận thêm 03 cảnh báo hợp lệ, tài khoản sẽ bị khóa vĩnh viễn và không được đăng ký lại bằng email cũ, số điện thoại cũ hoặc giấy tờ xác minh đã dùng trước đó.",
          "Các mức xếp hạng tham chiếu: 90 đến 100 là Xuất sắc, 75 đến 89 là Uy tín, 60 đến 74 là Bình thường, 50 đến 59 là Cảnh báo, dưới 50 là Hạn chế hoạt động.",
          "Cơ chế phục hồi tham chiếu: mỗi 30 ngày không phát sinh vi phạm có thể được cộng lại 2 điểm, mỗi giao dịch thành công được đánh giá từ 4 sao trở lên có thể được cộng 0.5 điểm, nhưng điểm tối đa không vượt quá 100 và tài khoản bị khóa vĩnh viễn không được phục hồi.",
        ],
      },
    ],
  },
  en: {
    title: "EduCart Legal Package",
    description:
      "This page summarizes EduCart's legal and platform governance framework, including marketplace rules, privacy, payments, disputes, learning-material copyright, and the user trust-score policy.",
    tocTitle: "Contents",
    sections: [
      {
        id: "legal-package",
        heading: "1. Platform legal package",
        items: [
          "EduCart operates as a C2C learning-material marketplace based on transparency, voluntariness, equality, legal compliance, and respect for intellectual property.",
          "The legal package includes Terms of Use, Marketplace Operating Rules, Privacy Policy, Payment Policy, Complaint and Dispute Resolution Policy, Learning Material and Copyright Policy, and Policies for professional sellers or organizations.",
          "For the EduCart project, this page works as the platform governance and legal-risk chapter, showing that the system handles more than code and database design.",
        ],
      },
      {
        id: "marketplace-rules",
        heading: "2. Marketplace operating rules",
        items: [
          "Users may register by email, phone number, or school account, verify by OTP, update their profile, and activate the account.",
          "Sellers must provide product title, subject category, description, price, images, and condition; EduCart may review, reject, edit, or remove unsuitable content.",
          "For physical books: buyer places an order, pays, seller confirms, ships, and buyer confirms receipt. For digital materials: buyer pays, the system confirms payment, grants access, and completes the transaction.",
          "After each transaction, buyers may rate product quality, response speed, and description accuracy on a 1-to-5-star scale; EduCart may remove fraudulent, abusive, or spam reviews.",
        ],
      },
      {
        id: "privacy",
        heading: "3. Personal data privacy policy",
        items: [
          "EduCart may collect account information such as full name, email, phone number, and student ID; transaction information such as trade history, payment records, and complaints; and technical information such as IP, device, cookies, and access logs.",
          "Data is used for authentication, transaction support, fraud prevention, product improvement, and recommendation personalization.",
          "EduCart commits not to sell user data, not to disclose it unlawfully, and to apply encryption and role-based access control.",
          "Users may review, edit, request deletion of personal data, or withdraw consent where permitted by law.",
        ],
      },
      {
        id: "payments",
        heading: "4. Payment and settlement policy",
        items: [
          "EduCart supports bank transfer, e-wallets, VNPay, MoMo, ZaloPay, and cash-on-delivery for physical books.",
          "Digital-material orders are complete when the platform records successful payment and grants access to the purchased material.",
          "For physical books, funds are released to the seller after the buyer confirms receipt or after the valid complaint window expires.",
          "Under EduCart's escrow model, the platform may temporarily hold revenue, deduct compensation obligations, or refund affected users when a verified violation occurs.",
        ],
      },
      {
        id: "complaints",
        heading: "5. Complaints, disputes, and report handling",
        items: [
          "Users may complain about wrong items, damaged goods, missing goods, non-delivery, corrupted files, inaccessible files, or content that does not match the description.",
          "Recommended complaint windows are 7 days for physical books and 3 days for digital materials.",
          "The process has four steps: submit complaint, EduCart receives it, verifies evidence, and issues a resolution.",
          "Possible outcomes include refund, replacement, transaction cancellation, account suspension, or escalation to dispute-resolution review.",
        ],
      },
      {
        id: "copyright",
        heading: "6. Learning material and copyright policy",
        items: [
          "Allowed content includes personal notes, self-created flashcards, course summaries, outlines prepared by the user, and materials distributed with permission from the rightsholder.",
          "Prohibited content includes full scans of copyrighted textbooks, pirated ebooks or PDFs, resold materials from unauthorized sources, protected exam materials, and dissertations sold for plagiarism.",
          "Copyright owners may submit author information, proof of ownership, and the infringing link; EduCart will review within 72 hours, temporarily lock the content, and notify the uploader.",
          "Suggested copyright sanctions: first violation removes the content, second violation suspends uploads for 30 days, third violation permanently bans the account.",
        ],
      },
      {
        id: "professional-sellers",
        heading: "7. Professional seller policy and student-specific terms",
        items: [
          "This policy applies to bookstores, libraries, academic clubs, training centers, and education organizations; they may be asked to provide representative information, contact details, and business licenses where applicable.",
          "Benefits may include verified storefronts, badges, priority visibility, revenue reporting, and analytics tools.",
          "Users verified with .edu.vn email addresses may receive membership perks, lower transaction fees, and Ambassador-program access; EduCart may revoke these benefits in cases of impersonation, fake information, or account sharing.",
        ],
      },
      {
        id: "trust-score",
        heading: "8. Trust Score policy",
        items: [
          "Each account starts with a Trust Score of 100 to reflect reliability, reduce fraud, protect the learning community, and encourage responsible behavior.",
          "Misleading information, unjustified cancellations, inaccurate material descriptions, or spam may reduce 5 points; harassment may reduce 10 points; first-time copyright violations may reduce 15 points; transaction fraud may reduce 20 points.",
          "Every confirmed violation records one warning and deducts trust points, while the user is informed by email, in-app notification, and profile notice.",
          "When a user reaches 10 valid warnings or the Trust Score falls to 50 or lower, the platform may suspend the account for 7 days and pause listing, payout, and new upload privileges.",
          "Before reactivation, the user must fulfill shipping obligations, refund affected buyers, and compensate invalid transactions; EduCart may deduct from wallet balance or hold platform revenue.",
          "If the user receives 3 more valid warnings after returning from suspension, the account may be permanently banned and cannot be recreated with the same email, phone number, or verification documents.",
          "Reference tiers: 90-100 Excellent, 75-89 Trusted, 60-74 Normal, 50-59 Warning, below 50 Restricted.",
          "Reference recovery policy: add 2 points after 30 days without violations and 0.5 points for each successful 4-star-or-above transaction, capped at 100; permanently banned accounts cannot recover.",
        ],
      },
    ],
  },
} as const;

export default function LegalFrameworkPage() {
  const { locale } = useLocale();
  const page = content[locale];

  return (
    <main className="min-h-screen bg-gray-50">
      <HomeNavbar />

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="hover:text-blue-600">
              {locale === "vi" ? "Trang chủ" : "Home"}
            </Link>
            <span>/</span>
            <span className="font-medium text-slate-900">{page.title}</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">{page.title}</h1>
          <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-600 sm:text-base">
            {page.description}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">
                {page.tocTitle}
              </h2>
              <nav className="mt-4 space-y-2">
                {page.sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="block rounded-2xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-blue-50 hover:text-blue-700"
                  >
                    {section.heading}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <div className="space-y-6">
            {page.sections.map((section) => (
              <article
                key={section.id}
                id={section.id}
                className="scroll-mt-24 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h2 className="text-2xl font-bold text-slate-900">{section.heading}</h2>
                <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-600">
                  {section.items.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <HomeFooter />
    </main>
  );
}
