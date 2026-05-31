export type AddressTree = {
  province: string;
  districts: Array<{
    name: string;
    wards: string[];
  }>;
};

export const VN_ADDRESS_TREE: AddressTree[] = [
  {
    province: "Hồ Chí Minh",
    districts: [
      { name: "TP Thủ Đức", wards: ["Linh Trung", "Linh Chiểu", "Hiệp Phú", "Tăng Nhơn Phú A", "Tăng Nhơn Phú B"] },
      { name: "Quận 1", wards: ["Bến Nghé", "Bến Thành", "Đa Kao", "Nguyễn Cư Trinh"] },
      { name: "Bình Thạnh", wards: ["Phường 13", "Phường 14", "Phường 25", "Phường 26"] },
      { name: "Gò Vấp", wards: ["Phường 1", "Phường 3", "Phường 5", "Phường 7"] },
    ],
  },
  {
    province: "Hà Nội",
    districts: [
      { name: "Cầu Giấy", wards: ["Dịch Vọng", "Dịch Vọng Hậu", "Mai Dịch", "Nghĩa Tân"] },
      { name: "Đống Đa", wards: ["Láng Thượng", "Ô Chợ Dừa", "Quang Trung", "Trung Liệt"] },
      { name: "Thanh Xuân", wards: ["Khương Đình", "Khương Mai", "Nhân Chính", "Thượng Đình"] },
    ],
  },
  {
    province: "Đà Nẵng",
    districts: [
      { name: "Hải Châu", wards: ["Bình Hiên", "Bình Thuận", "Hải Châu I", "Hải Châu II"] },
      { name: "Sơn Trà", wards: ["An Hải Bắc", "An Hải Đông", "Mân Thái", "Phước Mỹ"] },
    ],
  },
  {
    province: "Bình Dương",
    districts: [
      { name: "Dĩ An", wards: ["An Bình", "Dĩ An", "Đông Hòa", "Tân Bình"] },
      { name: "Thuận An", wards: ["An Phú", "Bình Chuẩn", "Lái Thiêu", "Thuận Giao"] },
    ],
  },
  {
    province: "Đồng Nai",
    districts: [
      { name: "Biên Hòa", wards: ["An Bình", "Hiệp Hòa", "Long Bình", "Tân Hiệp"] },
      { name: "Long Khánh", wards: ["Bảo Vinh", "Bàu Sen", "Suối Tre", "Xuân An"] },
    ],
  },
  {
    province: "Cần Thơ",
    districts: [
      { name: "Ninh Kiều", wards: ["An Cư", "An Hòa", "An Khánh", "Xuân Khánh"] },
      { name: "Cái Răng", wards: ["Ba Láng", "Hưng Phú", "Lê Bình", "Phú Thứ"] },
    ],
  },
];
