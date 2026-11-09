# Gửi em ♡

Thiệp web hồng nhẹ bằng HTML/CSS/JavaScript, dùng trên điện thoại và laptop, phù hợp GitHub Pages. Không cần cài thư viện hoặc build.

Toàn bộ trải nghiệm nằm trên **một màn hình**, theo cách trình bày trong ảnh tham chiếu: mỗi lần chỉ một câu lớn in nghiêng ở giữa, chữ được gõ dần từng ký tự, nút nhạc nhỏ ở đáy, không có thanh tua. Chữ được gõ dần theo nhạc, không hiển thị câu tiếp theo bên dưới, không tích lũy đoạn văn hay cuộn trang. Giữ nền hồng nhẹ. Sticker tách nền xuất hiện bên cạnh câu đang chạy; **Lá thư** mở toàn bộ nội dung để đọc tùy ý. Đã bỏ mục Kỷ niệm.

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

Hiệu ứng nhập chữ dùng thời gian phát nhạc: tạm dừng sẽ dừng gõ, phát tiếp sẽ tiếp tục; tốc độ được canh để hoàn thành trước câu kế. Thiết bị giảm chuyển động hiển thị ngay toàn bộ câu. Chạm màn hình vẫn chuyển ngay sang câu mới.

Chuyển câu: câu cũ mờ dần và trôi lên trong 380 ms; câu mới hiện mềm từ phía dưới trong 680 ms, đồng thời gõ từng ký tự. Chạm liên tục hủy lớp chuyển cũ để tránh chồng nhiều câu. Chế độ giảm chuyển động bỏ hiệu ứng này.


Sticker hiện nguyên hình, đứng yên; mỗi lần chuyển câu chỉ mờ đi trong 180 ms rồi hiện lại trong 260 ms, độc lập với hiệu ứng gõ chữ. Ảnh vẫn thay sau mỗi hai câu.


Bản thử câu chuyện sticker dùng stickerScenes trong content.js: câu 0 ảnh khóc; câu 1 girl-black; câu 2 surprise nhìn về girl-light; từ câu 3 cap tiến tới girl-pink trong 7 giây rồi giữ cảnh này. Chuyển động dùng đồng hồ nhạc, tạm dừng khi nhạc dừng và không bắt đầu lại khi chỉ chuyển câu trong cùng cảnh.


Bộ sticker chuẩn bị cho cảnh tiếp theo: sticker-pout.png (bĩu môi), sticker-finger-heart.png (tim tay), girl-glasses-cutout.png (bạn nữ đeo kính). Các ảnh này đã tách nền, có viền trắng, tạm enabled:false để giữ nguyên bốn cảnh đang thử.


Cảnh 1 giữ nguyên sticker-cry khi girl-black xuất hiện (preserveExisting). Surprise có nét vẽ SVG 2D độc lập: tia ngạc nhiên, sao và tim nhỏ. Girl-pink scale 1.55 để chiều cao gần bằng cap. Năm trái tim SVG nằm bên trong phần tử cap nên luôn đi theo vị trí của cap; nét vẽ chuyển động nhẹ và tắt khi bật giảm chuyển động.


Cảnh từ câu 5 (mốc 24 giây của file đã cắt): sticker-pink-sweater đứng cạnh girl-pink, bong bóng thoại ghi đúng Vy thíc Kình. Cảnh cap trước đó kéo dài qua hai câu để đủ thời gian tiến lại gần. Lời thoại có bản văn bản dành cho trình đọc màn hình.


Cảnh từ câu 7: girl-green xuất hiện, chờ 2 giây rồi bạn chạy xe tới trong 6 giây. Khi dừng, phần xuống xe kéo dài 1,1 giây; chỉ sau khi tư thế ngồi đã mờ hết mới hiện sticker-bouquet cầm hoa. Xe đậu lại phía sau. Chuyển động, bánh xe và thời điểm hiện hoa dùng đồng hồ nhạc nên dừng cùng âm thanh. Giảm chuyển động sẽ hiển thị cảnh cuối ngay.


Đã chèn sticker-pout vào trước xe đạp: girl-green chờ riêng 1 giây, pout xuất hiện trong khoảng giây 1–3 rồi mờ đi; sau đó xe đi vào trong 5 giây, xuống xe và mới hiện bó hoa. Pout không xuất hiện đồng thời với người đang chạy xe.


Điều hướng mới: chạm nửa trái vùng nội dung để lùi một câu; nửa phải để tiến một câu. Laptop dùng ArrowLeft/ArrowRight; Enter/Space vẫn tiến khi vùng chữ được chọn. Có thể lùi từ câu hỏi cuối, không lùi vượt lời chào. Nút nhạc, Lá thư và nút trả lời giữ chức năng riêng. Nhạc không bị tua khi chuyển câu. Khi nhạc đang dừng, câu vừa chọn hiện đầy đủ để đọc.

