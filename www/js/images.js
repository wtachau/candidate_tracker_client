var bernieImageContainer, checkExist, clintonImageContainer, positionImages, ref, showImages, trumpImageContainer;

$("#trump-image, #clinton-image, #bernie-image").hide();

checkExist = setInterval((function() {
  if ($('.line-trump path').length) {
    showImages();
    clearInterval(checkExist);
  }
}), 100);

ref = [0, 0, 0], trumpImageContainer = ref[0], clintonImageContainer = ref[1], bernieImageContainer = ref[2];

showImages = function() {
  var bernieImage, clintonImage, imageNum, numberOfPictures, trumpImage;
  trumpImageContainer = ($("#trump-image"))[0];
  clintonImageContainer = ($("#clinton-image"))[0];
  bernieImageContainer = ($("#bernie-image"))[0];
  trumpImage = $("#trump-image img");
  clintonImage = $("#clinton-image img");
  bernieImage = $("#bernie-image img");
  numberOfPictures = 6;
  imageNum = Math.floor(Math.random() * 6) + 1;
  trumpImage.attr('src', "/images/trump/" + imageNum + ".png");
  imageNum = Math.floor(Math.random() * 6) + 1;
  bernieImage.attr('src', "/images/bernie/" + imageNum + ".png");
  imageNum = Math.floor(Math.random() * 6) + 1;
  clintonImage.attr('src', "/images/clinton/" + imageNum + ".png");
  positionImages();
  return $("#trump-image, #clinton-image, #bernie-image").show();
};

positionImages = function() {
  var bernieRect, clintonRect, trumpRect;
  trumpRect = $(".line-trump path")[0].getBoundingClientRect();
  clintonRect = $(".line-clinton path")[0].getBoundingClientRect();
  bernieRect = $(".line-bernie path")[0].getBoundingClientRect();
  trumpImageContainer.style.left = 150;
  trumpImageContainer.style.top = trumpRect.top + 25;
  bernieImageContainer.style.left = bernieRect.width / 2;
  bernieImageContainer.style.top = bernieRect.top - 25;
  clintonImageContainer.style.left = clintonRect.width - 100;
  return clintonImageContainer.style.top = clintonRect.top + 10;
};

window.addEventListener("resize", function() {
  return positionImages();
});
