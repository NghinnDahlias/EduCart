# BONUS AI Chatbot Report

## 1. Muc tieu module

Module AI Chatbot duoc tich hop de giai quyet mot bai toan thuc te trong san TMDT EduCart:

- ho tro nguoi dung tra cuu tinh trang don hang
- huong dan thanh toan lai don cho thanh toan
- giai thich trust score, report, tranh chap va chinh sach ban quyen
- goi y hoc lieu phu hop tu kho san pham san co

Thay vi chi la widget chat giao dien, module nay co backend phan loai intent va truy van du lieu thuc trong he thong de tra loi.

## 2. Co so ly thuyet

### 2.1. Rule-based intent classification

Chatbot duoc hien thuc theo huong rule-based NLP don gian. He thong chuan hoa cau hoi, tach tu khoa va gan cau hoi vao mot trong cac nhom intent:

- payment_retry
- order_tracking
- refund_dispute
- rent_policy
- trust_score
- copyright
- product_recommendation
- greeting
- fallback

Uu diem cua huong nay:

- de kiem soat
- de kiem thu
- khong phu thuoc mo hinh AI ben ngoai
- phu hop do an can demo on dinh

### 2.2. Retrieval-based response

Sau khi xac dinh intent, chatbot khong tra loi bang noi dung co dinh hoan toan. He thong ket hop truy van du lieu tu:

- Orders
- OrderItems
- Products

de tao cau tra loi co ngu canh. Vi du:

- neu user hoi thanh toan lai, bot tim don PendingPayment gan nhat
- neu user hoi goi y hoc lieu, bot tim san pham Available co title/category/description phu hop

Day la mo hinh retrieval-based assistant o muc do phu hop voi do an thuong mai dien tu.

## 3. Kien truc module

### 3.1. Backend

File chinh:

- [be/src/controllers/ai.controller.js](/c:/Users/user/Desktop/EduCart/be/src/controllers/ai.controller.js:1)
- [be/src/routes/ai.routes.js](/c:/Users/user/Desktop/EduCart/be/src/routes/ai.routes.js:1)
- [be/src/routes/index.js](/c:/Users/user/Desktop/EduCart/be/src/routes/index.js:1)

Luong xu ly:

1. Frontend gui `POST /api/ai/chat`
2. Backend nhan `message`
3. Controller chuan hoa text va classify intent
4. Neu co token, backend doc thong tin user de tai don hang gan day
5. Backend tim them san pham goi y neu can
6. He thong tra ve:
   - `intent`
   - `reply`
   - `suggestions`

### 3.2. Frontend

File chinh:

- [fe/src/components/SupportChatbot.tsx](/c:/Users/user/Desktop/EduCart/fe/src/components/SupportChatbot.tsx:1)
- [fe/src/app/layout.tsx](/c:/Users/user/Desktop/EduCart/fe/src/app/layout.tsx:1)

Widget chatbot duoc gan global vao layout, nen xuat hien o toan bo website. Nguoi dung co the:

- mo widget bang nut tro ly AI goc phai duoi
- chon prompt nhanh
- nhap cau hoi tu do
- bam vao goi y san pham de mo trang chi tiet

## 4. Thiet ke du lieu va logic

### 4.1. Dau vao

Request:

```json
{
  "message": "Toi muon thanh toan lai don hang"
}
```

Header:

- co the co `Authorization: Bearer ...`
- neu co token hop le, chatbot se lay ngu canh don hang cua chinh user dang dang nhap

### 4.2. Dau ra

Response:

```json
{
  "ok": true,
  "intent": "payment_retry",
  "reply": "Ban dang co don #1002 ...",
  "suggestions": [
    {
      "id": 12,
      "title": "Bo note Giai tich 1 PDF",
      "href": "/products/12",
      "price": 49000,
      "isForRent": false
    }
  ]
}
```

### 4.3. Logic chinh

#### Theo doi don hang

- tim 3 don buyer gan nhat
- uu tien don moi nhat de tra loi

#### Thanh toan lai

- tim don co `LifecycleState = PendingPayment`
- thong bao han thanh toan theo `PaymentDueAt`

#### Goi y san pham

- lay tu khoa tu cau hoi
- truy van title/category/description trong bang Products
- chi lay san pham `Status = Available`

## 5. Hien thuc UI

Widget chatbot gom 4 phan:

1. Header gradient de nhan dien module AI
2. Vung hoi thoai
3. Prompt nhanh
4. O nhap tin nhan va nut gui

Trang web duoc gan chatbot theo dang floating widget de:

- khong lam vo layout cu
- de demo
- nguoi dung co the hoi o bat ky man hinh nao

## 6. Kiem thu module

### 6.1. Test case chuc nang

#### TC-AI-01: Chao hoi

- Input: `xin chao`
- Expected:
  - intent = `greeting`
  - bot tu gioi thieu cac kha nang ho tro

#### TC-AI-02: Thanh toan lai

- Dieu kien: user co don `PendingPayment`
- Input: `toi muon thanh toan lai don hang`
- Expected:
  - intent = `payment_retry`
  - reply co ma don va han thanh toan

#### TC-AI-03: Theo doi don

- Input: `don hang cua toi dang o dau`
- Expected:
  - intent = `order_tracking`
  - bot tra ve trang thai don gan nhat

#### TC-AI-04: Goi y hoc lieu

- Input: `goi y giao trinh giai tich`
- Expected:
  - intent = `product_recommendation`
  - suggestions tra ve tu kho san pham

#### TC-AI-05: Trust score

- Input: `trust score tinh nhu the nao`
- Expected:
  - intent = `trust_score`
  - bot tra loi dung policy canh bao, tam khoa, ban

#### TC-AI-06: Ban quyen

- Input: `scan giao trinh co duoc ban khong`
- Expected:
  - intent = `copyright`
  - bot canh bao noi dung vi pham ban quyen

### 6.2. Kiem thu giao dien

- chatbot mo duoc o moi trang
- dong/mo widget khong lam mat state trang chinh
- prompt nhanh gui duoc
- goi y san pham bam duoc vao product detail

### 6.3. Kiem thu loi

- gui message rong => backend tra 400
- backend loi => frontend hien thong bao fail-safe
- khong dang nhap => van chat duoc, nhung khong co ngu canh don hang ca nhan

## 7. Uu diem module

- tich hop AI thuc te vao nghiep vu san
- co ket noi du lieu don hang va san pham that
- de mo rong them sentiment analysis, summary, hoac recommendation nang cao
- khong phu thuoc API AI ben ngoai, phu hop demo offline/local

## 8. Han che hien tai

- rule-based nen chua hieu cac cau hoi qua phuc tap
- chua su dung embedding hay LLM ben ngoai
- chua co bo nho dai han cho lich su hoi thoai
- chua co human handoff sang CSKH that

## 9. Huong mo rong

- thay classifier rule-based bang LLM hoac hybrid RAG
- them sentiment analysis cho report/khieu nai
- them goi y san pham ca nhan hoa theo lich su mua
- them tong hop cau hoi thuong gap de toi uu van hanh cham soc khach hang

## 10. Ket luan

Module AI Chatbot cua EduCart da duoc hien thuc o muc do ung dung thuc te cho san thuong mai dien tu hoc lieu. He thong khong chi tra loi hoi dap co dinh, ma con ket hop du lieu don hang va kho san pham de tao phan hoi co ngu canh. Day la mot thanh phan bonus phu hop de chung minh nang luc tich hop AI vao bai toan TMDT thuc te.
