$("#infowindow").hide()

checkExist = setInterval((->
  if $('.line-trump path').length
    showImages()
    clearInterval checkExist
  return
), 100)

[trumpImageContainer, clintonImageContainer, bernieImageContainer] = [0,0,0]

showImages = () ->

  trumpImageContainer = ($ "#infowindow .trump")[0]
  clintonImageContainer = ($ "#infowindow .clinton")[0]
  bernieImageContainer = ($ "#infowindow .bernie")[0]

  trumpImage = $(trumpImageContainer).find "img"
  clintonImage = $(clintonImageContainer).find "img"
  bernieImage = $(bernieImageContainer).find "img"

  numberOfPictures = 6
  imageNum = Math.floor(Math.random()*6) + 1
  trumpImage.attr('src',"/images/trump/#{imageNum}.png")
  imageNum = Math.floor(Math.random()*6) + 1
  bernieImage.attr('src',"/images/bernie/#{imageNum}.png")
  imageNum = Math.floor(Math.random()*6) + 1
  clintonImage.attr('src',"/images/clinton/#{imageNum}.png")

  # positionInfoBox()

  $("#infowindow").show()


# positionInfoBox = () ->
#   boxWidth = 200
#   boxHeight = 400
#   infoBox = ($ "#infowindow")[0]
#   infoBox.style.top = 100 #((window.innerHeight - boxHeight) / 2)
#   infoBox.style.width = 200
#   infoBox.style.left = ((window.innerWidth - boxWidth) / 2)
