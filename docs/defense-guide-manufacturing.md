# 📋 Hướng Dẫn Trình Bày Bảo Vệ Đồ Án

## Chủ đề: Quy Trình Tạo Công Lệnh Sản Xuất (Manufacturing Order)

> **Thời lượng khuyến nghị:** 8-12 phút cho phần demo này
> **Chuẩn bị:** Mở sẵn app ở trang danh sách BOM, chuẩn bị data mẫu

---

## 🎬 PHẦN 1: MỞ ĐẦU (30 giây)

### Cách nói:

> _"Bây giờ em xin demo quy trình tạo công lệnh sản xuất - đây là một trong những chức năng cốt lõi của hệ thống quản lý chuỗi cung ứng. Quy trình này bao gồm 3 bước chính: tạo định mức nguyên vật liệu hay còn gọi là BOM, sau đó tạo quy trình sản xuất, và cuối cùng là tạo công lệnh sản xuất."_

### Tip:

- Nói chậm, rõ ràng
- Đưa tay chỉ lên màn hình khi nhắc đến từng phần
- Tạo eye contact với giám khảo trước khi bắt đầu demo

---

## 🎬 PHẦN 2: TẠO BOM - Bill of Materials (2-3 phút)

### Bước 1: Giới thiệu BOM

**Cách nói:**

> _"Đầu tiên, trước khi sản xuất bất kỳ sản phẩm nào, chúng ta cần xác định sản phẩm đó được làm từ những nguyên vật liệu gì và với số lượng bao nhiêu. Đây chính là mục đích của BOM - Bill of Materials, hay trong hệ thống em gọi là Định mức nguyên vật liệu."_

### Bước 2: Demo tạo BOM

**Thao tác:** Click vào menu "Sản xuất" → "Định mức NVL" → "Tạo mới"

**Cách nói khi thao tác:**

> _"Em sẽ tạo BOM cho sản phẩm [Tên sản phẩm - VD: Bàn làm việc]. Để sản xuất 1 chiếc bàn, em cần thêm các nguyên vật liệu..."_

**Thêm NVL và giải thích:**

> _"Ví dụ đây là gỗ ván - số lượng 2 tấm cho 1 bàn, ốc vít - 8 cái, keo dán - 0.5 lít. Mỗi dòng này đại diện cho một loại nguyên vật liệu cần thiết."_

**Nhấn Lưu:**

> _"Sau khi lưu, BOM này sẽ được gắn với sản phẩm. Mỗi sản phẩm chỉ có một BOM duy nhất, nếu cần thay đổi thì phải chỉnh sửa BOM hiện tại."_

### Điểm nhấn kỹ thuật:

> _"Điểm đặc biệt ở đây là số lượng NVL trong BOM là cho 1 đơn vị sản phẩm. Khi tạo công lệnh sản xuất 100 sản phẩm, hệ thống sẽ tự động nhân lên để tính tổng NVL cần thiết."_

---

## 🎬 PHẦN 3: TẠO QUY TRÌNH SẢN XUẤT - Stage (2-3 phút)

### Bước 1: Giới thiệu

**Cách nói:**

> _"Bước tiếp theo, chúng ta cần định nghĩa quy trình sản xuất - tức là sản phẩm này được làm qua những công đoạn nào, thứ tự ra sao."_

### Bước 2: Demo tạo quy trình

**Thao tác:** Click "Quy trình SX" → "Tạo mới"

**Cách nói:**

> _"Em chọn sản phẩm [cùng sản phẩm đã tạo BOM], sau đó thêm các công đoạn theo thứ tự thực hiện."_

**Thêm công đoạn:**

> _"Công đoạn 1 - Cắt gỗ, thời gian dự kiến 30 phút. Công đoạn 2 - Mài bóng, 20 phút. Công đoạn 3 - Sơn phủ, 45 phút. Công đoạn 4 - Lắp ráp, 25 phút."_

**Nhấn Lưu và highlight:**

> _"Hệ thống tự động tính tổng thời gian dự kiến là 120 phút, tức khoảng 2 tiếng cho 1 sản phẩm. Thông tin này sẽ giúp người quản lý ước lượng được thời gian hoàn thành đơn hàng."_

### Chuyển tiếp:

> _"Bây giờ chúng ta đã có đầy đủ 2 điều kiện: biết cần NVL gì và biết làm như thế nào. Tiếp theo là tạo công lệnh sản xuất thực tế."_

---

## 🎬 PHẦN 4: TẠO CÔNG LỆNH SẢN XUẤT - MO (2-3 phút)

### Bước 1: Tạo MO

**Thao tác:** Click "Công lệnh SX" → "Tạo mới"

**Cách nói:**

> _"Đây là nơi chúng ta tạo công lệnh sản xuất thực tế. Em chọn sản phẩm cần sản xuất, số lượng - ví dụ 50 chiếc, chọn dây chuyền sản xuất nếu nhà máy có nhiều dây chuyền, và đặt thời gian bắt đầu, kết thúc dự kiến."_

**Nhấn Lưu:**

> _"Công lệnh được tạo với trạng thái 'Chờ xác nhận'. Tại sao lại cần xác nhận? Vì trước khi bắt đầu sản xuất, hệ thống cần kiểm tra xem kho có đủ nguyên vật liệu không."_

---

## 🎬 PHẦN 5: XÁC NHẬN & KIỂM TRA TỒN KHO (3-4 phút) ⭐ PHẦN QUAN TRỌNG

### Bước 1: Mở chi tiết MO

**Thao tác:** Click vào MO vừa tạo → Click nút "Xác nhận"

**Cách nói:**

> _"Khi click xác nhận, hệ thống sẽ chuyển sang màn hình kiểm tra tồn kho. Đây là một tính năng quan trọng của hệ thống."_

### Bước 2: Giải thích màn hình Check Inventory

**Cách nói:**

> _"Như các thầy cô thấy, hệ thống hiển thị danh sách tất cả nguyên vật liệu cần để sản xuất 50 sản phẩm."_

**Chỉ vào bảng:**

> _"Cột 'Số lượng cần' - đây là con số được tính tự động bằng công thức: số lượng trong BOM nhân với số lượng MO. Ví dụ BOM cần 2 tấm gỗ cho 1 bàn, MO sản xuất 50 bàn, thì số lượng cần là 100 tấm gỗ."_

### Bước 3: Demo kiểm tra

**Thao tác:** Chọn kho xuất → Click "Kiểm tra tồn kho"

**Cách nói:**

> _"Em chọn kho nguyên vật liệu, sau đó nhấn kiểm tra. Hệ thống sẽ gọi API để lấy số liệu tồn kho thực tế của từng NVL trong kho đã chọn."_

**Chờ kết quả:**

> _"Cột 'Tồn kho sẵn có' hiển thị số lượng thực tế có thể sử dụng. Lưu ý là 'sẵn có' chứ không phải tổng tồn kho - vì có thể một phần đã được đặt trước cho công lệnh khác."_

### Bước 4: Giải thích trạng thái

**Cách nói:**

> _"Cột trạng thái sẽ hiển thị 'Đủ' màu xanh nếu tồn kho đáp ứng được, hoặc 'Không đủ' màu đỏ nếu thiếu. Hệ thống chỉ cho phép xác nhận khi TẤT CẢ nguyên vật liệu đều đủ."_

### Bước 5: Xác nhận (nếu đủ)

**Thao tác:** Click "Xác nhận MO"

**Cách nói - Đây là điểm nhấn quan trọng:**

> _"Và đây là phần thú vị nhất. Khi em nhấn xác nhận, hệ thống thực hiện 3 việc quan trọng đồng thời:"_

> _"Thứ nhất - Cập nhật trạng thái MO sang 'Chờ sản xuất'."_

> _"Thứ hai - Tự động tăng số lượng 'OnDemand' của từng NVL trong kho. Điều này có nghĩa là 100 tấm gỗ đó sẽ được 'đặt trước' cho công lệnh này, các công lệnh khác không thể sử dụng. Đây là cơ chế giúp tránh tình trạng 2 công lệnh cùng claim một NVL."_

> _"Thứ ba - Tự động tạo phiếu xuất kho với loại 'Sản xuất' và mã tham chiếu là mã công lệnh. Nhân viên kho sẽ dựa vào phiếu này để xuất NVL cho bộ phận sản xuất."_

---

## 🎬 PHẦN 6: QUÁ TRÌNH SẢN XUẤT & QR CODE (2-3 phút)

### Bước 1: Theo dõi tiến trình

**Thao tác:** Quay lại chi tiết MO

**Cách nói:**

> _"Sau khi được xác nhận, MO chuyển sang trạng thái 'Chờ sản xuất'. Khi công nhân bắt đầu làm, họ sẽ đánh dấu từng công đoạn hoàn thành."_

### Bước 2: Demo hoàn thành công đoạn

**Thao tác:** Click "Hoàn thành" cho từng công đoạn

**Cách nói:**

> _"Hệ thống hiển thị timeline các công đoạn theo đúng quy trình đã định nghĩa. Công đoạn đang thực hiện được highlight, có nút hoàn thành. Khi click, hệ thống ghi nhận thời gian bắt đầu và kết thúc thực tế."_

### Bước 3: Hoàn thành sản xuất - QR Code

**Cách nói khi hoàn thành công đoạn cuối:**

> _"Và khi công đoạn cuối cùng được hoàn thành, hệ thống tự động thực hiện một việc rất quan trọng: tạo các sản phẩm vào hệ thống kèm theo QR Code."_

**Highlight tính năng QR:**

> _"Mỗi sản phẩm được tạo sẽ có một QR Code riêng, được gom theo lô sản xuất - batch number. QR Code này chứa thông tin truy xuất nguồn gốc: sản phẩm được sản xuất từ công lệnh nào, ngày nào, từ những NVL nào."_

**Demo download QR:**

> _"Nhân viên có thể tải về file PDF chứa tất cả QR Code của lô hàng để in và dán lên sản phẩm."_

---

## 🎬 PHẦN 7: NHẬP KHO THÀNH PHẨM (1-2 phút)

**Thao tác:** MO đang ở trạng thái "Chờ nhập kho"

**Cách nói:**

> _"Sau khi sản xuất xong, sản phẩm cần được nhập vào kho thành phẩm. Hệ thống cho phép chọn kho đích và tạo phiếu nhập kho với một click."_

**Demo tạo phiếu nhập:**

> _"Phiếu nhập kho cũng sẽ tham chiếu đến mã công lệnh, giúp việc truy xuất sau này dễ dàng."_

---

## 🎬 PHẦN 8: TỔNG KẾT (30 giây)

**Cách nói:**

> _"Như vậy, em vừa demo toàn bộ quy trình sản xuất từ đầu đến cuối. Các điểm nổi bật của hệ thống bao gồm:_
>
> - _Tự động tính toán NVL dựa trên BOM_
> - _Kiểm tra tồn kho trước khi sản xuất_
> - _Cơ chế OnDemand để đặt trước NVL_
> - _Liên kết tự động với phiếu xuất/nhập kho_
> - _Tạo QR Code tự động cho sản phẩm_
> - _Truy xuất nguồn gốc đầy đủ"_

---

## 💡 MẸO XỬ LÝ CÂU HỎI PHẢN BIỆN

### Câu hỏi 1: "Nếu không đủ NVL thì sao?"

**Trả lời:**

> _"Dạ, nếu không đủ NVL, hệ thống sẽ hiển thị trạng thái 'Không đủ' màu đỏ và disable nút xác nhận. Người dùng có 2 lựa chọn: một là đợi nhập thêm NVL vào kho, hai là điều chỉnh giảm số lượng sản xuất trong công lệnh."_

### Câu hỏi 2: "OnDemand là gì? Tại sao cần?"

**Trả lời:**

> _"OnDemand là số lượng đã được 'đặt trước' cho các công lệnh đã xác nhận nhưng chưa xuất kho thực tế. Công thức tính tồn kho sẵn có là: Tồn kho - OnDemand. Điều này giúp tránh trường hợp 2 công lệnh cùng sử dụng một NVL khi tồn kho chỉ đủ cho 1 công lệnh."_

### Câu hỏi 3: "QR Code chứa thông tin gì?"

**Trả lời:**

> _"QR Code chứa mã sản phẩm duy nhất, batch number, mã công lệnh. Khi quét, có thể truy xuất được sản phẩm thuộc lô nào, sản xuất ngày nào, từ những NVL nào (thông qua BOM và phiếu xuất kho)."_

### Câu hỏi 4: "Nếu sản xuất hỏng, không đạt số lượng thì sao?"

**Trả lời:**

> _"Khi hoàn thành công lệnh, hệ thống cho phép nhập số lượng hoàn thành thực tế, có thể khác với số lượng dự kiến ban đầu. Số lượng này sẽ được ghi nhận và tạo đúng số sản phẩm với QR Code tương ứng."_

### Câu hỏi 5: "Các trạng thái của công lệnh?"

**Trả lời:**

> _"Công lệnh có 6 trạng thái: Chờ xác nhận → Chờ sản xuất → Đang sản xuất → Chờ nhập kho → Đã hoàn thành. Ngoài ra còn có trạng thái 'Đã hủy' cho trường hợp hủy công lệnh."_

---

## 📝 CHECKLIST TRƯỚC KHI DEMO

- [ ] Đã tạo sẵn 1 sản phẩm mẫu trong hệ thống
- [ ] Đã tạo sẵn các NVL cần thiết
- [ ] Đã nhập tồn kho cho NVL (đủ số lượng để demo thành công)
- [ ] Đã tạo ít nhất 1 dây chuyền sản xuất
- [ ] Đã tạo ít nhất 1 kho nguyên vật liệu và 1 kho thành phẩm
- [ ] App đang chạy ổn định, đã test thử 1 lần
- [ ] Mở sẵn browser ở trang danh sách BOM
- [ ] Tắt các notification/popup không cần thiết
- [ ] Điện thoại để chế độ im lặng

---

## ⏱️ TIMELINE TỔNG THỂ

| Phần     | Nội dung         | Thời gian    |
| -------- | ---------------- | ------------ |
| 1        | Mở đầu           | 0:30         |
| 2        | Tạo BOM          | 2:30         |
| 3        | Tạo Quy trình    | 2:30         |
| 4        | Tạo Công lệnh    | 2:00         |
| 5        | Kiểm tra tồn kho | 3:30         |
| 6        | Sản xuất & QR    | 2:30         |
| 7        | Nhập kho         | 1:30         |
| 8        | Tổng kết         | 0:30         |
| **Tổng** |                  | **~15 phút** |

---

> **Lưu ý cuối:** Nếu bị timeout hoặc lỗi API trong lúc demo, hãy bình tĩnh nói: _"Dạ, do mạng/server đang chậm, em sẽ thử lại"_ hoặc _"Em đã chuẩn bị sẵn data ở bước tiếp theo để tiết kiệm thời gian"_ rồi chuyển sang demo tiếp từ data đã chuẩn bị sẵn.

**Chúc bạn bảo vệ thành công! 🎓**
