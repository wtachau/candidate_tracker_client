checkXAxisExist = setInterval((->
  if $('.x.axis .tick').length
    createInfoWindows()
    clearInterval checkXAxisExist
  return
), 100)

numberOfPictures = 6
randomImageNum = () -> Math.floor(Math.random()*6) + 1
imageNum = randomImageNum()
trumpImageSrc = "/images/trump/#{imageNum}.png"
imageNum = randomImageNum()
bernieImageSrc = "/images/bernie/#{imageNum}.png"
imageNum = randomImageNum()
clintonImageSrc = "/images/clinton/#{imageNum}.png"

createInfoWindows = () ->
  numberOfDates = ($ ".x.axis .tick").length
  ($ ".x.axis .tick").each (i) ->
    d = document.createElement('div')

    dateText = $(@).find("text").text()
    d.appendChild(document.createTextNode dateText)

    imageFor = (src) ->
      image = document.createElement('img')
      image.setAttribute 'src', src
      return image

    bernieImage = document.createElement('div')
    $(bernieImage).addClass('hil')
    d.appendChild bernieImage
    bernieImage.appendChild (imageFor bernieImageSrc)

    clintonImage = document.createElement('div')
    $(clintonImage).addClass('clinton')
    d.appendChild clintonImage
    clintonImage.appendChild (imageFor clintonImageSrc)

    trumpImage = document.createElement('div')
    $(trumpImage).addClass('trump')
    d.appendChild trumpImage
    trumpImage.appendChild (imageFor trumpImageSrc)

    boxHeight = 400
    boxWidth = 200

    offset = ((window.innerWidth - boxWidth) / (numberOfDates - 1)) * i
    console.log i
    console.log offset
    
    width = window.innerWidth

    d.style.top = ((window.innerHeight - boxHeight) / 2) + 50
    d.style.left = offset
    d.style.height = boxHeight
    d.style.width = 200
    $(d).addClass("infowindow").appendTo($ ".chart")
