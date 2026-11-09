// Thay nội dung mẫu ở đây. Ảnh và nhạc có thể đặt trong thư mục assets/.
window.CARD_CONTENT = {
  autoAdvance: false,
  greeting: "Gửi Quỳnhh,",
  greetingAt: 0,
  signoff: "Huy mong Quỳnh luôn được là chính mình khi ở bên Huy.",
  signature: "Huy",
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
  // Giữ lời thư của Huy, chia từng ý để đọc trên một màn hình.
  // Đang chuyển câu bằng tay; at chỉ là mốc dự phòng nếu bật tự động lại.
  letterLines: [
    { at: 2, text: "Có một điều mà Huy đã suy nghĩ rất nhìu" },
    { at: 8, text: "Huy đã khom biết cách bắt đầu lá thư này như thế nào." },
    { at: 14, text: "Rồi H nhận ra H cần phải can đảm hơn" },
    { at: 20, text: "để bày tỏ tâm tư này cho Q." },
    { at: 26, text: "H rất vui vì giữa bao nhiêu người, chúng mình đã gặp nhau." },
    { at: 32, text: "Thực sự thì mình đã quen nhau một thời gian cũng chưa phải là dài" },
    { at: 38, text: "và số lần mình gặp gỡ cũng chưa nhiều." },
    { at: 44, text: "Nhưng quãng thời gian ở gần Q" },
    { at: 50, text: "cho H cảm giác một ngày bình thường trở nên đáng nhớ hơn rất nhiều." },
    { at: 56, text: "H thấy mình hợp năng lượng" },
    { at: 62, text: "đơn giản chỉ là lúc hai đứa đi la cà cùng nhau," },
    { at: 68, text: "dù chỉ là ăn vài món lặt vặt" },
    { at: 74, text: "hay đi dạo loanh quanh" },
    { at: 80, text: "và cảm giác mỗi sáng ngủ dậy" },
    { at: 86, text: "biết mình có ai đó để nhắn tin trò chuyện," },
    { at: 92, text: "thích mấy câu đùa vu vơ mà cả hai cùng cười." },
    { at: 98, text: "Từng chút một, H đã thích cả những điều nhỏ bé nhất ở Q." },
    { at: 104, text: "Một người H muốn kể cho nghe mọi chuyện." },
    { at: 110, text: "Một người H muốn gặp, dù ngày hôm ấy chẳng có gì đặc biệt." },
    { at: 116, text: "Ở bên Q, H thấy mình có thêm thật nhiều điều để mong chờ." },
    { at: 122, text: "Và H nhận ra H thật sự muốn nghiêm túc" },
    { at: 128, text: "muốn bước vào cuộc sống của Q." },
    { at: 134, text: "H không hứa mọi ngày đều sẽ hoàn hảo." },
    { at: 140, text: "Nhưng H muốn học cách hiểu Q nhiều hơn." },
    { at: 146, text: "Lắng nghe Q, kể cả những lúc chẳng biết phải nói gì." },
    { at: 152, text: "Cùng Q đi qua ngày vui và cả những ngày chẳng dễ dàng." }
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
      { src: "assets/sticker-pink-sweater.png", x: 52, beside: 1, gap: 4, scale: 1.15, speech: "Vy thíc Kình" },
      { src: "assets/girl-pink.png", x: 76, scale: 1.55 }
    ] },
    { fromLine: 7, bicycle: {
      delay: 3, rideSeconds: 5, dismountSeconds: 1.1,
      pout: "assets/sticker-pout.png", poutAt: 1,
      rider: "assets/sticker-bike-rider.png",
      parked: "assets/bicycle-parked.svg",
      bouquet: "assets/sticker-bouquet.png"
    }, actors: [
      { src: "assets/girl-green.png", x: 77, scale: 1.2 }
    ] },
    { fromLine: 9, stroll: true, actors: [
      { src: "assets/girl-glasses-cutout.png", x: 40, scale: .95 },
      { src: "assets/sticker-finger-heart.png", version: 2, x: 60, scale: 1.05 }
    ] }
  ],
  // Sticker ảnh tách nền; crop (nếu có) dùng để hiển thị một biểu cảm từ sheet.
  stickers: [
    // Ảnh mới đã sẵn sàng; chờ sắp xếp vào các cảnh tiếp theo.
    { src: "assets/sticker-pink-sweater.png" },
    { src: "assets/girl-pink-peace.png" },
    { src: "assets/sticker-bouquet.png" },
    { src: "assets/sticker-pout.png" },
    { src: "assets/sticker-finger-heart.png" },
    { src: "assets/girl-glasses-cutout.png" },
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
