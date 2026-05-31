import InfoPageShell from "@/components/InfoPageShell";

export default function QualityStandardsPage() {
  return (
    <InfoPageShell
      title="Quy chuẩn kiểm định chất lượng"
      description="EduCart khuyến nghị người dùng tuân thủ các quy chuẩn dưới đây khi đăng bán hoặc cho thuê để đảm bảo minh bạch và nâng cao độ tin cậy cho toàn hệ thống."
      sections={[
        {
          heading: "1. Quy chuẩn cho sách in và giáo trình",
          items: [
            "Ảnh đăng tải nên chụp rõ bìa trước, bìa sau, gáy sách và một vài trang bên trong nếu có ghi chú hoặc hư hao đáng kể.",
            "Mô tả cần nêu trung thực mức độ mới/cũ, tình trạng gáy, rách trang, ghi chú viết tay, tô highlight hoặc thiếu phụ lục đi kèm.",
            "Nếu sách là bản photo hoặc bản scan, cần ghi rõ để người mua phân biệt với sách gốc.",
          ],
        },
        {
          heading: "2. Quy chuẩn cho tài liệu số",
          items: [
            "Cần ghi rõ định dạng file, số lượng tài liệu, phạm vi nội dung và mức độ đầy đủ như slide, đề thi, note, source code hoặc flashcard.",
            "Không đăng tải tài liệu vi phạm bản quyền hoặc dữ liệu cá nhân nhạy cảm của người khác.",
            "Nên có ảnh minh họa hoặc ảnh preview cấu trúc thư mục để người mua đánh giá đúng giá trị học liệu.",
          ],
        },
        {
          heading: "3. Quy chuẩn cho dụng cụ, bộ kit và thiết bị",
          items: [
            "Tin đăng nên nêu rõ linh kiện đi kèm, mức độ hoạt động, phụ kiện thiếu hoặc lỗi nhỏ nếu có.",
            "Với sản phẩm điện tử hoặc bộ kit, nên mô tả khả năng sử dụng thực tế như còn hoạt động, đã test nguồn, thiếu dây hay cảm biến.",
            "Với họa cụ và thiết bị media, nên ghi rõ mức hao mòn, độ sạch, tình trạng pin hoặc khả năng sử dụng ngay.",
          ],
        },
        {
          heading: "4. Kiểm soát chất lượng cộng đồng",
          items: [
            "Người dùng được khuyến khích đánh giá sau giao dịch để tạo dữ liệu tin cậy cho cộng đồng.",
            "Những tin đăng sai mô tả, thiếu minh bạch hoặc có dấu hiệu gian lận có thể bị báo cáo và ẩn khỏi hệ thống.",
            "Các tiêu chuẩn này không thay thế việc kiểm tra trực tiếp, nhưng là cơ sở để giải quyết tranh chấp công bằng hơn.",
          ],
        },
      ]}
    />
  );
}
