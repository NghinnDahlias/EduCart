import InfoPageShell from "@/components/InfoPageShell";

export default function RentalPolicyPage() {
  return (
    <InfoPageShell
      title="Chính sách thuê sách và tài liệu"
      description="Chính sách này áp dụng cho các sản phẩm có hình thức thuê trên EduCart, bao gồm sách, dụng cụ học tập, bộ kit, tài khoản học online hoặc học liệu chuyên dụng."
      sections={[
        {
          heading: "1. Điều kiện áp dụng",
          items: [
            "Sản phẩm được đánh dấu là cho thuê phải có thời hạn, phí thuê và trạng thái rõ ràng trên tin đăng.",
            "Người cho thuê cần mô tả chính xác tình trạng sản phẩm, phụ kiện kèm theo và phạm vi sử dụng hợp lệ.",
            "Người thuê có trách nhiệm đọc kỹ mô tả trước khi xác nhận đơn để tránh hiểu nhầm về quyền sử dụng.",
          ],
        },
        {
          heading: "2. Tiền cọc và phí thuê",
          items: [
            "Tùy từng loại sản phẩm, giao dịch thuê có thể phát sinh tiền cọc nhằm đảm bảo hoàn trả đúng hạn và đúng tình trạng.",
            "Phí thuê cần được thống nhất minh bạch trước khi xác nhận đơn; không nên thay đổi điều kiện sau khi sản phẩm đã được bàn giao.",
            "Trong trường hợp hoàn trả đúng thời hạn và đúng hiện trạng đã thỏa thuận, tiền cọc được hoàn lại theo quy trình của đơn thuê.",
          ],
        },
        {
          heading: "3. Trách nhiệm khi sử dụng",
          items: [
            "Người thuê không được tự ý sửa, tháo rời, chia sẻ trái phép tài khoản học online hoặc làm thay đổi hiện trạng sản phẩm nếu chưa được đồng ý.",
            "Mọi trường hợp hư hỏng, mất phụ kiện, khóa tài khoản hoặc làm giảm giá trị sử dụng cần được thông báo sớm cho bên cho thuê.",
            "Nếu phát sinh vi phạm nghiêm trọng, người cho thuê có quyền đề nghị giữ cọc hoặc gửi khiếu nại qua trung tâm hỗ trợ.",
          ],
        },
        {
          heading: "4. Hoàn trả và kết thúc giao dịch",
          items: [
            "Người thuê cần chủ động hẹn lịch trả, bàn giao lại đầy đủ sách, thiết bị hoặc quyền truy cập liên quan.",
            "Người cho thuê nên kiểm tra nhanh tình trạng sản phẩm ngay khi nhận lại để tránh tranh chấp kéo dài.",
            "Sau khi hai bên xác nhận đã hoàn tất hoàn trả, đơn thuê được chuyển sang trạng thái kết thúc và có thể tiến hành đánh giá.",
          ],
        },
      ]}
    />
  );
}
