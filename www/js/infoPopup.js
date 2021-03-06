var resize;

resize = function() {
  var heightRatio, infoPopup, infoPopupWidth, widthRatio;
  infoPopup = ($("#infoPopup .popup"))[0];
  widthRatio = .7;
  heightRatio = .6;
  infoPopupWidth = window.innerWidth * widthRatio;
  infoPopup.style.width = infoPopupWidth;
  infoPopup.style.left = (window.innerWidth - infoPopupWidth) / 2;
  return infoPopup.style.top = (window.innerHeight - $(infoPopup).height()) / 2;
};

resize();

($("#infoPopup")).hide();

($(".info-label, img.exit, .background")).click(function() {
  return ($("#infoPopup")).toggle();
});

window.addEventListener("resize", function() {
  return resize();
});
