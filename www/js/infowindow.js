var bernieImageSrc, checkXAxisExist, clintonImageSrc, createInfoWindows, imageNum, numberOfPictures, randomImageNum, trumpImageSrc;

checkXAxisExist = setInterval((function() {
  if ($('.x.axis .tick').length) {
    createInfoWindows();
    clearInterval(checkXAxisExist);
  }
}), 100);

numberOfPictures = 6;

randomImageNum = function() {
  return Math.floor(Math.random() * 6) + 1;
};

imageNum = randomImageNum();

trumpImageSrc = "/images/trump/" + imageNum + ".png";

imageNum = randomImageNum();

bernieImageSrc = "/images/bernie/" + imageNum + ".png";

imageNum = randomImageNum();

clintonImageSrc = "/images/clinton/" + imageNum + ".png";

createInfoWindows = function() {
  var numberOfDates;
  numberOfDates = ($(".x.axis .tick")).length;
  return ($(".x.axis .tick")).each(function(i) {
    var bernieImage, boxHeight, boxWidth, clintonImage, d, dateText, imageFor, offset, trumpImage, width;
    d = document.createElement('div');
    dateText = $(this).find("text").text();
    d.appendChild(document.createTextNode(dateText));
    imageFor = function(src) {
      var image;
      image = document.createElement('img');
      image.setAttribute('src', src);
      return image;
    };
    bernieImage = document.createElement('div');
    $(bernieImage).addClass('hil');
    d.appendChild(bernieImage);
    bernieImage.appendChild(imageFor(bernieImageSrc));
    clintonImage = document.createElement('div');
    $(clintonImage).addClass('clinton');
    d.appendChild(clintonImage);
    clintonImage.appendChild(imageFor(clintonImageSrc));
    trumpImage = document.createElement('div');
    $(trumpImage).addClass('trump');
    d.appendChild(trumpImage);
    trumpImage.appendChild(imageFor(trumpImageSrc));
    boxHeight = 400;
    boxWidth = 200;
    offset = ((window.innerWidth - boxWidth) / (numberOfDates - 1)) * i;
    console.log(i);
    console.log(offset);
    width = window.innerWidth;
    d.style.top = ((window.innerHeight - boxHeight) / 2) + 50;
    d.style.left = offset;
    d.style.height = boxHeight;
    d.style.width = 200;
    return $(d).addClass("infowindow").appendTo($(".chart"));
  });
};
