// Thay nội dung mẫu ở đây. Ảnh và nhạc có thể đặt trong thư mục assets/.
window.CARD_CONTENT = {
  greeting: "Gửi em, người anh thương.",
  greetingAt: 0,
  signoff: "Thương em, hôm nay và những ngày sau nữa.",
  signature: "Anh của em",
  signoffAt: 158,
  signatureAt: 162,
  question: "Mình cùng viết tiếp<br>câu chuyện này, em nhé?",
  questionDescription: "Thêm những buổi hẹn, những chuyến đi và thật nhiều ngày bình yên bên nhau.",
  yesLabel: "Em đồng ý",
  laterLabel: "Để em nghĩ thêm nhé",
  yesMessage: "Vậy mình cùng tạo thêm thật nhiều kỷ niệm đẹp nhé. Thương em! ♡",
  laterMessage: "Em cứ dành thời gian cho mình nhé. Cảm ơn em đã đọc hết những lời anh muốn nói. ♡",
  music: {
    src: "assets/vien-da-nho-from-41.m4a",
    title: "Viên Đá Nhỏ",
    artist: "Nguyễn Hùng · OST Bò Sữa Bay",
    startSeconds: 0,
    sourceOffsetSeconds: 41,
    durationSeconds: 164.52
  },
  // Mỗi mục là một dòng/ý xuất hiện. Đây là tâm thư mẫu, không phải lời bài hát.
  // at tính bằng giây từ đầu file đã cắt (0 = giây 41 trong bản gốc).
  // Các mốc theo đầu câu hát; chữ bên dưới là tâm thư mẫu riêng.
  letterLines: [
    { at: 2, text: "Có một điều anh muốn nói với em từ rất lâu." },
    { at: 9, text: "Anh đã nghĩ khá nhiều về cách bắt đầu lá thư này." },
    { at: 12, text: "Rồi anh nhận ra: với em, anh chỉ cần thật lòng." },
    { at: 16, text: "Cảm ơn em vì đã xuất hiện trong cuộc đời anh." },
    { at: 24, text: "Vì những câu chuyện chẳng có đầu có cuối." },
    { at: 30, text: "Vì đã lắng nghe cả những điều anh vụng về chưa nói hết." },
    { at: 35, text: "Và khiến những ngày bình thường trở nên đáng nhớ." },
    { at: 45, text: "Anh thích cả những điều bé xíu ở em." },
    { at: 53, text: "Một nụ cười. Một câu hỏi han vào cuối ngày." },
    { at: 60, text: "Hay chỉ là cảm giác biết rằng có em ở đó." },
    { at: 64, text: "Từng chút một, em đã trở thành một phần thật dịu dàng." },
    { at: 69, text: "Một người anh muốn kể cho nghe mọi chuyện." },
    { at: 76, text: "Một người anh muốn gặp, dù ngày hôm ấy chẳng có gì đặc biệt." },
    { at: 82, text: "Ở bên em, anh thấy mình có thêm thật nhiều điều để mong chờ." },
    { at: 91, text: "Anh không hứa mọi ngày đều sẽ hoàn hảo." },
    { at: 95, text: "Nhưng anh muốn học cách hiểu em nhiều hơn." },
    { at: 100, text: "Lắng nghe em, kể cả những lúc em chẳng biết phải nói gì." },
    { at: 105, text: "Cùng em đi qua ngày vui và cả những ngày chẳng dễ dàng." },
    { at: 111, text: "Anh mong em luôn được là chính mình khi ở bên anh." },
    { at: 118, text: "Không cần phải mạnh mẽ hay tươi cười trong mọi khoảnh khắc." },
    { at: 129, text: "Nếu có một điều anh muốn em nhớ sau lá thư này…" },
    { at: 133, text: "Thì đó là: em luôn thật đặc biệt với anh." },
    { at: 137, text: "Anh rất vui vì giữa bao nhiêu người, chúng mình đã gặp nhau." },
    { at: 143, text: "Và anh vẫn muốn cùng em tạo thêm thật nhiều kỷ niệm." },
    { at: 152, text: "Thêm những cuộc hẹn nhỏ. Thêm những ngày bình yên." }
  ],
  // Bản thử câu chuyện: mỗi cảnh đầu đi cùng một câu, rồi giữ cảnh cuối.
  stickerScenes: [
    { fromLine: 0, actors: [{ src: "assets/sticker-cry.png", x: 24 }] },
    { fromLine: 1, preserveExisting: true, actors: [
      { src: "assets/sticker-cry.png", x: 24 },
      { src: "assets/girl-black.png", x: 76 }
    ] },
    { fromLine: 2, actors: [
      { src: "assets/sticker-surprise.png", x: 24, flip: true, doodles: "surprise" },
      { src: "assets/girl-light.png", x: 76 }
    ] },
    { fromLine: 3, duration: 7, actors: [
      { src: "assets/sticker-cap.png", x: 18, toX: 52, doodles: "hearts" },
      { src: "assets/girl-pink-peace.png", x: 78, scale: 1.38 }
    ] },
    { fromLine: 5, actors: [
      { src: "assets/sticker-pink-sweater.png", x: 26, scale: 1.15, speech: "Vy thíc Kình" },
      { src: "assets/girl-pink.png", x: 76, scale: 1.55 }
    ] }
  ],
  // Sticker ảnh tách nền; crop (nếu có) dùng để hiển thị một biểu cảm từ sheet.
  stickers: [
    // Ảnh mới đã sẵn sàng; chờ sắp xếp vào các cảnh tiếp theo.
    { src: "assets/sticker-pink-sweater.png" },
    { src: "assets/girl-pink-peace.png" },
    { src: "assets/sticker-bouquet.png", enabled: false },
    { src: "assets/sticker-pout.png", enabled: false },
    { src: "assets/sticker-finger-heart.png", enabled: false },
    { src: "assets/girl-glasses-cutout.png", enabled: false },
    { src: "assets/love-sticker.png", enabled: false },
    { src: "assets/girl-black.png" },
    { src: "assets/sticker-cry.png" },
    { src: "assets/girl-light.png" },
    { src: "assets/sticker-cap.png" },
    { src: "assets/boy-expressions.png", enabled: false, crop: [223,24,288,398,725,2170] },
    { src: "assets/girl-cheek.png" },
    { src: "assets/sticker-surprise.png" },
    { src: "assets/girl-pink.png" },
    { src: "assets/boy-expressions.png", enabled: false, crop: [226,460,282,400,725,2170] },
    { src: "assets/boy-peace.png", enabled: false },
    { src: "assets/girl-green.png" },
    { src: "assets/boy-expressions.png", enabled: false, crop: [173,915,388,359,725,2170] },
    { src: "assets/boy-yellow.png", enabled: false },
    { src: "assets/boy-expressions.png", enabled: false, crop: [213,1335,308,394,725,2170] },
    { src: "assets/boy-expressions.png", enabled: false, crop: [225,1770,287,393,725,2170] }
  ]
};
