import InfoPageShell from "@/components/InfoPageShell";

export default function TransactionGuidePage() {
  return (
    <InfoPageShell
      title="Hướng dẫn giao dịch"
      description="Trang này mô tả luồng giao dịch chuẩn trên EduCart, từ lúc tìm sản phẩm đến khi hoàn tất mua hoặc thuê. Mục tiêu là giúp người dùng mới thao tác nhanh, hạn chế nhầm lẫn và giảm tranh chấp."
      sections={[
        {
          heading: "1. Tìm và đánh giá sản phẩm",
          items: [
            "Dùng bộ lọc theo trường, khoa, môn học và loại sản phẩm để tìm đúng tài liệu hoặc dụng cụ cần thiết.",
            "Ưu tiên đọc kỹ mô tả, tình trạng, số lượng ảnh, giá bán hoặc giá thuê, cùng phần đánh giá của người bán trước khi quyết định.",
            "Với tài liệu số, cần xác nhận rõ định dạng file như PDF, PPT, scan hoặc source code trước khi chốt giao dịch.",
          ],
        },
        {
          heading: "2. Trao đổi trước khi chốt đơn",
          items: [
            "Người mua nên nhắn tin trực tiếp để hỏi thêm về chất lượng, thời gian giao nhận, hình thức sử dụng và tình trạng thực tế.",
            "Người bán nên phản hồi rõ về số lượng, phụ kiện đi kèm, thời gian trống đối với sản phẩm cho thuê và điều kiện hoàn trả.",
            "Nếu có điểm chưa rõ, nên thống nhất bằng tin nhắn trong hệ thống để dễ đối chiếu khi cần hỗ trợ.",
          ],
        },
        {
          heading: "3. Tạo đơn hàng",
          items: [
            "Sau khi chọn sản phẩm, người dùng thêm vào giỏ hàng và chuyển sang bước checkout để xác nhận đơn.",
            "Đơn mua sẽ hiển thị giá thanh toán theo sản phẩm; đơn thuê sẽ có thêm phần tiền cọc hoặc phí thuê theo kỳ nếu người bán cấu hình.",
            "Mỗi đơn nên chỉ chứa các sản phẩm phù hợp cùng một giao dịch để dễ theo dõi trạng thái và làm bằng chứng khi phát sinh vấn đề.",
          ],
        },
        {
          heading: "4. Nhận hàng và xác nhận hoàn tất",
          items: [
            "Khi nhận hàng, cần đối chiếu đúng sản phẩm, đúng tình trạng mô tả, đúng phụ kiện đi kèm và khả năng sử dụng thực tế.",
            "Sau khi kiểm tra, người mua xác nhận đã nhận hàng trong hệ thống để cập nhật trạng thái đơn.",
            "Sau giao dịch, người dùng nên để lại đánh giá nhằm tăng độ tin cậy cho cộng đồng.",
          ],
        },
      ]}
    />
  );
}
