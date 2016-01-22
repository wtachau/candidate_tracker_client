var bernieImageContainer, checkExist, clintonImageContainer, positionInfoBox, ref, showImages, trumpImageContainer;

$("#infowindow").hide();

checkExist = setInterval((function() {
  if ($('.line-trump path').length) {
    showImages();
    clearInterval(checkExist);
  }
}), 100);

ref = [0, 0, 0], trumpImageContainer = ref[0], clintonImageContainer = ref[1], bernieImageContainer = ref[2];

showImages = function() {
  var bernieImage, clintonImage, imageNum, numberOfPictures, trumpImage;
  trumpImageContainer = ($("#infowindow .trump"))[0];
  clintonImageContainer = ($("#infowindow .clinton"))[0];
  bernieImageContainer = ($("#infowindow .bernie"))[0];
  trumpImage = $(trumpImageContainer).find("img");
  clintonImage = $(clintonImageContainer).find("img");
  bernieImage = $(bernieImageContainer).find("img");
  numberOfPictures = 6;
  imageNum = Math.floor(Math.random() * 6) + 1;
  trumpImage.attr('src', "/images/trump/" + imageNum + ".png");
  imageNum = Math.floor(Math.random() * 6) + 1;
  bernieImage.attr('src', "/images/bernie/" + imageNum + ".png");
  imageNum = Math.floor(Math.random() * 6) + 1;
  clintonImage.attr('src', "/images/clinton/" + imageNum + ".png");
  positionInfoBox();
  return $("#infowindow").show();
};

positionInfoBox = function() {
  var boxHeight, boxWidth, infoBox;
  boxWidth = 200;
  boxHeight = 400;
  infoBox = ($("#infowindow"))[0];
  infoBox.style.top = (window.innerHeight - boxHeight) / 2;
  infoBox.style.width = 200;
  return infoBox.style.left = (window.innerWidth - boxWidth) / 2;
};
