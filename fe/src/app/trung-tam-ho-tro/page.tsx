import InfoPageShell from "@/components/InfoPageShell";

export default function HelpCenterPage() {
  return (
    <InfoPageShell
      title="Trung tâm hỗ trợ và khiếu nại"
      description="Trang hỗ trợ này tổng hợp quy trình liên hệ, báo cáo sự cố và khiếu nại giao dịch trên EduCart. Người dùng nên ưu tiên lưu lại đầy đủ bằng chứng trong hệ thống để việc xử lý diễn ra nhanh hơn."
      sections={[
        {
          heading: "1. Khi nào nên gửi hỗ trợ",
          items: [
            "Không đăng nhập được, không cập nhật được hồ sơ hoặc gặp lỗi thao tác trên các trang sản phẩm, giỏ hàng, đơn hàng hay diễn đàn.",
            "Tin đăng sai mô tả, giao sản phẩm không đúng cam kết, không hoàn cọc thuê hoặc có dấu hiệu gian lận.",
            "Tài khoản bị lạm dụng, có nội dung quấy rối hoặc phát sinh tranh chấp cần bên thứ ba hỗ trợ xác minh.",
          ],
        },
        {
          heading: "2. Bằng chứng nên chuẩn bị",
          items: [
            "Ảnh chụp màn hình đơn hàng, nội dung chat, thông tin sản phẩm và thời gian giao dịch.",
            "Mô tả ngắn gọn vấn đề: xảy ra khi nào, trên màn hình nào, đã thử xử lý ra sao và mong muốn hỗ trợ theo hướng nào.",
            "Nếu là giao dịch thuê, nên cung cấp thêm tình trạng bàn giao ban đầu, phụ kiện đi kèm và bằng chứng lúc hoàn trả.",
          ],
        },
        {
          heading: "3. Quy trình xử lý khiếu nại",
          items: [
            "Bước 1: Hai bên nên trao đổi lại trực tiếp qua tin nhắn trong hệ thống để làm rõ vấn đề.",
            "Bước 2: Nếu không tự xử lý được, người dùng gửi báo cáo hoặc liên hệ trung tâm hỗ trợ bằng email/điện thoại đã công bố.",
            "Bước 3: Nhóm vận hành đối chiếu dữ liệu, trạng thái đơn, nội dung trao đổi và phản hồi hướng xử lý phù hợp.",
          ],
        },
        {
          heading: "4. Kênh liên hệ hiện tại",
          items: [
            "Email hỗ trợ: contact.educart@gmail.com",
            "Số điện thoại: 0329 123 456",
            "Điểm hỗ trợ mẫu: Trường ĐH Bách Khoa - ĐHQG HCM, cơ sở 2",
            "Trang cộng đồng: facebook.com/EduCart.HCMUT",
          ],
        },
      ]}
    />
  );
}
