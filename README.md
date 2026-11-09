# Gửi em ♡

Thiệp web hồng nhẹ bằng HTML/CSS/JavaScript, dùng trên điện thoại và laptop, phù hợp GitHub Pages. Không cần cài thư viện hoặc build.

Toàn bộ trải nghiệm nằm trên **một màn hình**, theo cách trình bày trong ảnh tham chiếu: mỗi lần chỉ một câu lớn in nghiêng ở giữa, câu kế tiếp mờ phía dưới, nút nhạc nhỏ ở đáy, không có thanh tua. Chuyển câu bằng hiệu ứng hiện dần theo nhạc, không tích lũy đoạn văn hay cuộn trang. Giữ nền hồng nhẹ. Sticker tách nền xuất hiện bên cạnh câu đang chạy; **Lá thư** mở toàn bộ nội dung để đọc tùy ý. Đã bỏ mục Kỷ niệm.

## Xem thử

Nền hồng kem có các lớp lụa và ánh sáng chuyển động chậm liên tục, độc lập với việc phát/tạm dừng nhạc. Tự tắt chuyển động khi thiết bị bật chế độ giảm chuyển động.

Mở `index.html` trong trình duyệt, hoặc chạy `python preview.py` rồi mở http://localhost:4173. Trình xem thử hỗ trợ tải từng phần của âm thanh để tua nhạc. Phần thiệp và nhạc không cần kết nối YouTube. Font dùng Google Fonts khi có mạng, có font hệ thống thay thế.

## Nhạc và tâm thư

- Nhạc lấy từ file `videoplayback.m4a` người dùng cung cấp, cắt chính xác từ giây **41** tới cuối thành `assets/vien-da-nho-from-41.m4a` (khoảng **2 phút 44,52 giây**). File gốc được giữ nguyên.
- File đã cắt bắt đầu ở giây 0; `sourceOffsetSeconds: 41` giữ đồng hồ trên thiệp hiển thị theo mốc bản gốc từ 0:41.
- Bấm **Mở lời thương**. Mỗi câu xuất hiện tại mốc một câu hát, câu trước nhường chỗ cho câu mới. Các mốc được đối chiếu theo câu hát trong cùng bản nhạc, có độ chính xác ở mức giây, có thể tinh chỉnh bằng số thập phân.
- Chạm vùng tâm thư/nền để sang câu tiếp, hoặc dùng Enter/Space khi vùng chữ được chọn. Nhạc tiếp tục phát liền mạch. Câu đã chuyển bằng tay được giữ cho đến khi nhịp tự động bắt kịp; không bị chuyển ngược. Nghe lại đặt lại cả lời thư và nhạc.
- Đồng bộ dùng `audio.currentTime`: tạm dừng nhạc sẽ giữ nguyên câu hiện tại, nghe lại sẽ bắt đầu từ lời chào. Chữ không chạy tiếp khi âm thanh đang chờ tải.
- Chỉnh lời mẫu trong `content.js`: `greeting`, `letterLines`, `signoff`, `signature`. Mỗi dòng có `at` là số giây tính từ đầu **file đã cắt**. Ví dụ `at: 2` tương ứng giây **43** bản gốc. Mốc lời chào, lời kết và chữ ký lần lượt ở `greetingAt`, `signoffAt`, `signatureAt`.
- Nếu thêm hoặc bớt dòng, đặt lại các mốc theo thứ tự tăng dần. Dòng không có `at` sẽ dùng phân bố tự động theo độ dài; bản hiện tại dùng mốc riêng cho tất cả các dòng.
- Đây là tâm thư mẫu riêng, không phải chép lời bài hát. Khi có tâm thư thật có thể chỉnh nội dung và canh mốc lại.
- Khi bài hát kết thúc, câu hỏi hiện ở chính giữa màn hình, thay câu cuối. Nút **Lá thư** mở toàn bộ tâm thư trong hộp đọc, đồng thời tạm dừng nhạc.
- Chế độ giảm chuyển động bỏ hiệu ứng chuyển câu; mốc xuất hiện vẫn giữ nguyên.
- Câu trả lời chỉ hiển thị trên trang, chưa được lưu hoặc gửi đi.

## Sticker và câu hỏi

Đã thêm 13 sticker từ các ảnh được gửi: 5 ảnh bạn nữ, 3 ảnh bạn nam riêng và 5 biểu cảm trong một dải. Dải gửi lặp lại chỉ dùng một lần. Sticker có nền trong suốt, viền trắng, thay đổi sau mỗi hai câu và đổi góc trái/phải. Khi tới câu hỏi cuối, sticker nhường chỗ cho phần trả lời.

Sửa danh sách `stickers` trong `content.js` để thay ảnh hoặc đổi thứ tự. `crop` dùng tọa độ để hiển thị từng biểu cảm trong sheet; file PNG gốc vẫn được giữ nguyên. Tất cả ảnh tiêu thụ nằm trong `assets/`. Câu hỏi và lời đáp cũng nằm trong `content.js`.

## Đưa lên GitHub Pages

1. Tạo repository GitHub, đưa các tệp web và thư mục `assets/` lên; `index.html` nằm ở thư mục gốc. Không cần đưa `.preview/` lên.
2. Vào **Settings → Pages → Deploy from a branch**, chọn nhánh **main**, thư mục **/ (root)** và **Save**.
3. Mở đường dẫn GitHub Pages khi triển khai hoàn tất.

[Hướng dẫn GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site). Các đường dẫn tài nguyên tương đối hỗ trợ repository con. Repo: https://github.com/Khanhhuyz/gui-em · Thiệp: https://khanhhuyz.github.io/gui-em/. GitHub Pages phục vụ trang tĩnh liên tục, không cần giữ máy hoặc trình xem thử hoạt động.

## Kiểm tra

`node --test tests/letter-timing.test.cjs` kiểm tra các mốc câu, tua ngược, thời lượng và cấu hình của tâm thư mẫu.

Theo yêu cầu mới nhất, toàn bộ 8 sticker bạn nam đang có `enabled: false`. Thiệp chỉ hiển thị 5 ảnh bạn nữ. Tệp ảnh vẫn được giữ nguyên; bỏ `enabled: false` để bật lại.

Các ảnh bạn nam đang ẩn chỉ giữ tại máy, được loại khỏi Git và không tải lên repo công khai. Muốn bật lại cần thêm ảnh tương ứng vào repo.
