
resize = () ->
  infoPopup = ($ "#infoPopup .popup")[0]

  widthRatio = .7
  heightRatio = .6
  infoPopupWidth = window.innerWidth * widthRatio
  # infoPopupHeight = window.innerHeight * heightRatio
  infoPopup.style.width = infoPopupWidth
  # infoPopup.style.height = infoPopupHeight
  infoPopup.style.left = (window.innerWidth - infoPopupWidth) / 2
  infoPopup.style.top = (window.innerHeight - $(infoPopup).height()) / 2

resize()
($ "#infoPopup").hide()

($ ".info-label, img.exit, .background").click () ->
  ($ "#infoPopup").toggle()

# handle resize
window.addEventListener "resize", () ->
  resize()
